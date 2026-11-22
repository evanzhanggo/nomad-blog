import { parseFeed } from "./feed";
import { buildDraft, byRank, dedupeDrafts, withTag } from "./item";
import { fetchJson, fetchText } from "./text";
import type { Draft, Source } from "./types";

/**
 * 实测后保留的来源（2026-11-22）：
 * - Hacker News Algolia、dev.to、Medium 标签、Nomad Gate、JohnnyFD
 * - V2EX「远程工作」「签证」公开 API
 * - 电鸭官方 RSS（JSON API 返回 403）
 * - Remote OK 公开职位 API（博客 RSS 已 410），只留全球远程的知识工作职位
 *
 * 丢掉的来源：Reddit JSON/RSS 被 403/登录墙挡住；Nomad List 的 /feed、/rss、/blog/feed
 * 都返回网站 HTML；电鸭 svc API 403；V2EX「数字游民」节点几乎没有帖子；
 * 「dn」节点是域名而不是游民。
 */

const HN_BLOCK =
  /remote code execution|\brce\b|\bcve-\d|vulnerability|exploit|buffer overflow|who is hiring|who wants to be hired|seeking freelancer/i;
const MEDIUM_REMOTE =
  /nomad|visa|abroad|cowork|coliving|wi-?fi|anywhere|passport|旅居|数字游民|签证|location[- ]independent/i;
const NOMAD_JOB =
  /engineer|developer|designer|\bdesign\b|writer|writing|marketing|product|support|devops|software|frontend|backend|full[- ]?stack|\bdata\b|programmer/i;
const CLINICAL =
  /physician|nurse|medical|clinical|pharmacist|therapist|dentist|health assessment|\bdoctor\b/i;

interface HnHit {
  title?: string;
  url?: string | null;
  author?: string;
  points?: number;
  num_comments?: number;
  created_at?: string;
  objectID?: string;
  story_text?: string | null;
}

interface DevArticle {
  title?: string;
  description?: string | null;
  url?: string;
  canonical_url?: string | null;
  published_at?: string;
  positive_reactions_count?: number;
  public_reactions_count?: number;
  comments_count?: number;
  user?: { name?: string; username?: string };
}

interface V2Topic {
  title?: string;
  url?: string;
  content?: string;
  replies?: number;
  created?: number;
  deleted?: boolean;
  member?: { username?: string };
}

interface RemoteJob {
  position?: string;
  company?: string;
  description?: string;
  location?: string;
  url?: string;
  date?: string;
  epoch?: number;
  tags?: string[];
}

function top(items: Array<Draft | null>, limit: number): Draft[] {
  const ready = dedupeDrafts(items.filter((item): item is Draft => item !== null)).sort(byRank);
  if (!ready.length) throw new Error("no items");
  return ready.slice(0, limit);
}

function siteLabel(url: string, fallback: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || fallback;
  } catch {
    return fallback;
  }
}

function hnUrl(query: string, since: number, byDate: boolean): string {
  const url = new URL(
    byDate
      ? "https://hn.algolia.com/api/v1/search_by_date"
      : "https://hn.algolia.com/api/v1/search",
  );
  url.searchParams.set("query", query);
  url.searchParams.set("tags", "story");
  url.searchParams.set("hitsPerPage", "15");
  url.searchParams.set("numericFilters", `created_at_i>${since},points>0`);
  return url.toString();
}

function mapHn(hit: HnHit): Draft | null {
  if (!hit.title || !hit.objectID || HN_BLOCK.test(hit.title)) return null;
  const discussion = `https://news.ycombinator.com/item?id=${hit.objectID}`;
  let self = !hit.url;
  if (hit.url) {
    try {
      self = new URL(hit.url).hostname.replace(/^www\./, "") === "news.ycombinator.com";
    } catch {
      self = true;
    }
  }
  return buildDraft({
    url: self ? discussion : (hit.url as string),
    title: hit.title,
    excerpt: hit.story_text ?? "",
    sourceId: "hn",
    sourceName: self ? "Hacker News" : siteLabel(hit.url as string, "Hacker News"),
    author: self ? (hit.author ?? null) : null,
    publishedAt: hit.created_at,
    popularity: hit.points ?? 0,
    popularityLabel: "分",
    discussionUrl: self ? null : discussion,
    commentBonus: Math.round((hit.num_comments ?? 0) * 0.2),
  });
}

