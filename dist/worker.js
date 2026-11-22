var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/tags.ts
var TAGS = [
  {
    id: "visa",
    label: "\u7B7E\u8BC1",
    pattern: /visa|passport|residency|golden visa|nomad visa|dnv|移民|签证|簽證|居留|永居|国籍|电子居民|電子居民|数字游民签|數位遊牧簽/i
  },
  {
    id: "taxes",
    label: "\u7A0E\u52A1",
    pattern: /\btax(?:es|ation)?\b|irs\b|vat\b|税务|报税|税收|个税|税务居民/i
  },
  {
    id: "jobs",
    label: "\u8FDC\u7A0B\u5DE5\u4F5C",
    pattern: /hiring|we're hiring|\bjobs?\b|\bremote\b|career|salary|recruit|远程|招聘|内推|岗位|职位/i
  },
  {
    id: "cost",
    label: "\u751F\u6D3B\u6210\u672C",
    pattern: /cost of living|budget|expenses|生活成本|物价|开销|每月花费|花费报告/i
  },
  {
    id: "cities",
    label: "\u57CE\u5E02",
    pattern: /chiang mai|bali|lisbon|porto|bangkok|mexico city|medell[ií]n|tbilisi|buenos aires|da nang|penang|kuala lumpur|tokyo|taipei|seoul|清迈|曼谷|巴厘|里斯本|波尔图|墨西哥城|第比利斯|岘港|槟城|吉隆坡|东京|台北|城市指南|where to (?:live|stay)|best (?:cities|places) for/i
  },
  {
    id: "housing",
    label: "\u4F4F\u5BBF",
    pattern: /apartment|\brent(?:ing|al)?\b|airbnb|accommodation|coliving|住房|租房|住宿|民宿|长租/i
  },
  {
    id: "coworking",
    label: "\u8054\u5408\u529E\u516C",
    pattern: /cowork|co-working|联合办公|共享办公|coworking/i
  },
  {
    id: "insurance",
    label: "\u4FDD\u9669",
    pattern: /insurance|safetywing|health cover|保险|医疗险/i
  },
  {
    id: "finance",
    label: "\u8D22\u52A1",
    pattern: /\bbank(?:ing)?\b|wise\b|revolut|paypal|stripe|多币种|银行|收款|跨境支付|发票|currency/i
  },
  {
    id: "tools",
    label: "\u5DE5\u5177",
    pattern: /\bvpn\b|notion|obsidian|slack|vscode|figma|工具|软件|效率/i
  },
  {
    id: "legal",
    label: "\u6CD5\u5F8B\u4E0E\u5408\u89C4",
    pattern: /\blegal\b|compliance|\bllc\b|incorporation|合规|公司注册|法律|合同/i
  },
  {
    id: "gear",
    label: "\u88C5\u5907",
    pattern: /\bgear\b|packing list|backpack|装备|行李|行李清单/i
  },
  {
    id: "travel",
    label: "\u65C5\u884C",
    pattern: /\btravel\b|\bflight\b|backpacker|行程|旅行|航班|机票|游记|旅居/i
  },
  {
    id: "community",
    label: "\u793E\u533A",
    pattern: /community|meetup|discord|社区|聚会|交流群/i
  },
  {
    id: "howto",
    label: "\u6559\u7A0B",
    pattern: /how to|guide|tutorial|教程|指南|入门|手把手|攻略/i
  }
];
var TAG_BY_ID = new Map(TAGS.map((tag) => [tag.id, tag]));
function tagString(title, excerpt) {
  const haystack = `${title}
${excerpt}`;
  const ids = TAGS.filter((tag) => tag.pattern.test(haystack)).map((tag) => tag.id);
  const picked = ids.slice(0, 4);
  return picked.length ? `|${picked.join("|")}|` : "";
}
__name(tagString, "tagString");
function parseTags(stored) {
  return stored.split("|").map((id) => id.trim()).filter(Boolean).map((id) => {
    const known = TAG_BY_ID.get(id);
    return known ? { id, label: known.label } : null;
  }).filter((tag) => tag !== null);
}
__name(parseTags, "parseTags");
function knownTag(id) {
  return TAG_BY_ID.get(id);
}
__name(knownTag, "knownTag");

