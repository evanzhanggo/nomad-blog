var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// data/classics.json
var classics_default = [
  {
    url: "https://invest-nav.com/tutorials/hk-banks/text/mainland-hongkong-bank-sim-brokers-gmail/",
    title: "\u5927\u9646\u7528\u6237\u9999\u6E2F\u5FC5\u505A\u7684 4 \u4EF6\u4E8B 2026\uFF1A\u6E2F\u5361\u3001\u9999\u6E2F\u624B\u673A\u53F7\u3001\u7F8E\u80A1\u5238\u5546\u3001Gmail",
    sourceId: "invest-nav",
    sourceName: "\u6295\u8D44\u5BFC\u822A",
    author: "Nico",
    topic: "bank"
  },
  {
    url: "https://larksim.com/guide",
    title: "giffgaff \u4E2D\u6587\u6559\u7A0B\u4E0E\u6D77\u5916\u7535\u8BDD\u5361\u6307\u5357\uFF1A\u6FC0\u6D3B\u3001\u5145\u503C\u3001\u6F2B\u6E38\u3001\u4FDD\u53F7",
    sourceId: "larksim",
    sourceName: "LarkSim",
    author: null,
    topic: "sim"
  },
  {
    url: "https://kannetflix.com/esim/",
    title: "eSIM \u4E0E\u6D77\u5916\u624B\u673A\u53F7\u6307\u5357 2026\uFF1A\u7F8E\u533A\u7D2B\u5361/\u82F1\u56FD giffgaff \u7533\u8BF7\u4E0E\u4FDD\u53F7",
    sourceId: "kannetflix",
    sourceName: "\u770B\u5948\u98DE",
    author: "Leo",
    topic: "sim"
  },
  {
    url: "https://kannetflix.com/esim/giffgaff/",
    title: "giffgaff \u82F1\u56FD\u624B\u673A\u5361/eSIM \u5B9E\u6D4B 2026\uFF1A\u514D\u5B9E\u540D 0 \u6708\u79DF",
    sourceId: "kannetflix",
    sourceName: "\u770B\u5948\u98DE",
    author: null,
    topic: "sim"
  },
  {
    url: "https://kannetflix.com/esim/ultra-mobile/",
    title: "\u7F8E\u56FD\u624B\u673A\u53F7\u63A8\u8350 2026\uFF1AUltra Mobile PayGo \u7D2B\u5361",
    sourceId: "kannetflix",
    sourceName: "\u770B\u5948\u98DE",
    author: null,
    topic: "sim"
  },
  {
    url: "https://kannetflix.com/pay/itin/",
    title: "ITIN \u7F8E\u56FD\u7A0E\u53F7\u7533\u8BF7\u6559\u7A0B\uFF1A4 \u79CD\u65B9\u5F0F\u6A2A\u8BC4",
    sourceId: "kannetflix",
    sourceName: "\u770B\u5948\u98DE",
    author: null,
    topic: "tax"
  },
  {
    url: "https://kannetflix.com/pay/apple-id-us/",
    title: "\u7F8E\u533A Apple ID \u6CE8\u518C\u3001\u5145\u503C\u4E0E\u9632\u5C01\u6307\u5357",
    sourceId: "kannetflix",
    sourceName: "\u770B\u5948\u98DE",
    author: null,
    topic: "ai"
  },
  {
    url: "https://kannetflix.com/pay/chatgpt-payment/",
    title: "ChatGPT Plus \u56FD\u5185\u4ED8\u6B3E\u6307\u5357 2026",
    sourceId: "kannetflix",
    sourceName: "\u770B\u5948\u98DE",
    author: null,
    topic: "ai"
  },
  {
    url: "https://kannetflix.com/pay/wise/",
    title: "Wise \u4E2D\u56FD\u5927\u9646\u7528\u6237\u6CE8\u518C\u4E0E\u4F7F\u7528\u6559\u7A0B",
    sourceId: "kannetflix",
    sourceName: "\u770B\u5948\u98DE",
    author: null,
    topic: "bank"
  }
];

// src/text.ts
var USER_AGENT = "NomadBlogBot/1.0 (+https://nomad.evanzhang.cloud; attribution)";
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

