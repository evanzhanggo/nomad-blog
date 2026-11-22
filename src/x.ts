import { buildDraft, dedupeDrafts } from "./item";
import { fetchJson, fetchText } from "./text";
import type { Draft } from "./types";

/**
 * 不用 X 官方 API。时间线和好文正文走 FxEmbed 的公开 JSON（api.fxtwitter.com）。
 * 列表里的 article.content 是空的，正文要再请求 /2/status/{id}。
 * JSON 整段失败时，退到 fixupx 的 RSS，再退到 syndication 的嵌入时间线。
 * 备用源常常没有长文全文，syndication 也容易 429。单账号失败由 collect 隔离。
 */

const FX_API = "https://api.fxtwitter.com";
const ARTICLE_MIN = 180;
const LONG_POST_MIN = 360;
const HYDRATE_MAX = 4;

const PROMO = /拉群|进群|加群|交流群|邀请码|速度冲|手慢无|速度薅|速速来撸|群满/;
const THREAD_HINT = /教程|指南|攻略|步骤|流程|如下|长文/;

export interface XAccount {
  id: string;
  name: string;
  handle: string;
  userId: string;
  /** 每次采集最多交出几条。一天跑两次，同一条会被 canonical URL 去掉。 */
  perRun: number;
}

export const X_ACCOUNTS: XAccount[] = [
  { id: "hejushang8", name: "何居上", handle: "hejushang8", userId: "1794938417656299521", perRun: 2 },
  { id: "vansvoler", name: "海无方", handle: "vansvoler", userId: "1584880501", perRun: 2 },
  { id: "niaoshu", name: "鸟叔本鸟", handle: "niaoshu", userId: "333823770", perRun: 2 },
  { id: "donniy520", name: "东逆", handle: "donniy520", userId: "2037918020807647232", perRun: 2 },
];

export interface XStyle {
  offset: number;
  length: number;
  style: string;
}

export interface XEntityRange {
  key: string;
  offset: number;
  length: number;
}

export interface XBlock {
  type: string;
  text: string;
  styles: XStyle[];
  entities: XEntityRange[];
}

export interface XEntity {
  key: string;
  type: string;
  url?: string;
  mediaId?: string;
  tweetId?: string;
}

export interface XArticle {
  title: string;
  preview: string;
  blocks: XBlock[];
  entities: XEntity[];
  images: Record<string, string>;
}

export interface XPost {
  id: string;
  url: string;
  text: string;
  createdAt: string | number | null;
  authorName: string;
  authorHandle: string;
  authorId: string;
  likes: number;
  replies: number;
  reposted: boolean;
  replyToHandle: string | null;
  replyToStatus: string | null;
  article: XArticle | null;
}

type FxGet = (path: string) => Promise<unknown>;

interface XDeps {
  get?: FxGet;
  fallbackPosts?: (account: XAccount) => Promise<XPost[]>;
}

function charCount(text: string): number {
  return Array.from(text).length;
}

function sameHandle(a: string, b: string): boolean {
  return a.replace(/^@/, "").toLowerCase() === b.replace(/^@/, "").toLowerCase();
}

function httpUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function xStatusUrl(handle: string, id: string, raw?: string): string {
  const match = raw?.match(/https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([^/?#\s]+)\/status\/(\d+)/i);
  const who = (match?.[1] && match[1].toLowerCase() !== "i" ? match[1] : handle).toLowerCase();
  const status = match?.[2] || id;
  return `https://x.com/${who}/status/${status}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function timeValue(post: XPost): number {
  if (typeof post.createdAt === "number" && Number.isFinite(post.createdAt)) {
    return post.createdAt < 1e12 ? post.createdAt * 1000 : post.createdAt;
  }
  const parsed = Date.parse(String(post.createdAt ?? ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function newest(a: XPost, b: XPost): number {
  return timeValue(b) - timeValue(a) || b.id.localeCompare(a.id);
}

export function titleFromText(text: string): string {
  const line =
    text
      .split(/\n+/)
      .map((part) => part.trim())
      .find((part) => part && !/^https?:\/\//i.test(part)) ?? "";
  const compact = line.replace(/\s+/g, " ").trim();
  const chars = Array.from(compact);
  if (chars.length <= 42) return compact;
  const head = chars.slice(0, 42).join("");
  const cut = head.search(/[。！？!?；;]/);
  return cut >= 8 ? head.slice(0, cut) : head;
}

function parseEntities(raw: unknown): XEntity[] {
  const entries: Array<{ key: string; value: Record<string, unknown> }> = [];
  if (Array.isArray(raw)) {
    for (const entry of raw) {
      const record = asRecord(entry);
      const value = asRecord(record?.value);
      if (!record || record.key == null || !value) continue;
      entries.push({ key: String(record.key), value });
    }
  } else if (asRecord(raw)) {
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      const record = asRecord(value);
      if (record) entries.push({ key, value: record });
    }
  }
  return entries.map(({ key, value }) => {
    const data = asRecord(value.data) ?? {};
    const media = Array.isArray(data.mediaItems) ? asRecord(data.mediaItems[0]) : null;
    return {
      key,
      type: asString(value.type),
      url: httpUrl(data.url) ?? undefined,
      mediaId: media?.mediaId != null ? String(media.mediaId) : undefined,
      tweetId: data.tweetId != null ? String(data.tweetId) : undefined,
    };
  });
}

function parseBlocks(raw: unknown): XBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry) => {
    const block = asRecord(entry) ?? {};
    const styles = Array.isArray(block.inlineStyleRanges)
      ? block.inlineStyleRanges.map((style) => {
          const record = asRecord(style) ?? {};
          return {
            offset: asNumber(record.offset),
            length: asNumber(record.length),
            style: asString(record.style),
          };
        })
      : [];
    const entities = Array.isArray(block.entityRanges)
      ? block.entityRanges.map((range) => {
          const record = asRecord(range) ?? {};
          return {
            key: record.key == null ? "" : String(record.key),
            offset: asNumber(record.offset),
            length: asNumber(record.length),
          };
        })
      : [];
    return {
      type: asString(block.type) || "unstyled",
      text: asString(block.text),
      styles,
      entities,
    };
  });
}

function parseImages(raw: unknown): Record<string, string> {
  const images: Record<string, string> = {};
  if (!Array.isArray(raw)) return images;
  for (const entry of raw) {
    const record = asRecord(entry);
    const info = asRecord(record?.media_info);
    const url = httpUrl(info?.original_img_url);
    if (record?.media_id == null || !url) continue;
    images[String(record.media_id)] = url;
  }
  return images;
}

function parseArticle(raw: unknown): XArticle | null {
  const article = asRecord(raw);
  if (!article) return null;
  const title = asString(article.title).trim();
  if (!title) return null;
  const content = asRecord(article.content);
  return {
    title,
    preview: asString(article.preview_text).trim(),
    blocks: parseBlocks(content?.blocks),
    entities: parseEntities(content?.entityMap),
    images: parseImages(article.media_entities),
  };
}

export function parseFxStatus(raw: unknown): XPost | null {
  const status = asRecord(raw);
  if (!status || status.id == null) return null;
  if (status.type && status.type !== "status") return null;
  const author = asRecord(status.author) ?? {};
  const reply = asRecord(status.replying_to);
  const handle = asString(author.screen_name);
  const id = String(status.id);
  return {
    id,
    url: xStatusUrl(handle || "i", id, asString(status.url)),
    text: asString(status.text).trim(),
    createdAt: typeof status.created_timestamp === "number" ? status.created_timestamp : asString(status.created_at) || null,
    authorName: asString(author.name).trim(),
    authorHandle: handle,
    authorId: author.id == null ? "" : String(author.id),
    likes: asNumber(status.likes),
    replies: asNumber(status.replies),
    reposted: status.reposted_by != null,
    replyToHandle: reply ? asString(reply.screen_name) || null : null,
    replyToStatus: reply?.status == null ? null : String(reply.status),
    article: parseArticle(status.article),
  };
}

export function postsFromFxPayload(payload: unknown): XPost[] {
  const body = asRecord(payload);
  if (!body) return [];
  const list: unknown[] = [];
  if (Array.isArray(body.results)) list.push(...body.results);
  else if (body.status) list.push(body.status);
  if (Array.isArray(body.thread)) list.push(...body.thread);
  return list.map(parseFxStatus).filter((post): post is XPost => post != null);
}

function stripQuotes(html: string): string {
  return html
    .replace(/<blockquote\b[\s\S]*?<\/blockquote>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function postsFromFixupRss(xml: string, account: XAccount): XPost[] {
  const source = xml.replace(/^\uFEFF/, "");
  const items = [...source.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)];
  const posts: XPost[] = [];
  for (const match of items) {
    const block = match[1] ?? "";
    const link = block.match(/<link>([^<]*)<\/link>/i)?.[1]?.trim() ?? "";
    const id = link.match(/status\/(\d+)/)?.[1] ?? "";
    if (!id) continue;
    const title = block.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
    const description = block.match(/<description>([\s\S]*?)<\/description>/i)?.[1] ?? "";
    const html = description.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
    const own = stripQuotes(html);
    const text = (own || title).replace(/\s+/g, " ").trim();
    if (/^RT\s+@/i.test(text)) continue;
    const published = block.match(/<pubDate>([^<]*)<\/pubDate>/i)?.[1]?.trim() ?? null;
    posts.push({
      id,
      url: xStatusUrl(account.handle, id, link),
      text,
      createdAt: published,
      authorName: account.name,
      authorHandle: account.handle,
      authorId: "",
      likes: 0,
      replies: 0,
      reposted: false,
      replyToHandle: null,
      replyToStatus: null,
      article: null,
    });
  }
  return posts;
}

export function postsFromSyndication(html: string, account: XAccount): XPost[] {
  const match = html.match(/<script id=(?:"__NEXT_DATA__"|'__NEXT_DATA__')[^>]*>([\s\S]*?)<\/script>/);
  if (!match?.[1]) return [];
  let data: unknown;
  try {
    data = JSON.parse(match[1]);
  } catch {
    return [];
  }
  const page = asRecord(asRecord(asRecord(data)?.props)?.pageProps);
  const entries = asRecord(page?.timeline)?.entries;
  if (!Array.isArray(entries)) return [];
  const posts: XPost[] = [];
  for (const entry of entries) {
    const tweet = asRecord(asRecord(asRecord(entry)?.content)?.tweet);
    if (!tweet) continue;
    const user = asRecord(tweet.user) ?? {};
    const id = asString(tweet.id_str) || (tweet.id == null ? "" : String(tweet.id));
    if (!id) continue;
    const handle = asString(user.screen_name);
    const full = asString(tweet.full_text).trim() || asString(tweet.text).trim();
    if (!full || /^RT\s+@/i.test(full) || tweet.retweeted_status) continue;
    if (handle && !sameHandle(handle, account.handle)) continue;
    const replyHandle = asString(tweet.in_reply_to_screen_name);
    posts.push({
      id,
      url: xStatusUrl(account.handle, id, asString(tweet.permalink)),
      text: full,
      createdAt: asString(tweet.created_at) || null,
      authorName: asString(user.name).trim() || account.name,
      authorHandle: handle || account.handle,
      authorId: asString(user.id_str),
      likes: asNumber(tweet.favorite_count),
      replies: asNumber(tweet.reply_count),
      reposted: false,
      replyToHandle: replyHandle || null,
      replyToStatus: asString(tweet.in_reply_to_status_id_str) || null,
      article: null,
    });
  }
  return posts;
}

function articlePlain(post: XPost): string {
  const article = post.article;
  if (!article) return "";
  const fromBlocks = article.blocks
    .map((block) => block.text.trim())
    .filter(Boolean)
    .join("\n");
  return fromBlocks || article.preview;
}

function hasArticleBody(post: XPost): boolean {
  return post.article?.blocks.some((block) => block.text.trim() || block.type === "atomic") ?? false;
}

function dedupePosts(posts: XPost[]): XPost[] {
  const byId = new Map<string, XPost>();
  for (const post of posts) {
    const current = byId.get(post.id);
    if (!current || articlePlain(post).length > articlePlain(current).length) byId.set(post.id, post);
  }
  return [...byId.values()];
}

export function postsByOwner(posts: XPost[], account: XAccount): XPost[] {
  const ids = new Set(posts.map((post) => post.authorId).filter(Boolean));
  if (ids.size && !ids.has(account.userId)) {
    throw new Error(`user id mismatch for @${account.handle}: expected ${account.userId}`);
  }
  return posts.filter((post) => !post.authorId || post.authorId === account.userId);
}

function isRoot(post: XPost): boolean {
  if (post.reposted) return false;
  if (!post.replyToHandle) return true;
  return false;
}

function promoLead(title: string, plain: string): boolean {
  return PROMO.test(`${title}\n${plain}`.slice(0, 160));
}

function keepReply(post: XPost): boolean {
  const text = post.text.trim();
  if (charCount(text) < 40) return false;
  if (promoLead(titleFromText(text), text) && charCount(text) < 180) return false;
  return true;
}

function threadParts(root: XPost, posts: XPost[]): XPost[] {
  const children = new Map<string, XPost[]>();
  for (const post of posts) {
    if (!post.replyToStatus || post.reposted) continue;
    if (!sameHandle(post.authorHandle, root.authorHandle)) continue;
    const list = children.get(post.replyToStatus) ?? [];
    list.push(post);
    children.set(post.replyToStatus, list);
  }
  const ordered: XPost[] = [root];
  const queue = [root.id];
  const seen = new Set([root.id]);
  while (queue.length) {
    const id = queue.shift();
    if (!id) break;
    const next = (children.get(id) ?? []).sort((a, b) => timeValue(a) - timeValue(b));
    for (const child of next) {
      if (seen.has(child.id)) continue;
      seen.add(child.id);
      if (keepReply(child)) ordered.push(child);
      queue.push(child.id);
    }
  }
  return ordered;
}

function renderInline(text: string, block: XBlock, entities: Map<string, XEntity>): string {
  const ranges: Array<{ start: number; end: number; open: string; close: string; rank: number }> = [];
  for (const style of block.styles) {
    const open = style.style === "Bold" ? "<strong>" : style.style === "Italic" ? "<em>" : "";
    const close = style.style === "Bold" ? "</strong>" : style.style === "Italic" ? "</em>" : "";
    if (!open) continue;
    ranges.push({ start: style.offset, end: style.offset + style.length, open, close, rank: style.style === "Bold" ? 1 : 2 });
  }
  for (const range of block.entities) {
    const entity = entities.get(range.key);
    if (entity?.type !== "LINK" || !entity.url) continue;
    ranges.push({
      start: range.offset,
      end: range.offset + range.length,
      open: `<a href="${entity.url}">`,
      close: "</a>",
      rank: 0,
    });
  }
  if (!ranges.length) return text;
  const points = new Set<number>([0, text.length]);
  for (const range of ranges) {
    points.add(Math.max(0, Math.min(text.length, range.start)));
    points.add(Math.max(0, Math.min(text.length, range.end)));
  }
  const cuts = [...points].sort((a, b) => a - b);
  let html = "";
  for (let index = 0; index < cuts.length - 1; index += 1) {
    const start = cuts[index] ?? 0;
    const end = cuts[index + 1] ?? start;
    const slice = text.slice(start, end);
    if (!slice) continue;
    const active = ranges
      .filter((range) => range.start <= start && range.end >= end)
      .sort((a, b) => a.rank - b.rank);
    html += `${active.map((range) => range.open).join("")}${slice}${active
      .slice()
      .reverse()
      .map((range) => range.close)
      .join("")}`;
  }
  return html;
}

function renderAtomic(block: XBlock, entities: Map<string, XEntity>, images: Record<string, string>): string {
  const key = block.entities[0]?.key ?? "";
  const entity = entities.get(key);
  if (entity?.type === "MEDIA" && entity.mediaId && images[entity.mediaId]) {
    return `<p><img src="${images[entity.mediaId]}" alt=""></p>`;
  }
  if (entity?.type === "TWEET" && entity.tweetId && /^\d+$/.test(entity.tweetId)) {
    return `<p><a href="https://x.com/i/status/${entity.tweetId}">查看嵌入的帖子</a></p>`;
  }
  return "";
}

function blocksToHtml(article: XArticle): string {
  const entities = new Map(article.entities.map((entity) => [entity.key, entity]));
  const parts: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  const flush = () => {
    if (!list?.items.length) {
      list = null;
      return;
    }
    parts.push(`<${list.type}>${list.items.join("")}</${list.type}>`);
    list = null;
  };
  const heading: Record<string, string> = {
    "header-one": "h2",
    "header-two": "h2",
    "header-three": "h3",
    "header-four": "h4",
  };
  for (const block of article.blocks) {
    if (block.type === "unordered-list-item" || block.type === "ordered-list-item") {
      const type = block.type === "ordered-list-item" ? "ol" : "ul";
      if (!list || list.type !== type) {
        flush();
        list = { type, items: [] };
      }
      const item = renderInline(block.text, block, entities).trim();
      if (item) list.items.push(`<li>${item}</li>`);
      continue;
    }
    flush();
    if (block.type === "atomic") {
      const html = renderAtomic(block, entities, article.images);
      if (html) parts.push(html);
      continue;
    }
    const inner = renderInline(block.text, block, entities).trim();
    if (!inner) continue;
    if (block.type === "code-block") {
      parts.push(`<pre><code>${inner}</code></pre>`);
      continue;
    }
    const tag = heading[block.type] || (block.type === "blockquote" ? "blockquote" : "p");
    parts.push(`<${tag}>${inner}</${tag}>`);
  }
  flush();
  return parts.join("");
}

function paragraphsHtml(text: string): string {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("");
}

function attribution(name: string, url: string): string {
  return `<p>原文：<a href="${url}">${name}在 X 发布的帖子</a></p>`;
}

interface Piece {
  id: string;
  url: string;
  title: string;
  author: string;
  createdAt: string | number | null;
  likes: number;
  plain: string;
  html: string;
}

function pieceFrom(root: XPost, posts: XPost[], account: XAccount): Piece | null {
  const author = root.authorName && !root.authorName.includes("@") ? root.authorName : account.name;
  if (root.article) {
    const plain = articlePlain(root);
    const title = root.article.title.trim();
    if (promoLead(title, plain)) return null;
    const ready = hasArticleBody(root) || charCount(root.article.preview) >= ARTICLE_MIN;
    if (!ready || charCount(plain) < ARTICLE_MIN) return null;
    const body = hasArticleBody(root) ? blocksToHtml(root.article) : paragraphsHtml(plain);
    if (!body) return null;
    return {
      id: root.id,
      url: root.url,
      title,
      author,
      createdAt: root.createdAt,
      likes: root.likes,
      plain,
      html: `${body}${attribution(author, root.url)}`,
    };
  }

  const title = titleFromText(root.text);
  if (!title || promoLead(title, root.text)) return null;
  const parts = threadParts(root, posts);
  const plain = parts
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join("\n\n");
  const substantive = parts.filter((part) => charCount(part.text) >= 40);
  const long = charCount(plain) >= LONG_POST_MIN && (charCount(root.text) >= LONG_POST_MIN || substantive.length >= 2);
  if (!long) return null;
  return {
    id: root.id,
    url: root.url,
    title,
    author,
    createdAt: root.createdAt,
    likes: root.likes,
    plain,
    html: `${parts.map((part) => paragraphsHtml(part.text)).join("")}${attribution(author, root.url)}`,
  };
}

export function qualifyXPosts(posts: XPost[], account: XAccount): Draft[] {
  const pool = dedupePosts(posts).filter(
    (post) => !post.authorHandle || sameHandle(post.authorHandle, account.handle),
  );
  const roots = pool.filter(isRoot).sort(newest);
  const drafts: Draft[] = [];
  const seen = new Set<string>();
  for (const root of roots) {
    if (drafts.length >= account.perRun) break;
    const piece = pieceFrom(root, pool, account);
    if (!piece || seen.has(piece.url)) continue;
    const draft = buildDraft({
      url: piece.url,
      title: piece.title,
      excerpt: piece.plain,
      sourceId: account.id,
      sourceName: account.name,
      author: piece.author,
      publishedAt: piece.createdAt,
      popularity: piece.likes,
      popularityLabel: piece.likes ? "赞" : "",
      contentHtml: piece.html,
    });
    if (!draft) continue;
    seen.add(piece.url);
    drafts.push(draft);
  }
  return dedupeDrafts(drafts);
}

function statusIdFromUrl(url: string): string | null {
  return url.match(/\/status\/(\d+)/)?.[1] ?? null;
}

function shouldFetchThread(root: XPost, posts: XPost[], account: XAccount): boolean {
  if (root.article || root.replies < 2 || charCount(root.text) < 80) return false;
  if (pieceFrom(root, posts, account)) return false;
  return THREAD_HINT.test(root.text);
}

function nextHydrationTarget(
  posts: XPost[],
  account: XAccount,
  tried: Set<string>,
): { id: string; kind: "status" | "thread" } | null {
  const qualified = new Set(
    qualifyXPosts(posts, account)
      .map((draft) => statusIdFromUrl(draft.canonicalUrl))
      .filter((id): id is string => Boolean(id)),
  );
  const roots = dedupePosts(posts)
    .filter((post) => !post.authorHandle || sameHandle(post.authorHandle, account.handle))
    .filter(isRoot)
    .sort(newest);
  let filled = 0;
  for (const root of roots) {
    const needsArticle = Boolean(root.article) && !hasArticleBody(root);
    if (!tried.has(root.id) && needsArticle && root.article && !promoLead(root.article.title, root.article.preview)) {
      return { id: root.id, kind: "status" };
    }
    if (qualified.has(root.id)) {
      filled += 1;
      if (filled >= account.perRun) return null;
      continue;
    }
    if (tried.has(root.id)) continue;
    if (shouldFetchThread(root, posts, account)) return { id: root.id, kind: "thread" };
  }
  return null;
}

async function defaultGet(path: string): Promise<unknown> {
  let last: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await fetchJson(`${FX_API}${path}`);
    } catch (error) {
      last = error;
      const message = error instanceof Error ? error.message : String(error);
      // FxEmbed sometimes answers 404 or 429 for a profile that works on the next try.
      if (attempt === 1 || !/HTTP (404|429|5\d\d)\b/.test(message)) break;
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}

function callError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isMissing(error: string): boolean {
  return /HTTP 404\b/.test(error);
}

async function loadFxPosts(account: XAccount, get: FxGet): Promise<XPost[]> {
  const settle = async (path: string) => {
    try {
      return { ok: true as const, value: await get(path) };
    } catch (error) {
      return { ok: false as const, error: callError(error) };
    }
  };
  const [articles, statuses] = await Promise.all([
    settle(`/2/profile/${encodeURIComponent(account.handle)}/articles?count=8`),
    settle(`/2/profile/${encodeURIComponent(account.handle)}/statuses?count=20`),
  ]);
  const failures = [articles, statuses].filter(
    (result): result is { ok: false; error: string } => !result.ok && !isMissing(result.error),
  );
  if (!articles.ok && !statuses.ok) {
    throw new Error(`articles: ${articles.error}; statuses: ${statuses.error}`);
  }
  for (const failure of failures) console.error(`x @${account.handle}: ${failure.error}`);
  const posts = dedupePosts([
    ...(articles.ok ? postsFromFxPayload(articles.value) : []),
    ...(statuses.ok ? postsFromFxPayload(statuses.value) : []),
  ]);
  if (!posts.length && failures.length) throw new Error(failures.map((result) => result.error).join("; "));
  return posts;
}

async function defaultFallback(account: XAccount): Promise<XPost[]> {
  const errors: string[] = [];
  try {
    const xml = await fetchText(`https://fixupx.com/${encodeURIComponent(account.handle)}/feed.xml?count=20`);
    const posts = postsFromFixupRss(xml, account);
    if (posts.length) return posts;
    errors.push("fixupx rss had no posts");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  try {
    const html = await fetchText(
      `https://syndication.twitter.com/srv/timeline-profile/screen-name/${encodeURIComponent(account.handle)}`,
    );
    const posts = postsFromSyndication(html, account);
    if (posts.length) return posts;
    errors.push("syndication had no posts");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  throw new Error(errors.join("; ") || "x fallback failed");
}

async function hydrate(posts: XPost[], account: XAccount, get: FxGet): Promise<XPost[]> {
  let pool = posts;
  const tried = new Set<string>();
  for (let index = 0; index < HYDRATE_MAX; index += 1) {
    const target = nextHydrationTarget(pool, account, tried);
    if (!target) break;
    tried.add(target.id);
    const path = target.kind === "thread" ? `/2/thread/${target.id}` : `/2/status/${target.id}`;
    try {
      pool = dedupePosts([...pool, ...postsFromFxPayload(await get(path))]);
    } catch (error) {
      console.error(`x ${target.kind} ${target.id}: ${error instanceof Error ? error.message : error}`);
    }
  }
  return pool;
}

export async function fetchXAccount(account: XAccount, deps: XDeps = {}): Promise<Draft[]> {
  const get = deps.get ?? defaultGet;
  const fallbackPosts = deps.fallbackPosts ?? defaultFallback;
  const fromJson = async (): Promise<Draft[]> => {
    const posts = postsByOwner(await loadFxPosts(account, get), account);
    return qualifyXPosts(await hydrate(posts, account, get), account);
  };
  let drafts: Draft[] = [];
  let failure: unknown = null;
  let sawSuccess = false;
  for (let pass = 0; pass < 2 && drafts.length === 0; pass += 1) {
    try {
      drafts = await fromJson();
      sawSuccess = true;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("user id mismatch")) throw error;
      failure = error;
    }
  }
  if (drafts.length || sawSuccess) return drafts;
  const message = failure instanceof Error ? failure.message : String(failure ?? "x json failed");
  console.error(`x json @${account.handle} failed: ${message}`);
  try {
    return qualifyXPosts(await fallbackPosts(account), account);
  } catch (fallbackError) {
    console.error(
      `x fallback @${account.handle} failed: ${fallbackError instanceof Error ? fallbackError.message : fallbackError}`,
    );
    throw failure instanceof Error ? failure : new Error(message);
  }
}