// src/text.ts
var USER_AGENT = "NomadBlogBot/1.0 (+https://nomad.evanzhang.cloud; excerpts-only; attribution)";
var EXCERPT_MAX = 300;
var TRACKING_PARAMS = /* @__PURE__ */ new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "utm_name",
  "ref",
  "ref_src",
  "source",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "igshid",
  "si",
  "spm",
  "gi"
]);
function safeCodePoint(value) {
  if (!Number.isInteger(value) || value < 0 || value > 1114111) return "";
  if (value >= 55296 && value <= 57343) return "";
  return String.fromCodePoint(value);
}
__name(safeCodePoint, "safeCodePoint");
function decodeXml(input) {
  let text = input.replace(/^\uFEFF/, "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  for (let pass = 0; pass < 2; pass++) {
    text = text.replace(/&#(\d+);/g, (_, n) => safeCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => safeCodePoint(parseInt(n, 16))).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  }
  return text;
}
__name(decodeXml, "decodeXml");
function stripTags(html2) {
  return html2.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}
__name(stripTags, "stripTags");
function plainTitle(input) {
  let text = decodeXml(input);
  if (/<[a-z!/]/i.test(text)) text = decodeXml(stripTags(text));
  return text.replace(/\s+/g, " ").trim();
}
__name(plainTitle, "plainTitle");
function plainExcerpt(input) {
  let text = decodeXml(input);
  const snippet = text.match(/medium-feed-snippet">([\s\S]*?)<\/p>/i);
  if (snippet) text = decodeXml(snippet[1]);
  if (/<[a-z!/]/i.test(text)) text = decodeXml(stripTags(text));
  return text.replace(/!\[[^\]]*]\([^)]*\)/g, " ").replace(/\[([^\]]+)]\([^)]*\)/g, "$1").replace(/https?:\/\/\S+/g, " ").replace(/\s+/g, " ").trim();
}
__name(plainExcerpt, "plainExcerpt");
function clip(text, max = EXCERPT_MAX) {
  const chars = Array.from(text);
  if (chars.length <= max) return text;
  return `${chars.slice(0, max - 1).join("").trimEnd()}\u2026`;
}
__name(clip, "clip");
function excerptOf(raw, title = "") {
  let text = plainExcerpt(raw);
  const normalizedTitle = plainTitle(title);
  if (normalizedTitle && text.startsWith(normalizedTitle)) {
    text = text.slice(normalizedTitle.length).trim();
  }
  return clip(text, EXCERPT_MAX);
}
__name(excerptOf, "excerptOf");
function canonicalUrl(input) {
  let url;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  url.protocol = "https:";
  url.hash = "";
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const kept = [];
  for (const [key, value] of url.searchParams.entries()) {
    const lower = key.toLowerCase();
    if (TRACKING_PARAMS.has(lower) || lower.startsWith("utm_")) continue;
    kept.push([key, value]);
  }
  kept.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
  url.search = "";
  for (const [key, value] of kept) url.searchParams.append(key, value);
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}
__name(canonicalUrl, "canonicalUrl");
function toIso(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const ms = value < 1e12 ? value * 1e3 : value;
    const date2 = new Date(ms);
    return Number.isNaN(date2.getTime()) ? null : date2.toISOString();
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
__name(toIso, "toIso");
function authorName(raw) {
  if (!raw) return null;
  const text = plainTitle(raw);
  if (!text) return null;
  const wrapped = text.match(/\(([^)]+)\)\s*$/);
  const name = (wrapped?.[1] ?? text).trim();
  if (!name || name.includes("@")) return null;
  return clip(name, 80);
}
__name(authorName, "authorName");
function rankScore(popularity2, publishedAt, commentBonus = 0) {
  let score = Math.max(0, popularity2) + Math.max(0, commentBonus);
  if (publishedAt) {
    const ageDays = (Date.now() - Date.parse(publishedAt)) / 864e5;
    if (Number.isFinite(ageDays)) {
      if (ageDays < 2) score += 6;
      else if (ageDays < 10) score += 3;
      else if (ageDays > 400) score -= 4;
    }
  }
  return Math.round(score * 10) / 10;
}
__name(rankScore, "rankScore");
function esc(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(esc, "esc");
function xmlEsc(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
__name(xmlEsc, "xmlEsc");
function safeHref(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return esc(url.toString());
  } catch {
  }
  return "#";
}
__name(safeHref, "safeHref");
function shanghaiDayKey(iso) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(iso));
}
__name(shanghaiDayKey, "shanghaiDayKey");
function shanghaiLabel(iso, withWeekday = true) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: withWeekday ? "short" : void 0
  }).format(new Date(iso));
}
__name(shanghaiLabel, "shanghaiLabel");
function rfc822(iso) {
  return new Date(iso).toUTCString();
}
__name(rfc822, "rfc822");
async function fetchText(url, timeoutMs = 12e3) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/rss+xml, application/atom+xml, application/feed+json, application/json, text/xml, */*;q=0.5"
    },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
  }
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > 25e5) throw new Error("response too large");
  return new TextDecoder("utf-8").decode(buffer);
}
__name(fetchText, "fetchText");

// src/item.ts
var BLOCKED = /remote code execution|\brce\b|\bcve-\d|vulnerability|exploit|buffer overflow|privilege escalation/i;
function detectLanguage(title, excerpt) {
  return isPredominantlyChinese(title) || isPredominantlyChinese(excerpt) ? "zh" : "en";
}
__name(detectLanguage, "detectLanguage");
function isPredominantlyChinese(title) {
  const cjk = title.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const latin = title.match(/[A-Za-z]/g)?.length ?? 0;
  if (cjk < 4) return false;
  return cjk / (cjk + latin) >= 0.45;
}
__name(isPredominantlyChinese, "isPredominantlyChinese");
function buildDraft(input) {
  const title = clip(plainTitle(input.title), 200);
  const canonical = canonicalUrl(input.url);
  if (!title || !canonical) return null;
  if (!isPredominantlyChinese(title)) return null;
  if (BLOCKED.test(title)) return null;
  const excerpt = excerptOf(input.excerpt ?? "", title);
  const publishedAt = toIso(input.publishedAt);
  const popularity2 = Math.max(0, Math.round(input.popularity ?? 0));
  const discussion = input.discussionUrl ? canonicalUrl(input.discussionUrl) : null;
  return {
    canonicalUrl: canonical,
    title,
    excerpt,
    sourceId: input.sourceId,
    sourceName: input.sourceName,
    author: authorName(input.author),
    publishedAt,
    popularity: popularity2,
    popularityLabel: input.popularityLabel ?? "",
    discussionUrl: discussion && discussion !== canonical ? discussion : null,
    rankScore: rankScore(popularity2, publishedAt, input.commentBonus ?? 0),
    tags: tagString(title, excerpt),
    language: detectLanguage(title, excerpt)
  };
}
__name(buildDraft, "buildDraft");
function withTag(draft, tag) {
  if (!draft) return null;
  const ids = draft.tags.split("|").filter(Boolean);
  if (ids.includes(tag)) return draft;
  ids.unshift(tag);
  return { ...draft, tags: `|${ids.slice(0, 4).join("|")}|` };
}
__name(withTag, "withTag");
function byRank(a, b) {
  return b.rankScore - a.rankScore || b.popularity - a.popularity || (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
}
__name(byRank, "byRank");
function dedupeDrafts(items) {
  const byUrl = /* @__PURE__ */ new Map();
  for (const item of items) {
    const current = byUrl.get(item.canonicalUrl);
    if (!current || item.rankScore > current.rankScore) byUrl.set(item.canonicalUrl, item);
  }
  return [...byUrl.values()];
}
__name(dedupeDrafts, "dedupeDrafts");