// src/content.ts
var CONTENT_MAX_BYTES = 2e5;
var ALLOWED = /* @__PURE__ */ new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "a",
  "img",
  "strong",
  "em",
  "br",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td"
]);
var DROP = /* @__PURE__ */ new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "noscript",
  "svg",
  "math",
  "form",
  "textarea",
  "template",
  "noframes",
  "frameset",
  "frame"
]);
var VOID = /* @__PURE__ */ new Set(["br", "img"]);
var RENAME = { b: "strong", i: "em" };
function visibleText(html2) {
  return stripTags(html2).replace(/\s+/g, " ").trim();
}
__name(visibleText, "visibleText");
function isFullArticle(html2) {
  const text = visibleText(html2);
  if (text.length >= 800) return true;
  const blocks = html2.match(/<(p|h2|h3|li|blockquote|pre|br)\b/gi)?.length ?? 0;
  return text.length >= 180 && blocks >= 2;
}
__name(isFullArticle, "isFullArticle");
function hostOf(pageUrl) {
  try {
    return new URL(pageUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}
__name(hostOf, "hostOf");
function attrValue(attrs, name) {
  const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i"));
  return (match?.[2] ?? match?.[3] ?? match?.[4] ?? "").trim();
}
__name(attrValue, "attrValue");
function classHas(attrs, token) {
  return attrValue(attrs, "class").split(/\s+/).includes(token);
}
__name(classHas, "classHas");
function innerFrom(html2, start) {
  const open = html2.slice(start).match(/^<([a-zA-Z0-9]+)\b[^>]*>/);
  if (!open) return null;
  const name = open[1].toLowerCase();
  if (VOID.has(name)) return "";
  const from = start + open[0].length;
  const re = new RegExp(`<(/?)${name}\\b[^>]*>`, "gi");
  re.lastIndex = from;
  let depth = 1;
  let match;
  while (match = re.exec(html2)) {
    const closing = Boolean(match[1]);
    const selfClosing = !closing && /\/>\s*$/.test(match[0]);
    if (closing) depth -= 1;
    else if (!selfClosing) depth += 1;
    if (depth === 0) return html2.slice(from, match.index);
  }
  return html2.slice(from, from + 25e4);
}
__name(innerFrom, "innerFrom");
function findTag(html2, predicate) {
  const re = /<([a-zA-Z0-9]+)\b([^>]*)>/g;
  let match;
  while (match = re.exec(html2)) {
    if (!predicate(match[1].toLowerCase(), match[2] ?? "")) continue;
    return innerFrom(html2, match.index);
  }
  return null;
}
__name(findTag, "findTag");
function bestRegion(html2) {
  const article = findTag(html2, (name) => name === "article");
  if (article && visibleText(article).length >= 180) return article;
  const main = findTag(html2, (name) => name === "main");
  if (main && visibleText(main).length >= 180) return main;
  const re = /<(div|section|article|main)\b([^>]*)>/gi;
  let match;
  let best = null;
  let bestLength = 0;
  let seen = 0;
  while ((match = re.exec(html2)) && seen < 40) {
    const attrs = match[2] ?? "";
    const name = match[1].toLowerCase();
    const interesting = name === "article" || name === "main" || /content|article|post|entry|rich|markdown|body/i.test(attrs);
    if (!interesting) continue;
    seen += 1;
    const inner2 = innerFrom(html2, match.index);
    if (!inner2) continue;
    const length = visibleText(inner2).length;
    if (length > bestLength) {
      best = inner2;
      bestLength = length;
    }
  }
  return best;
}
__name(bestRegion, "bestRegion");
function pickRegion(html2, pageUrl) {
  const host = hostOf(pageUrl);
  if (host === "mp.weixin.qq.com") {
    return findTag(html2, (_name, attrs) => attrValue(attrs, "id") === "js_content") ?? html2;
  }
  if (host === "sspai.com" || host.endsWith(".sspai.com")) {
    return findTag(html2, (_name, attrs) => attrValue(attrs, "id") === "article-content") ?? findTag(html2, (_name, attrs) => classHas(attrs, "article-body")) ?? findTag(html2, (name, attrs) => name === "article" || classHas(attrs, "content")) ?? html2;
  }
  if (host === "zhuanlan.zhihu.com") {
    return findTag(html2, (_name, attrs) => classHas(attrs, "Post-RichText")) ?? findTag(html2, (_name, attrs) => classHas(attrs, "RichText")) ?? html2;
  }
  return bestRegion(html2) ?? html2;
}
__name(pickRegion, "pickRegion");
function absoluteUrl(value, base) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  try {
    const url = new URL(trimmed, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
__name(absoluteUrl, "absoluteUrl");
function escapeText(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
__name(escapeText, "escapeText");
function escapeAttr(value) {
  return escapeText(value).replace(/"/g, "&quot;");
}
__name(escapeAttr, "escapeAttr");
function parseTag(raw) {
  const match = raw.match(/^<(\/?)([a-zA-Z0-9]+)\b([^>]*)>$/);
  if (!match) return null;
  const name = RENAME[match[2].toLowerCase()] ?? match[2].toLowerCase();
  const attrs = match[3] ?? "";
  const selfClosing = Boolean(match[1]) ? false : /\/>\s*$/.test(raw) || VOID.has(name);
  return { kind: match[1] ? "end" : "start", name, attrs, selfClosing };
}
__name(parseTag, "parseTag");
function allowedAttrs(name, attrs, base) {
  if (name === "a") {
    const href = absoluteUrl(attrValue(attrs, "href"), base);
    if (!href) return null;
    return ` href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer"`;
  }
  if (name === "img") {
    const src = absoluteUrl(attrValue(attrs, "src") || attrValue(attrs, "data-src"), base);
    if (!src) return null;
    const alt = attrValue(attrs, "alt");
    return ` src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" referrerpolicy="no-referrer"`;
  }
  if (name === "th" || name === "td") {
    const parts = [];
    for (const key of ["colspan", "rowspan"]) {
      const value = attrValue(attrs, key);
      if (/^[1-9]\d?$/.test(value)) parts.push(` ${key}="${value}"`);
    }
    return parts.join("");
  }
  return "";
}
__name(allowedAttrs, "allowedAttrs");
function sanitizeHtml(input, baseUrl) {
  const source = decodeXml(input).replace(/<head\b[\s\S]*?<\/head>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  const parts = [];
  const stack = [];
  let bytes = 0;
  let dropDepth = 0;
  let dropTag = "";
  let inPre = 0;
  let stopped = false;
  const push = /* @__PURE__ */ __name((chunk) => {
    const size = new TextEncoder().encode(chunk).length;
    if (bytes + size > CONTENT_MAX_BYTES) return false;
    bytes += size;
    parts.push(chunk);
    return true;
  }, "push");
  const closeTag = /* @__PURE__ */ __name((open) => {
    if (open === "pre") inPre = Math.max(0, inPre - 1);
    parts.push(`</${open}>`);
  }, "closeTag");
  const closeThrough = /* @__PURE__ */ __name((name) => {
    if (name == null) {
      while (stack.length) {
        const open = stack.pop();
        if (open) closeTag(open);
      }
      return;
    }
    const index = stack.lastIndexOf(name);
    if (index < 0) return;
    while (stack.length > index) {
      const open = stack.pop();
      if (open) closeTag(open);
    }
  }, "closeThrough");
  const re = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g;
  let match;
  while (!stopped && (match = re.exec(source))) {
    const token = match[0];
    if (token.startsWith("<")) {
      const tag = parseTag(token.replace(/\s+$/g, ""));
      if (!tag) continue;
      if (dropDepth > 0) {
        if (tag.kind === "start" && tag.name === dropTag && !tag.selfClosing) dropDepth += 1;
        else if (tag.kind === "end" && tag.name === dropTag) dropDepth -= 1;
        continue;
      }
      if (tag.kind === "start" && DROP.has(tag.name)) {
        if (!tag.selfClosing) {
          dropDepth = 1;
          dropTag = tag.name;
        }
        continue;
      }
      if (!ALLOWED.has(tag.name)) continue;
      if (tag.kind === "end") {
        closeThrough(tag.name);
        continue;
      }
      const rendered = allowedAttrs(tag.name, tag.attrs, baseUrl);
      if (rendered == null) continue;
      if (!push(`<${tag.name}${rendered}>`)) {
        stopped = true;
        break;
      }
      if (!tag.selfClosing && !VOID.has(tag.name)) {
        stack.push(tag.name);
        if (tag.name === "pre") inPre += 1;
      }
      continue;
    }
    if (dropDepth > 0) continue;
    const text = inPre > 0 ? token : token.replace(/\s+/g, " ");
    if (!text || text === " ") {
      if (text === " " && parts.length) push(" ");
      continue;
    }
    if (!push(escapeText(text))) stopped = true;
  }
  closeThrough(null);
  return parts.join("").replace(/(?:<p>\s*<\/p>)+/g, "").trim();
}
__name(sanitizeHtml, "sanitizeHtml");
function articleHtmlFromSource(raw, pageUrl) {
  if (!raw.trim()) return null;
  const documentLike = /<html[\s>]|<body[\s>]/i.test(raw);
  const special = /mp\.weixin\.qq\.com|sspai\.com|zhuanlan\.zhihu\.com/i.test(pageUrl);
  const region = documentLike || special ? pickRegion(raw, pageUrl) : raw;
  const clean = sanitizeHtml(region, pageUrl);
  return isFullArticle(clean) ? clean : null;
}
__name(articleHtmlFromSource, "articleHtmlFromSource");

// src/score.ts
var MIN_QUALITY_SCORE = 40;
var TOPICS = [
  {
    id: "bank",
    label: "\u6D77\u5916\u5F00\u5361",
    patterns: [
      { re: /港卡|香港银行|香港银行卡|汇丰|中银香港|众安银行|蚂蚁银行|天星银行|虚拟银行|银行卡开户/i, weight: 28, primary: true },
      { re: /开户|U\s*卡|虚拟卡|\bWise\b|万里汇|收款账户/i, weight: 14 }
    ]
  },
  {
    id: "sim",
    label: "\u6D77\u5916\u624B\u673A\u5361",
    patterns: [
      { re: /紫卡|giffgaff|保号|eSIM|香港手机号|电话卡|手机卡|Club\s*SIM|英国号|香港号/i, weight: 28, primary: true },
      { re: /验证码|漫游|实名/i, weight: 8 }
    ]
  },
  {
    id: "tax",
    label: "\u6D77\u5916\u7A0E\u53F7",
    patterns: [
      { re: /\bITIN\b|税号|税务居民|\bTIN\b|报税|W-7/i, weight: 28, primary: true },
      { re: /税务|增值税|电子居民/i, weight: 12 }
    ]
  },
  {
    id: "ai",
    label: "\u6D77\u5916 AI \u8BA2\u9605",
    patterns: [
      { re: /ChatGPT|Claude|OpenAI|Apple\s*ID|美区|外区|Gemini/i, weight: 26, primary: true },
      { re: /订阅|Plus|礼品卡|虚拟卡/i, weight: 10 }
    ]
  },
  {
    id: "visa",
    label: "\u6570\u5B57\u6E38\u6C11\u7B7E\u8BC1",
    patterns: [
      { re: /数字游民签证|數位遊牧簽證|游民签证|DNV|居留许可/i, weight: 30, primary: true },
      { re: /签证|簽證|居留|永居|移民|电子居民/i, weight: 16 }
    ]
  },
  {
    id: "remote",
    label: "\u8FDC\u7A0B\u5DE5\u4F5C",
    patterns: [
      { re: /远程工作|遠端工作|远程办公|数字游民|數位遊牧/i, weight: 24, primary: true },
      { re: /自由职业|一人公司|异步办公/i, weight: 12 }
    ]
  },
  {
    id: "broker",
    label: "\u6D77\u5916\u5238\u5546",
    patterns: [
      { re: /券商|盈透|\bIBKR\b|富途|老虎证券|美股开户|港股通|出入金/i, weight: 28, primary: true },
      { re: /美股|港股|经纪账户/i, weight: 12 }
    ]
  }
];
var TOPIC_BY_ID = new Map(TOPICS.map((topic) => [topic.id, topic]));
function topicById(id) {
  return TOPIC_BY_ID.get(id);
}
__name(topicById, "topicById");
var GUIDE = /指南|教程|攻略|手把手|实测|流程|步骤|如何|开户|保号|申请/;
var CHATTER = /呢[？?]?$|大家怎么|请问|求助|吐槽|闲聊|空虚|摸鱼|各位都在/;
var REJECT = /招聘|内推|招一位|招人|岗位更新|接单|外包|美工|诚邀|派单|月薪|底薪|急招|在招|兼职/;
function scoreQuality(title, excerpt, popularity2 = 0) {
  const haystack = `${title}
${excerpt}`;
  if (REJECT.test(haystack)) {
    return { topic: "", score: 0, rejected: true, reason: "\u62DB\u8058\u3001\u6D3E\u5355\u6216\u5E7F\u544A" };
  }
  let bestId = "";
  let best = 0;
  let primaryInTitle = false;
  for (const topic of TOPICS) {
    let points = 0;
    let primary = false;
    for (const pattern of topic.patterns) {
      if (!pattern.re.test(haystack)) continue;
      points += pattern.weight;
      if (pattern.primary && pattern.re.test(title)) primary = true;
    }
    if (points > best) {
      best = points;
      bestId = topic.id;
      primaryInTitle = primary;
    }
  }
  if (!bestId || best < 12) {
    return { topic: "", score: best, rejected: false, reason: "\u6CA1\u6709\u5BF9\u4E0A\u6838\u5FC3\u4E3B\u9898" };
  }
  const length = Array.from(excerpt).length;
  const lengthScore = length >= 180 ? 18 : length >= 100 ? 12 : length >= 40 ? 6 : 0;
  const guideScore = GUIDE.test(haystack) ? 16 : 0;
  const titleScore = primaryInTitle ? 14 : 0;
  const engagement = popularity2 >= 20 ? 10 : popularity2 >= 5 ? 6 : popularity2 >= 1 ? 3 : 0;
  const chatterPenalty = CHATTER.test(title) && !/指南|教程|攻略|实测/.test(title) ? 24 : 0;
  const score = best + lengthScore + guideScore + titleScore + engagement - chatterPenalty;
  return {
    topic: bestId,
    score,
    rejected: false,
    reason: `\u4E3B\u9898${best}+\u7BC7\u5E45${lengthScore}+\u6307\u5357${guideScore}+\u6807\u9898${titleScore}+\u70ED\u5EA6${engagement}-\u95F2\u804A${chatterPenalty}`
  };
}
__name(scoreQuality, "scoreQuality");
function passesQuality(title, excerpt, popularity2 = 0) {
  const quality = scoreQuality(title, excerpt, popularity2);
  return !quality.rejected && quality.score >= MIN_QUALITY_SCORE && quality.topic !== "";
}
__name(passesQuality, "passesQuality");

// src/search.ts
var SEARCH_PAGE_SIZE = 50;
var QUERY_MAX = 80;
var TEXT_MAX = 2e4;
function normalizeSearchQuery(raw) {
  return (raw ?? "").replace(/\s+/g, " ").trim().slice(0, QUERY_MAX);
}
__name(normalizeSearchQuery, "normalizeSearchQuery");
function likePattern(query) {
  const escaped = query.replace(/[\\%_]/g, (char) => `\\${char}`);
  return `%${escaped}%`;
}
__name(likePattern, "likePattern");
function topicIdsFor(query) {
  const needle = query.toLowerCase();
  return TOPICS.filter(
    (topic) => topic.id.toLowerCase().includes(needle) || topic.label.toLowerCase().includes(needle)
  ).map((topic) => topic.id);
}
__name(topicIdsFor, "topicIdsFor");
function plainContent(html2) {
  if (!html2) return null;
  const text = visibleText(html2);
  if (!text) return "";
  return Array.from(text).slice(0, TEXT_MAX).join("");
}
__name(plainContent, "plainContent");
function highlight(text, query) {
  const needle = query.trim();
  if (!needle) return esc(text);
  const haystack = text.toLowerCase();
  const target = needle.toLowerCase();
  let html2 = "";
  let cursor = 0;
  while (cursor < text.length) {
    const index = haystack.indexOf(target, cursor);
    if (index < 0) {
      html2 += esc(text.slice(cursor));
      break;
    }
    html2 += esc(text.slice(cursor, index));
    html2 += `<mark>${esc(text.slice(index, index + needle.length))}</mark>`;
    cursor = index + needle.length;
    if (cursor <= index) break;
  }
  return html2;
}
__name(highlight, "highlight");
function cardSnippet(item, query) {
  const summary = item.ai_summary || item.excerpt || "";
  const needle = query.trim().toLowerCase();
  if (!needle) return summary;
  if (summary.toLowerCase().includes(needle) || item.title.toLowerCase().includes(needle)) return summary;
  const snippet = item.content_snippet ?? "";
  if (snippet.toLowerCase().includes(needle)) return snippet;
  return summary;
}
__name(cardSnippet, "cardSnippet");

// src/summary.ts
var SUMMARY_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
var INPUT_CHARS = 6e3;
function summaryInput(title, contentHtml, excerpt) {
  const body = contentHtml ? visibleText(contentHtml) : excerpt;
  const clipped = Array.from(body).slice(0, INPUT_CHARS).join("");
  return `\u6807\u9898\uFF1A${title}

\u6B63\u6587\uFF1A${clipped}`;
}
__name(summaryInput, "summaryInput");
function stripThink(raw) {
  return raw.replace(/<think>[\s\S]*?<\/think>/gi, " ").replace(/^[\s\S]*?<\/think>/i, " ").replace(/<think>[\s\S]*$/gi, "");
}
__name(stripThink, "stripThink");
function readModelText(result) {
  let text = "";
  if (typeof result === "string") text = result;
  else if (result && typeof result === "object") {
    const record = result;
    if (typeof record.response === "string") text = record.response;
    else if (Array.isArray(record.choices) && record.choices.length) {
      const message = record.choices[0].message;
      if (typeof message?.content === "string") text = message.content;
    }
  }
  return stripThink(text);
}
__name(readModelText, "readModelText");
function cleanSummary(raw) {
  let text = plainTitle(stripThink(raw));
  text = text.replace(/^(摘要|总结|AI摘要|简体中文摘要|以下是(?:摘要|总结)?)[:：]\s*/i, "");
  text = text.replace(/^["“「]|["”」]$/g, "").trim();
  text = text.replace(/\s+/g, " ").trim();
  if (text.length < 20 || text.startsWith("\u6807\u9898\uFF1A")) return null;
  const chars = Array.from(text);
  if (chars.length > 160) {
    const cut = chars.slice(0, 150).join("");
    const end = Math.max(cut.lastIndexOf("\u3002"), cut.lastIndexOf("\uFF01"), cut.lastIndexOf("\uFF1F"));
    text = (end >= 40 ? cut.slice(0, end + 1) : `${cut.trimEnd()}\u2026`).trim();
  }
  return text || null;
}
__name(cleanSummary, "cleanSummary");
async function summarizeArticle(ai, title, contentHtml, excerpt) {
  if (!ai) return { text: null, error: null };
  const source = summaryInput(title, contentHtml, excerpt);
  if (Array.from(source).length < 40) return { text: null, error: null };
  try {
    const result = await ai.run(SUMMARY_MODEL, {
      messages: [
        {
          role: "system",
          content: "\u4F60\u662F\u4E2D\u6587\u7F16\u8F91\u3002\u539F\u6587\u5373\u4F7F\u662F\u7E41\u4F53\u4E2D\u6587\uFF0C\u4E5F\u5FC5\u987B\u6539\u5199\u6210\u7B80\u4F53\u4E2D\u6587\u3002\u53EA\u8F93\u51FA\u4E24\u5230\u4E09\u53E5\u7B80\u4F53\u4E2D\u6587\u6458\u8981\uFF0C\u5927\u7EA680\u5230150\u4E2A\u5B57\u3002\u4E0D\u8981\u6807\u9898\u3001\u524D\u8A00\u3001\u7F16\u53F7\u3001\u5F15\u53F7\u3001\u82F1\u6587\u8BF4\u660E\u6216\u7E41\u4F53\u5B57\u3002"
        },
        { role: "user", content: source }
      ],
      max_tokens: 1024,
      temperature: 0.2
    });
    return { text: cleanSummary(readModelText(result)), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("summary failed", message);
    return { text: null, error: message };
  }
}
__name(summarizeArticle, "summarizeArticle");

// src/fulltext.ts
var CONTENT_FETCH_LIMIT = 4;
var SUMMARY_LIMIT = 4;
var ADMIN_BATCH_DEFAULT = 4;
var ADMIN_BATCH_MAX = 8;
var RETRY_MS = 12 * 60 * 60 * 1e3;
function parseBatchLimit(raw) {
  if (raw == null || raw === "" || !/^\d+$/.test(raw)) return ADMIN_BATCH_DEFAULT;
  const value = Number(raw);
  if (value < 1) return ADMIN_BATCH_DEFAULT;
  return Math.min(value, ADMIN_BATCH_MAX);
}
__name(parseBatchLimit, "parseBatchLimit");
async function fetchPage(url, timeoutMs = 8e3) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (type && !/html|xml|text\/plain/i.test(type)) return null;
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > 2e6) return null;
    return new TextDecoder("utf-8").decode(buffer);
  } catch {
    return null;
  }
}
__name(fetchPage, "fetchPage");
async function writeContent(db, url, html2, at) {
  await db.prepare(
    `UPDATE items
       SET content_html = ?, content_fetched_at = ?, content_text = ?
       WHERE canonical_url = ? AND content_html IS NULL`
  ).bind(html2, at, plainContent(html2), url).run();
}
__name(writeContent, "writeContent");
function parseReindexLimit(raw) {
  if (raw == null || raw === "" || !/^\d+$/.test(raw)) return 200;
  const value = Number(raw);
  if (value < 1) return 200;
  return Math.min(value, 1e3);
}
__name(parseReindexLimit, "parseReindexLimit");
async function reindexContentText(db, limit) {
  const rows = await db.prepare(
    `SELECT id, content_html FROM items
       WHERE content_html IS NOT NULL AND content_text IS NULL
       ORDER BY id
       LIMIT ?`
  ).bind(limit).all();
  let updated = 0;
  for (const row of rows.results ?? []) {
    const result = await db.prepare(`UPDATE items SET content_text = ? WHERE id = ? AND content_text IS NULL`).bind(plainContent(row.content_html) ?? "", row.id).run();
    updated += result.meta?.changes ?? 0;
  }
  const left = await db.prepare(
    `SELECT COUNT(*) AS n FROM items WHERE content_html IS NOT NULL AND content_text IS NULL`
  ).first();
  return { limit, updated, remaining: Number(left?.n ?? 0) };
}
__name(reindexContentText, "reindexContentText");
async function writeSummary(db, id, summary, at) {
  await db.prepare(
    `UPDATE items
       SET ai_summary = ?, ai_summary_at = ?
       WHERE id = ? AND ai_summary IS NULL`
  ).bind(summary, at, id).run();
}
__name(writeSummary, "writeSummary");
async function summarizeRow(env, row, at) {
  if (!env.AI) return { ok: false, error: null };
  const { text, error } = await summarizeArticle(env.AI, row.title, row.content_html, row.excerpt ?? "");
  await writeSummary(env.DB, row.id, text, at);
  return { ok: text != null, error };
}
__name(summarizeRow, "summarizeRow");
async function storeAndFetchContent(env, items, fetchLimit, summaryLimit) {
  let fromFeed = 0;
  let fetched = 0;
  let failed = 0;
  let summarized = 0;
  let fetches = 0;
  let summaries = 0;
  const at = (/* @__PURE__ */ new Date()).toISOString();
  for (const item of items) {
    try {
      let html2 = item.feedHtml ? articleHtmlFromSource(item.feedHtml, item.canonicalUrl) : null;
      let attempted = Boolean(html2);
      if (html2) fromFeed += 1;
      if (!html2 && fetches < fetchLimit) {
        fetches += 1;
        attempted = true;
        const page = await fetchPage(item.canonicalUrl);
        html2 = page ? articleHtmlFromSource(page, item.canonicalUrl) : null;
        if (html2) fetched += 1;
        else failed += 1;
      }
      if (!attempted) continue;
      await writeContent(env.DB, item.canonicalUrl, html2, at);
      if (!html2 || summaries >= summaryLimit || !env.AI) continue;
      const row = await env.DB.prepare(
        `SELECT id, title, excerpt, content_html FROM items WHERE canonical_url = ?`
      ).bind(item.canonicalUrl).first();
      if (!row) continue;
      summaries += 1;
      if ((await summarizeRow(env, row, at)).ok) summarized += 1;
    } catch (error) {
      console.error("content attach failed", error instanceof Error ? error.message : error);
      failed += 1;
    }
  }
  return { fromFeed, fetched, failed, summarized };
}
__name(storeAndFetchContent, "storeAndFetchContent");
async function fillMissingContent(env, limit) {
  const cutoff = new Date(Date.now() - RETRY_MS).toISOString();
  const rows = await env.DB.prepare(
    `SELECT id, canonical_url, title, excerpt FROM items
     WHERE content_html IS NULL
       AND (content_fetched_at IS NULL OR content_fetched_at < ?)
     ORDER BY content_fetched_at IS NOT NULL, id
     LIMIT ?`
  ).bind(cutoff, limit).all();
  const pending = rows.results ?? [];
  let filled = 0;
  let failed = 0;
  let summarized = 0;
  const at = (/* @__PURE__ */ new Date()).toISOString();
  for (const row of pending) {
    try {
      const page = await fetchPage(row.canonical_url);
      const html2 = page ? articleHtmlFromSource(page, row.canonical_url) : null;
      await writeContent(env.DB, row.canonical_url, html2, at);
      if (!html2) {
        failed += 1;
        continue;
      }
      filled += 1;
      if (!env.AI) continue;
      if ((await summarizeRow(env, { ...row, content_html: html2 }, at)).ok) summarized += 1;
    } catch (error) {
      console.error("fetch-content failed", error instanceof Error ? error.message : error);
      failed += 1;
    }
  }
  return { limit, scanned: pending.length, filled, failed, summarized };
}
__name(fillMissingContent, "fillMissingContent");
async function fillMissingSummaries(env, limit) {
  const cutoff = new Date(Date.now() - RETRY_MS).toISOString();
  const rows = await env.DB.prepare(
    `SELECT id, title, excerpt, content_html FROM items
     WHERE ai_summary IS NULL
       AND (ai_summary_at IS NULL OR ai_summary_at < ?)
       AND (content_html IS NOT NULL OR excerpt != '')
     ORDER BY content_html IS NULL, ai_summary_at IS NOT NULL, id
     LIMIT ?`
  ).bind(cutoff, limit).all();
  const pending = rows.results ?? [];
  let summarized = 0;
  let failed = 0;
  let lastError = null;
  const at = (/* @__PURE__ */ new Date()).toISOString();
  for (const row of pending) {
    try {
      const outcome = await summarizeRow(env, row, at);
      if (outcome.error) lastError = outcome.error;
      if (outcome.ok) summarized += 1;
      else failed += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("summarize failed", message);
      lastError = message;
      failed += 1;
    }
  }
  return { limit, scanned: pending.length, summarized, failed, lastError };
}
__name(fillMissingSummaries, "fillMissingSummaries");

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
  const encoded = inner(block, ["content:encoded"]) || inner(block, ["content"]);
  const rawExcerpt = inner(block, ["description", "summary"]) || encoded;
  return {
    url,
    title: title.slice(0, 300),
    excerpt: excerptOf(rawExcerpt, title),
    author,
    publishedAt,
    contentHtml: encoded || null
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

// src/item.ts
var BLOCKED = /remote code execution|\brce\b|\bcve-\d|vulnerability|exploit|buffer overflow|privilege escalation/i;
function isPredominantlyChinese(title) {
  const cjk = title.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const latin = title.match(/[A-Za-z]/g)?.length ?? 0;
  if (cjk < 8) return false;
  return cjk / (cjk + latin) >= 0.35;
}
__name(isPredominantlyChinese, "isPredominantlyChinese");
function buildDraft(input) {
  const title = clip(plainTitle(input.title), 200);
  const canonical = canonicalUrl(input.url);
  if (!title || !canonical) return null;
  if (!isPredominantlyChinese(title)) return null;
  if (BLOCKED.test(title)) return null;
  const excerpt = excerptOf(input.excerpt ?? "", title);
  const popularity2 = Math.max(0, Math.round(input.popularity ?? 0));
  const quality = scoreQuality(title, excerpt, popularity2);
  if (quality.rejected || quality.score < MIN_QUALITY_SCORE || !quality.topic) return null;
  const publishedAt = toIso(input.publishedAt);
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
    rankScore: quality.score,
    tags: tagString(title, excerpt),
    language: "zh",
    topic: quality.topic,
    qualityScore: quality.score,
    feedHtml: input.contentHtml?.trim() ? input.contentHtml : null
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

// src/sources.ts
var FEEDS = [
  { id: "kannetflix", name: "\u770B\u5948\u98DE", url: "https://kannetflix.com/index.xml", dailyLimit: 8 },
  { id: "ttshuoka", name: "TT\u8BF4\u5361", url: "https://www.ttshuoka.com/blog/rss.xml", dailyLimit: 6 },
  { id: "jarodise", name: "\u6570\u5B57\u6E38\u6C11\u90E8\u843D", url: "https://jarodise.com/rss.xml", dailyLimit: 6 },
  {
    id: "turtlegirl",
    name: "\u4E4C\u9F9F\u59B9\u51FA\u8D70\u65C5\u884C",
    url: "https://turtlegirltravel.com/category/digital-nomad/feed/",
    dailyLimit: 4
  },
  { id: "looktheworld", name: "Look the World", url: "https://www.looktheworld.com/changes.xml", dailyLimit: 4, tag: "visa" },
  { id: "rososa", name: "\u7231\u6C99\u5C3C\u4E9A\u7535\u5B50\u5C45\u6C11\u793E\u533A", url: "https://rososa.com/feed/", dailyLimit: 4 },
  { id: "sspai", name: "\u5C11\u6570\u6D3E", url: "https://sspai.com/feed", dailyLimit: 3 },
  { id: "eleduck", name: "\u7535\u9E2D\u793E\u533A", url: "https://eleduck.com/feed/latest.xml", dailyLimit: 4 }
];
function qualify(entries, spec) {
  return dedupeDrafts(
    entries.map((entry) => {
      const draft = buildDraft({
        url: entry.url,
        title: entry.title,
        excerpt: entry.excerpt,
        sourceId: spec.id,
        sourceName: spec.name,
        author: entry.author,
        publishedAt: entry.publishedAt,
        contentHtml: entry.contentHtml
      });
      return spec.tag && draft ? withTag(draft, spec.tag) : draft;
    }).filter((item) => item !== null)
  ).sort(byRank);
}
__name(qualify, "qualify");
async function qualifyFeed(spec, limit) {
  const entries = parseFeed(await fetchText(spec.url));
  return qualify(entries, spec).slice(0, limit);
}
__name(qualifyFeed, "qualifyFeed");
var SOURCES = FEEDS.map((spec) => ({
  id: spec.id,
  name: spec.name,
  hint: spec.url,
  fetch: /* @__PURE__ */ __name(() => qualifyFeed(spec, spec.dailyLimit), "fetch")
}));
function knownSource(id) {
  return SOURCES.find((source) => source.id === id);
}
__name(knownSource, "knownSource");

// src/backfill.ts
function pageExcerpt(html2) {
  const head = html2.slice(0, 8e4);
  const title = plainTitle(head.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "");
  const raw = head.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ?? head.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1] ?? head.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i)?.[1] ?? "";
  return { title, excerpt: excerptOf(raw, title) };
}
__name(pageExcerpt, "pageExcerpt");
async function draftFromSeed(seed) {
  const html2 = await fetchText(seed.url, 12e3);
  const page = pageExcerpt(html2);
  const title = page.title || seed.title;
  return buildDraft({
    url: seed.url,
    title,
    excerpt: page.excerpt,
    sourceId: seed.sourceId,
    sourceName: seed.sourceName,
    author: seed.author,
    contentHtml: html2
  });
}
__name(draftFromSeed, "draftFromSeed");
async function insertClassics(env, items) {
  if (!items.length) return { inserted: 0, skipped: 0 };
  const collectedAt = (/* @__PURE__ */ new Date()).toISOString();
  const results = await env.DB.batch(
    items.map(
      (item) => env.DB.prepare(
        `INSERT INTO items (
          canonical_url, title, excerpt, source_id, source_name, author,
          published_at, collected_at, popularity, popularity_label, tags,
          language, discussion_url, topic, quality_score, section
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'classic')
        ON CONFLICT(canonical_url) DO UPDATE SET
          section = 'classic',
          topic = excluded.topic,
          quality_score = excluded.quality_score,
          excerpt = CASE
            WHEN length(excluded.excerpt) > length(items.excerpt) THEN excluded.excerpt
            ELSE items.excerpt
          END`
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
        item.discussionUrl,
        item.topic,
        item.qualityScore
      )
    )
  );
  const inserted = results.reduce((sum, result) => sum + (result.meta?.changes ?? 0), 0);
  return { inserted, skipped: items.length - inserted };
}
__name(insertClassics, "insertClassics");
async function runBackfill(env) {
  const byTopic = Object.fromEntries(TOPICS.map((topic) => [topic.id, 0]));
  const pool = [];
  const seen = /* @__PURE__ */ new Set();
  const feeds = [];
  for (const spec of FEEDS) {
    try {
      const items = await qualifyFeed(spec, 80);
      feeds.push({ id: spec.id, qualified: items.length, error: null });
      for (const item of items) {
        if (seen.has(item.canonicalUrl)) continue;
        seen.add(item.canonicalUrl);
        pool.push(item);
      }
    } catch (error) {
      feeds.push({
        id: spec.id,
        qualified: 0,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
  let seedOk = 0;
  let seedFailed = 0;
  for (const seed of classics_default) {
    try {
      const draft = await draftFromSeed(seed);
      if (!draft) {
        seedFailed += 1;
        continue;
      }
      seedOk += 1;
      if (seen.has(draft.canonicalUrl)) continue;
      seen.add(draft.canonicalUrl);
      pool.push(draft);
    } catch {
      seedFailed += 1;
    }
  }
  const saved = await insertClassics(env, pool);
  if (pool.length) await storeAndFetchContent(env, pool, 0, 0);
  for (const item of pool) byTopic[item.topic] = (byTopic[item.topic] ?? 0) + 1;
  return {
    ok: pool.length > 0,
    inserted: saved.inserted,
    skipped: saved.skipped,
    byTopic,
    seeds: { ok: seedOk, failed: seedFailed },
    feeds
  };
}
__name(runBackfill, "runBackfill");

// src/collect.ts
var RUN_LIMIT = 16;
async function loadSource(source) {
  try {
    const items = dedupeDrafts(await source.fetch()).sort(byRank).slice(0, 12);
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
  let fresh = [];
  if (picked.length) {
    const results = await env.DB.batch(
      picked.map(
        (item) => env.DB.prepare(
          `INSERT INTO items (
            canonical_url, title, excerpt, source_id, source_name, author,
            published_at, collected_at, popularity, popularity_label, tags,
            language, discussion_url, topic, quality_score, section
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'daily')
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
          item.discussionUrl,
          item.topic,
          item.qualityScore
        )
      )
    );
    inserted = results.reduce((sum, result) => sum + (result.meta?.changes ?? 0), 0);
    fresh = picked.filter((_, index) => (results[index]?.meta?.changes ?? 0) > 0);
  }
  if (fresh.length) {
    await storeAndFetchContent(env, fresh, CONTENT_FETCH_LIMIT, SUMMARY_LIMIT);
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
async function purgeItems(db, mode) {
  const rows = await db.prepare("SELECT id, title, excerpt FROM items").all();
  const all = rows.results ?? [];
  const languageIds = [];
  const qualityIds = [];
  for (const row of all) {
    const foreign = !isPredominantlyChinese(row.title);
    const weak = !passesQuality(row.title, row.excerpt ?? "");
    if ((mode === "all" || mode === "language") && foreign) languageIds.push(row.id);
    else if ((mode === "all" || mode === "quality") && weak) qualityIds.push(row.id);
  }
  const deletedLanguage = await deleteIds(db, languageIds);
  const deletedQuality = await deleteIds(db, qualityIds);
  return {
    scanned: all.length,
    deleted: deletedLanguage + deletedQuality,
    deletedLanguage,
    deletedQuality
  };
}
__name(purgeItems, "purgeItems");
async function deleteIds(db, ids) {
  let deleted = 0;
  for (let index = 0; index < ids.length; index += 80) {
    const chunk = ids.slice(index, index + 80);
    const placeholders = chunk.map(() => "?").join(", ");
    const result = await db.prepare(`DELETE FROM items WHERE id IN (${placeholders})`).bind(...chunk).run();
    deleted += result.meta?.changes ?? 0;
  }
  return deleted;
}
__name(deleteIds, "deleteIds");

// src/brand-assets.ts
var FAVICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="\u6E38\u7267\u624B\u8BB0">\n  <rect width="64" height="64" rx="14" fill="#0c5f57"/>\n  <circle cx="32" cy="32" r="18.5" fill="none" stroke="#f4efe4" stroke-width="2.4"/>\n  <path d="M32 14.2 37 32 32 28.6 27 32Z" fill="#f4efe4"/>\n  <path d="M32 49.8 27 32 32 35.4 37 32Z" fill="#e7b2ab"/>\n  <circle cx="32" cy="32" r="2.7" fill="#8d2e28"/>\n</svg>\n';
var ICON_512_PNG = "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";
var APPLE_TOUCH_PNG = "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";
var OG_PNG = "iVBORw0KGgoAAAANSUhEUgAABLAAAAJ2CAYAAABPQHtcAACQnklEQVR4nO39fbQtVWHne1eeHmSIXlBJfK7hyDWj5ciLIBkJkEAnoHKiYO4DHkzUNrkIl5b4QgfiS8zh7Q/eTozGaDeCjc0DeKM3mgjCbQWTgwjpgHIwIwRQkeMd0nhO0tcbwkvrccjomzu/6zhhUqdmraq1au0996rvh1Gc2nuvVS+zZtWu+dtz1vqJ/+Etb/znSpKkVfYPH/6j8H9JkiRJ2p0BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJRTDAkiRJkpRjgCVJKoIBliRJkqQcAyxJUhEMsCRJkiTlGGBJkopggCVJkiQpxwBLklQEAyxJkiRJOQZYkqQiGGBJkiRJyjHAkiQVwQBLkiRJUo4BliSpCAZYkiRJknIMsCRJ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lGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSjgGWJKkIBliSJEmScgywJElFMMCSJEmSlGOAJUkqggGWJEmSpBwDLElSEQywJEmSJOUYYEmSimCAJUmSJCnHAEuSVAQDLEmSJEk5BliSpCIYYEmSJEnKMcCSJBXBAEuSJElSzv8LQnBR1A6uU4sAAAAASUVORK5CYII=";
var FAVICON_ICO = "AAABAAEAICAAAAEAIAAABAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAgAAAAIAgGAAAAc3p69AAAA8dJREFUeJzFl0doVFEUhv9rAccyGQMunEFUVEQssaCiolkYKxLbIkEEJ4iCIsS6EHvDhS0WFBTJLMSysAUxlriIoqKixhYRFBWduBDiJCIjqDz//8UkMy/TElM+eDfn3Jfk/Oeecy/3GUTg8fs9v/EzH5Y1h+5wPs1JGYy51AGdDoYCgRB9mzoB3fy5fgY+YFEH3RaDAUMUsup74GwAhH5NcMuyCmm2GsaYPIkwWvY/Vvi91cKZO2HmofbG1dd09eduhWVt4VzrY8w203VRzlOaw/m0BWUSYNFImSE+Hwb7evLx0fZyBngZrMCrYJDPF9pBzqROygLSXC4ULMjFjKFDGKjCDhT8FuIbwNfdQzES5kXxi5dYefosqsJhvklOSgLG9++HwsV5duB8/vNPlZWcBXLGjOYInHv4iCPQKz0dBylSQvJOFuLe23ecTUxSAcpYwfdeu8HnOmfqCXBe+BkskrXTp/GZinlHjiYVkVCAlv3h5g3Yx+DHS29zJpo3u3dyBAau38gxGolYkjkRY7bvSliOhAKUuUQoEycqy4UVy2nBfh8rU71XcJUjHnEFqKlK1q3GaGZQW/NIlKGWWcQqj1BPPOIKZu3ZbzdtLOIKUIMtzZyEyXv20WuIxEmk0D9XkFjcWrfGLl9tozqJK2DH3Nlwc/nV9U5UFtW/qLgm6+wZ0+w+0HI70a6o5vymi5fpNSSuANXvGve01DvRzuhS+Q1Dr1ylB7yYNRM/0rvbZ4ATlUr9oj6JRZMETPF60aW6GiPu3KUHPJ04AT/cbtysqKAXTZMFJCqBu2NHPM6ejeLnz+lxRYYNw6iiy6j+9YteNE0ugZpQ+zhecxVlZWFQmocW8LoqhOySEloNUbOeKL3T+CZUh+uP423DjRkZWNR/AC3g8OtyHCovpxXNf21DoaPW7erE+h2jF83YHj1walImLWDh7VI8+PqVVjRK4DOb1XlUR5JQgLabMjjOJYx10DxhH4iRrL8TNZ/KmMVzpCoc5kxsEgoQ6mDtCAnQiRfJsXHjOQLL7t/jWI9OSAlQ58c6oiNJKkBIhMqhOuafPlfXE/N794E4//EDhGpeuNjPlevM3zuTNLhISYBQObSlpvMQkhDdDUL/LiQeXkh0B1Dj6uzQ1k207JGkLKAWBakJ5uVPH2dAMUGK0rWs5qbUGHgrzimDhQzarY/BM9Pm13L7wwThD5aFNE61Gsagqj1cfQztNvo0azf3e+DMJVuAkAjAKmjplVDmQDu/gtNFnQChcvDzfCWFzGn2xmTDcdDneUHk5/lfelS7sIEtmvwAAAAASUVORK5CYII=";
function decodeAsset(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes;
}
__name(decodeAsset, "decodeAsset");

// src/icons.ts
var CACHE = "public, max-age=2592000";
var MANIFEST = JSON.stringify({
  name: "\u6E38\u7267\u624B\u8BB0",
  short_name: "\u6E38\u7267\u624B\u8BB0",
  icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  theme_color: "#0c5f57",
  background_color: "#f4efe4",
  display: "standalone",
  start_url: "/"
});
var FILES = {
  "/favicon.svg": { type: "image/svg+xml; charset=utf-8", body: FAVICON_SVG },
  "/favicon.ico": { type: "image/x-icon", body: decodeAsset(FAVICON_ICO) },
  "/apple-touch-icon.png": { type: "image/png", body: decodeAsset(APPLE_TOUCH_PNG) },
  "/icon-512.png": { type: "image/png", body: decodeAsset(ICON_512_PNG) },
  "/og.png": { type: "image/png", body: decodeAsset(OG_PNG) },
  "/manifest.webmanifest": { type: "application/manifest+json; charset=utf-8", body: MANIFEST }
};
function iconResponse(pathname) {
  const file = FILES[pathname];
  if (!file) return null;
  return new Response(file.body, {
    headers: {
      "content-type": file.type,
      "cache-control": CACHE,
      "x-content-type-options": "nosniff"
    }
  });
}
__name(iconResponse, "iconResponse");

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
var ITEM_COLUMNS = `id, canonical_url, title, excerpt, source_id, source_name, author,
  published_at, collected_at, popularity, popularity_label, tags, language, discussion_url,
  topic, quality_score, section, ai_summary`;
var DETAIL_COLUMNS = `${ITEM_COLUMNS}, content_html, content_fetched_at, ai_summary_at`;
function whereClause(sourceId, tag) {
  const parts = ["section = 'daily'"];
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
    `SELECT ${ITEM_COLUMNS}
       FROM items ${where.sql}
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ? OFFSET ?`
  ).bind(...where.binds, PAGE_SIZE, offset).all();
  return rows.results ?? [];
}
__name(listItems, "listItems");
async function getItem(db, id) {
  return db.prepare(
    `SELECT ${DETAIL_COLUMNS}
       FROM items WHERE id = ?`
  ).bind(id).first();
}
__name(getItem, "getItem");
async function recentItems(db, limit = 30) {
  const rows = await db.prepare(
    `SELECT ${ITEM_COLUMNS}
       FROM items
       WHERE section = 'daily'
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ?`
  ).bind(limit).all();
  return rows.results ?? [];
}
__name(recentItems, "recentItems");
async function listClassics(db, topic) {
  const rows = await db.prepare(
    `SELECT ${ITEM_COLUMNS}
       FROM items
       WHERE section = 'classic' AND (? = '' OR topic = ?)
       ORDER BY quality_score DESC, id DESC
       LIMIT ?`
  ).bind(topic, topic, topic ? 12 : 6).all();
  return rows.results ?? [];
}
__name(listClassics, "listClassics");
function searchWhere(query) {
  const pattern = likePattern(query);
  const topics = topicIdsFor(query);
  const parts = [
    "title LIKE ? ESCAPE '\\'",
    "ifnull(ai_summary, '') LIKE ? ESCAPE '\\'",
    "excerpt LIKE ? ESCAPE '\\'",
    "source_name LIKE ? ESCAPE '\\'",
    "topic LIKE ? ESCAPE '\\'",
    "ifnull(content_text, '') LIKE ? ESCAPE '\\'"
  ];
  const binds = [pattern, pattern, pattern, pattern, pattern, pattern];
  if (topics.length) {
    parts.push(`topic IN (${topics.map(() => "?").join(", ")})`);
    binds.push(...topics);
  }
  return { sql: parts.join(" OR "), binds };
}
__name(searchWhere, "searchWhere");
async function countSearch(db, query) {
  const where = searchWhere(query);
  const row = await db.prepare(`SELECT COUNT(*) AS n FROM items WHERE ${where.sql}`).bind(...where.binds).first();
  return Number(row?.n ?? 0);
}
__name(countSearch, "countSearch");
async function searchItems(db, query, page) {
  const where = searchWhere(query);
  const offset = (page - 1) * SEARCH_PAGE_SIZE;
  const rows = await db.prepare(
    `SELECT ${ITEM_COLUMNS},
         substr(
           ifnull(content_text, ''),
           max(1, instr(lower(ifnull(content_text, '')), lower(?)) - 24),
           96
         ) AS content_snippet
       FROM items
       WHERE ${where.sql}
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ? OFFSET ?`
  ).bind(query, ...where.binds, SEARCH_PAGE_SIZE, offset).all();
  return rows.results ?? [];
}
__name(searchItems, "searchItems");

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
form.search { display: flex; gap: 0.5rem; margin: 0.85rem 0 0; }
form.search label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
form.search input[type="search"] {
  flex: 1;
  min-width: 0;
  font: inherit;
  color: var(--ink);
  background: var(--paper-2);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 0.55rem 0.95rem;
}
mark { background: #f3df9a; color: inherit; padding: 0 0.12em; border-radius: 0.15em; }
@media (prefers-color-scheme: dark) {
  mark { background: #6a5420; }
}
.source-form { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.source-form label { color: var(--muted); font-size: 0.92rem; }
.count { color: var(--muted); font-size: 0.92rem; margin: 0; }
.classic { margin: 0 0 2rem; }
.classic h2, .daily-heading {
  font-family: var(--serif);
  font-size: 1.45rem;
  margin: 0 0 0.4rem;
}
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
.ai-mark {
  display: inline-block;
  margin-right: 0.35rem;
  padding: 0.02rem 0.4rem;
  border-radius: 999px;
  background: var(--teal-soft);
  color: var(--teal);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.ai-summary {
  margin: 0.9rem 0 1.1rem;
  padding: 0.85rem 1rem;
  background: var(--teal-soft);
  border-left: 3px solid var(--teal);
}
.ai-summary strong { display: block; margin-bottom: 0.25rem; font-size: 0.82rem; letter-spacing: 0.08em; }
.reprint {
  margin: 0.9rem 0;
  padding: 0.75rem 0.9rem;
  background: var(--paper-2);
  border-left: 3px solid var(--teal);
}
.reprint p { margin: 0.2rem 0; }
.reprint span { display: inline-block; min-width: 4.5rem; color: var(--muted); }
.reprint .notice { margin-top: 0.55rem; color: var(--stamp); }
.article-body { font-family: var(--serif); font-size: 1.08rem; }
.article-body p { margin: 0.9rem 0; }
.article-body h2, .article-body h3, .article-body h4 { font-family: var(--serif); line-height: 1.3; }
.article-body img { max-width: 100%; height: auto; }
.article-body pre { overflow: auto; padding: 0.8rem 1rem; background: var(--paper-2); }
.article-body blockquote { margin: 1rem 0; padding-left: 0.9rem; border-left: 3px solid var(--stamp); }
.article-body table { width: 100%; border-collapse: collapse; }
.article-body th, .article-body td { border: 1px solid var(--line); padding: 0.35rem 0.5rem; vertical-align: top; }
.origin { font-size: 0.92em; }
@media (max-width: 640px) {
  body { font-size: 16px; }
  .mast-row { flex-direction: column; align-items: flex-start; }
  .item { grid-template-columns: 1.8rem 1fr; }
  .item h3 { font-size: 1.18rem; }
}
`.trim();

// src/render.ts
function pageHref(page, source, tag, topic = "") {
  const params = new URLSearchParams();
  if (source) params.set("source", source);
  if (tag) params.set("tag", tag);
  if (topic) params.set("topic", topic);
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
  return `\u6765\u6E90\uFF1A<strong>${esc(item.source_name)}</strong> \xB7 \u4F5C\u8005\uFF1A<strong>${esc(displayAuthor(item.author))}</strong> \xB7 <a class="origin" href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">\u539F\u6587</a>`;
}
__name(attribution, "attribution");
function reprint(item) {
  const author = item.author?.trim() ? `<p><span>\u4F5C\u8005</span>${esc(item.author)}</p>` : "";
  return `<aside class="reprint">
    <p><span>\u539F\u6587\u6807\u9898</span>${esc(item.title)}</p>
    ${author}
    <p><span>\u6765\u6E90\u7AD9\u70B9</span>${esc(item.source_name)}</p>
    <p><span>\u539F\u6587\u94FE\u63A5</span><a href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">${esc(item.canonical_url)}</a></p>
    <p class="notice">\u672C\u6587\u8F6C\u8F7D\u81EA${esc(item.source_name)}\uFF0C\u7248\u6743\u5F52\u539F\u4F5C\u8005\u6240\u6709\uFF0C\u5982\u6709\u4FB5\u6743\u8BF7\u8054\u7CFB\u5220\u9664</p>
  </aside>`;
}
__name(reprint, "reprint");
function safeBody(html2) {
  if (!html2) return null;
  if (/<\s*script\b|<\/script|on\w+\s*=|javascript:/i.test(html2)) return null;
  return html2;
}
__name(safeBody, "safeBody");
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
function searchForm(query) {
  return `<form class="search" method="get" action="/search" role="search">
    <label for="q">\u641C\u7D22</label>
    <input id="q" name="q" type="search" value="${esc(query)}" placeholder="\u641C\u7D22\u6807\u9898\u3001\u6458\u8981\u6216\u6B63\u6587" maxlength="80" enterkeyhint="search">
    <button type="submit">\u641C\u7D22</button>
  </form>`;
}
__name(searchForm, "searchForm");
function layout(options) {
  const onHome = !options.query && (options.path === "/" || options.path.startsWith("/?"));
  const fullTitle = onHome ? "\u6E38\u7267\u624B\u8BB0" : `${options.title} \xB7 \u6E38\u7267\u624B\u8BB0`;
  const canonical = `${options.origin}${options.path === "/" ? "/" : options.path}`;
  const shareTitle = options.shareTitle ?? fullTitle;
  const shareDescription = options.shareDescription ?? options.description;
  const shareType = options.shareType ?? "website";
  const image = `${options.origin}/og.png`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(options.description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" type="application/rss+xml" title="\u6E38\u7267\u624B\u8BB0" href="/rss.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0c5f57">
<meta property="og:title" content="${esc(shareTitle)}">
<meta property="og:description" content="${esc(shareDescription)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="\u6E38\u7267\u624B\u8BB0">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="zh_CN">
<meta property="og:type" content="${shareType}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(shareTitle)}">
<meta name="twitter:description" content="${esc(shareDescription)}">
<meta name="twitter:image" content="${esc(image)}">
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
    <p class="deck">\u6BCF\u5929\u6574\u7406\u4E2D\u6587\u6570\u5B57\u6E38\u6C11\u6307\u5357\u3002\u70B9\u6807\u9898\u8BFB\u5168\u6587\uFF0C\u6587\u9996\u548C\u6587\u672B\u90FD\u5199\u7740\u51FA\u5904\uFF1B\u5217\u8868\u4E0A\u4F18\u5148\u663E\u793A AI \u6458\u8981\u3002</p>
    ${searchForm(options.query ?? "")}
  </div>
</header>
<main id="content" class="wrap">${options.body}</main>
<footer class="site">
  <div class="wrap">
    <p>\u6B63\u6587\u8F6C\u8F7D\u81EA\u516C\u5F00\u6765\u6E90\uFF0C\u6587\u9996\u548C\u6587\u672B\u4FDD\u7559\u6807\u9898\u3001\u4F5C\u8005\u3001\u6765\u6E90\u548C\u539F\u6587\u94FE\u63A5\u3002\u5185\u5BB9\u8457\u4F5C\u6743\u5F52\u539F\u4F5C\u8005\u6240\u6709\uFF0C\u5982\u6709\u4FB5\u6743\u8BF7\u8054\u7CFB\u5220\u9664\u3002</p>
    <p>\u6E38\u7267\u624B\u8BB0 \xB7 <a href="/rss.xml">\u8BA2\u9605 RSS</a> \xB7 <a href="/about">\u5173\u4E8E\u8FD9\u4EFD\u65E5\u66F4</a></p>
  </div>
</footer>
</body>
</html>`;
}
__name(layout, "layout");
function classicsBlock(view) {
  const tabs = [
    `<a class="tag${view.topic ? "" : " on"}" href="${esc(pageHref(1, view.source, view.tag, ""))}">\u5168\u90E8\u7CBE\u9009</a>`,
    ...TOPICS.map(
      (topic) => `<a class="tag${view.topic === topic.id ? " on" : ""}" href="${esc(pageHref(1, view.source, view.tag, topic.id))}">${esc(topic.label)}</a>`
    )
  ].join("");
  const cards = view.classics.map(
    (item, index) => `<article class="item">
      <div class="index">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3><a href="/a/${item.id}">${esc(item.title)}</a></h3>
        ${item.ai_summary ? `<p class="excerpt"><span class="ai-mark">AI \u6458\u8981</span> ${esc(item.ai_summary)}</p>` : item.excerpt ? `<p class="excerpt">${esc(item.excerpt)}</p>` : ""}
        <p class="attr">${attribution(item)}</p>
        <p class="submeta">${esc([TOPICS.find((topic) => topic.id === item.topic)?.label, item.quality_score ? `${item.quality_score} \u5206` : ""].filter(Boolean).join(" \xB7 "))}</p>
      </div>
    </article>`
  ).join("");
  return `<section class="classic">
    <h2>\u7ECF\u5178\u6559\u7A0B</h2>
    <p class="count">\u7CBE\u9009\u8FC7\u7684\u957F\u6307\u5357\uFF0C\u548C\u4E0B\u9762\u7684\u6BCF\u65E5\u6536\u5F55\u5206\u5F00\u3002</p>
    <div class="tag-row" aria-label="\u7ECF\u5178\u4E3B\u9898">${tabs}</div>
    ${cards || `<p class="empty">\u8FD9\u4E2A\u4E3B\u9898\u4E0B\u8FD8\u6CA1\u6709\u7ECF\u5178\u6559\u7A0B\u3002</p>`}
  </section>`;
}
__name(classicsBlock, "classicsBlock");
function filters(view) {
  const tags = [
    `<a class="tag${view.tag ? "" : " on"}" href="${esc(pageHref(1, view.source, "", view.topic))}">\u5168\u90E8</a>`,
    ...TAGS.map(
      (tag) => `<a class="tag${view.tag === tag.id ? " on" : ""}" href="${esc(pageHref(1, view.source, tag.id, view.topic))}">${esc(tag.label)}</a>`
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
      ${view.topic ? `<input type="hidden" name="topic" value="${esc(view.topic)}">` : ""}
      <button type="submit">\u7B5B\u9009</button>
    </div>
  </form>`;
}
__name(filters, "filters");
function itemCard(item, index, sourceFilter, query = "") {
  const bits = [
    popularity(item),
    item.published_at ? `\u53D1\u5E03\u4E8E ${shanghaiLabel(item.published_at, false)}` : "",
    item.language === "zh" ? "\u4E2D\u6587" : "EN"
  ].filter(Boolean);
  const summary = query ? cardSnippet(item, query) : item.ai_summary || item.excerpt || "";
  const summaryHtml = query ? highlight(summary, query) : esc(summary);
  const titleHtml = query ? highlight(item.title, query) : esc(item.title);
  return `<article class="item">
    <div class="index">${String(index).padStart(2, "0")}</div>
    <div>
      <h3><a href="/a/${item.id}">${titleHtml}</a></h3>
      ${summary ? `<p class="excerpt">${!query && item.ai_summary ? `<span class="ai-mark">AI \u6458\u8981</span> ` : ""}${summaryHtml}</p>` : ""}
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
  const prev = view.page > 1 ? `<a href="${esc(pageHref(view.page - 1, view.source, view.tag, view.topic))}">\u4E0A\u4E00\u9875</a>` : `<span>\u4E0A\u4E00\u9875</span>`;
  const next = view.page < pages ? `<a href="${esc(pageHref(view.page + 1, view.source, view.tag, view.topic))}">\u4E0B\u4E00\u9875</a>` : `<span>\u4E0B\u4E00\u9875</span>`;
  const body = `${classicsBlock(view)}
    <h2 class="daily-heading">\u6700\u65B0\u6536\u5F55</h2>
    ${filters(view)}
    <p class="count">\u5171 ${view.total} \u7BC7${filterBits ? ` \xB7 ${esc(filterBits)}` : ""} \xB7 \u7B2C ${view.page} / ${pages} \u9875 \xB7 ${esc(shanghaiLabel(view.generatedAt, false))}</p>
    ${list}
    ${view.total > PAGE_SIZE ? `<nav class="pager" aria-label="\u5206\u9875">${prev}<span>\u7B2C ${view.page} / ${pages} \u9875</span>${next}</nav>` : ""}`;
  return layout({
    title: "\u6700\u65B0",
    description: "\u6570\u5B57\u6E38\u6C11\u3001\u8FDC\u7A0B\u5DE5\u4F5C\u3001\u7B7E\u8BC1\u4E0E\u65C5\u5C45\u7684\u6BCF\u65E5\u9009\u8BFB\u3002\u5217\u8868\u7ED9\u51FA AI \u6458\u8981\uFF0C\u8BE6\u60C5\u9875\u662F\u5E26\u6765\u6E90\u7684\u5168\u6587\u3002",
    path: pageHref(view.page, view.source, view.tag, view.topic),
    body,
    origin
  });
}
__name(renderHome, "renderHome");
function searchHref(base, q, page) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
__name(searchHref, "searchHref");
function renderSearch(view, origin) {
  const pages = pageCount(view.total, SEARCH_PAGE_SIZE);
  const cards = view.items.map((item, index) => itemCard(item, (view.page - 1) * SEARCH_PAGE_SIZE + index + 1, "", view.q)).join("");
  const list = view.q ? cards || `<div class="empty"><p>\u6CA1\u6709\u627E\u5230\u4E0E\u300C${esc(view.q)}\u300D\u76F8\u5173\u7684\u6761\u76EE\u3002</p></div>` : `<div class="empty"><p>\u8BF7\u8F93\u5165\u5173\u952E\u8BCD\u3002\u53EF\u4EE5\u641C\u6807\u9898\u3001\u6458\u8981\u3001\u6765\u6E90\u3001\u4E3B\u9898\u548C\u6B63\u6587\u3002</p></div>`;
  const prev = view.page > 1 ? `<a href="${esc(searchHref(view.basePath, view.q, view.page - 1))}">\u4E0A\u4E00\u9875</a>` : `<span>\u4E0A\u4E00\u9875</span>`;
  const next = view.page < pages && view.q ? `<a href="${esc(searchHref(view.basePath, view.q, view.page + 1))}">\u4E0B\u4E00\u9875</a>` : `<span>\u4E0B\u4E00\u9875</span>`;
  const body = `<h2 class="daily-heading">\u641C\u7D22\u7ED3\u679C</h2>
    <p class="count">${view.q ? `\u5171 ${view.total} \u7BC7 \xB7 \u300C${esc(view.q)}\u300D \xB7 \u7B2C ${view.page} / ${pages} \u9875` : "\u8F93\u5165\u5173\u952E\u8BCD\u540E\u641C\u7D22\u5168\u7AD9\u3002"}</p>
    ${list}
    ${view.q && view.total > SEARCH_PAGE_SIZE ? `<nav class="pager" aria-label="\u5206\u9875">${prev}<span>\u7B2C ${view.page} / ${pages} \u9875</span>${next}</nav>` : ""}`;
  return layout({
    title: view.q ? `\u641C\u7D22 ${view.q}` : "\u641C\u7D22",
    description: view.q ? `\u641C\u7D22\u300C${view.q}\u300D\u7684\u7ED3\u679C\u3002` : "\u641C\u7D22\u6E38\u7267\u624B\u8BB0\u3002",
    path: searchHref(view.basePath, view.q, view.page),
    body,
    origin,
    query: view.q
  });
}
__name(renderSearch, "renderSearch");
function renderItem(item, origin) {
  const bits = [
    popularity(item),
    item.published_at ? `\u53D1\u5E03\u4E8E ${shanghaiLabel(item.published_at)}` : "",
    `\u6536\u5F55\u4E8E ${shanghaiLabel(item.collected_at)}`,
    item.language === "zh" ? "\u4E2D\u6587" : "EN"
  ].filter(Boolean);
  const discussion = item.discussion_url ? `<p class="discuss"><a href="${safeHref(item.discussion_url)}" target="_blank" rel="noopener noreferrer">\u67E5\u770B\u8BA8\u8BBA\u7EBF\u7A0B</a></p>` : "";
  const full = safeBody(item.content_html);
  const aiBox = item.ai_summary ? `<p class="ai-summary"><strong>AI \u6458\u8981</strong> ${esc(item.ai_summary)}</p>` : "";
  const article = full ? `<div class="article-body">${full}</div>` : `<p class="note">${item.excerpt ? "\u5168\u6587\u8FD8\u6CA1\u6709\u6293\u5230\uFF0C\u4E0B\u9762\u5148\u653E\u539F\u6765\u7684\u6458\u8981\u3002" : "\u8FD9\u6761\u6765\u6E90\u6682\u65F6\u6CA1\u6709\u53EF\u7528\u7684\u6B63\u6587\u3002"}</p>${item.excerpt ? `<blockquote class="quote">${esc(item.excerpt)}</blockquote>` : ""}`;
  const body = `<article class="post">
    <p class="kicker">${esc(item.language === "zh" ? "\u4E2D\u6587" : "EN")}</p>
    <h1>${esc(item.title)}</h1>
    ${aiBox}
    ${reprint(item)}
    ${article}
    <p><a class="read" href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">\u9605\u8BFB\u539F\u6587</a></p>
    ${discussion}
    ${tagLinks(item, "")}
    <p class="submeta">${esc(bits.join(" \xB7 "))}</p>
    ${reprint(item)}
  </article>`;
  return layout({
    title: item.title,
    description: item.ai_summary || item.excerpt || `${item.source_name} \u7684\u4E00\u7BC7\u8F6C\u8F7D\u3002`,
    path: `/a/${item.id}`,
    body,
    origin,
    shareTitle: item.title,
    shareDescription: item.ai_summary || item.excerpt || "",
    shareType: "article"
  });
}
__name(renderItem, "renderItem");
function renderAbout(origin) {
  const sources = SOURCES.map(
    (source) => `<li><strong>${esc(source.name)}</strong> \xB7 <a href="${safeHref(source.hint)}">${esc(source.hint)}</a></li>`
  ).join("");
  const body = `<article class="about">
    <h1>\u5173\u4E8E\u6E38\u7267\u624B\u8BB0</h1>
    <p>\u8FD9\u662F\u7ED9\u4E2D\u6587\u8BFB\u8005\u7684\u4E00\u4EFD\u6570\u5B57\u6E38\u6C11\u65E5\u66F4\u3002\u5B83\u6536\u5F55\u6807\u9898\u4EE5\u4E2D\u6587\u4E3A\u4E3B\u7684\u516C\u5F00\u6587\u7AE0\uFF0C\u5728\u672C\u7AD9\u5C55\u793A\u5168\u6587\uFF0C\u5E76\u5728\u6587\u9996\u6587\u672B\u5199\u660E\u51FA\u5904\u3002</p>
    <h2>\u6BCF\u5929\u600E\u4E48\u66F4\u65B0</h2>
    <p>\u540C\u4E00\u4E2A Cloudflare Worker \u5728\u5317\u4EAC\u65F6\u95F4 08:00 \u548C 22:00 \u5404\u8DD1\u4E00\u6B21\u91C7\u96C6\u3002\u4E24\u6B21\u90FD\u5199\u8FDB\u5F53\u5929\u7684\u5206\u7EC4\u3002\u6BCF\u6761\u90FD\u8981\u5148\u5BF9\u4E0A\u6D77\u5916\u5F00\u5361\u3001\u624B\u673A\u5361\u3001\u7A0E\u53F7\u3001AI \u8BA2\u9605\u3001\u7B7E\u8BC1\u3001\u8FDC\u7A0B\u65B9\u6CD5\u6216\u5238\u5546\uFF0C\u5E76\u4E14\u5206\u6570\u591F\u9AD8\uFF1B\u62DB\u8058\u548C\u95F2\u804A\u4E0D\u4F1A\u8FDB\u6765\u3002\u6BCF\u6B21\u6700\u591A\u65B0\u589E 16 \u6761\u3002</p>
    <h2>\u9875\u9762\u4E0A\u6709\u4EC0\u4E48</h2>
    <ul>
      <li>\u9996\u9875\u6309\u6536\u5F55\u65E5\u5206\u7EC4\uFF0C\u53EF\u4EE5\u6309\u6765\u6E90\u548C\u4E3B\u9898\u7B5B\u9009\uFF0C\u4E5F\u53EF\u4EE5\u7FFB\u9875\u3002</li>
      <li>\u6BCF\u7BC7\u6587\u7AE0\u5728 <code>/a/\u7F16\u53F7</code>\uFF0C\u6B63\u6587\u4E0A\u65B9\u6709 AI \u6458\u8981\uFF0C\u5F00\u5934\u548C\u7ED3\u5C3E\u90FD\u6709\u539F\u6587\u6807\u9898\u3001\u4F5C\u8005\u3001\u6765\u6E90\u548C\u539F\u6587\u94FE\u63A5\u3002</li>
      <li><a href="/rss.xml">/rss.xml</a> \u662F\u8FD9\u4EFD\u65E5\u66F4\u81EA\u5DF1\u7684\u8BA2\u9605\u6E90\u3002</li>
    </ul>
    <h2>\u6B63\u6587\u548C\u6458\u8981</h2>
    <p>\u91C7\u96C6\u65F6\u4F18\u5148\u4F7F\u7528\u8BA2\u9605\u6E90\u91CC\u7684\u5168\u6587\uFF0C\u6CA1\u6709\u7684\u8BDD\u518D\u6253\u5F00\u539F\u6587\u9875\u63D0\u53D6\u6B63\u6587\u3002\u811A\u672C\u3001\u6837\u5F0F\u548C\u8DDF\u8E2A\u53C2\u6570\u4F1A\u88AB\u53BB\u6389\u3002\u6293\u4E0D\u5230\u6B63\u6587\u65F6\u4ECD\u663E\u793A\u539F\u6765\u7684\u77ED\u6458\u8981\u3002\u6293\u5230\u6B63\u6587\u540E\uFF0CWorkers AI \u4F1A\u5199\u4E24\u5230\u4E09\u53E5\u7B80\u4F53\u4E2D\u6587\u6458\u8981\uFF1B\u6A21\u578B\u5931\u8D25\u65F6\u5217\u8868\u7EE7\u7EED\u7528 RSS \u6458\u8981\u3002\u4F5C\u8005\u672A\u77E5\u65F6\u5217\u8868\u5199\u6210\u300C\u672A\u77E5\u300D\uFF0C\u4E0D\u4F1A\u628A\u8F6C\u5E16\u7684\u4EBA\u8BF4\u6210\u539F\u4F5C\u8005\u3002</p>
    <h2>\u73B0\u5728\u7684\u6765\u6E90</h2>
    <ul>${sources}</ul>
    <p>\u82F1\u6587\u6765\u6E90\u5DF2\u7ECF\u62FF\u6389\u3002V2EX \u7684\u5B98\u65B9\u63A5\u53E3\u4ECE Cloudflare \u7684\u5730\u5740\u8BBF\u95EE\u4F1A\u8FD4\u56DE 403\uFF0C\u6240\u4EE5\u4E5F\u4E0D\u76F4\u63A5\u6293\u3002\u6807\u9898\u91CC\u6C49\u5B57\u4E0D\u591F\u591A\u7684\u6761\u76EE\u4F1A\u88AB\u8DF3\u8FC7\u3002</p>
    <h2>\u7248\u6743</h2>
    <p>\u672C\u6587\u8F6C\u8F7D\u81EA\u5404\u6765\u6E90\u7AD9\u70B9\uFF0C\u7248\u6743\u5F52\u539F\u4F5C\u8005\u6240\u6709\uFF0C\u5982\u6709\u4FB5\u6743\u8BF7\u8054\u7CFB\u5220\u9664\u3002\u6BCF\u7BC7\u6587\u7AE0\u7684\u5F00\u5934\u548C\u7ED3\u5C3E\u90FD\u91CD\u590D\u4E86\u539F\u6587\u6807\u9898\u3001\u6765\u6E90\u548C\u539F\u6587\u94FE\u63A5\u3002</p>
  </article>`;
  return layout({
    title: "\u5173\u4E8E",
    description: "\u6E38\u7267\u624B\u8BB0\u5982\u4F55\u6BCF\u5929\u6536\u96C6\u6570\u5B57\u6E38\u6C11\u4E0E\u8FDC\u7A0B\u5DE5\u4F5C\u7684\u516C\u5F00\u6307\u5357\uFF0C\u5E76\u5728\u4FDD\u7559\u51FA\u5904\u7684\u524D\u63D0\u4E0B\u5C55\u793A\u5168\u6587\u3002",
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
    const link = `${origin}/a/${item.id}`;
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
  <description>\u6BCF\u5929\u6574\u7406\u6570\u5B57\u6E38\u6C11\u3001\u8FDC\u7A0B\u5DE5\u4F5C\u3001\u7B7E\u8BC1\u4E0E\u65C5\u5C45\u7684\u516C\u5F00\u6307\u5357\u3002\u7AD9\u5185\u6587\u7AE0\u4FDD\u7559\u51FA\u5904\u5E76\u94FE\u56DE\u539F\u6587\u3002</description>
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
function searchHref2(base, q, page) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
__name(searchHref2, "searchHref");
async function searchResponse(url, env, origin) {
  const basePath = url.pathname === "/search" ? "/search" : "/";
  const q = normalizeSearchQuery(url.searchParams.get("q"));
  if (!q) {
    return html(renderSearch({ q: "", items: [], total: 0, page: 1, basePath }, origin));
  }
  const requested = parsePage(url.searchParams.get("page"));
  const total = await countSearch(env.DB, q);
  const page = normalizePage(requested, total, SEARCH_PAGE_SIZE);
  if (url.searchParams.has("page") && page !== requested) {
    return redirect(searchHref2(basePath, q, page));
  }
  const items = await searchItems(env.DB, q, page);
  return html(renderSearch({ q, items, total, page, basePath }, origin), 200, "public, max-age=60");
}
__name(searchResponse, "searchResponse");
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
    if (url.pathname.startsWith("/admin/")) {
      if (request.method !== "POST") {
        return json({ error: "method not allowed" }, 405);
      }
      if (!bearerOk(request.headers.get("Authorization"), env.ADMIN_TOKEN)) {
        return json({ error: "unauthorized" }, 401);
      }
      if (url.pathname === "/admin/purge-non-chinese") {
        return json({ ok: true, ...await purgeItems(env.DB, "all") });
      }
      if (url.pathname === "/admin/purge-low-quality") {
        return json({ ok: true, ...await purgeItems(env.DB, "quality") });
      }
      if (url.pathname === "/admin/backfill") {
        return json(await runBackfill(env));
      }
      if (url.pathname === "/admin/collect") {
        return json(await runCollect(env, "manual"), 200);
      }
      if (url.pathname === "/admin/fetch-content") {
        return json({ ok: true, ...await fillMissingContent(env, parseBatchLimit(url.searchParams.get("limit"))) });
      }
      if (url.pathname === "/admin/summarize") {
        return json({ ok: true, ...await fillMissingSummaries(env, parseBatchLimit(url.searchParams.get("limit"))) });
      }
      if (url.pathname === "/admin/reindex") {
        return json({ ok: true, ...await reindexContentText(env.DB, parseReindexLimit(url.searchParams.get("limit"))) });
      }
      return json({ error: "not found" }, 404);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return json({ error: "method not allowed" }, 405);
    }
    const icon = iconResponse(url.pathname);
    if (icon) return icon;
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
    const legacyMatch = url.pathname.match(/^\/item\/(\d+)$/);
    if (legacyMatch) return redirect(`/a/${legacyMatch[1]}`);
    const itemMatch = url.pathname.match(/^\/a\/(\d+)$/);
    if (itemMatch) {
      const id = Number(itemMatch[1]);
      const item = await getItem(env.DB, id);
      if (!item) return html(renderNotFound(origin), 404, "no-store");
      return html(renderItem(item, origin), 200, "public, max-age=600");
    }
    if (url.pathname === "/search" || url.pathname === "/" && normalizeSearchQuery(url.searchParams.get("q"))) {
      return searchResponse(url, env, origin);
    }
    if (url.pathname === "/") {
      const source = knownSource(url.searchParams.get("source") ?? "")?.id ?? "";
      const tag = knownTag(url.searchParams.get("tag") ?? "")?.id ?? "";
      const topic = topicById(url.searchParams.get("topic") ?? "")?.id ?? "";
      const requested = parsePage(url.searchParams.get("page"));
      const total = await countItems(env.DB, source, tag);
      const page = normalizePage(requested, total, PAGE_SIZE);
      if (url.searchParams.has("page") && page !== requested) {
        const params = new URLSearchParams();
        if (source) params.set("source", source);
        if (tag) params.set("tag", tag);
        if (topic) params.set("topic", topic);
        if (page > 1) params.set("page", String(page));
        const query = params.toString();
        return redirect(query ? `/?${query}` : "/");
      }
      const items = await listItems(env.DB, source, tag, page);
      const classics = await listClassics(env.DB, topic);
      return html(
        renderHome(
          { items, classics, total, page, source, tag, topic, generatedAt: (/* @__PURE__ */ new Date()).toISOString() },
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