async function fetchHn(): Promise<Draft[]> {
  const now = Math.floor(Date.now() / 1000);
  const queries: Array<{ q: string; since: number; byDate?: boolean }> = [
    { q: '"digital nomad"', since: now - 540 * 86_400 },
    { q: '"nomad visa"', since: now - 540 * 86_400 },
    { q: '"remote work"', since: now - 120 * 86_400 },
    { q: '"digital nomad"', since: now - 120 * 86_400, byDate: true },
  ];
  const results = await Promise.allSettled(
    queries.map(async (query) => {
      const data = await fetchJson<{ hits?: HnHit[] }>(hnUrl(query.q, query.since, Boolean(query.byDate)));
      return data.hits ?? [];
    }),
  );
  const hits: HnHit[] = [];
  const errors: string[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") hits.push(...result.value);
    else errors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
  }
  if (errors.length) console.error(`hn partial: ${errors.join(" | ")}`);
  try {
    return top(hits.map(mapHn), 12);
  } catch (error) {
    throw new Error(errors.join(" | ") || (error instanceof Error ? error.message : "no items"));
  }
}

function mapDev(article: DevArticle): Draft | null {
  const url = article.canonical_url || article.url;
  if (!article.title || !url) return null;
  const host = siteLabel(url, "dev.to");
  return buildDraft({
    url,
    title: article.title,
    excerpt: article.description ?? "",
    sourceId: "devto",
    sourceName: host === "dev.to" ? "dev.to" : host,
    author: article.user?.name || article.user?.username || null,
    publishedAt: article.published_at,
    popularity: article.positive_reactions_count ?? article.public_reactions_count ?? 0,
    popularityLabel: "反应",
    commentBonus: Math.round((article.comments_count ?? 0) * 0.5),
  });
}

async function fetchDevto(): Promise<Draft[]> {
  const urls = [
    "https://dev.to/api/articles?tag=digitalnomad&per_page=15",
    "https://dev.to/api/articles?tag=remotework&per_page=10&top=7",
  ];
  const results = await Promise.allSettled(urls.map((url) => fetchJson<DevArticle[]>(url)));
  const articles: DevArticle[] = [];
  const errors: string[] = [];
  for (const result of results) {
    if (result.status === "fulfilled" && Array.isArray(result.value)) articles.push(...result.value);
    else if (result.status === "rejected") {
      errors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
    } else errors.push("dev.to response was not a list");
  }
  if (errors.length) console.error(`devto partial: ${errors.join(" | ")}`);
  try {
    return top(articles.map(mapDev), 12);
  } catch (error) {
    throw new Error(errors.join(" | ") || (error instanceof Error ? error.message : "no items"));
  }
}

async function fetchMedium(): Promise<Draft[]> {
  const feeds: Array<{ url: string; filter: boolean }> = [
    { url: "https://medium.com/feed/tag/digital-nomad", filter: false },
    { url: "https://medium.com/feed/tag/remote-work", filter: true },
  ];
  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const entries = parseFeed(await fetchText(feed.url)).filter(
        (entry) => !feed.filter || MEDIUM_REMOTE.test(`${entry.title} ${entry.excerpt}`),
      );
      return entries.map((entry) =>
        buildDraft({
          url: entry.url,
          title: entry.title,
          excerpt: entry.excerpt,
          sourceId: "medium",
          sourceName: "Medium",
          author: entry.author,
          publishedAt: entry.publishedAt,
        }),
      );
    }),
  );
  const items: Array<Draft | null> = [];
  const errors: string[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") items.push(...result.value);
    else errors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
  }
  if (errors.length) console.error(`medium partial: ${errors.join(" | ")}`);
  try {
    return top(items, 10);
  } catch (error) {
    throw new Error(errors.join(" | ") || (error instanceof Error ? error.message : "no items"));
  }
}

async function fetchRss(options: {
  url: string;
  sourceId: string;
  sourceName: string;
  limit: number;
  authorFallback?: string;
}): Promise<Draft[]> {
  const entries = parseFeed(await fetchText(options.url));
  return top(
    entries.slice(0, 20).map((entry) =>
      buildDraft({
        url: entry.url,
        title: entry.title,
        excerpt: entry.excerpt,
        sourceId: options.sourceId,
        sourceName: options.sourceName,
        author: entry.author ?? options.authorFallback ?? null,
        publishedAt: entry.publishedAt,
      }),
    ),
    options.limit,
  );
}