// src/feed.ts
function inner(block, names) {
  for (const name of names) {
    const match = block.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "i"));
    if (match?.[1]) return match[1];
  }
  return "";
}
__name(inner, "inner");
function rssLink(block) {
  const match = block.match(/<link\b[^>]*>([^<]*)<\/link>/i);
  return (match?.[1] ?? "").trim();
}
__name(rssLink, "rssLink");
function atomLink(block) {
  const tags = block.match(/<link\b[^>]*\/?>/gi) ?? [];
  let fallback = "";
  for (const tag of tags) {
    const href = tag.match(/\bhref\s*=\s*"([^"]+)"/i)?.[1] ?? tag.match(/\bhref\s*=\s*'([^']+)'/i)?.[1] ?? "";
    if (!href) continue;
    const rel = tag.match(/\brel\s*=\s*"([^"]+)"/i)?.[1] ?? "";
    if (rel === "" || rel === "alternate") return href.trim();
    if (!fallback && rel !== "self" && rel !== "enclosure") fallback = href.trim();
  }
  return fallback;
}
__name(atomLink, "atomLink");
function entryAuthor(block) {
  const creator = authorName(inner(block, ["dc:creator", "creator"]));
  if (creator) return creator;
  const named = authorName(inner(inner(block, ["author"]), ["name"]));
  if (named) return named;
  return authorName(inner(block, ["author"]));
}
__name(entryAuthor, "entryAuthor");
function entryFrom(block, link) {
  const title = plainTitle(inner(block, ["title"]));
  const url = link || inner(block, ["guid", "id"]).trim();
  if (!title || !url) return null;
  const author = entryAuthor(block);
  const publishedAt = toIso(
    plainTitle(inner(block, ["pubDate", "published", "updated", "dc:date", "date"]))
  );
  const rawExcerpt = inner(block, ["description", "summary"]) || inner(block, ["content:encoded", "content"]);
  return {
    url,
    title: title.slice(0, 300),
    excerpt: excerptOf(rawExcerpt, title),
    author,
    publishedAt
  };
}
__name(entryFrom, "entryFrom");
function parseFeed(xml) {
  const source = xml.replace(/^\uFEFF/, "");
  const items = [...source.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(
    (match) => entryFrom(match[1] ?? "", rssLink(match[1] ?? ""))
  );
  if (items.length) return items.filter((entry) => entry !== null);
  const entries = [...source.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map(
    (match) => entryFrom(match[1] ?? "", atomLink(match[1] ?? ""))
  );
  return entries.filter((entry) => entry !== null);
}
__name(parseFeed, "parseFeed");

// src/sources.ts
var NOMAD_TOPIC = /数字游民|數位遊牧|数位游牧|游民|遊牧|远程|遠端|遠程|签证|簽證|旅居|海外|自由职业|自由職業|一人公司|居留|移民|电子居民|電子居民|税务|稅務|nomad/i;
function top(items, limit) {
  const ready = dedupeDrafts(items.filter((item) => item !== null)).sort(byRank);
  if (!ready.length) throw new Error("no items");
  return ready.slice(0, limit);
}
__name(top, "top");
async function fetchFeed(options) {
  const entries = parseFeed(await fetchText(options.url));
  return top(
    entries.map((entry) => {
      const draft = buildDraft({
        url: entry.url,
        title: entry.title,
        excerpt: entry.excerpt,
        sourceId: options.sourceId,
        sourceName: options.sourceName,
        author: entry.author ?? options.authorFallback ?? null,
        publishedAt: entry.publishedAt
      });
      if (!draft) return null;
      if (options.topicOnly && !NOMAD_TOPIC.test(`${draft.title}
${draft.excerpt}`)) return null;
      return options.tag ? withTag(draft, options.tag) : draft;
    }),
    options.limit
  );
}
__name(fetchFeed, "fetchFeed");
var SOURCES = [
  {
    id: "eleduck",
    name: "\u7535\u9E2D\u793E\u533A",
    hint: "https://eleduck.com/feed/latest.xml",
    fetch: /* @__PURE__ */ __name(() => fetchFeed({
      url: "https://eleduck.com/feed/latest.xml",
      sourceId: "eleduck",
      sourceName: "\u7535\u9E2D\u793E\u533A",
      limit: 10
    }), "fetch")
  },
  {
    id: "looktheworld",
    name: "Look the World",
    hint: "https://www.looktheworld.com/changes.xml",
    fetch: /* @__PURE__ */ __name(() => fetchFeed({
      url: "https://www.looktheworld.com/changes.xml",
      sourceId: "looktheworld",
      sourceName: "Look the World",
      limit: 8,
      tag: "visa"
    }), "fetch")
  },
  {
    id: "jarodise",
    name: "\u6570\u5B57\u6E38\u6C11\u90E8\u843D",
    hint: "https://jarodise.com/rss.xml",
    fetch: /* @__PURE__ */ __name(() => fetchFeed({
      url: "https://jarodise.com/rss.xml",
      sourceId: "jarodise",
      sourceName: "\u6570\u5B57\u6E38\u6C11\u90E8\u843D",
      limit: 8,
      topicOnly: true
    }), "fetch")
  },
  {
    id: "turtlegirl",
    name: "\u4E4C\u9F9F\u59B9\u51FA\u8D70\u65C5\u884C",
    hint: "https://turtlegirltravel.com/category/digital-nomad/feed/",
    fetch: /* @__PURE__ */ __name(() => fetchFeed({
      url: "https://turtlegirltravel.com/category/digital-nomad/feed/",
      sourceId: "turtlegirl",
      sourceName: "\u4E4C\u9F9F\u59B9\u51FA\u8D70\u65C5\u884C",
      limit: 6
    }), "fetch")
  },
  {
    id: "rososa",
    name: "\u7231\u6C99\u5C3C\u4E9A\u7535\u5B50\u5C45\u6C11\u793E\u533A",
    hint: "https://rososa.com/feed/",
    fetch: /* @__PURE__ */ __name(() => fetchFeed({
      url: "https://rososa.com/feed/",
      sourceId: "rososa",
      sourceName: "\u7231\u6C99\u5C3C\u4E9A\u7535\u5B50\u5C45\u6C11\u793E\u533A",
      limit: 6
    }), "fetch")
  }
];
function knownSource(id) {
  return SOURCES.find((source) => source.id === id);
}
__name(knownSource, "knownSource");

// src/collect.ts
var RUN_LIMIT = 16;
async function loadSource(source) {
  try {
    const items = dedupeDrafts(await source.fetch()).sort(byRank).slice(0, 12);
    if (!items.length) throw new Error("no items");
    return { id: source.id, name: source.name, ok: true, error: null, items };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`source ${source.id} failed: ${message}`);
    return {
      id: source.id,
      name: source.name,
      ok: false,
      error: message.slice(0, 300),
      items: []
    };
  }
}
__name(loadSource, "loadSource");
async function loadSources(sources = SOURCES) {
  return Promise.all(sources.map((source) => loadSource(source)));
}
__name(loadSources, "loadSources");
function selectHybrid(items, limit) {
  const groups = /* @__PURE__ */ new Map();
  for (const item of items) {
    const list = groups.get(item.sourceId) ?? [];
    list.push(item);
    groups.set(item.sourceId, list);
  }
  for (const list of groups.values()) list.sort(byRank);
  const picked = [];
  const seen = /* @__PURE__ */ new Set();
  const ordered = [...groups.values()].sort((a, b) => byRank(a[0], b[0]));
  for (const list of ordered) {
    if (picked.length >= limit) break;
    const item = list[0];
    if (!item || seen.has(item.canonicalUrl)) continue;
    seen.add(item.canonicalUrl);
    picked.push(item);
  }
  const rest = items.filter((item) => !seen.has(item.canonicalUrl)).sort(byRank);
  for (const item of rest) {
    if (picked.length >= limit) break;
    if (seen.has(item.canonicalUrl)) continue;
    seen.add(item.canonicalUrl);
    picked.push(item);
  }
  return picked;
}
__name(selectHybrid, "selectHybrid");
function selectFresh(items, existing, limit = RUN_LIMIT) {
  const unique = dedupeDrafts(items);
  const fresh = unique.filter((item) => !existing.has(item.canonicalUrl));
  const picked = selectHybrid(fresh, limit);
  return {
    picked,
    duplicates: unique.length - fresh.length,
    capped: fresh.length - picked.length
  };
}
__name(selectFresh, "selectFresh");
async function existingUrls(db, urls) {
  const found = /* @__PURE__ */ new Set();
  for (let index = 0; index < urls.length; index += 80) {
    const chunk = urls.slice(index, index + 80);
    const placeholders = chunk.map(() => "?").join(", ");
    const rows = await db.prepare(`SELECT canonical_url FROM items WHERE canonical_url IN (${placeholders})`).bind(...chunk).all();
    for (const row of rows.results ?? []) found.add(row.canonical_url);
  }
  return found;
}
__name(existingUrls, "existingUrls");
async function runCollect(env, trigger) {
  const startedAt = (/* @__PURE__ */ new Date()).toISOString();
  const loaded = await loadSources();
  const pool = loaded.flatMap((source) => source.items);
  const existing = await existingUrls(
    env.DB,
    [...new Set(pool.map((item) => item.canonicalUrl))]
  );
  const { picked, duplicates, capped } = selectFresh(pool, existing, RUN_LIMIT);
  const collectedAt = (/* @__PURE__ */ new Date()).toISOString();
  let inserted = 0;
  if (picked.length) {
    const results = await env.DB.batch(
      picked.map(
        (item) => env.DB.prepare(
          `INSERT INTO items (
            canonical_url, title, excerpt, source_id, source_name, author,
            published_at, collected_at, popularity, popularity_label, tags,
            language, discussion_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(canonical_url) DO NOTHING`
        ).bind(
          item.canonicalUrl,
          item.title,
          item.excerpt,
          item.sourceId,
          item.sourceName,
          item.author,
          item.publishedAt,
          collectedAt,
          item.popularity,
          item.popularityLabel,
          item.tags,
          item.language,
          item.discussionUrl
        )
      )
    );
    inserted = results.reduce((sum, result) => sum + (result.meta?.changes ?? 0), 0);
  }
  const failed = loaded.filter((source) => !source.ok).length;
  const status = failed === 0 ? "ok" : failed === loaded.length ? "error" : "partial";
  const report = {
    ok: loaded.some((source) => source.ok),
    trigger,
    status,
    inserted,
    duplicates,
    capped,
    sources: loaded.map((source) => ({
      id: source.id,
      name: source.name,
      ok: source.ok,
      fetched: source.items.length,
      error: source.error
    }))
  };
  await env.DB.prepare(
    `INSERT INTO collect_runs (
      started_at, finished_at, trigger, status, inserted_count, duplicate_count, capped_count, report
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    startedAt,
    (/* @__PURE__ */ new Date()).toISOString(),
    trigger,
    status,
    inserted,
    duplicates,
    capped,
    JSON.stringify(report).slice(0, 2e4)
  ).run();
  console.log(
    JSON.stringify({
      trigger,
      status,
      inserted,
      duplicates,
      capped,
      titles: picked.map((item) => `${item.sourceId}: ${item.title}`)
    })
  );
  return report;
}
__name(runCollect, "runCollect");
async function purgeNonChinese(db) {
  const rows = await db.prepare("SELECT id, title FROM items").all();
  const all = rows.results ?? [];
  const ids = all.filter((row) => !isPredominantlyChinese(row.title)).map((row) => row.id);
  let deleted = 0;
  for (let index = 0; index < ids.length; index += 80) {
    const chunk = ids.slice(index, index + 80);
    const placeholders = chunk.map(() => "?").join(", ");
    const result = await db.prepare(`DELETE FROM items WHERE id IN (${placeholders})`).bind(...chunk).run();
    deleted += result.meta?.changes ?? 0;
  }
  return { scanned: all.length, deleted };
}
__name(purgeNonChinese, "purgeNonChinese");

// src/queries.ts
var PAGE_SIZE = 20;
function parsePage(raw) {
  if (!raw) return 1;
  if (!/^\d+$/.test(raw)) return 1;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) return 1;
  return Math.min(value, 1e3);
}
__name(parsePage, "parsePage");
function pageCount(total, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / pageSize));
}
__name(pageCount, "pageCount");
function normalizePage(requested, total, pageSize = PAGE_SIZE) {
  return Math.min(Math.max(1, requested), pageCount(total, pageSize));
}
__name(normalizePage, "normalizePage");
function whereClause(sourceId, tag) {
  const parts = [];
  const binds = [];
  if (sourceId) {
    parts.push("source_id = ?");
    binds.push(sourceId);
  }
  if (tag) {
    parts.push("tags LIKE ?");
    binds.push(`%|${tag}|%`);
  }
  return {
    sql: parts.length ? `WHERE ${parts.join(" AND ")}` : "",
    binds
  };
}
__name(whereClause, "whereClause");
async function countItems(db, sourceId, tag) {
  const where = whereClause(sourceId, tag);
  const row = await db.prepare(`SELECT COUNT(*) AS n FROM items ${where.sql}`).bind(...where.binds).first();
  return Number(row?.n ?? 0);
}
__name(countItems, "countItems");
async function listItems(db, sourceId, tag, page) {
  const where = whereClause(sourceId, tag);
  const offset = (page - 1) * PAGE_SIZE;
  const rows = await db.prepare(
    `SELECT id, canonical_url, title, excerpt, source_id, source_name, author,
              published_at, collected_at, popularity, popularity_label, tags, language, discussion_url
       FROM items ${where.sql}
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ? OFFSET ?`
  ).bind(...where.binds, PAGE_SIZE, offset).all();
  return rows.results ?? [];
}
__name(listItems, "listItems");
async function getItem(db, id) {
  return db.prepare(
    `SELECT id, canonical_url, title, excerpt, source_id, source_name, author,
              published_at, collected_at, popularity, popularity_label, tags, language, discussion_url
       FROM items WHERE id = ?`
  ).bind(id).first();
}
__name(getItem, "getItem");
async function recentItems(db, limit = 30) {
  const rows = await db.prepare(
    `SELECT id, canonical_url, title, excerpt, source_id, source_name, author,
              published_at, collected_at, popularity, popularity_label, tags, language, discussion_url
       FROM items
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ?`
  ).bind(limit).all();
  return rows.results ?? [];
}
__name(recentItems, "recentItems");

// src/styles.ts
var CSS = `
:root {
  color-scheme: light;
  --paper: #f4efe4;
  --paper-2: #fffaf2;
  --ink: #1c1712;
  --muted: #5e564e;
  --line: #e0d3c2;
  --line-strong: #c9b8a2;
  --teal: #0c5f57;
  --teal-soft: #e5f3f1;
  --stamp: #8d2e28;
  --chip: #efe4d4;
  --shadow: 0 18px 50px rgba(48, 32, 14, 0.06);
  --serif: "Iowan Old Style", Palatino, "Palatino Linotype", "Songti SC", "Noto Serif SC", "Source Han Serif SC", serif;
  --sans: "Avenir Next", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --paper: #141210;
    --paper-2: #1d1a16;
    --ink: #f4ecdf;
    --muted: #c3b6a6;
    --line: #3a332c;
    --line-strong: #5a4e43;
    --teal: #8fd9cf;
    --teal-soft: #1c3330;
    --stamp: #f0a79f;
    --chip: #2a241e;
    --shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  }
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1200px 400px at 10% -10%, rgba(12, 95, 87, 0.08), transparent 50%),
    var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.65;
}
a { color: var(--teal); text-underline-offset: 0.16em; }
a:hover { color: var(--stamp); }
:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
.skip {
  position: absolute;
  left: 1rem;
  top: -4rem;
  background: var(--ink);
  color: var(--paper);
  padding: 0.4rem 0.7rem;
}
.skip:focus { top: 0.6rem; }
.wrap { width: min(860px, calc(100% - 2rem)); margin: 0 auto; }
header.mast {
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
}
.mast-inner { padding: 1.4rem 0 1.15rem; }
.kicker {
  margin: 0;
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--stamp);
  font-weight: 700;
}
.mast-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-top: 0.2rem;
}
.logo {
  font-family: var(--serif);
  font-size: clamp(2.2rem, 5vw, 3.3rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--ink);
  text-decoration: none;
}
.logo:hover { color: var(--teal); }
nav.site { display: flex; gap: 0.9rem; font-size: 0.95rem; }
nav.site a { color: var(--ink); text-decoration: none; border-bottom: 1px solid transparent; }
nav.site a:hover, nav.site a[aria-current="page"] { border-bottom-color: var(--stamp); color: var(--stamp); }
.deck { margin: 0.75rem 0 0; max-width: 46rem; color: var(--muted); }
main { flex: 1; padding: 1.4rem 0 3rem; }
.filters { display: grid; gap: 0.85rem; margin-bottom: 1.3rem; }
.tag-row, .meta-row { display: flex; gap: 0.45rem; overflow-x: auto; padding-bottom: 0.15rem; }
.tag, button, select {
  font: inherit;
  color: var(--ink);
  background: var(--chip);
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.28rem 0.75rem;
  text-decoration: none;
  white-space: nowrap;
}
.tag.on, button { background: var(--teal); color: #f7fffd; }
@media (prefers-color-scheme: dark) {
  .tag.on, button { color: #10211f; }
}
button { cursor: pointer; border-radius: 999px; }
select { border-radius: 999px; background: var(--paper-2); border-color: var(--line); }
.source-form { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.source-form label { color: var(--muted); font-size: 0.92rem; }
.count { color: var(--muted); font-size: 0.92rem; margin: 0; }
.day { margin: 0 0 1.6rem; }
.day h2 {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: baseline;
  margin: 0 0 0.7rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--serif);
  font-size: 1.25rem;
  font-weight: 600;
}
.day h2 span { color: var(--muted); font-family: var(--sans); font-size: 0.85rem; font-weight: 500; }
.item {
  display: grid;
  grid-template-columns: 2.4rem 1fr;
  gap: 0.7rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--line);
}
.index {
  font-family: var(--serif);
  color: var(--teal);
  font-size: 1.15rem;
  padding-top: 0.15rem;
}
.item h3 { margin: 0; font-family: var(--serif); font-size: 1.35rem; line-height: 1.3; font-weight: 600; }
.item h3 a { color: var(--ink); text-decoration: none; }
.item h3 a:hover { color: var(--teal); }
.excerpt { margin: 0.4rem 0 0.55rem; color: var(--muted); }
.attr {
  margin: 0.35rem 0;
  padding: 0.55rem 0.75rem;
  background: var(--paper-2);
  border-left: 3px solid var(--teal);
  box-shadow: var(--shadow);
}
.attr strong { font-weight: 650; }
.badges { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.45rem 0 0; padding: 0; list-style: none; }
.badges a, .lang {
  font-size: 0.78rem;
  text-decoration: none;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 0.05rem 0.5rem;
  color: var(--stamp);
}
.submeta { margin: 0.35rem 0 0; color: var(--muted); font-size: 0.88rem; }
.pager { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-top: 1.4rem; }
.pager a, .pager span { text-decoration: none; }
.empty, .note {
  background: var(--paper-2);
  border: 1px dashed var(--line-strong);
  padding: 1rem 1.1rem;
}
article.post h1 {
  font-family: var(--serif);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin: 0.3rem 0 0.9rem;
}
.quote {
  margin: 1rem 0;
  padding: 0.2rem 0 0.2rem 1rem;
  border-left: 3px solid var(--stamp);
  font-family: var(--serif);
  font-size: 1.18rem;
  color: var(--ink);
}
.read {
  display: inline-block;
  margin-top: 0.4rem;
  background: var(--teal);
  color: #f7fffd;
  text-decoration: none;
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
}
@media (prefers-color-scheme: dark) {
  .read { color: #10211f; }
}
.read:hover { background: var(--stamp); color: white; }
.discuss { margin: 0.8rem 0 0; }
footer.site {
  border-top: 1px solid var(--line);
  padding: 1.2rem 0 2rem;
  color: var(--muted);
  font-size: 0.92rem;
}
footer.site p { margin: 0.3rem 0; }
.about h2 { font-family: var(--serif); font-size: 1.4rem; margin: 1.6rem 0 0.4rem; }
.about ul { padding-left: 1.2rem; }
.about li { margin: 0.35rem 0; }
code { font-size: 0.92em; }
@media (max-width: 640px) {
  body { font-size: 16px; }
  .mast-row { flex-direction: column; align-items: flex-start; }
  .item { grid-template-columns: 1.8rem 1fr; }
  .item h3 { font-size: 1.18rem; }
}
`.trim();

// src/render.ts
var FAVICON = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0c5f57"/><path d="M16 5.5 19.2 14.6 16 26.5 12.8 14.6Z" fill="#f4efe4"/><circle cx="16" cy="16" r="1.7" fill="#8d2e28"/></svg>`
);
function pageHref(page, source, tag) {
  const params = new URLSearchParams();
  if (source) params.set("source", source);
  if (tag) params.set("tag", tag);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}
__name(pageHref, "pageHref");
function displayAuthor(author) {
  return author && author.trim() ? author : "\u672A\u77E5";
}
__name(displayAuthor, "displayAuthor");
function attribution(item) {
  return `\u6765\u6E90\uFF1A<strong>${esc(item.source_name)}</strong> \xB7 \u4F5C\u8005\uFF1A<strong>${esc(displayAuthor(item.author))}</strong> \xB7 <a href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">\u539F\u6587\u94FE\u63A5</a>`;
}
__name(attribution, "attribution");
function tagLinks(item, source) {
  const tags = parseTags(item.tags);
  if (!tags.length) return "";
  return `<ul class="badges">${tags.map(
    (tag) => `<li><a href="${esc(pageHref(1, source, tag.id))}">${esc(tag.label)}</a></li>`
  ).join("")}</ul>`;
}
__name(tagLinks, "tagLinks");
function popularity(item) {
  if (!item.popularity || !item.popularity_label) return "";
  return `${item.popularity} ${item.popularity_label}`;
}
__name(popularity, "popularity");
function layout(options) {
  const onHome = options.path === "/" || options.path.startsWith("/?");
  const fullTitle = onHome ? "\u6E38\u7267\u624B\u8BB0" : `${options.title} \xB7 \u6E38\u7267\u624B\u8BB0`;
  const canonical = `${options.origin}${options.path === "/" ? "/" : options.path}`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(options.description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" type="application/rss+xml" title="\u6E38\u7267\u624B\u8BB0" href="/rss.xml">
<link rel="icon" href="${FAVICON}">
<meta name="theme-color" content="#0c5f57">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(options.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="zh_CN">
<meta property="og:type" content="website">
<style>${CSS}</style>
</head>
<body>
<a class="skip" href="#content">\u8DF3\u5230\u6B63\u6587</a>
<header class="mast">
  <div class="wrap mast-inner">
    <p class="kicker">nomad.evanzhang.cloud \xB7 \u6BCF\u65E5\u9009\u8BFB</p>
    <div class="mast-row">
      <a class="logo" href="/">\u6E38\u7267\u624B\u8BB0</a>
      <nav class="site" aria-label="\u7AD9\u70B9">
        <a href="/" ${onHome ? 'aria-current="page"' : ""}>\u6700\u65B0</a>
        <a href="/about" ${options.path === "/about" ? 'aria-current="page"' : ""}>\u5173\u4E8E</a>
        <a href="/rss.xml">RSS</a>
      </nav>
    </div>
    <p class="deck">\u6BCF\u5929\u4ECE\u516C\u5F00\u7F51\u9875\u6574\u7406\u4E2D\u6587\u7684\u6570\u5B57\u6E38\u6C11\u3001\u8FDC\u7A0B\u5DE5\u4F5C\u3001\u7B7E\u8BC1\u548C\u65C5\u5C45\u5185\u5BB9\u3002\u8FD9\u91CC\u53EA\u653E\u6807\u9898\u3001\u4E09\u767E\u5B57\u4EE5\u5185\u7684\u6458\u8981\uFF0C\u4EE5\u53CA\u56DE\u5230\u539F\u6587\u7684\u94FE\u63A5\u3002</p>
  </div>
</header>
<main id="content" class="wrap">${options.body}</main>
<footer class="site">
  <div class="wrap">
    <p>\u672C\u7AD9\u53EA\u6574\u7406\u516C\u5F00\u6765\u6E90\u7684\u6807\u9898\u3001\u77ED\u6458\u8981\u4E0E\u94FE\u63A5\uFF0C\u4E0D\u8F6C\u8F7D\u5168\u6587\u3002\u5185\u5BB9\u8457\u4F5C\u6743\u5F52\u539F\u4F5C\u8005\u6240\u6709\u3002</p>
    <p>\u6E38\u7267\u624B\u8BB0 \xB7 <a href="/rss.xml">\u8BA2\u9605 RSS</a> \xB7 <a href="/about">\u5173\u4E8E\u8FD9\u4EFD\u65E5\u66F4</a></p>
  </div>
</footer>
</body>
</html>`;
}
__name(layout, "layout");
function filters(view) {
  const tags = [
    `<a class="tag${view.tag ? "" : " on"}" href="${esc(pageHref(1, view.source, ""))}">\u5168\u90E8</a>`,
    ...TAGS.map(
      (tag) => `<a class="tag${view.tag === tag.id ? " on" : ""}" href="${esc(pageHref(1, view.source, tag.id))}">${esc(tag.label)}</a>`
    )
  ].join("");
  const options = [
    `<option value="">\u5168\u90E8\u6765\u6E90</option>`,
    ...SOURCES.map(
      (source) => `<option value="${esc(source.id)}"${view.source === source.id ? " selected" : ""}>${esc(source.name)}</option>`
    )
  ].join("");
  return `<form class="filters" method="get" action="/">
    <div class="tag-row" role="navigation" aria-label="\u6309\u4E3B\u9898\u7B5B\u9009">${tags}</div>
    <div class="source-form">
      <label>\u6765\u6E90 <select name="source">${options}</select></label>
      ${view.tag ? `<input type="hidden" name="tag" value="${esc(view.tag)}">` : ""}
      <button type="submit">\u7B5B\u9009</button>
    </div>
  </form>`;
}
__name(filters, "filters");
function itemCard(item, index, sourceFilter) {
  const bits = [
    popularity(item),
    item.published_at ? `\u53D1\u5E03\u4E8E ${shanghaiLabel(item.published_at, false)}` : "",
    item.language === "zh" ? "\u4E2D\u6587" : "EN"
  ].filter(Boolean);
  return `<article class="item">
    <div class="index">${String(index).padStart(2, "0")}</div>
    <div>
      <h3><a href="/item/${item.id}">${esc(item.title)}</a></h3>
      ${item.excerpt ? `<p class="excerpt">${esc(item.excerpt)}</p>` : ""}
      <p class="attr">${attribution(item)}</p>
      ${tagLinks(item, sourceFilter)}
      <p class="submeta">${esc(bits.join(" \xB7 "))}</p>
    </div>
  </article>`;
}
__name(itemCard, "itemCard");
function renderHome(view, origin) {
  const pages = pageCount(view.total, PAGE_SIZE);
  const activeTag = view.tag ? knownTag(view.tag)?.label : "";
  const activeSource = SOURCES.find((source) => source.id === view.source)?.name;
  const filterBits = [activeSource, activeTag].filter(Boolean).join(" \xB7 ");
  let list = "";
  if (!view.items.length) {
    list = `<div class="empty"><p>${view.total === 0 && !view.source && !view.tag ? "\u8FD8\u6CA1\u6709\u6536\u5F55\u3002\u6BCF\u5929\u5317\u4EAC\u65F6\u95F4 08:00 \u548C 22:00 \u4F1A\u5404\u6536\u96C6\u4E00\u6B21\u3002\u672C\u5730\u8C03\u8BD5\u53EF\u4EE5\u8C03\u7528\u7BA1\u7406\u63A5\u53E3\u624B\u52A8\u8DD1\u4E00\u8F6E\u3002" : "\u6CA1\u6709\u7B26\u5408\u7B5B\u9009\u6761\u4EF6\u7684\u6761\u76EE\u3002"}</p></div>`;
  } else {
    const groups = [];
    for (const item of view.items) {
      const key = shanghaiDayKey(item.collected_at);
      const last = groups[groups.length - 1];
      if (!last || last.key !== key) {
        groups.push({ key, label: shanghaiLabel(item.collected_at), items: [item] });
      } else {
        last.items.push(item);
      }
    }
    let number = (view.page - 1) * PAGE_SIZE;
    list = groups.map((group) => {
      const cards = group.items.map((item) => {
        number += 1;
        return itemCard(item, number, view.source);
      }).join("");
      return `<section class="day"><h2>\u6536\u5F55\u4E8E ${esc(group.label)}<span>${group.items.length} \u7BC7</span></h2>${cards}</section>`;
    }).join("");
  }
  const prev = view.page > 1 ? `<a href="${esc(pageHref(view.page - 1, view.source, view.tag))}">\u4E0A\u4E00\u9875</a>` : `<span>\u4E0A\u4E00\u9875</span>`;
  const next = view.page < pages ? `<a href="${esc(pageHref(view.page + 1, view.source, view.tag))}">\u4E0B\u4E00\u9875</a>` : `<span>\u4E0B\u4E00\u9875</span>`;
  const body = `${filters(view)}
    <p class="count">\u5171 ${view.total} \u7BC7${filterBits ? ` \xB7 ${esc(filterBits)}` : ""} \xB7 \u7B2C ${view.page} / ${pages} \u9875 \xB7 ${esc(shanghaiLabel(view.generatedAt, false))}</p>
    ${list}
    ${view.total > PAGE_SIZE ? `<nav class="pager" aria-label="\u5206\u9875">${prev}<span>\u7B2C ${view.page} / ${pages} \u9875</span>${next}</nav>` : ""}`;
  return layout({
    title: "\u6700\u65B0",
    description: "\u6570\u5B57\u6E38\u6C11\u3001\u8FDC\u7A0B\u5DE5\u4F5C\u3001\u7B7E\u8BC1\u4E0E\u65C5\u5C45\u7684\u6BCF\u65E5\u9009\u8BFB\u3002\u53EA\u6536\u5F55\u6807\u9898\u3001\u77ED\u6458\u8981\u548C\u539F\u6587\u94FE\u63A5\u3002",
    path: pageHref(view.page, view.source, view.tag),
    body,
    origin
  });
}
__name(renderHome, "renderHome");
function renderItem(item, origin) {
  const bits = [
    popularity(item),
    item.published_at ? `\u53D1\u5E03\u4E8E ${shanghaiLabel(item.published_at)}` : "",
    `\u6536\u5F55\u4E8E ${shanghaiLabel(item.collected_at)}`,
    item.language === "zh" ? "\u4E2D\u6587" : "EN"
  ].filter(Boolean);
  const discussion = item.discussion_url ? `<p class="discuss"><a href="${safeHref(item.discussion_url)}" target="_blank" rel="noopener noreferrer">\u67E5\u770B\u8BA8\u8BBA\u7EBF\u7A0B</a></p>` : "";
  const body = `<article class="post">
    <p class="kicker">${esc(item.language === "zh" ? "\u4E2D\u6587" : "EN")}</p>
    <h1>${esc(item.title)}</h1>
    <p class="attr">${attribution(item)}</p>
    ${item.excerpt ? `<blockquote class="quote">${esc(item.excerpt)}</blockquote>` : `<p class="note">\u8FD9\u6761\u6765\u6E90\u6CA1\u6709\u63D0\u4F9B\u53EF\u7528\u7684\u6458\u8981\u3002</p>`}
    <p class="note">\u4E0A\u9762\u662F\u6765\u6E90\u7AD9\u70B9\u516C\u5F00\u63CF\u8FF0\u91CC\u7684\u77ED\u6458\u8981\uFF0C\u6700\u591A 300 \u5B57\uFF0C\u4E0D\u662F\u6B63\u6587\u3002\u8BF7\u4ECE\u539F\u6587\u94FE\u63A5\u7EE7\u7EED\u8BFB\u3002</p>
    <p><a class="read" href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">\u9605\u8BFB\u539F\u6587</a></p>
    ${discussion}
    ${tagLinks(item, "")}
    <p class="submeta">${esc(bits.join(" \xB7 "))}</p>
  </article>`;
  return layout({
    title: item.title,
    description: item.excerpt || `${item.source_name} \u7684\u4E00\u6761\u6536\u5F55\uFF0C\u94FE\u56DE\u539F\u6587\u3002`,
    path: `/item/${item.id}`,
    body,
    origin
  });
}
__name(renderItem, "renderItem");
function renderAbout(origin) {
  const sources = SOURCES.map(
    (source) => `<li><strong>${esc(source.name)}</strong> \xB7 <a href="${safeHref(source.hint)}">${esc(source.hint)}</a></li>`
  ).join("");
  const body = `<article class="about">
    <h1>\u5173\u4E8E\u6E38\u7267\u624B\u8BB0</h1>
    <p>\u8FD9\u662F\u7ED9\u4E2D\u6587\u8BFB\u8005\u7684\u4E00\u4EFD\u6570\u5B57\u6E38\u6C11\u65E5\u66F4\u3002\u5B83\u4E0D\u751F\u4EA7\u539F\u521B\u957F\u6587\uFF0C\u53EA\u6536\u5F55\u6807\u9898\u4EE5\u4E2D\u6587\u4E3A\u4E3B\u7684\u516C\u5F00\u5185\u5BB9\uFF0C\u7559\u4E0B\u6807\u9898\u3001\u77ED\u6458\u8981\u548C\u51FA\u5904\u3002</p>
    <h2>\u6BCF\u5929\u600E\u4E48\u66F4\u65B0</h2>
    <p>\u540C\u4E00\u4E2A Cloudflare Worker \u5728\u5317\u4EAC\u65F6\u95F4 08:00 \u548C 22:00 \u5404\u8DD1\u4E00\u6B21\u91C7\u96C6\u3002\u4E24\u6B21\u90FD\u5199\u8FDB\u5F53\u5929\u7684\u5206\u7EC4\uFF0C\u6BCF\u6B21\u6700\u591A\u65B0\u589E\u5927\u7EA6 16 \u6761\uFF0C\u5DF2\u7ECF\u6536\u5F55\u8FC7\u7684\u94FE\u63A5\u4F1A\u8DF3\u8FC7\u3002\u6BCF\u4E2A\u6765\u6E90\u5355\u72EC\u8BF7\u6C42\u3001\u5355\u72EC\u8D85\u65F6\uFF1B\u67D0\u4E00\u4E2A\u6253\u4E0D\u5F00\uFF0C\u4E0D\u4F1A\u8BA9\u6574\u8F6E\u505C\u6389\u3002</p>
    <h2>\u9875\u9762\u4E0A\u6709\u4EC0\u4E48</h2>
    <ul>
      <li>\u9996\u9875\u6309\u6536\u5F55\u65E5\u5206\u7EC4\uFF0C\u53EF\u4EE5\u6309\u6765\u6E90\u548C\u4E3B\u9898\u7B5B\u9009\uFF0C\u4E5F\u53EF\u4EE5\u7FFB\u9875\u3002</li>
      <li>\u6BCF\u6761\u8BB0\u5F55\u6709\u81EA\u5DF1\u7684\u9875\u9762\uFF0C\u4E0A\u9762\u6709\u6765\u6E90\u3001\u4F5C\u8005\u548C\u539F\u6587\u94FE\u63A5\u3002</li>
      <li><a href="/rss.xml">/rss.xml</a> \u662F\u8FD9\u4EFD\u65E5\u66F4\u81EA\u5DF1\u7684\u8BA2\u9605\u6E90\u3002</li>
    </ul>
    <h2>\u6211\u4EEC\u4E0D\u4FDD\u5B58\u4EC0\u4E48</h2>
    <p>\u4E0D\u6293\u6B63\u6587\uFF0C\u4E5F\u4E0D\u628A\u5168\u6587\u653E\u8FDB\u6570\u636E\u5E93\u3002\u6458\u8981\u6765\u81EA\u6765\u6E90\u81EA\u5DF1\u7684\u63CF\u8FF0\u3001\u7B80\u4ECB\u6216\u5E16\u5B50\u5F00\u5934\uFF0C\u622A\u5230 300 \u4E2A\u5B57\u7B26\u3002\u4F5C\u8005\u672A\u77E5\u65F6\u4F1A\u5199\u6210\u300C\u672A\u77E5\u300D\uFF0C\u4E0D\u4F1A\u628A\u8F6C\u5E16\u7684\u4EBA\u8BF4\u6210\u539F\u4F5C\u8005\u3002</p>
    <h2>\u73B0\u5728\u7684\u6765\u6E90</h2>
    <ul>${sources}</ul>
    <p>\u82F1\u6587\u6765\u6E90\u5DF2\u7ECF\u62FF\u6389\u3002V2EX \u7684\u5B98\u65B9\u63A5\u53E3\u4ECE Cloudflare \u7684\u5730\u5740\u8BBF\u95EE\u4F1A\u8FD4\u56DE 403\uFF0C\u6240\u4EE5\u4E5F\u4E0D\u76F4\u63A5\u6293\u3002\u6807\u9898\u91CC\u6C49\u5B57\u4E0D\u591F\u591A\u7684\u6761\u76EE\u4F1A\u88AB\u8DF3\u8FC7\u3002</p>
    <h2>\u7248\u6743</h2>
    <p>\u6807\u9898\u3001\u6458\u8981\u548C\u94FE\u63A5\u53EA\u4E3A\u4E86\u65B9\u4FBF\u4F60\u51B3\u5B9A\u8981\u4E0D\u8981\u70B9\u56DE\u53BB\u3002\u5185\u5BB9\u8457\u4F5C\u6743\u5F52\u539F\u4F5C\u8005\u6240\u6709\u3002\u82E5\u8981\u9605\u8BFB\uFF0C\u8BF7\u4F7F\u7528\u6BCF\u6761\u8BB0\u5F55\u4E0A\u7684\u539F\u6587\u94FE\u63A5\u3002</p>
  </article>`;
  return layout({
    title: "\u5173\u4E8E",
    description: "\u6E38\u7267\u624B\u8BB0\u5982\u4F55\u6BCF\u5929\u6536\u96C6\u6570\u5B57\u6E38\u6C11\u4E0E\u8FDC\u7A0B\u5DE5\u4F5C\u7684\u516C\u5F00\u6307\u5357\uFF0C\u4EE5\u53CA\u5B83\u4E0D\u8F6C\u8F7D\u5168\u6587\u7684\u539F\u56E0\u3002",
    path: "/about",
    body,
    origin
  });
}
__name(renderAbout, "renderAbout");
function renderNotFound(origin) {
  return layout({
    title: "\u6CA1\u6709\u8FD9\u6761\u8BB0\u5F55",
    description: "\u8FD9\u4E2A\u5730\u5740\u6CA1\u6709\u5BF9\u5E94\u7684\u6536\u5F55\u3002",
    path: "/404",
    body: `<div class="empty"><h1>\u6CA1\u6709\u627E\u5230\u8FD9\u6761\u8BB0\u5F55</h1><p><a href="/">\u56DE\u5230\u4ECA\u5929\u7684\u9009\u8BFB</a></p></div>`,
    origin
  });
}
__name(renderNotFound, "renderNotFound");
function renderError(origin) {
  return layout({
    title: "\u6682\u65F6\u6253\u4E0D\u5F00",
    description: "\u9875\u9762\u6682\u65F6\u4E0D\u53EF\u7528\u3002",
    path: "/error",
    body: `<div class="empty"><h1>\u9875\u9762\u6682\u65F6\u6253\u4E0D\u5F00</h1><p>\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002</p></div>`,
    origin
  });
}
__name(renderError, "renderError");
function renderRss(items, origin) {
  const entries = items.map((item) => {
    const link = `${origin}/item/${item.id}`;
    const author = displayAuthor(item.author);
    const description = `${item.excerpt || "\u6765\u6E90\u6CA1\u6709\u63D0\u4F9B\u6458\u8981\u3002"} \u6765\u6E90\uFF1A${item.source_name}\u3002\u4F5C\u8005\uFF1A${author}\u3002\u539F\u6587\uFF1A${item.canonical_url}`;
    const when = item.published_at || item.collected_at;
    return `<item>
  <title>${xmlEsc(item.title)}</title>
  <link>${xmlEsc(link)}</link>
  <guid isPermaLink="true">${xmlEsc(link)}</guid>
  <pubDate>${xmlEsc(rfc822(when))}</pubDate>
  <dc:creator>${xmlEsc(author)}</dc:creator>
  <description>${xmlEsc(description)}</description>
  <source url="${xmlEsc(item.canonical_url)}">${xmlEsc(item.source_name)}</source>
</item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>\u6E38\u7267\u624B\u8BB0</title>
  <link>${xmlEsc(origin)}/</link>
  <atom:link href="${xmlEsc(origin)}/rss.xml" rel="self" type="application/rss+xml"/>
  <description>\u6BCF\u5929\u6574\u7406\u6570\u5B57\u6E38\u6C11\u3001\u8FDC\u7A0B\u5DE5\u4F5C\u3001\u7B7E\u8BC1\u4E0E\u65C5\u5C45\u7684\u516C\u5F00\u6307\u5357\u3002\u53EA\u6709\u6807\u9898\u3001\u77ED\u6458\u8981\u548C\u539F\u6587\u94FE\u63A5\uFF0C\u4E0D\u8F6C\u8F7D\u5168\u6587\u3002</description>
  <language>zh-CN</language>
  <lastBuildDate>${xmlEsc((/* @__PURE__ */ new Date()).toUTCString())}</lastBuildDate>
  ${entries}
</channel>
</rss>`;
}
__name(renderRss, "renderRss");

// src/index.ts
function originOf(request) {
  return new URL(request.url).origin;
}
__name(originOf, "originOf");
function html(body, status = 200, cache = "public, max-age=120") {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-language": "zh-CN",
      "cache-control": cache,
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin"
    }
  });
}
__name(html, "html");
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}
__name(json, "json");
function bearerOk(header, token) {
  if (!token) return false;
  const expected = new TextEncoder().encode(`Bearer ${token}`);
  const actual = new TextEncoder().encode(header ?? "");
  const length = Math.max(expected.length, actual.length);
  let diff = expected.length === actual.length ? 0 : 1;
  for (let index = 0; index < length; index++) {
    diff |= (expected[index] ?? 0) ^ (actual[index] ?? 0);
  }
  return diff === 0;
}
__name(bearerOk, "bearerOk");
function redirect(location) {
  return new Response(null, {
    status: 302,
    headers: { location, "cache-control": "no-store" }
  });
}
__name(redirect, "redirect");
async function handle(request, env) {
  const url = new URL(request.url);
  const origin = originOf(request);
  try {
    if (url.pathname === "/admin/collect" || url.pathname === "/admin/purge-non-chinese") {
      if (request.method !== "POST") {
        return json({ error: "method not allowed" }, 405);
      }
      if (!bearerOk(request.headers.get("Authorization"), env.ADMIN_TOKEN)) {
        return json({ error: "unauthorized" }, 401);
      }
      if (url.pathname === "/admin/purge-non-chinese") {
        const result = await purgeNonChinese(env.DB);
        return json({ ok: true, ...result });
      }
      const report = await runCollect(env, "manual");
      return json(report, 200);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return json({ error: "method not allowed" }, 405);
    }
    if (url.pathname === "/health") {
      return json({ ok: true, name: "nomad-blog" });
    }
    if (url.pathname === "/about") return html(renderAbout(origin), 200, "public, max-age=3600");
    if (url.pathname === "/rss.xml") {
      const items = await recentItems(env.DB, 40);
      return new Response(renderRss(items, origin), {
        headers: {
          "content-type": "application/rss+xml; charset=utf-8",
          "cache-control": "public, max-age=600",
          "x-content-type-options": "nosniff"
        }
      });
    }
    const itemMatch = url.pathname.match(/^\/item\/(\d+)$/);
    if (itemMatch) {
      const id = Number(itemMatch[1]);
      const item = await getItem(env.DB, id);
      if (!item) return html(renderNotFound(origin), 404, "no-store");
      return html(renderItem(item, origin), 200, "public, max-age=600");
    }
    if (url.pathname === "/") {
      const source = knownSource(url.searchParams.get("source") ?? "")?.id ?? "";
      const tag = knownTag(url.searchParams.get("tag") ?? "")?.id ?? "";
      const requested = parsePage(url.searchParams.get("page"));
      const total = await countItems(env.DB, source, tag);
      const page = normalizePage(requested, total, PAGE_SIZE);
      if (url.searchParams.has("page") && page !== requested) {
        const params = new URLSearchParams();
        if (source) params.set("source", source);
        if (tag) params.set("tag", tag);
        if (page > 1) params.set("page", String(page));
        const query = params.toString();
        return redirect(query ? `/?${query}` : "/");
      }
      const items = await listItems(env.DB, source, tag, page);
      return html(
        renderHome(
          { items, total, page, source, tag, generatedAt: (/* @__PURE__ */ new Date()).toISOString() },
          origin
        )
      );
    }
    return html(renderNotFound(origin), 404, "no-store");
  } catch (error) {
    console.error("request failed", error instanceof Error ? error.message : error);
    return html(renderError(origin), 500, "no-store");
  }
}
__name(handle, "handle");
var index_default = {
  async fetch(request, env) {
    return handle(request, env);
  },
  async scheduled(controller, env, ctx) {
    void controller.cron;
    ctx.waitUntil(
      runCollect(env, "cron").catch((error) => {
        console.error("cron collect failed", error instanceof Error ? error.message : error);
      })
    );
  }
};
export {
  bearerOk,
  index_default as default,
  handle
};