async function fetchV2ex(node: string, sourceId: string, sourceName: string): Promise<Draft[]> {
  const data = await fetchJson<V2Topic[] | { message?: string }>(
    `https://www.v2ex.com/api/topics/show.json?node_name=${encodeURIComponent(node)}`,
  );
  if (!Array.isArray(data)) throw new Error(data.message || "v2ex response was not a list");
  const tag = sourceId === "v2ex-visa" ? "visa" : "jobs";
  return top(
    data
      .filter((topic) => topic && !topic.deleted && topic.title && topic.url)
      .map((topic) =>
        withTag(
          buildDraft({
            url: topic.url as string,
            title: topic.title as string,
            excerpt: topic.content ?? "",
            sourceId,
            sourceName,
            author: topic.member?.username ?? null,
            publishedAt: topic.created ?? null,
            popularity: topic.replies ?? 0,
            popularityLabel: "回复",
          }),
          tag,
        ),
      ),
    8,
  );
}

function worldwideJob(job: RemoteJob): boolean {
  const place = `${job.location ?? ""} ${(job.tags ?? []).join(" ")}`;
  const role = `${job.position ?? ""} ${(job.tags ?? []).join(" ")}`;
  if (/us only|uk only|canada only|europe only|north america|\bemea\b|latam|latin america|united states|\busa\b/i.test(place)) {
    return false;
  }
  if (!/worldwide|anywhere|global/i.test(place)) return false;
  if (CLINICAL.test(role) || !NOMAD_JOB.test(role)) return false;
  return true;
}

async function fetchRemoteOk(): Promise<Draft[]> {
  const data = await fetchJson<RemoteJob[]>("https://remoteok.com/api", 15_000);
  if (!Array.isArray(data)) throw new Error("remote ok response was not a list");
  const jobs = data
    .filter((job) => job.position && job.url && worldwideJob(job))
    .sort((a, b) => (b.epoch ?? 0) - (a.epoch ?? 0))
    .slice(0, 12);
  return top(
    jobs.map((job) =>
      withTag(
        buildDraft({
          url: job.url as string,
          title: job.position as string,
          excerpt: job.description ?? "",
          sourceId: "remoteok",
          sourceName: "Remote OK",
          author: job.company ?? null,
          publishedAt: job.date ?? job.epoch ?? null,
        }),
        "jobs",
      ),
    ),
    8,
  );
}

export const SOURCES: Source[] = [
  {
    id: "hn",
    name: "Hacker News",
    hint: "https://hn.algolia.com/api/v1/search?query=%22digital%20nomad%22&tags=story",
    fetch: fetchHn,
  },
  {
    id: "devto",
    name: "dev.to",
    hint: "https://dev.to/api/articles?tag=digitalnomad",
    fetch: fetchDevto,
  },
  {
    id: "medium",
    name: "Medium",
    hint: "https://medium.com/feed/tag/digital-nomad",
    fetch: fetchMedium,
  },
  {
    id: "nomadgate",
    name: "Nomad Gate",
    hint: "https://nomadgate.com/feed.xml",
    fetch: () =>
      fetchRss({
        url: "https://nomadgate.com/feed.xml",
        sourceId: "nomadgate",
        sourceName: "Nomad Gate",
        limit: 8,
      }),
  },
  {
    id: "johnnyfd",
    name: "JohnnyFD",
    hint: "https://www.johnnyfd.com/feeds/posts/default?alt=rss",
    fetch: () =>
      fetchRss({
        url: "https://www.johnnyfd.com/feeds/posts/default?alt=rss",
        sourceId: "johnnyfd",
        sourceName: "JohnnyFD",
        authorFallback: "Johnny FD",
        limit: 6,
      }),
  },
  {
    id: "v2ex-remote",
    name: "V2EX · 远程工作",
    hint: "https://www.v2ex.com/api/topics/show.json?node_name=remote",
    fetch: () => fetchV2ex("remote", "v2ex-remote", "V2EX · 远程工作"),
  },
  {
    id: "v2ex-visa",
    name: "V2EX · 签证",
    hint: "https://www.v2ex.com/api/topics/show.json?node_name=visa",
    fetch: () => fetchV2ex("visa", "v2ex-visa", "V2EX · 签证"),
  },
  {
    id: "eleduck",
    name: "电鸭社区",
    hint: "https://eleduck.com/feed/latest.xml",
    fetch: () =>
      fetchRss({
        url: "https://eleduck.com/feed/latest.xml",
        sourceId: "eleduck",
        sourceName: "电鸭社区",
        limit: 8,
      }),
  },
  {
    id: "remoteok",
    name: "Remote OK",
    hint: "https://remoteok.com/api",
    fetch: fetchRemoteOk,
  },
];

export function knownSource(id: string): Source | undefined {
  return SOURCES.find((source) => source.id === id);
}
