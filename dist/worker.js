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
var OG_PNG = "iVBORw0KGgoAAAANSUhEUgAABLAAAAJ2CAYAAABPQHtcAACYiUlEQVR4nO3dD9xdVX3n++WdF17Bgoj1FvPIxXtN+BuktxJa0hbEpBp0hhCw4mgHyFBR/rRQhWr4k3lNgKSKtTATwUK5AUYd/0EIM0qwiQhtgxLsbQREJM6VwUQ7jpRA5XHkNbd3fU/8kZWVvfafc/Y5Zz1nf96v1072c57n7D9rr72fvb7PWvu85JfOPP2fHAAAY/aja//U/wsAAAAAeyLAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALcG7btm1u7dq7/NyepqZmuSVLFvu54Xrsse+4ww8/zM9hptGx2779h73/t23b7latutK/Oj6qz1NTU34OAIDBEWABALJAgDXzPfvss27jxq/56au+4brdBzGf968Oz/nnX+he8pKXuAUL3uynN7n99tvPvzqzPfjgZnfGGWf7uT0de+wx7rbb/m8/NzwKPpYseWcvdND6Fi5U2Z7ov4Pc6Fh95zvf9dN3/PzjvboTW7362t4xHDVty7Jly91zzz3nNmz48kScmwCA8SPAAgBkgQBrNNSwvO22T/vw5/2t9LJRI3rz5m/6sGpdbz6k3h/D6jGksOzYY3/Lz+1y7LHzeo31BQve1AtgZiIdn3EGWDqOy5Zd4ed2UfigEGvJkpP9Nszzr2DUHnzwIR9UPd47x+z/OnQebNx4t58bDfW4WrXqGh9afdV/tZPqzG233eznAAAYDAEWACALBFjDt3r1Db1JFErceutfDBRiFYUdoWE2XKvWrUa7Gu8zzbgDrJUrP+LX8Wk/tycFWKtWXeXnMCwKqtRrSQHVzqDq8V4oNIhly/7YnXnm7/m54VK90fVF4XLsggvO7U1tUlnl7rDDDuldawEA7SDAAgBkgQBreNSgvOCCP/INvt2HGKlhNUiIpeXGvaBiGkbY7/LLaPjgxo33+rk9jSLoaUIBxLPPPlerHHSMxhlgnXHGv/bbUBwMjCoImWQ6ZzTsT0NsVS8UUqlu7Px/z+CnDTrPhz2MT8NOFbqVUZitULsthx32Bv9v3treZwDoOgIsAEAWCLCGQ0N5Lr10eWnjeJChfmVBkgyj1472pSw4G2R/hsFCKfUIW7jwRHfKKScnwyz72SKjCLDKQoFhhZGTRsHUtm0/fDGUUiBovarGRb2fNA3Lrbd+yp93H/VzaQrQ2gzSyupqLgiwAKBdBFgAgCwQYA1H1VA702/oU2f5Dz741601WmXDhq/6xvhFfm5P++67rw/U7m51fYPSsCpNIQuzzj///btt6zgDLAUs6kmT8p3vfMv/2z0ql+ee+0c/p3BqZ88p2Tm/3c/Z/M7Xc3TYYYf6unPzbnWtbVVhthx++GH+mvF5Pzc4AiwA6B4CLABAFgiwhkch08qVH/WN8Of8V2kaHqZhYk3Nm/ebpcvWMrXstijgUdBTZBg9vga1bNnl/hjc5ef2pMa8GvVG+6X9KzLsAEv1JBVGDnvdg1JPJw3NK6IyraJeUiHrPTXTKMA9/PBD/fGa50PSWb1J86Og8lIAqjCvzBlnvMddeumH/NxgCLAAoHsIsAAAWSDAGi71IlEwUhY0iXphqTdWE2UBjbQZfqiXy4IFJ/m5YnEglIOy50rFvZoUtug4FWmzHIuUPcBdw8805aqqXkwi1QcFVIcddpiv84f6/w8dag+rOnSdUYhVpY1ghwALALqHAAsAkAUCrOFT41LhSJ0Qa9myS2o3hsuG9Jm2hhGWhWVqzG/cuN7P5SXV0FbgcOedX/Bzu4wzwCoL2lavvtYtXPhmP5evU075XR8IPu7nJovqieq2glnNK6zSENRcabispjIKdRTuDCJ1XuVE+6h9BQC0gwALAJAFAqzRqBtiqbGsTyisGzotWLDIlQ0daiMA0RClhQvf1vu/iII3TW1TcNSvsp5BRcMdxxlglQUCbQWQw1TnQeI5G+fwv7aVhaFGPT0HOV+1jhyU7ScBFgC0iwALAJAFAqzRUQCkkKSqt0qTEKts+Jm08dybcQUU8TC/JsoCqaJng5X9/DADrLKgTUFKjj3bYmX7kBsdS5VrTsP/2qRrjI5FWVCuXmRr135uxu93WfBLgAUA7SLAAgBkgQBrtOr2xFqw4ET3iU9c5+fKaXllz75RY1WfDjgINYgVUozaIAGWhlJpKlLUuB1XgFUWDhb1FMtV7sMIh3kMc1P2oQBGz1XTNJMRYAHA6BBgAQCyQIA1egqdFJakQiz1ClEDrG4PiaphhAqwFGT1o05jeFgGCbDOP/9Cv9/3+rk9FQ3LG1eAVbadRT3FclUWxA1K58N+++3r53YKgwkb/ieqq6nntA3zGOZIw/zKhtjJINeFHBBgAcDoEGABALJAgDUeamwXBUNqrKvxpYBFQdeqVdf4V8up54uGDqVoSKIa+lW03pCWWfbsq2EbJMA69tjfKtxuDR8rGpY3rgArtZ2S4yc7pqiHnnrqpahe1wmhRMeon2BFPe40FRnmMcxRWX02ejaenpE3UxFgAcDoEGABALJAgDU+cYilRr4aXgqvpE4jtE1xYKQwQNO4xNtTl4K/1LDK1NDMsrIeVvhRtp0yjHWW0X4OQmVo+g2hBqG6qqmI9m3U5Tluk94LiwALAEaHAAsAkAUCrPFatuxyH2Td5Rtju4dXokAgFaoMQxgYqVfQOHtfSbg9TZQNZ9NzfzTFysp6WOGHwhZNuei3vHOhstRUZFjHMGdlveJUHjoPZnLIQ4AFAKNDgAUAyAIB1vip0a1PCwzDKykLVYYhDDAsWEvR85nCYV/D0G8DtGzbNWRKQ6diZWWtxv4wwo86PWRGKTz+M5HOI01FhnUMcxefCxqueemlf+yWLFnsv5rZCLAAYHQIsAAAWSDAyldZqDIMFmBUDW3LPQxQrxP1PimiZ0qpER/TA/W130UULKqHXF1qPNdR1gAfBzv+M5XCK01Fcq+zw6Lz4JRT3tmr3+pxVRSUz1Rl54/OQQIsAGgPARYAIAsEWPkaV4Cl8CoV5kjOz81Rg10B1jhZOZbZsOGrPlC4yM/lo85250zhlaYiXQ2wRHVNvSVzPWf7RYAFAKNDgAUAyAIBVr7GEWApANCUoh4cl176IT+Xp/jB+OOgcqyycuVHfCP7034uH3W2O2eqt5qKdDnAmlQEWAAwOgRYAIAsEGDNPGqkayoySMNNva7U+ypFQ+/U+yrnIUjnn3+h38Z7/dz41AmCVM4q75zU2e6c6ZzQVIQAa/IQYAHA6BBgAQCyQIA186iRrqnIIA23qlBl1aor/c/k/fDnY4/9rbF+cqJUBUFVwxz1rKJBaR3hw7tjS5acvMeQsjbWO046JzQVIcCaPARYADA6BFgAgCwQYA2XhgG23ZAqG37Wb8NNgcf551/kw5fH/Vd7mgkBgJ71k8NzpaoCrFtv/ZQPAz/q5/Y0NTXLbdy43s8Npmoo5dq1n3d6oP0kUXilqchMqL9ohgALAEaHAAsAkAUCrOGxEEENqVWrVvhwYvceL/0644x/7YOxh/zcnh588K/7HuKnnksKVop67syEBuGyZZcXbvuoVQVYZT3d2nrGmIIcTSlV2zgTaX81FSHAmjwEWAAwOgRYAIAsEGANh4VXRqHSypUr3MKFb/ZfDaYswGojmNC2r1z50d5H74uGm61adVWvl9awAyIFDf02PDUsT9tYpKrHkXrKpR6Yr21qK/xQcKUAK6WthndZmKdnmW3e/Dd+brIovNJUpM1jiDwQYAHA6BBgAQCyQIDVPgVAYXgV0jOkli27pBdo9WvYAZYoaNE+bNu23dmD28tCnrboOUyamtL2poKhOsPyyvatzfCjbPhnm8FSWR1pc3+Meu995zvf9XPjo/NOUxGFl8uW/bGfG73DDjukd/6gXQRYADA6BFgAgCwQYLVLDWgFP2U0lHD16j/rNar7URZOtBVgyc5Q4vEXG4JlIU9bFF5paqosGKozLK9s39oMfMp6iS1YcKL7xCeu83ODG9V6TFn5dd0gYYqC2VWrrvFz7dC2TAoCLAAYHQIsAEAWCLDaVRYuxfr9VL+ydbQZYMVGEVIovNLUVFlgUzV8UMr2ra0AS2FEqpeYqIfQmWf+np8bXFnjXuWrqU1l5dd1g4QpbZfrMK8Po1ZWxwcpcwDAngiwAABZIMBqX1lvoJgCCwUXTaQCrLaClpS2G9NFFKxoaqIsGKozfFDK9q2tcq2qF/assUEpyFOgl6L6pnrXprLy67pBwpS2y5UACwDQDwIsAEAWCLCGQ0MJwwehl1EvLPXGqkvhhEKKWFtBS0rbjekiCq80NVH2wPI6wwelbN/aKtfUcTN6TpI+RXJQZfsiw2jcV62zywYp77bLlQALANAPAiwAQBYIsIZHPYPU+KwTYqmxpediKcSokmq4tRW0pLTdmC6i8EpTE8ce+1u953UVqTN8UMr2rY1y3bDhq36/LvJz5VavvnbgT6pUeFr2HDY9lF/PYWtTWfl13SBhStvlSoAFAOgHARYAIAsEWMOlYEUNUD0MvYqClltv/YvKECvVcGsjaCmjfamzHyn6RMOyYEUUXmmqqyysqTt8UMqCgjbKtayXWKiNYYRVQxWHEWKUlV/XDRKmtF2ubR57bVvRUOZRWb36Bv9vsUHKHACwJwIsAEAWCLBGo26AUSfESgVYw/h0ubYo/DrzzN/v9UpL2XfffX3gdHfpvsfUuFdDukiTZz1pGVpWkUEDLA0b1PDBOrTvgw4jTD0jTZqEek2UlV/XDRKm6HxZteqjfq6+xx57PNnrs80ASwGSphwNUuYAgD0RYAEAskCANTp1Qqw6oUsqwNKztDT147DDDumFJ8OicEMhR5mmjc6qYEhhWN2hcto2bWORQQMsNfI11TXoMMJU/ZCcQ85BqYw1FRn0GM4kZQEmARYAoB8EWACALBBgjVZZiFVn+FhVaNOvYTb4NMRPQ/3K1AnuYmo8aypy2GGHujvv/IKfq2eYAVbZM7qK1KkHKeqxk/pERtHwTE2TSHVBU5FBj+FMQoA13OsZAHQRARYAIAsEWKNXFGLV7RlTFrQMYlgNvltv/ZQPY8qHQNXd95hCMYVjRZoGYmXlOkj4UbaNKeoJt2HDl3v/N1W1vmEd5xwoTNFUZJBjONMQYE12PQeAcSDAAgBkgQBrPMIQS72F1OCqE1iUBS2D0PrbbvBVhSnSZN+LqMeRyiN+5k+T4YNSVq6DhB/qLadec02tWnWl62c46Dge4J4LhSmaigxyDGcaAqzhXM8AoMsIsAAAWSDAGh+FWGporl37+doBTlnQMoi2G3wKlvTQ9rKhc3pou9arB9cPQgHR+edf5BvnOz8hUaFYk+GDUlau/YYfZcusojJRvWiqLLzop1xmEoUpmor0ewxnorI6QIAFAOgHARYAIAsEWOOl8KVJT6E6vZr60WaDT/u0ZMnppeGV9NvLqIjWpaGK6tXWdPiglIVN/YYf559/odu48V4/V0zPoioLABRgKchqouwB7mec8R536aUf8nOTSWWpqUi/x3AmyiHA0qddtnVup6TWLW1ezwAABFgAgEwQYM0sarRpaltbDT4FSep5pR5YZYYVpuiZWwsXnugb0PVDQWkjwNK+KzjQJwgqxNPwwRQtU582qJ+Jhz+apg9zV5mXPcC9zcAwRzovNBVRedc5hpMghwBrFOVdFta2dT0DAOxEgAUAyAIB1syiBqOmIup5dPjhh/q5Yuq9pR5KRdpq8CkEUhhUJsehbNpmbXuRqsa4gis9d0qTep6o55SCNPUIS7Hy1rHUVETDSps8zF3L0ZSi7Wrao2sm0b5rKlJ1DCcJAdau8wsA0A4CLABAFgiwZpayh3RXPbhcjU1NRdpo8FWFNqLnXmk764Yyo9JPgBUGV5o3FhIoMFy58qN79LAKl1fVU6tJryn1vlIvrCIq982b/8bPTS7VbU1FwjKfdARY7VzPAAC7EGABALJAgDWzDNI4VWNTU5E2GnxatqYybaxnGJoEWAqrFFpp0nws3EcFSnpmmT1gXsLvix7mn+oZp0BSgV+VqiAs3odJpLqnqUgX9t8Mco1oQmWtqcgoypsACwBGhwALAJAFAqyZZZDGaVnvrTYafGrMakrREMemD1cflToBlsIqlZ8mzafE+6mfVc80hVRFwyerwqc6vbDU20tBWUq8TZNIdU9TETuGXTDINaIJlbWmIl0qbwDoAgIsAEAWCLBmFgUdCjxidYaIlTVshx1gLVhwovvEJ67zc3kqC7AUOunB7FXBlUntq0ImHSctK1Z2bOr0wqr6xEO9X8uZZKp7mop0KVApq0sEWACAfhBgAQCyQIA1s6SGzdRpMJY1bIcdYF1wwbm9KVdlAVZTCooUGDVRtf6qXljHHvtbyXBNAVzc62sSqe5pKlLn/JgUZec5ARYAoB8EWACALBBgjY8Ch6YPMyfAGo6qAKmJJUtO9oHTVX6umQULFrlt27b7uT2VhWIbNnzVl+1Ffq5Ym8MH2yynrmvjnCtSdp4TYAEA+kGABQDIAgHW+OhT++688y63cuUKd/jhh/lXyumB4PqkuSKpYWuhsoatNabVINWUgzYb21XaCGYUXCmkU9jUDw0xLHuOVaoXVtlD4EXBV7/bFGujnLCTnXNtKzvP2zyndJ3QVIQACwAmCwEWACALBFjjEz63SMGHpjJl4YHeq6lMWcPWGtNqkGrKQZuN7RQ9T2zjxq/5AGhdLyDshxrrKnuV36DmzftN99xzz/m5PSmEUhgV0vbruWgpbQ8fLKuDaMbOubaVnedtnlO6TmgqonOCAAsAJgcBFgAgCwRY4xMPB1RjdtWqFb2gooh6bOnT7IrUGSZW1rC1xrQapJpy0GZjO/Tss8/6IGhnaKVApl9qpLcVXBmVvaYUrU+T0c9qSqlTL5pQeRFgtcPOubaVnedtnlOqd5qK6NwgwAKAyUGABQDIAgHWeKSeW6RnYmlIYdEn1amxqKlIncZwWcNWPXsUnGn5mnLQZmNb1NtN5a7gahBTU7N6wVDRMRqUwjX1qEr1wlL92LDhy73/RT+rXlgpdlzbQoDVnjrnbD/KzvM2zyldJzQVIcACgMlCgAUAyAIB1nisXPkR38D7tJ/b0+rV1xaGI+GQw9jatZ+vfI5WWdhhDVs1SDXlwLZpEBoWqHJWuSkcGoSCK/V+KnoOVZvKetqJnrWlh8QriCt7ZlbbwweFAKs9BFgAgJmCAAsAkAUCrPEoC5MefPCvX+xhExq0YRoPWQzZ+9Ug1ZQD26amVK56qLkmzQ9q33337QVXbQ7Fq1L2iYSi8GP16k/6+rDZf1VMvcTa3matjwCrHTqGBFgAgJmAAAsAkAUCrNFTqKIAq0hZr5lUAKWeQRs3rvdz5VLvF2vYqkGqKQe2TXWod9Wdd/4nH1r1/zD2lHE0xquCIvW2K9tPhW4aPlgUhA5C5fyd7zzu5/KjY6/QsojOq0sv/WM/lw9tU9vHRwiwAABtI8ACAGSBAGv0yoaIqaePplhZ6FW3sVgnwBqEGrOaimifNLVN5bJq1TVOz7Yalrrl27ayIKKKylpTl6juaSoyrmM4DmX1po3z3KisNRXpUnkDQBcQYAEAskCANXpLlrwz2XsmNaxIAU3RQ99FQYWmKpMYYKlH0LHH/pafG55xNcZVR1RXmhpW76vcqe5pKjKuYzgOBFgAgLYRYAEAskCANVrqMZTqSSWpBqYaipqKrFp1pQ86qh8sPokBlixbdnly6FgVDeNS2e23375+OcUPRB9nY7yffVM5a+oa1T1NRcZ5DEet6wGWrrEXXPBHvW3QHwPmzXujP7/3898BAPSLAAsAkAUCrNEqGz64YMGJ7hOfuM7P7amsUVrnEwjLevOox87mzX/j5wajxqymIgpUNA1DWe+0ItpffZKfgisrt7JnTqkhPM7G+CmnvNM999xz/qt6Uh8CMOlU9zQVGecxHLWya0UXAqyic1lBlrZJ11g75wEA9RFgAQCyQIA1WgqRFCYVKfvUOA2T03C5InUapUWNOqOGXRuNTTVmNRVReKVpWObN+83KkEeNV4VWCxe+2X+1u1GUT79UpprqUDC3atVVfq57VEaaioz7GI5S1wOsskB7nNsFADMZARYAIAsEWKOj4EoBVoqeWzQ1NeXndlf2Pg2BS31qYWgUAY0as5qKKLzSNCypoXYqH4VWCnbKeiWNonz6peBSx3/btu3+q3KpOtQFqnuaioz7GI5SvwGWevs1qTsqa01Fxlne2iZNRXQN0gQAaIYACwCQBQKs0Vm58iO+UfdpP7cnBS2pIEqNMU1FzjjjPe7SSz/k58qNIqDRNmoqokajpmEJe11MTc16sbdV3eFCoyifQWjftI9ltM+pIahdoLqnqUgOx3BU+gmwFJKfeebv9+qQnqlXh8paU5FxlnfZdbaslysAII0ACwCQBQKs0Vmw4KReL4ciZQ2rsgbp6tXXFg6Ji40ioFFjVlMRhVeahkkNVz3rpk55xEZRPv1au3adrx/FD5iP1a0Pk0h1T1ORcR/DUSq7XhQFWBZeqaefKPitE2KprDUVGWd5l+1/6lNeAQDlCLCAAc39RTf3RxKNQQD1EGCNhhqJGgaWkhr6pUalnn+VUveB3Wpoaiqi4XVtPDdJy9dUROGVplzlGmCp3oThQhXVhVtv/YvaPc8mieqepiLjPIajVhbgxAGW6tXChW/r/R9SiLVs2SW9+pSistZUZJzlretlvD+mzgdeAAD2RIAFRObPfr3bb++9fTA1yx3pG3Gv2Ptl/tWddn69t5+rtmN62j0ahFo7pn/W+/qRbdvds/57m7Z+z78KwBBgjUbqGU1SNnywrPdN2ftiamhqKqJgSdOgtHxNRbR8TbnKMcBSI3zJktOTvfZSFDp0McRS3dNUZFzHcBzqBliqXwpHFZIWUf1RPVJ9KqKy1lRkXOWtc0U9XVPC/QcA1EeAhc5SUKXpoAMO8NMrG4VTbbGQKwy1NAFdRIA1fGooFvVyMGXDB88//0K3ceO9fm5PTXpOqaGpqYiCJU2D0vI1FdHyNeUqxwCrznOvUhQ6KHxQCNEVqnuaiozrGI5DnQBL16Ky8EoUkGvInepSEZW1piLjKu+y81jPxtu4cb2fAwA0RYCFzlBYtWua7V/J16atW/20M8zSBHQBAdbw3Xrrp3zQ9FE/Vyw1rEWNTA2HSWnyvKOyHmBlAVoTasxqKqLwSlOuyhq+42iMq9edet8NQsFDl0Is1T1NRcZxDMelToCluq46n1IVXonKWlORcZW3tkdTET2gvssfcgAAgyDAwsTSs6mOm/1/9sKqk46a61+ZmdRLSyGWQq0Htv4Xx7O2MKkIsIZPQ1o0tKVIWa+AsuBr3333dZs3/42fq6esUauGahsPNlbDUVMRhVeacqXGvBr1RUbdGG8jvDJ6rtratZ8rDSImheqepiKjPobjVHauK8Cqql+6tuiaUBV8qqw1FRlXees5g6leZW0F9QDQRQRYmCgaDni6v1k53TeAND+Jnnr6aXfjffe79Q8/2psHJgUB1nCVBSNS1qgqa4w1GT4oZY1aNVYJsNLHaZSN8apwwSj4VI+S2277tP+qnIII9cSa9BBLdU9TkVEew3ErO9f1cPaq+pXqERpTWWsqMo7y1h8J9MeClLr7BQDYEwEWZjw9t2rRUUf2Qiv1tuoS9cr63IObe2GWemoBMxkB1nCVDd2T1KcPlgUqoo+5V2O0rsMOe4P/t1jdTzKsosaspiIKrzTlqqy8R9UYV7CgAKtK2EOmqn4Z/eykh1iqe5qKjOoY5qAswKrS5LqistZUZBzlrW3RVETnTJMeqwCA3RFgYcZadNTc3tBABVdwvSDr7ocf8WHWI/4rYOYhwBqeqh4B6kGTeiaLwhSFKilNQ6eyAEvDitqgxqOmIgqvNOVKZa0yLzKKxrjKTVMd4bPP9Jw0bfd3vvO4/6qcgtLVq/+sF2ZNIpWfpiKjOIa56DfAKusNWkRlranIqMtb50HZB2WUXWsBANUIsDDjaIjgxYveOrFDBAelYYUfW3+PD7Sa3zQC40SANTxq3GlKCYOIUFXw1XT4YFk4o6FoqWdwNaV91VRE4ZWmXJWV0TAb42pwr1p1jVPvqzpUhppCWoaGm27btt1/VU6h58qVKwrr3UynuqepyDCPYW76CbCaXlNEZa2piMLSUT17TfW/6hxqGs4BAHZHgIUZQcME3+lv+s454XiCq5oUZOlZWZ/3N48ML8RMQIA1HGpUlfUIKAuOqoaFafhYk2dWrVz5Ef+eT/u5PbXZM0GNWU1FFLpoytU4AizVjTPP/P3kc85iZSGDlqHtf+655/xX1XQsNE2SsvNmWMcwR00DrDPOeI+79NIP+blmdK5rStFQxGXLLhlaiKXzZ+PGr/W2QaF/ioYPaqj2sLYDALqAAAtZU3D13hN+20/H9+bRnMKrm3yQddN9f9WbB3JFgDUcZZ8gKAoPNMXUECvrfVUWfKVoeVpuEW2DpjaoIampiNahKVejDrAUOCm8UiO8jrLwymzY8FVfxhf5uXqGHTCMmnqhqVyLDOMY5qpJgNXkmVcxneuayqhuqe4qcD/ssEP89WvKv9qc7Y96GX7nO9/pfZ061rF+AzoAwC4EWMiSwqpxBlebtn7PPTs97R7xNyjqyaQp9Kh/3cKgW85e6v917qyb1/h/d277kb5hF1KvMU1z/ev7+e/Pn/16/+poaXsJspAzAqzhKAuNRD0CihpzClEUpqQ0HQqjBqamlNQwxn5oPZqKKLzSlCuVucq+SNvhh8pIU10KAKrCK6NhVHUeBG/0PKxcHu6uQEI9BRXS6tzY+f9r/LTneRKrCozb7GmYO5Wj6nJZbzz1Srr00j/2dau/8EpUhzU1pbp22GGH+rlyOifbkLrWAgDqI8BCdvSMqxVLTukFQcOmIEqf5KfASqGOvtb/TTz+i5v5Q5dd7v+tT/unoEv/K9DSJyjq62HT/i1feyfPyEJ2CLDaVxUipAKRqh40anSqMaYGoLEGpHo4iJYt6tmjMMC+n1L1APdTTvnd3vr222/fXqNTDUEFC+pNoddF69q8+Ztu5cqPJkM7hVeacqXGshr9RVSmRcerKZXNsmXLe+uqS2WuIaNW1nWUDaUromUrxFKYNU6qR8ce+1t+bk/aRpWF1UP7Wg+vV3nq3CmjuqepK1SWqs8qn9i+++76FMtBqNy1jpw1CX8BAGkEWMjGXN8YWeF/wSvIGRYFVTunrX2FVTEFT3dccJ6fc27hNR93j/hGwSAUZinEUhlo2ZqGRWWw3DcsBt1moC0EWO2r6n1V1OtJDc6yZ2aJGuCaQk2GC8XqNO6ahiEpRfuck7LGeBsBloWJZcc3pvWq3BTWNNX0uGkdOTzcfd683yztOdQvBTYW8naF6poC8fD6oNBPwwYHDa9Ey08FjjnQvuq4q24DAAZDgIWxU2jzwUVv6T2gvW0aBnj3w4+49X7S/23TpyFe7LddPrb+K366x8+166Sj5rpFftL/Gn7YNm0zwwqRAwKsdlX1vlLvpaJnWJU9aF3UayLufSVV7yuj5alHVZmqoVl11VnXOA0zwFKYecop72wUzNQJF6s0CbFUv9TYbyPYGMQggWyZBx/86z3Ona6wejCMQMeWnZth7CsAdBkBFsZKocyKJYt7z4dqkwKrz/lGwDBCq9CGSz7Q6zkm6smkXljDpPI63f/lVoFWm/SMr+W+sTvs8gLKEGC1q6r3lXo/FD13pqohqJ5XmmJVgVmKlqWpip6no4djD0LhyObNf+Pn8jXMAEuaHKdUHelHVb0yauzn0ENJvdQ0tamN4zfTqf7pOWBtBzq61jUNZ4dNfyRQz8Vxh7EAMEkIsDAW6nV17bvf1Qtk2qKhgQqtFF6NojeR9sGef2X0HKxRrVshlsKsNocZKsC66DOfHck+ADECrHapoahnQRU16KqCnFTYoPepB1NR41MNSIVmTaghq5CkaHlFDjvsDf7f/mldbQUywzLsAEvOP/9Cfxzv9XPFdJw/8Ylr/fraDZIUCGlKyen46FlWGvbWFpVp6txBOxRyq5fmMHrONaFeV6rHTT7kAgBQDwEWRk6By3U+vGqr15VCKw3fUy+iUVJ4pP0IXejDH23PKKkHmD6xUdvTBpXj0ptv6fUoA0aJAKt9atCpt038AGX1eNJURgGY3huq+uTBJs8N6mdo2iDDurS/mnI3igBLzwxSb7Zt27b7r3anxreCpGH1GimqV9JPfRimfgLZMrn0LOsCXfcU0OpcUh3XNCw6JxVO6nzRuaOvCSkBYHgIsDBSel6UnhvVBgVF4wiujMKrODTSNinEGgcFgirfeJv6dcXaO3vPxgJGhQBrOBRWKDBQg07U2KrbE0Rhg/XiUuPszju/4F9NqxMwqYGnIKmfxnw/z8FSMHLGGb/Xa2DOBGp0DzvAkqL16LhoGjbVK9VJo554n/jEdX4uLwsWLBo4/FD9U5nm/Ny1LlAgGR5LzWuqomGAmkK6Fta5fgIA2keAhZHQkLc1Z5/l9Ol6g9BD2RUS3eiDlXEFV0bDB7VfIQ290zDCcbIgS8MzB33oO0MKMUoEWMNl4Y8a1E16uqg3g4IO9SCpCoHCRmIYZCk0O/zwQ3/xf/ky6lIwZz3LtE5NRkGPzMSGZlGwZLRfbQVYouF8mlROw+x1VUQhlsJRhQOqW7kfJ50HCnLF6nZY3/W/9kUsnNW5RnAFAEB7CLAwdBoyuObspXuEPU0puNKDxnMIUzRsTw9wL6IHuecw/E7lrQfkD9ojS+W99OY1vWeMAcNEgDV8aoTvt9++jRvVCotyDxgmhcragrlYmwGgUZCk5/WMQ7/1EQAAdBMBFoZK4YmG2g3iUf9XTQ1nyylAOeeE43vhUBGFbDfed7+fy4MCxOve/S/dQQe80n/VPw2NVIgIDAsBFgAAAIAUAiwMjYIrBVj90nBBDRX82Pp7/Fd5ueOC83rBUBEFbaeuvt7P5UXPHjvnhN8eaFihgjkFdMAwEGABAAAASCHAwlAMGl6tf/gRd4UPSsb9nKsiGpqn51+V0XOwNPQuN3o+1pVLFrtFR831X/VHvbDUGwtoGwEWAAAAgBQCLLRK4c61PrzSA8T7oV5XCkf08PBcad/0TK8yemZU7vugkLHf3lgKsdQTK8eQDjMXARYAAACAFAIstEbh1e0XnNt7wHk/9Kyrs3zwk2Ovq5CCn6reZQp4FMTlTL2xbvFB3JG/+NSkpvSg+tNW30CIhdYQYAEAAABIIcBCKwYNr2667/7ekMGZYPPyy3rhTxmFcPNWXO3n8qchhe894Xg/1xwhFtpEgAUAAAAghQALAxskvJoJQwZD2scNl3zAz1VbeM3HewHPTDDIkELtIyEW2kCABQAAACCFAAsDGSS8milDBkPnnHC8W7FksZ+rpmdE6VP7ZgodQ4VY/QwpJMRCGwiwAAAAAKQQYKFvg4RX+pRB9byaaYGHnhlV9xP8tI8K6GYSHVM9oH7+7Nf7r5ohxMKgCLAAAAAApBBgoW8KOjT0rKmZ8IDzlKYN7AMv+qD/d+ZRT6yqB9UXmcnHFuPX9PwCAAAA0B0EWOhLFwMOhXUK7ZpYevOaGfN8r1gXjzHGiwALAAAAQAoBFhrrN9iYac+EivXzaX0z6dMVi1y86K1+eoufa2am7zfGgwALAAAAQAoBFhpRcKUAqyn1yFHPnJls8/LL3EEHHODn6tMD6uetuNrPzVxdPuYYLQIsAAAAACkEWKhND/a+44Lz/FwzkxBkKLhSgNUPBVgKsmayfkOshdd8vPdwd6AOAiwAAAAAKQRYqEWfTvegD3D0fxOTEF7JOScc71YsWeznmpuUMugnxFJwpxCLTyZEHQRYAAAAAFIIsFDLHRec6+bPnu3n6pvpz7wK3XL2UrfoqOafuCjrH37EnXXzGj838/XzTCw9xF4PsweqEGABAAAASCHAQqV+Qgv1OFLPo0nx+KqrGvc+M+p9dOiyy/3cZFAvLPXGamKSwkwMDwEWAAAAgBQCLJTq57lXkxZe9VMGsVNXX+82bf2en5sM/YRYGkrI87BQhgALAAAAQAoBFpLU42jDJR/oPcC8rkkaLmeuXLLYvfeE4/1c/2667353xdp1fm5yKNRTuFcXz8NCFQIsAAAAACkEWEhac/ZSd1KD5z49um17r6fRpAUUCvHmTk35uf6p55HCm0migFMh1pFTs/xX9fA8LJQhwAIAAACQQoCFQgquFGDV9awPrRb4gEa9bCaJep9tXn6ZnxvcvBVXT1z5KNjTA/7382FWXQqwFGQBMQIsAAAAACkEWNiDetao15HCm7omNZTQc570vKc26Llgej7YpGlaRgrx1Btt0nrqYXAEWAAAAABSCLCwh6bPfJrE5zsZBTMKaNqg8Eoh1iRqWmc+tv4rfrrHzwG7EGABAAAASCHAwm40JEy9r+rSc68WXDO5jc7HV13V65HWBvU4OnTZ5X5uMm285IONnoc1iUMqMRgCLAAAAAApBFjYjZ5nNH/2bD9XbVKfe2Wahnl1aOicHug+iTTkdKMvr7rPw9q0das7dfUNfg7YiQALAAAAQAoBFl6koXIaMlfXpD73yly86K1+eoufa8+kD51r+vB/DanU0EpACLAAAAAApBBgoUfD5B5cflnv/zrW++DqLB9gTTL1vlIvrDap95V6YU2yW3yAtcgHWXXsmJ52x664uvc/QIAFAAAAIIUACz1NehtN+tBBUZCn518Ng56DNcmBTdOhhJPeKw31EWABAAAASCHAQi+sadL7qguBQ9PhlE10Ydhck0BUYR69sCAEWAAAAABSCLDgg4b6YcOkf+qgUXilEGsYFF4pxJp0m5df7g464JV+rloXQlFUI8ACAAAAkEKA1XHqddWk99Wpq693m7Z+z89Nts2+TDQUbhg09HLeiqv93GSbP/v17o4LzvNz1dT7il5YIMACAAAAkEKA1XHnnHC8W7FksZ+r1pWeQ3pwux7gPkx6kLse6D7pmvRkU91SHUN3EWABAAAASCHA6ri6PY304Hb1GupCD5kmoV6/lq9d5268734/N9nUs091rM4D3bvSMw1pBFgAAAAAUgiwOkw9Y9RDpo6bfNhyhQ9dukDD3jT8bZg0DFPDMbtAdUx1rQ56YXUbARYAAACAFAKsDlPPmDq9r0Q9Y9RDZtKpx9Djq67yc8N36LLLO9GjTXVMda0O1THVNXQTARYAAACAFAKsjjrpqLluzdlL/Vw19YhRz5guaFIug1p68xp398OP+LnJ16QXVpfKBbsjwAIAAACQQoDVUU0CBfWIUc+YLmhSLoPq0rDMJr2wuhSYYncEWAAAAABSCLA6qMkwua6FCQpZFLaMgkJBhYNd0SQc7MrwSuyOAAsAAABACgFWBylEUJhQhwIWBS1doOBKAdYodal8505NuQ2XfMDPVVNoqvAU3UKABQAAACCFAKuD7rjgXDd/9mw/V65Ln5Qn55xwvFuxZLGfG53la9e5G++73891Q91PeNy0dauvezf4OXQJARYAAACAFAKsjmnSy6hrvWBuOXupW3TUXD83OusffsSddfMaP9cN9P5DGQIsAAAAACkEWB1z8aK3+uktfq5a155DNK7G84EXfdD/2w1Nnr/Wtd5pGN85OMmef/55t88++/g555566il3++dv93POXfTBi/y/O4U/Y/Taf7j1P7hDDjnEveHoN7hX/fKr/Kvt+8l//4n70pe+5J54/An3G8f9hnv7v3i7f3Vw2n6J90v0vW9t+Zb77ne/68448wz/StqX/tOXevuuMihaFmaWJ777hPvBUz9wz08/797+z9upazPBdx//rrv3q/e6o3/16D3qsur4T57+Se9c1zk4abTvN37yRveGX32De/vb3947n6t84fNfcE//5OleeQ1SJl/6z19yr33ta3vLGZcHNj3gvvHAN/zc7tf9UdD13a617zv3ff6Vclv+bovbsmWLO/roo8daZm267dbb/L+uVw/evODNfq6c6uvXv/51d9BrD3K/ftyv73auDkLL1e90levb/vnbWlvuTKb6GV8P2jxfBjn/r/3Ta/2/zk0dNOV+952/6+cQIsDqGPW+Ui+sKup5pR5YXXHSUXPdmrOX+rnRW3rzGnf3w4/4uW6o29NNva/UCwvdQYDVHjUEvvj5L7o5h8xxZ5y1M6TRDey1H995U3T9n1/v/90Z5iy/bHnvJutfnfmvXryZ0/v//IY/93Ou9/px84/zc8Nx+aWX9xqLuqFecfWK3v+D0H6qwXrAqw5w73v/+17cJ6PG6b0b7/VzrteoSt1c6ub2isuu8HPOnbjgxMY3keGN8DAMenM9LKpTqmcKRN7xznf4V4qpfJ721/l+HODvY8rqpI7dD37wg52TD6w0/eQnP/Hf2SWs19ZYaGImNSxuu+U29/UHvu7nnLvy6itfPCd0rC7+o4v9nC9Tf75ctbLeH5hmEh1bBSh7+z+gXbnyylrXF5WJykZh3/vPe79/pbkrLr2iV+e0vqLrmv6g8LPpn/m5wczx1/gyCijVkBa77o9KeK0Nz7eUlVet7J2rbdTFP/vTP+sF1sOkELzqjy7nve88/6/rBaH2u7hM6lwdlJVtk/NgUPpd/MQT7R6DOXPmuEMOPcTPFdN5W+f3j1hZh7/f2zpfqs7/KlZv5vjz+48++Ed+DiECrA5p8hDtroUqVy5Z7N57wvF+bvRuuu9+d8XadX6uG5qEhQuv+bh7ZNs2P4cuIMBqj24cdRMndhMcvqYbM7vR002tAqxLr7jUf2ensOFh7x8WBRn6y7DohrPOX6nLhMvTTeOFH7jQHXTQQf6rndRwXHXVKj/nShuoX9341V4IKMsuX7bbMuoIb4SHQccwR2HD8bUHvdZd9IGLeschFv5cU3NKbuotEC2j+v4b83/jxbpmjYUmyrZhkH1rok4d0HmuQEbibQ7PlbARNynCa17dAKGt8D48/xWSKywPtVVHqupAuB1VP9s2Bcn2R4BXvepVveAkJTxWbfweaKt8y1QFWOE+6firHpQJz1Vdo8LfyYMIz/O650EbwrrXlqoyD4972e8flbX+eKf/w2tfuM2DnC/hcnTcdfybsN9J8TUbOxFgdUjdh5Q/Oz3tDll2uZ/rDgV7CvjGQQGNgpou+e6qq9x+/q9AVRhG2C0EWO2yhrzdsIY307oxC29q44DG/lrbz1/Cwxu3YUvd3KkRqr+uTvvfZ7p5jUMsKxtRWRSxv6Cq4aXyS5l67VRvHbGwHLSdbdD2VG33uCkgVABg25lqRCgkVR3rh5ZpDY5YWO4hrf+c959T+Nd7ayzoXNHxLqPePGog6ZgW1T0JG1HDVKcOhEFsHMjYeS7xNWASWO+rOlRHVTd03VCvjLrsfUVWXunL9wc7yzf+ubbqSFUdCM+Hqp8dhk9e/8neMEIpq2Nhuauxr/O1Dp2HRax89f3Uedovu15UhSlW9ur19Kc17m/KztVB2O8y0bVzn7338XODq+oFbPvfpqoyr/v7J3X/E27zoOdL2flvrJ42VVUOk44Aq0PqfgJc14YPakilhlaOk4bKachcV+hB7nqge5WuPeS+6wiw2qUbNN2IqaGvvwDGAZboZyS8UdZfJO2vwGrQl4U3RcIbwGEra5woxNKNrMQ/p/DEepgV3ViGZVWl6P0SloOV96CGscxhUB1SeGA376lGxDCo14eeo6MeDFqvAho7lqkyswaptrHoWIbsGMR1KqRG1PTz9Z4hqjKyRqt6nmi766raVrHGa9yIVjlZ7xjptzFUNaRnXJqcw6JjL03eI3pfav/Da5CGNIUN/qo6ojqhuqH6oHqRklq3sfoqqfrar1R4HwrLINXo1vXCfuc0lTqnLRgoO0/7ZdeLov3RcbVnTeq806Qy0nGMhfVB7FyVj/3Zx3rvG1R4/NuWKnsTrrvqZ6uUlXlM9anq908YrOrcNCp/TRK+HtKzycJ7ppSw7mtZ8fEWq6dN1SmHSUaA1SF1G4ddGz6oIEWByjgpMFRw2BV1hxHqQwT0YQLohrrXKJRTKKVnC6lxtPc+u3o66qbs65u+7uf8zU/ixkc3RWHDTzddcw4t/gu3FD2LKLxp1U3jMFjjrqpxorJQUKUbR91IVt0o2vLChkQV7WNRIzIsh0Fv3s0wljksYSOinyC0LWF9TpWZNY5SxzJkx8DqyqDC7auz/ibCZYfDZCQMcQeha0bqejIuqns2PEjBndU9XQNEvezUwyWkRq6GFuu8t/fofx1ru26oZ5BeC+l9YcM4pt6euharjJoMi7OG7aD1zOrrMBTVVzuX6rDzUcdFjf1+2DJibZVfEdvHorofnnNVwm0P36f6qSHOVarCY4Vp1338ut55oABNf8hqU7zvsbDuhfvaj7IyL6J9Tv3+Ccu6H3W3QarOfx0jfT9m26fjVhRgq44M89EOuSPA6gj1vFIPrDq69Kl4Uveh4sPUxZ5GdcMKDa/UMEtMvrp1AuXsxr0fuskMbzqrFDUOwvdrecNg+1i0/phuZNXAtPeU0fIU2tn2q5EbB3R1DaMchrHMYVLZK2wMGw+jFjZWUmVmjaOiBnnMjoHqSlXdqyPcvjrrbyIclhUOk9FxsbBmUE0ac6MSDo0Mty8M7dQoDBuUdlwlfI8amCorUQCgEKsJvV+NTV2DmrDr1aD1LNyvthXVVzuX6tD5GA6bi4OGQVj5KWAMg9s2aNkS1hMTns86djGFFQpVRPsvOh/1HquzdRWt36jeWXgl4fk/KmHds33tl9Wrsn2Oad9Vt+I6pWBLQ4sVRqt+hHRNtOGHRcdPVE/r3hfoOPRz/tv+ahsGOf8nFQFWR1y86K1+eoufK7dp6/fcqasHu8jMNI+vusq9wl/ExqmLPY0UqCpYrfKx9V/x0z1+DpOOAKsdaqTFN8LhTZnopqiIbpR0c64b/6Kbu/DmW38ZVO+suHHQ5k1rim2j9kPbXIduJLX9uqHVPugmVFNIz8zSczF049tk2UWGUQ7DWOakCxuUqTKzxkJRgzxmx2DQ+mHC7auz/rpU3y14kXDZtg8SNgitHMLXZprbbvWh3S96msbP8NN5rd6VOs/VoFx22bIXezFYkKLrWvzw7DAIVIClIGvY+rnGFQmPtepAm/T7QeUYUn0WXWNVnpJarxr2q65e1Tsu+n2jh7zHyyuin6/6OSu/YSo6T7T/dj4XXW+Kvq/f2Rasqs6qXFL0O0xlK0XrF5WPzn393pfUzw1bWPdsX/vV1rVJvbL1O16KltXmNg/C9nfQ839SEWB1BGFBMZWJyiYHCg4VIHYFoSpiBFjDoYZs+JdYsRszvRY2BMLn4sRDjiS8+VajxBrEId0gWmNPN166Od/21Db/1eDs2RNapkI6NaDibdT6NYRSN6dFrGGj78c3ryoPNVb1bAw1VMOyKaIhlNYAjoU3wurV1QY1SDSJHcOZRsfnGw98w88N7rR3nrZHrwId25DqieqLqD6G7PhZY0HDdsoaj/LE40/0/nrfVsOizjnVj7AXktiydT1Q41bi0MDKoejcmAnC65f2TUOH4/oRnpfqhaXjqGcWKYzXkCwNu47fo+uCgi9RuYQ9t4bFrlPavkHqWbi/o7xmhPU6tV7rCSM6FmXlquV9/etfd9/6u2/1fg/E1/2Yld8wFZ0n2s6y/Y6/r6GTGkIpqrPh+VgkfH/R+lVX9X079xXIqmz1Whu0zXW1Wffaujbpd4HCwlRZt7nNVVT/U+y80PbpGBaZOmiq8jyYVARYHVG3YaigQIFBV1y5ZLF77wnH+7nxu+m++90Va9f5uW6o+xws6dqw1q6qe51CfWqsWnilGzb1PBDdmFlPhXBogfVCkPB1E948F32/SJsNiaqb17AxoHDrfe9/Xy+gCNn2lC1L+ym2ryllywhvhIdBx3AmarNcLJQJWUOnDjt+Td5jBg0WjOqa1bOi/elHeB4bW7YaTdY4sv03Vg7x6zOJrnm6BqhhV9RTStdChdTaPzXyb//C7b3XRA39VIiia4sakvH1JKQATSFLTMGYyj6mbf3Z9M/cy/Z+2R7XUrtODVrPwvNtlNeMsF6n1mvbpp6w8TAv0f6r3DVZcC9q1Osh52Wall+4vXau9CNcTtF+h9/XPtiz2kR/NCmqs6Hw/UXnqZWpqL4qxFU9t/cMqmifUsJtafK+Im1em7Rd6ummP4bF9L1+t7np+W/71K+6dXsSEWB1QJNeRl0LCjZc8gE3d2rKz42fnvOk5z11hYZtavhmHV0LVruKAKtdutG98ZM39m6OdSOrmz417EQ3ZvaXSAU9umFXo0C9DNRQ0LxurmP93NxpPbqBbiocKmGqbl61r2q4Ww8w7ceFH7hwt8ah7WPVslR+VTf9ZcsIy0o3mlXC/dXxUk+QMjP1xlU9sOz4GNUPhasKWVUfjRqgosZGUc8oBQ7hsZUmjQI7fmrsNqXtVEgyqLCe6Twsaug0oXMgbBQbLVv1S+eHqKzjHghWdlYuk0pl88Uv+OuED/BDKgv1PD3xzSf25psKj2UoVZ6qd6rjuj7E53PZ95oIr0N1r9ltqLtelZnOJbv+aZ91PbCQNaQ6q4BHgVfVedK0/LQddux0rlQtPyVcTtF+h9/XMxZtOJv2qSjEi4XvT9UrBdiq2wqvVI8VANrvfl0z9fslpHKPXwvpeq1JivYppW4dqKONa5MCJvXOLvPAA/73ky87qao31oPXhMcmlNpm/XxTunexOqNjmQrcJx0BVgfUHar16LbtbsE13WlANglQRkXPwdLzsLpi4yUfdEdOzfJz5bo2tLWrCLDaocbZl//zl3s3saKb/ksvv7R342M3V3YzaTf5arQdffTRL35finpY2c9rmeFH8rdNN8tqaGtfROvTDWDdm7Xwxlk38OGzbureCGvdakiFFLLo5lHfk7K/mIfbYOVdRjezVv5ly82ZepRoOFYRNaZSrF7Fjc26x6qMBZZS5ziMWnjcB2k4GzVU1WAVNUrVOBXVqbDuFq3LyltDKY877jg/lxY33mYKhfY6L60cVOcUHuh6o/NbdM3QNbFpkKX6r+UYXT+0zFT9TdV7KfteE02vQ20J11u076o/YQ8Yq3tFdP1XY13XxLrHo2n5tXUehsspKu/4+wr0VSfj566lhO9P1atYeCzCfdM5YEGuQkQFavHvfAnfr22uq9/3FbH6UbbPOv/Kfv+E29OGeFu0/ibnf0jH4t6v3rvbNUfH+oknntjtXLEetPqjTvh8v64hwOqA6979Lnf6sfP8XLmuDWFTmahscnLhZz7rPvfgZj/XDXWHcHatbnYVAVY7NDxGAZDoJkcNV92U6mbIbnztZlKvKehSTxLd2Nn7RI26+C/CF//Rxb0brbqNgqa0PWpkW+AgWtcZZ57RuLGshoGWFe+H3QgXqbrRtGGXUvWz4c2ylXcZ3fzas4mqlp0rHT+rY7GyMrBjomMd1it7vd/yCMtU+l3OMIVlFjYu+xEuS+GVGv32tZat81tTqhysvOtILSNX2m+dk3ZtUSii64JCEdF1TUGCrodqdIoakv0EWcZClFRZ2ffjei9l32tC+9zkOtSWcL1F4v0K655+b+m5gTpW/ZZB0/ILzx2dK/2eh+Fyisq76vui65Z+ZxcJ35+qV7HwWITrVJ1X4K1yEtXxuMeyqBe1zg0J318lXG+dY1BGx1PK9jksm5i2O9yeNpRti2ibVbZVPyf2zMIwSLTttTqsP0zoeMkgdXQSEGB1gIYPahhhlaU3r3F3P/yIn+sGhVcKsQa1/hdltuiouf7fwSi8UojVFSp/HYcqGj6oYYSYbARY7dBNqW6GNORK4ZVuSkXd59WIk/hmSu9ROBXS+8JhhHq/PSC5zg1ZE7ph119O9ZdFowam1lG311UR3fBZA9WEDaVY2X6FN/FvOPoN7v3nvd/PpdnNp+jmuQ7bNjWaFSrONDqO4V+g1QC1T78sKwPb77hc7fWy41ImPGZGjQP7a7Yo6KwaVpIS/mW8X2Gja9BGiYXXOnfiXpdathpHqpOpumXlXUe/x2TUVB46F1UWRqG2wj1d42K6zqmM9L6QriOaVEeL3lekqgFr37cGasi+p2OWOl56XxXtu/anTVpvvL0xW6/qovbBqJGugDBehtW9sKwUJup6ovIOfxeJjlPZHzWs/LQehWHalrZp2eE+SHg+F13zyr6v66f+6KIyiq9TJnx/WFZlwutgvE6xchaVddhjWawspej9KVYH2lS2zyo/2w/ROR/+/lGd0WsxvUc9VXU8tXyx1+wPAUV0jxWWU8zKTctMbbPR7yEde9ExUJCoDyxQ+Wm7VM/sZ+zrLiPA6gANk9NwuSoKCBQUdEXdckl51v8CVq8ghU5yzgnH94Zq7jfAMjV8UMMIu0LBqgLWKl0rl64iwGqPbtTCGyu78dGN/DnnntO7QQop6LG/7OnmSDddEt5E2zJEwZgac20Il2sU4OimL97OQYVBnW5KdXMqVQ2CsHzUO0DhQNW2hTfvdW82dcMravClGq2hqddOVW7HOIVloAZEkfCYxOVf1KhtIhw+aFReahzoL9yiMrf63pTOlbrHNiVskCpkGiTA0nmvkNnO26bLHrS8c6Fy0HAchVCqX0bnrnpzVpWDqOxUd4vqhq59mqrCLKtbqfK07xfVI/temdQ5FQrPwbYUbW/sk9d/svdprvHP2n7FrxfVPR0Dq78KsKys7XdGWZ0O16Pfe22XgWjZ4T5IuM1V4uOnuqprlgI+7euKq1f0/g+Fy9fvsDp/4LGykHidRmWqMtLvHdXtUJ33FxlG3QvrR5Vw/WXbrTLX74lw2bbPRce4LltGuNyQjreOpXp46nqtY6B6LXqEg0I0vT/cBoV0Yr+/uooAqwPqNgq79AB3PbhdD3Dvl4I+9ZR6Kvqr7UH+r7HqUaRgpl96kLse6N4FChAVJNbRpfrZVXWvVWjOnpugBlfYwyWkmz09wPSqlVe5yy+9vPeXS/2FUQ96FmuQyJVXX7lbQDYIrdduMuf4GzU1MNtadiy8+Q/3oajxFLJtVG8CPUujzs2jvWeYyhpwOQjLINWACG/a4wZZ1XEpoxv9cPigKLDUX9XVKLTGoXonqMdDzB4qLXpf0UP16waNZcI62cbxVNhqDdCmyx6kvHOgYx735JQ5/rqieqUG4zce+IZ/pR59TL2eDaggTFOR8DoSq2rA2vfn+O2zBqqx75VJnVMh1YGq5dSl3w/6vVC0vTHb/vhnU68X1T0dLwu3rf7qeqLriiiQ1O+rIhZKaD36naL5MjrXFRiIrkM656vomhD/LlB52zlXpej4hddD/SEnvr6Ey7cyCen9cY9SDXvX/ut6p2U2Vfb+1CfsiY6TjpcU7WsTRfWjSp31h3Us/MNcqp42YctIbbOu1faHMX1fP6fjJwq07P2DbMOkIsCacApS6vRwkS4FBHUfbB9Trys9UPzG++73X6UN0htLy+/SA8vrhhZd6yHYRXXrAsrZTU8TdiOsmzndpOomym6i1ZtDN3V2k6cb+7oPnK0jvMnUDZxu5NqiBm3YwAhv/sMb2vDm+A2/+obeR9uH1HDTTbzEN5KpXlDhfg2LHbdchWUQlncoDEbj/QmPS9N6oWDKhs0YLd+Ov+bDdcXCulL1s4MY5nqaLnuQ8s6F1SeFzbpuaV8sYArrYx1hw1HXRoVYug4o7BANRdRztFLsWqxtKCpP+364HlP2vXFpsk36faEyi/c9tYxU3fugb5uoR5LKWuVuYbPer8Ch6NortjwFLnEIVKTpuZISLyemfbCgLHVNtD8gad8saDfx8uPttPIdlfh4hcLzLbWvddnxLFtfrM76w59Rrye7X7ByVD0L62kTtoyybQ7vtfThGQpbjR4Fofquul92nekiAqwJxzOGiqn3lXphNaEyCntdvcb/Qn3Fz19wB/r/5Uf+ZmnHS/dyP/T/S7+9sbSeLh0LBax1yqhrz2jrIgKsdthNUxNFN8J2E61eWGoE2E23/jqt3gwp/ax/EKkbU9ENoCiE041p+KyP8H3hzbF6bzTZ/qKyk/DGWD9Th/7KbTezKnP1/iijHkBh4yY3YRmE5W3UwFVD18Q/Ex6XsAGg90lq3xVcWu8r3fwreBAtX8+JUp0Ol1ekqqHYlmGup+myU+U9k6huKLjU+RPXDzUWrS7UofOrKPxQ/dI6dC2M1xGya2GqPO37RY3ksu+NS5NtStWl1DJSP2+BpFEwqd8/4c/ENIRUQ2klXl5K03MlJVyOrjexqu+L6qn9HlAd0/6a8P1F26ngXqFHSOUt6rGma19T9n6Vvc6JkK6v6i1UpOr630SqfpSpWr+uFcsvW977X2UT9uZL1dMmbBlV22zHW+WrxxNY4N7PPncFAdaEq9vTSA8iP8sHBF3QZNiaWb52Xa/X1d7/83+6Rdu2u9c9949u/5//3H9nT8+89KXu+/v+kls/NctN/7N/5su/3jEI6XlPeu5TF9xy9lJX5wH4XeuZ1kUEWO1Q40rDn0SBjd3866/VukEyumFSYKIbN900xQ0xu6mKlQ2ZEbtpG5WiG1MJGzHad/XGsBvaOdFNaXijOIwAK7WNRSw4LBvuOVNUlYGGT2gYhaghFP+VOTwu4Q283qP36pjq2MYUXKoRp7qtv2hbg0/boMZKXNeLVDUU2zLM9TRddqq8J5WulVu/u7XXizJVNirDr3/9670wWfWtCbsWpsrTvh9fj6Tse+Ni55XCwaJgz6hcLUDWHw/CgMP2Ky6TVN0Lfw/pGqHvl/3+ER0zq/f6eS1Pvw/ioXUh7ZfCH9G+xUFNTMelSLhuXW9iVd831vMs7vEcvr/OOR0eCyuLkK7Pup7qOOmPPEXs2Gifm9TFqut/E7YNRfuQUrX+8FOF46DQ6mnRPut7OjYnvnnns6tS9HNaRp1tVj1XnbNjEB5nHZuy9XQRAdaEu+VswoHYSb481vhyqeNRH1ap15WeSfWmH/29O+6//di9zIdYdfzMh1f3vuZA9/VX/3Kvt5d6Yx3pQ606utTbqG7A16WQtasIsNpVduNa9+bIwhSjBkQcMsR0Ixa+p0oYGOlmUQ/cbSLcr5DCu7i3ld1QxuGQ3RwrDClqpFbdCBfp5z2iRpR6d0hVWJi7sjJQPbGGqYLVomeL2XGJ62/ZcsPv6X1zfJ2yuh7/rKhhq4AipnDXGjca2hH3XGjjEwglPBfrNEibaLpsK+86VK5xwy5Hapxv2bLFz7lemBmy65uOrT3rL2bPD5Sm56Ndb1QPw/pr7PtzCsqy7HtldMyfeGLn9XRQcR23+pHaHxOe2+GwLLH9ipeRWrYCZz3PSoFB/L2UcP1W78PrQhuKriWi8rdzruhnqr5v9PtLf4hSWBgG7qrPCu/F9q1M2c+Hv2skdS+QOjZVwjIv29c6+tmGsvWH4ZV+/+j8D8vZ6mnR+Wffq7ofsp8r2mbV0apAVcdOin7/mN/4Df+9BtekSUGANeHqDs9SSGOfpjfpFCRpaGUVC/Ws19Wv+pucfvyd/wtw095YOhY6Jl2gY6FjUqVrQyu7iACrXfbX8vgvuGoQKNhSAz3+Xkw3WdYQkKYNuDrCm8yiG71+2f6HYZWGq2n/w7+26mu9LvENvgm3Mb4RTunnPRIGj+F2zkSpMtBr+p6pajjpBl436i95yUt6x0vBpOqveliFwz7CsrNGiepAWYMxbFA2MaegYdOPcP2p+tevpsu28q6jrf0fNtUz1TeJyyC8vhXVwbD8qhqrRcoasGLfLyrLsu+VCfd3UPG6rX6k9sdomK4N1YzPudQyUq+LLU8BQ/xMqCJhGViAFr7Whni/TFhnin6m6vtVwv0IP5kxJfz5ot/fCsp0PTVF50HZsSkTrruffQ31sw1F61c90uv6/WGK9tnOP/WKUg91o98/NuywaltsGUU/Z98bVHxN6woCrAlXN8BSMKCAoAs2L7+s93yqlLDXlSz5r0/1HV4ZhVhr//eD/Jyr1RtLz9mat+JqPzf5VD9VT6uofqqeYnIRYLVHN2h246YbXP0V98Q37/xLrv4aa3/Zs5v7FAuBTNGN3qDCbS260euHetXY8EELgcJwI7zpCxsU4euhcBvtRrhKP+8x1jNEx6tOg83opvrer9774rEet7gMtH0q67BOlQUD1mhJid+req36LdabLjy+2oaY6kXYgDPq/aAHLouCXn3iWEgNGw01GlS4fan616+my7byVrlqKqPyiK8dOr451T/RNlkPHvXuVE+/kA3VCoNuM0jvK7FGql3XdC6EZWPfnxMFRVL2vTLhOTeocN1hXbJzK8V+b+i8if9AYnXMysSkXpdw3UXfj9n6xc75sFzstabC7Ugto+pnqr5fpel+WD2S1M/rGqi6rnNavRTD60S4vU1//zfd1jJl9SMlXn8c1klqn8Jy03XD6HeCrilSdU21Zdg2a1vs/FfvN6ujMYVr+v0vOod0XFJ0fxNfh7uAAGvCKRhQQFBFwYACgkmn8EgPcE+xXlfmxB/9vXvTD3/k5wa3/rVT7oFX/7Kf2+nKJYvde0843s8VW3jNx18M0SaZ6qfqaRXVT9VTTC4CrPboplM3S7p5Mrpp0s2QNchSN24m7GIfqgq9mgpvMu1Gb1DhMq3hqRtGGy6hm1mjsrIb9NQNabi88L1l+nmPCW+0FSSEIY0ooNON9BzfwNRxNdZwU7ii49vmcepHURlYbwr1kNLNd1kd1PtVFgoYQnqvGtB6f7j/ol41CrIsjAiPr21DHeH7UvWiDcNcT9Nl99NIDOVW/4zVObHrgQm/F/ZoUT2y3llF52AdYQP2+Wkf7vnrj8rGenTY9+f489iCIlP2vXGoW5fUuLcerUXllqpjqdeNlYeOT1mor2uj/fEiLDtdS+JrUVNhGaSWUfUzVd+vkvo9lqLwVoGI6l1Z4G7nbUyva52i99vPvGzvl1We322UuamqH0WK1m/1SL13tT/6PVJEv0PsjyFFdC8Vh7MxW5e2uej8L6Iw8bqPX9c7j7SN+lnVddXr8LrVdQRYE65ug1DBgAKCSXeOD4xW+OAo9tTT/+Au/Mx/3K0MNHTwokcfq/3Mqyp6Jta1Rx7eG0poFN5c9+5/6Q464JX+q93Zg+MnncqgToClh9rr4faYXHWvV6hPN8u6gdNNVKjqJiq88VNYoB5M9rVupi78wIWVN691hevSjV7dm9MyL960BzeZ9lrc00JlZA2KuHFrwm20G+EqVe/RDeq2H2zrBYpPPP6EO+fcc3pla+zmV+IGY7jN4ffCRreW1eZx6kcYgqohqwatbsRVLkXh0zCEZVV0HFLC94Vl3LZhrqfpsvtpJIZyq38mbIzGvYf0PW23ykb1U9utc9OGCen6p2tl0XWhip3Dut4qCBD1hlXDWez7c4KgxZR9bxzC61kY9MVUnlbWCjHDgFrnvoVL8XGoqntq2FsPWpWnjkkRBd4W/ofLCre/yXUgFJ5PqWWEP2PrDul3kF0TU8so06ReqP5amNi2Outvo8xNVf0okvr9o9+5Yb1MUZ371t99y8/tTvUvrLspdqz080Xnf0zrs/BK7Jqt65Ouq1rnO373HX1diyYNAdaEq9sg7EqApaBEgUnoJh8SqeeVApJQG0MHY+FQQqNPRdRzseLeWDoeOi6TTsdDx6WOAy/6oP8Xk6ru9QrN6Kboxhtu7N04h9Qt/rR3nrZHA1M3nLrxNHYTFfZUUOPlnPef03t9UFqX1ilNbk5T7GZPrAFV1qgK15+6ya7zM7H4PbpxVq8p3dDqBtpuaI2Vs9HPq0eLeh+pvMMwIFx23CMu3P/4faOiRtwXv/DFPfZRD6LV86xU99QAGgVtizUodRzqCt8XH5s2DXM9TZfdTyMxlkP9K6LtUgNQ21QlvNYNUhbWgDWq82Gj374fvy5l3xuHT17/yd4n2irQ+9OS39X2cxIHXWX1saju6Rj80z/904vX6/C46Dqi4W4xXTPtuhOuI7xmNrkOhMLtTy0j/JkqqWWUUSClgENhjEKZMk22pak69TIsc13zB6HfmRLWjxTtdw6/f+wcNlpnqszUO8t6uondp+hYa3in7h2M9l/l0GUEWBOuboNQPVviAGcSheVR1Osq9EePPub2//nP/Vx7nnnpS92fHXm4n9uTgpy4N1YXAhs9j0zPJaujC+XRZeH5icEpAPnSl7704l8g1fDQzZu+VihidDOk5zKIgi67URS7iTJh40Ti7/cjvMnVTZm2ZxDWgNH+6iHeakBZ76vwNaObQ+1z2FsrFm5j3UZH+B7dOGv9Kbqx1b4fcujuN/lhbwJts35GPcjUKLHlFW2PQkvtl46z3rfssmUj+autbrbVcFAdM6oj2g6Vh/6P6a/T++y963g0pb9oK5hIUWNG5SVxWamcfjb9Mz+3J9Uha1DoL+baziJTr53qlbGxY16XjqOVl85P1ZUm9HD71LEN9z1szKcUhQj9ULmOo/4Z7Xe/n8SnZ5/pvDOpcog/oa9IeL3U9UXP31KYbp8+puOu469jrmMfKvteaM6cOZXHtQ79vtAwp6KwUeVp9agsONH5r4BFtL/x9VTlatezuLer1T2dz6ozatBreTrvrLeVvta1XPVK9LM6N432wXp46VofBm26/ti5mTqmVXQ8dFwkvpaYsKyqpJah/VTv3Dn+90JIIayFw7quVtU/lYe2eRBany1D1xCj5zIV1ZVQWOZtKbs2qdxy+v1TdP6rbodUX7TN+n0jqrfqnRwfW21/WJba7ve9/327nUNdQoA14eo2CLsQDJx01Fy35uylfi7d68q8xr/+/u9818+175OHHeJ+6C9QRdQbS0Mc9cl8svTmNe7uhx/xc5ONegqpWw+Qphs43TDpBk6hjNGNsP5arZsd/Yz+kq2fE90waTjHjZ+8sfc9oxu/+CZK31fDNPxrYNHPFVEYsO2pbb0bX918GTXo7Oat7rJSdDNojQfdWKpxE970282vbYsabLZu+3nRe778n7/cazyK9lf7rmdSXBV86l2Z+IbTqLx1PNTo1E2t/i8TNvpiZY3JsCxU3mp8xDfPbVNwYcN8JDyeKj+Vh463PaB2UCrLK6NAMhaWQ9xgjP9C3g+Va3gMrSE+KvH6Q+G+l/2csW2382QQ4bpHVf9M6txrk87hVG8Kozqv66VY47WNOhdq41hJXGbaVl2fFF5oMjqOqXoUXqvUCNfQc7vWzjl0Tu/3kpal8zYMl8TqXiwuZ11jVKYWRuh3lwUI4frja2O8f4OKryUmrPdFP1P1fVG9sSBQdP6I/a5S+V1Zcd3rV1hGYZgbH4c6wjJXPR1EuJxUfVfdyOn3j9apuip2/ote/8YD3+iVrc4HozK2+7QiCiTVk1z3I6LlaR+t/ncJAdaEq9sg7EIwoIemKxjSJwxWhUKH79jh3vVfvu+G4bP/5+vcY694hZ9LU9imTyr83IOb3RVr1/lXJhv1FFK3HqCcfYKdKHDRDZ/dxIV0I6cgSzf5unFSzyW9TzdlahSkGim6+VIjQUM51MAJb8zKhDezKfFwuKYUPFlYZX/ht9e0X3azqUaV/sJvtB9hb4H4RtiEIVcVlZNuXnWDOseXr8pT//ezf7YPIe2PeiZoH1PCMlcvDt0cD5utUzfWRfVOVL56tojKRo0yuyFvSnU71ZgxZQ3GNsKEuEGfaogPS7z+ULjvZT9nbNvrlGsdVhdkVPVPwvUOi87lOg16XQdE1x3RtUd1vi0KalLnWRNhXUkpO6dFDXL9bhAbPlh0LCzcCtmnQYp+bx133HG9fSu6vtn1UNdAu6aLytau6/HvknA7dOz6oUDHrlXxtcTo2mZlUKd+pKy8cuWL64rp9/OwQovwOISqjn2RsMxT5VVX3WuTrbNse3WMRvX7Jz7/TXifpvsPLafOMdXyVL90/yV1ruuTiABrglV94l6oC8GAAqyyXlehNj99MPa11xzo7j3wV/xcOfXG0rOxCLB2mbfiavfUL7reY/LUrQcop5t43Wjr5r/qxkY3Q3ZjpZs63Rjp5theK6P1vPnNby5sYBRRA0lhgfUM0zbajWOTG7gqWo9u7hTMGe2b1m2NJv2MvlYPLHseRrzPuhEO6a/gbWxfv/TX169+9au9G271DFOYFjbQUmwYg+pDWCbDpHB0kLLS8VL9qKJjEh+3mI61NcwHbUTNNOG+12no1G0kNjGO+ofm9LtA1xZRgGHzukbq+qzrZJ1rvc5dXVvDa62uxwoLRNcF+15IP6cATKGDfqaKQiyd//E10JYTflCH6HquYEP6vQ5o2XY+9buMurR/CjhUnjoeosBO52W8z22KQ32tU8dL622qjTI3Ta5NOf3+SdHxVTnX/T0eU9lKVVlMKgKsCUaAtbvLjz7a/btvf9s9+8IL/qtyOQRY++21l/vDI45wV23Z4r+abHWDCwKsyVa3HgCoTw1T9Uro6o0uxov6hxzoDwAWolUFuSmqyxbs9bsMAIMjwJpwdRuEXQmwlhz8Ovfhhza7v9y+3b+SNu4hhL8za5b7k2PmubVPfp8AK9CFetpldesBAAAAgO4hwJpwdRuEXQgGFApdf9x8P+fc7T4YWumDoVRvrHE9xF29ri71QdtpPmiT8x7YVBm2TQLqKaRuPQAAAADQPQRYE65ug/DQZZfXejbUTKZw6JsnL/ZzO/3gpz91H/7mQ+4bP/6x/2pPf/ToY27/n//cz7XnmZe+1P3ZkYf7uT39+qtf7f7kjce417785f6rnebcvvNBkJPsoAMOcJuXX+bnqhFgTba61ysAAAAA3UOANeHqNghPXX2927T1e35usn36+BPcsT4oCt3yxBPu3z+257OxlvzXp9yv/qTd5y0VPf9KwdofHH6EO2vO7p+K8qAP1t5z/31+brLNn/16d8cF5/m5agRYk63u9QoAAABA9xBgTbi6DcKuBFhnzZ7jLjv6aD+3u6LeWHv/z//pLnr0Mfcy/38bfvbP/pm79sjD3bT/3xT1ujJXb9nibtn6hJ+bbHUDrGenp90hyy73c5hUda9XAAAAALqHAGvCKRhQQFClKwHWEfvv79YtWOjniqk31tXf2vXQ9ON+/N/doh9s83ODW//aKffAq3/Zz+102RuO3qPXVWjxxg3u28884+cmm+qn6mkV1U/VU0wuAiwAAAAAKQRYE07BgAKCKgoGFBB0wddOepub2mcfP1fsMR8aqTeWhUdtDCX8u1cd4Nb+7wf5uZ0hmnpdHe7/T9n2/PPuTXd/2c9NPtVP1dMqqp+qp5hcBFgAAAAAUgiwJpyCAQUEVS78zGfd5x7c7Ocm30eOmedOPfhgP1fu3337271nY2ko4aJt2/sOsRRerZ+a1Rs6qGdd/eERR/hXy93x5JPuQw9143icfuw8d9273+XnyhFgTT4CLAAAAAApBFgT7pazl7pFR831c+U+tv4rfrrHz02+35k1y11/3Hw/Vy3sjaXhhG/64Y9qPxNLz7zSQ9s1bLBOr6vQeQ9scn+5fbufm3wXL3qrn97i58opYFXQislFgAUAAAAghQBrwtUNB9Y//Ig76+Y1fm7y6VP/vnnyYj9XX9wb63XP/aPb/+c/99/Z0zMvfWmv19XXX/3LjXpdhd5417o9PhVxUhGywhBgAQAAAEghwJpwJ/lgYI0PCKp0bXjWXQsXusNfUa83lNEnFKo3lj6xUF4zPd0LsQ6c/pn/yje+935ZL7z64d57+69c75MF1etKnzTYxIN+Pe+5/z4/1w11h7ku9QHr3Q8/4ucwqQiwAAAAAKQQYE04BQMKCOo48KIP+n+7QT2i1DOqKfWKUm+sW7c+4b9KO3P2nN461NurKfX00jq6om5ooYBVQSsmV926AAAAAKB7CLA6oG6jsEsBlp5JtW7BQj/Xn7g3lum311Vo8cYNvWdudcEr9t7bPb7qKj9XrUv1s6vqXqsAAAAAdA8BVgd81wcE+/mgoErXerj87cmL3b599JAycW+sQXpdmef8Mn/trnV+rhvq9hB8dnraHbLscj+HSUaABQAAACCFAKsDFBAoKKjStWcMfeSYee7Ugw/2c4OxTwvUpxsO6o4nn3Qfemizn+uG04+d565797v8XDkFqwpYMdkIsAAAAACkEGB1gAICBQVVbrrvfnfF2u70/jnt4Ne5PznmGD+Xjw8/9JC7/cnvu664csli994Tjvdz5bpWN7uKAAsAAABACgFWB1y86K1+eoufK/fItm1u4TUf93PdoKF+3zx5sZ/LxxvvWtcbmtgVGy75gJs7NeXnyn1s/Vf8dI+fwyQjwAIAAACQQoDVARo+qGGEdRy67HK3Y3raz3XDXQsXusNfsb+fG7/HdjzjTt6wwc91Q5MHuGv4oIYRYrIRYAEAAABIIcDqiLoNw64FBZcffXTv4es50MPgr9qyxc91w0lHzXVrzl7q56rxCYTdUPc6BQAAAKB7CLA6Qj2w1BOrSteGav36q1/tPnX8CX5u/H7v/vvcN378Yz/XDXWHtipQVbCKyUeABQAAACCFAKsjCAvS/vbkxW7fvfbyc+Pz3AsvuF+7a52f6466oerytevcjffd7+cw6QiwAAAAAKQQYHWEggIFBnV0bbjWDcfNdwtnzfJz47Nh+3Z37gOb/Fx31A0r9MEC+oABTL66dQIAAABA9xBgdUjdxuHSm9e4ux9+xM91w2kHv879yTHH+Lnx+fBDD7nbn/y+64q6z796dnraHbLscj+HLqh7jQIAAADQPQRYHXKLDwwW+eCgyuce3Owu/Mxn/Vw3vPblL3f3LjrJz43Pievvdj/46U/9XDdc9+53udOPnefnyq1/+BF3lg9U0Q0EWAAAAABSCLA65JwTjncrliz2c+V2TE+7QzvW6+VrJ73NTe2zj58bvcd2PONO3rDBz3XH46uucq/Ye28/V47nX3ULARYAAACAFAKsDpk7NeU2XPIBP1eta8MILz/6aHfm7Dl+bvRu3fqEu2rLFj/XDXWHDwrPv+oWAiwAAAAAKQRYHbN5+eXuoANe6efKdW3o1u/MmuWuP26+nxu98x7Y5P5y+3Y/1w11h7I+9fQ/uHkrrvJz6AoCLAAAAAApBFgdU3cYoWgYoYYTdsUTp73D/zt6c27/ov+3GzRsUMMH62D4YPcQYAEAAABIIcDqmIMOOMBtXn6Zn6umB7nrge5dccNx893CWbP83Ohs2L7dnfvAJj/XDXpwux7gXse8FVe7p55+2s+hKwiwAAAAAKQQYHXQHRec5+bPfr2fK7dp61Z36uob/Fw3nDV7jrvs6KP93OhcvWWLu2XrE36uG+644Fxf92b7uXKbtn7P173r/Ry6hAALAAAAQAoBVgfRC6bYa1/+cnfvopP83OicuP5u94Of/tTPTb4mHyLQtd5/2IkACwAAAEAKAVYHNXkOkUIEhQld8bWT3uam9tnHzw3ftuefd2+6+8t+rhsUmio8raNrz1/DTgRYAAAAAFIIsDqqSZjQpV5YHzlmnjv14IP93PDduvUJd9WWLX5u8jV59lrXQlPsQoAFAAAAIIUAq6NOOmquW3P2Uj9XrUuBwu/MmuWuP26+nxu+8x7Y5P5y+3Y/N/maBKZLb17j7n74ET+HriHAAgAAAJBCgNVhm5df7g464JV+rlpXemHtt9de7psnL/Zzw/fGu9a5Z194wc9Ntia9r556+h98Xas3vBWThwALAAAAQAoBVoepR4x6xtTRpV5Ynz7+BHfsq1/t54bnwR//2L3n/vv83ORTHVNdq0N1THUN3USABQAAACCFAKvj6vbC0gO1j11xde//SXfW7DnusqOP9nPDc/WWLe6WrU/4ucnW5AMD6H0FAiwAAAAAKQRYHXfOCce7FUsW+7lq6hmjHjKT7oj993frFiz0c8OzeOMG9+1nnvFzk43eV2iCAAsAAABACgFWx6mHjJ5PtJ//v45TV1/vNm39np+bbF876W1uap99/Fz7tj3/vHvT3V/2c5Nt/uzXuzsuOM/PVXt2etrpOWtd6OGHNAIsAAAAACkEWHAXL3qrn97i56o9sm2bW3jNx/3cZPvIMfPcqQcf7Ofad8eTT7oPPTT5PY0UjOoB7nV8bP1X/HSPn0OXEWABAAAASCHAQuNeWF0IG047+HXuT445xs+178MPPeRuf/L7bpI1CUXpfQVDgAUAAAAghQALPU0CBwUN6oX11NNP+68m03577eW+eXK9Z4M19ca71rlnX3jBz00m9bracMkHesFoHV0IRFEPARYAAACAFAIs9ChsaNIL6+6HH3FLb17j5ybXXQsXusNfsb+fa89jO55xJ2/Y4Ocm15qzl7qTjprr56rR+wohAiwAAAAAKQRYeJE+LU6fGleXAiwFWZPqD484wv3B4Uf4ufb8+8e+7f7dt7/t5yaTgisFWHVNeh1CMwRYAAAAAFIIsLAbfWqcPj2uDvWameShhEfsv79bt2Chn2vP4o0b3LefecbPTZ6mQwf1aZb6VEvAEGABAAAASCHAwm7mTk31Qoi6Jv1TCf/25MVu37328nODe+6FF9yv3bXOz00m1RvVn7o0dHBSw0/0hwALAAAAQAoBFvbQ5IHuctN997sr1k5mMHPDcfPdwlmz/Nzg7njySfehhzb7ucmjoacagloXD25HEQIsAAAAACkEWNiDhoBtuOSD7qADXum/qmdSn2V02sGvc39yzDF+bnAffughd/uT33eTRsGVAqy6nnr6H9zCa/60NwQVCBFgAQAAAEghwEKhpg/jVhhx2uobekMKJ8lrX/5yd++ik/zc4E5cf7f7wU9/6ucmh4YM3n7Bub3Qs65JDTsxOAIsAAAAACkEWEi6xQdYi3yQVZfCK4VYCrMmyV0LF7rDX7G/n+vfYzuecSdv2ODnJodCK4VXCrHqWu+Dq7N8gAUUIcACAAAAkEKAhSQFFE2HEm7autWduvoGPzc5Lj/6aHfm7Dl+rn+3bn3CXbVli5+bHHf48Gr+7Nl+rh6GDqIKARYAAACAFAIslFLvGn26XBOfe3Czu/Azn/Vzk+HXX/1q96njT/Bz/fu9++9z3/jxj/3cZNAzr/Tsqyb0aZXqpQekEGABAAAASCHAQqVzTjjerViy2M/VN2kh1t+evNjtu9defq655154wf3aXev83GToJ7xavnadu/G++/0ckEaABQAAACCFAAu13HHBeW7+7Nf7ufomKbS44bj5buGsWX6uuQ3bt7tzH9jk52a+ixe91U9v8XP18dwr1EWABQAAACCFAAu16HlYm5df5vbz/zehXljqjTXTnTV7jrvs6KP9XHMffughd/uT33cznXpdqfdVEzz3Ck0QYAEAAABIIcBCbeqBpZ5YTU1CiPXal7/c3bvoJD/X3Inr73Y/+OlP/dzM1U94JTz3Ck0QYAEAAABIIcBCI/0GGZMQYn3tpLe5qX328XP1bXv+efemu7/s52auLh9zjBYBFgAAAIAUAiw0duWSxe69Jxzv55q5Yu2d7qb7/srPzUyXH320O3P2HD9X361bn3BXbdni52YmPe9Kz71q6qb77vfHe52fA+ojwGrH9r/b4v917lWzX+/+11/6JT+HHD33wx+55/7+791LX/5y98tzZvtXAAAAUIYAC31Rjxz1zGlKPXLUM2cm+p1Zs9z1x833c/Wd98Am95fbt/u5maeLxxjjRYDVjj8/YaH/17l/4ctz1v/V37P7BmUhWplJCW7q7KvZ91d+xe37mgP9nHMPrbnNffOW29xrfvVod/J11H0AAIAqBFjoWxcDjidOe4f/t745t3/R/zvzdPHYYvwIsNqRQ4Bl21BmUoKbOvtq3njWGe6YpWf4OQIsAACApgiw0Dd9MqEe6n7k1Cz/VTObtm51S2++ZcZ9Ot0Nx813C2fV298N27e7cx/Y5OdmDh3TNWef5ebPnu2aenTbdnfq6utn3DFFPgiw2mGBSg4BloYxvjQxjPGX/ffm/8F5fm5mu+vCD/p/037+j//ofrL1e37OuTd9+BJ36Ek7h2UTYAEAADRDgIWBKPDoN8TSp9Nd9JnP9f6fKc6aPcdddnS9BuHVW7a4W7Y+4edmhrlTU+7ad5/e+78pwiu0gQCrHRYe5RBgjXMbcvGfLvqg2/7/bNkjqCLAAgAAaIYACwMbJMRS4HHRZz7r7n74Ef9V/o7Yf3+3bsHOhlmVxRs3uG8/84yfy5+GC65Ysrh3LJsivEJbCLDakUN4lMM25OBbX7jdPbD6BvfSX3q5e8df/PmLz78SAiwAAIBmCLDQCgUf/YZYcuN997vlM+RT67520tvc1D77+Lm0bc8/795095f9XP76fd6VEF6hTQRY7bDw6Kwv3em+/9eb3Dd9UPLcj37kX3HuVXNmu9f91nx3zFk7n8Mkj999j/vuPV9xr3p9+ZC+ey7/N73hcG8884zKUMq2oU6ApSDnh1u2uIN/c757w++e5l/Zkz6x72sfucbPOfeWq/7ti5+uqJ5N2vb/96/+prdtoiGL/8dv/6bfzn+1W2Ak//2Jre6BT9zw4roe8gHSd+/+yovlo/ce9bunuqPecaqzdfTrf/jt+czpv9fbruMuOLe3vpD22wKst179b3tBV7gfOlbajkMXvcV/tSfbd/1v2y+v8/t+1GmnFpa7eoPZcX74i3e4h79wx4vv1b6r3LStqX238vvvT3yvt53he37iX/vmrbe5Q976lheHSQIAALSJAAutGTTE0lBCPRfrqaef9l/l6yPHzHOnHnywn0u748kn3Yce2uzn8nXQAQf0nnfVz5BBIbxC2wiw2mHhkUIEhVO/dOCvuH0PPLAXONizmBRuWBCkcOgz7/o9/+rO0EuvxRSSKPxQT6J3f+7ThT8Tsm2oE2BpG7/2J9f0tvHdn/uUf2VP1pNJz9R6x81/7l+xgOg9fr9+2ntdYYookPnHH/1972stL9xW2w+FRi95yc6vrXzkh7/4REFts7Z9EAr8vu8DKa2rqIeVBVgKFJ/7+//mA6CtL+5HeKzCB7+HPu33XfsZbr/tu7z7s5/aI8DTcVEwpuePqdzD99q+62uVW0w/r+Mkqgevmj37xe3UNivI0s+kthcAAGBQBFholUIsDUXrt0ePwpDchxT+zqxZ7vrj5vu5tPMe2OT+cvt2P5enk46a665997t6x6sf+rRB9ZjT8QLaQoDVDoUUJnxouKgHjQIchT5h0KAHkSvAUE+auKeQ3Lvqo+6767/iDln0Fnfisj/2r5SzbVAIpDCoTBhEnfYXn3S/7AOW2Bd///29gCfeHwUms3xAFAY1Wt49l/2b3v6E+ygKrLT/ohDmrVet2G37wu8r4FMo0w/1pPqKD7C0jnjooLEASxRcad/CfbfQTorCKK1jXx9Ahe8RO5YKxt569Qr/yi52XLRd8/0fnMKyDOtGXA9UptabLK4Dep+CLQVZEpc5AABAWwiwMBSDDEsTBVgKSHLsjbXfXnu5b5682M+lvfGude7ZF17wc3lRrysFjAqw+qXw6kIfMgJtI8Bqh4UURQGGKPRR4KBeM0u/dKd/Zddrqd43a95+Si+8qBNIiW1DmXBZFpBpyJyGt4UUkNzuAyyFLnV6f4ntT9z7KQyo4pDG2Lb0G8SEYU9qHRIGWGFZhL549vt6wVDq+0VsH+N9FzsuReUsm/799b2hhfH3bVvVY+s9/hjEbJ3Sb7kBAABUIcDC0Fzpg5L3nnC8n+uPevfcdN/97mO+IZGbTx9/gjv21a/2c3t68Mc/du+5/z4/l5eL/V/NdTz67XUlOh5X+GARGAYCrHZYSFHWg8h+JgxG1rx9sQ9d9uwFZWFQKrwoYssvE67bApAwVDMWqsQ9f8rY8uIQx16Xs/x6isIwC2uarC9UNXTQ2HoUzC39UvF11XpTlQVhsXAf33ffBv/vLnZcwrIP2bGOt73Odnz69J1DGgmwAADAsBBgYajUC0u9sQahXljq8bPJ/xU6F394xBHuDw4/ws/t6eotW9wtW5/wc3mYP/v1vWOg3leD0DFQ7ytgWAiw2lEVUkhRz55UUHTPZct7D4NvEkzU2YaYBSBx8KbeTHq2U2pZ6qH1/b/Z5Od2Pcfpf/ggTkMO4yCmLNwxFizF761Dw/qqhg6aOuux4ChV9np+2eP37Pwjj46nen3Zvku8j3ZczkqEd1Y+8TbZEM7UMZCqbQUAABgUARaGTgHKLWcvdfsN0PNHFJ5oWKF6Zo3bEfvv79Yt2NkQiC3euMF9+5ln/Nx4qaeVhgsqRBzEU0//g1t685reQ/aBYSLAaoeFFE3DBoUheph72AtKw+Fuefspfq74OUwpdbYhZoFOGKBZIFTU+0vB1dc+8rFesGIUvIiCHAU6+joMYiygkTjcMbYd8XurqKwUtmndZT2VTJ31FB0n0bHSpzJqf4yeo6Vjp/Vr3yXeRzsu8etGy1P5xNtk7ys7nqltBQAAaAsBFkZCYYp6AS06aq7/qn8Kr9Y//EhvWKF6Zo3T35682O27115+bpfnXnjB/dpd6/zc+KinlYYLqqxV7oNQWavnlcodGDYCrHbUCRtSPWoshNADxfWAbxtSlnqeVkqdbYgplFGAJmf5AE09hFLPo9LPah8U1mjb9EDyMFxLBTH2uqRCnDrBUpG6QwdNnfXY8Qj3X0HZf7ro4t7x077re+GQz7J9tOMSv27svfE2We+4suNZtK0AAABtIsDCSJ1zwvG9XkFtUI+scQZZHzlmnjv14IP93C53PPmk+9BD4xlmZ8HVoD2ujHq73Xjf/X4OGA0CrHZYSBEPxQvZz8SBRBxY2fBBC7TqSi2/Srw+e3h83PvLtlO9jt5x85/7V3Zn34+DGAtoJBXi1AmWYtZTrM7QQVNnPUWhkK2rqFealO2jHZf4dWPvjbfJtsOOSxH7mXBbAQAA2kSAhZGbOzXl1py91Acur/RfDU5B1k33/dXIh7iddvDr3J8cc4yf2+XDDz3kbn/y+26UVJ7vPeG3WwuuGDKIcSHAaoeFFOFQvJAFIApbih4ebg9zV2ikHlGpnytj29A0wLLgSQHaIYve2ttOzStMC1n4k9pH67kVBzEW0EgqxLFlx+9NUY+oJkMHTZ31FIVCVe+zZ5lJvI92XOLXjZVPvGwrTx1LHdOYesSprki4rQAAAG0iwMJYaGhbG0MKQ5u2bu2FWesffnQkQ97222sv982TF/u5Xd541zr37Asv+LnhUvktOurIXmg1f/Zs/0o7GDKIcSLAaoeFFBL3wlLYYsPPUkGDBSAKjtQbKhUSlbFtUNih0KMJC9C0XoUmRb1+vvWF290Dq29w+x54oHv35z7lX9nFAjqJgxgLaCQV4lQFRLGmQwdNnfUUBVi2f9r3027+ZG+opQn3T+J9tOMSv27s/fE2hQFVfDxUpxQ6qgwk3FYAAIA2EWBhrE46aq5bseSU1npjmbt9ELMzzHrEfzU8dy1c6A5/xf5+zrnHdjzjTt6wwc8NjwI/hVYqtzap19XytXf2yg0YFwKsdiikUK+pWT6EUAClAOlVPujWJ/kpoFBPIQ0/09C7MPwwYVghp/3FJ3d7xlId2oYqcUhirLePHkju3D8V9v7SNn7x99/n9+WnvSDnkJPe4l91vf1VOKeeUAq44nVo/xXQSCrEqRMsGT1I/vbff7+fqycMd+qspyjAUmCkT5HUM6mK9t2CP4n30Y5L/Lqx8inaJtteUZ3Sz2gb9J7/8Y/P9bZFD48PtxUAAKBNBFgYO/Umeu8Jx/ee39Q29SRSiKVgRv+37Q+POML9weFH+Dnn/v1j33b/7tvf9nPtUmilwEr/q6zapueI3XTf/b2yAsaJAKsdCinUe+pNy/7YfXPNbe7x9ff0gh5z1DtOdW/0AUNReGUsOFHQVfScpSrahioKQOKQRMJQSGFMqveXfk49fxSaGG3vMT5AUQ8hhTwKwcJ1KGxRQCOpEMeCmtT2hcLl1RGGO3XWY8chfJ9o3zetvqH3PaPQUj+nIYz2vngf7bjErxvbn9Q2aYjnQ36bFVwZq2v3XPZveuvUNoTbCgAA0BYCLGRDz3LSA97nz369/2o4NMxwk2/sPLJtu3vA/z9oaPPrr361+9TxJ/g55xZv3OC+/cwzfq5/CqiO8/s/d2pWrxzaHB4YUzlouOC4HoIPxAiwhkfBhAKOuj2p7GHq6smkQCRn6pH0kye+12j/JsW49l3rVS+4cJ0WmsVDDAEAANpCgIXsaIjclT7I2s+HOcOmB5UryHnU/69hdI9u29441PrbXzwH69fuWuf/rU9h1ZE+qNLwySN9eKfASiHesD3r9++Ktet6QyyBnBBg5UHBhA0hPOtLd7qynlqA0YPsNUy1n+eeAQAA1EGAhSwp3NGwwnNO+O2RBFkx9dTaMf0zH2gp2HraT//gX90lDLpuOG6+/9e5cx/Y5P/due0KpkIKqQ464AD/+pT//st8WLXrr9ajouDqxvv+iuGCyBYBVh5saFvZ8D0gZA+WF0JPAAAwLARYyJrCoHEGWXW88Pf/zf/r3F6/8r/5f/NDcIWZggBr/PTpg/oUQg1Je8df/Lnb9zUH+lcB5774++93h/pQ81WzX+/2/ZVf6dUN9db7/t9s6oWe+nAAnn8FAACGiQALM4KCLA0tVJil3kw5+f9+9jP/r3P/y8te5v/Nh3qNfWz9Pb2H1xNcYSYgwBoPhQ/qcRXiOUaI2QPgU+xh7vS+AgAAw0KAhRlHQdbFi96aXZCVCwuueMYVZhoCrPHQ8C/1vJJZv3p0L4gIH84NiB7c/n1fV5770d+77X+3xb/i3L4H/oqfDuzVG557BQAAho0ACzPWSUfNdYv8pEALrhdYqbfV3X4CZiICLAAAAAApBFiY8TS80IIsfZJfl+gTFC24YpggZjoCLAAAAAApBFiYKPqkP/XMyvFZWW3REEE9kF09rfQJicCkIMACAAAAkEKAhYk1d2qq1yPLplw/xbCKPkVQPa1semTbNv8qMHkIsAAAAACkEGChMxRoaaihwixNOVNQpUlDAwms0BUEWAAAAABSCLDQWQqx5s+e7V6x98vckT7cmjs1a+S9tNS76pFt292jPqTaMf0zH1pt9dP3/HeA7iHAAgAAAJBCgAVEFGzpwfBFoVb8dRkLp4x9vTOs2jksEMAuBFgAAAAAUgiwgAFpaKIw1A8YDAEWAAAAgBQCLABAFgiwAAAAAKQQYAEAskCABQAAACCFAAsAkAUCLAAAAAApBFgAgCwQYAEAAABIIcACAGSBAAsAAABACgEWACALBFgAAAAAUgiwAABZIMACAAAAkEKABQDIAgEWAAAAgBQCLABAFgiwAAAAAKQQYAEAskCABQAAACCFAAsAkAUCLAAAAAApBFgAgCwQYAEAAABIIcACAGSBAAsAAABACgEWACALBFgAAAAAUgiwAABZIMACAAAAkEKABQDIAgEWAAAAgBQCLABAFgiwAAAAAKQQYAEAskCABQAAACCFAAsAkAUCLAAAAAApBFgAgCwQYAEAAABIIcACAGSBAAsAAABACgEWACALBFgAAAAAUgiwAABZIMBCDq5Ye6d7dNt2d/qx83oTBnPq6uv9v65XlprQn5leL60erFiy2M2dmvJzAAA0R4AFAMgCARZyoIb2pq3fcxcveouf3upfwSAOvOiD/l/ny5LyHMRMr5dWD+644Fw3f/ZsPwcAQHMEWACALBBgIQczPSjIjQUXlOdgZnq9tHpAgAUAGAQBFgAgCwRYyMFMDwpyY8EF5TmYmV4vrR4QYAEABkGABQDIAgEWcjDTg4LcWHBBeQ5mptdLqwcEWACAQRBgAQCyQIA1XI9s2+Zesffe7qADDvBfNfPU00/7f11f75Ud09O9ZZQ9vFnf18+V/UwRvUcPt54/+/X+q2a0Tgn3q62gQNul5Tfdn34Mui69v98yrGLBRVyeqo/9bK+2dVz7qvVKWF/aYtu1394vK9y3pvVS5avt1Dk/alq31qv1G6sHBFgAgEEQYAEAskCA1Q5r6G5efpn/yrnla9e5ux9+xM/tctJRc3ufBhY2MGNqhP7p+q8UvveDvhFd1MgWNVTVeH181VV+O7b69d/VW5ZRcKB12/s/5tfxuQc3vxgOiL537btP7/1fRMv93IMPufV+29TwN1rve0843k+/3Zsvop+/6DOf9cv4Xm9e9LP6ZDft19Kb1/S+VzcoCGl5N933V366vzdvtM/aLpWd6HuHLrvczzl33bvf1Vt3yoWf+Y+9fT3ogFf6Y7rzPaIy0/5rW7U8o33RuorKQOV26uobettzxwXn9Y6tjnF4fPQe7buWEdOxrWLLNvYeBRf7+WVrfVpv6By/LpW91l3E9jV+n34+ta22r4uOmutuOXtp75jc6I9NWM/0ftXFsvLfMV1cX7ROrftj6+/x01d68/3UF5WH9k/zIdWVa33d0LrEzuuy9WgfVVfi46n9S5WvbX983GLhcSwKoFSu8bVG67Nyqno/AAB1EGABALJAgNUOa+iqYa7GsRrG1qtDjcynnv4H/1M7G5cP+pBL/8fUoFXD1hw5Ncv/63o9REwqeLGGqtavBq3o/VqPtks0f7tvyCrsUeNd1IDWtobrUAhXFLIdsuwy9+z0z/zczvdJ+F69VtQYV8P+tNU39H5WFApp+Xpdy1MZib5WozsVFBTRMrVsvVe0DaKvtWwJy8yCKf1c0bYaBV1atspTQY/oOM5bcbWfcy8eW9HPWRmcfuwxfn3/0s/tYqGO9lnf13EWOz7htioAu3LJKX5uF9WtFDu2FhiZsD5YfbRy135YfdQ+bLjkA35ud/qZon3V6/beom21fdXPa/+snmle+2rbK6ljrfLQMd0xvXt9sfcqZNJNtMK11DJStOylN9/i92FXoKa6oNd1DLSdGy/ZWXaistd6i9aj7bPgVayctGwrI233mrPP6r0e0nmueqB1l9VDO45FAZTKWvui7RBte1jGqvOa1/YUvR8AgLoIsAAAWSDAaoc1dEUN7jU+TAgbrWpsnrr6Bj9X3vCX+Ps7pqd98PLZXoNdFDiEyxZr6IpCkhX+/WrMihqw2j5rVEvcIFcDXj+jRrzeH4cwojBCvXkUIIT0urZPirZNy1XZqIGvxnr4/fC9Em9XFVu2Gu8KqsJlW1ilctB2KUxQTxWFDpIK6sKfUY82vd/ceN/9vffEZWCBhGhd4XaEx1bi8t0xPe1Dxzt72yqp7YqF2xmvM6wPKhuFW+EytR8WdKrcFHbErvDbpP2Mgw+9fpMPQSXe1nhfq+py/H5RcKY6W3QeheUsTevLwms+3qvrqosqk3DftE5tX7g+q19F67Fy0LJ0PFVWRuvQsdE5p+Xp+IRsPwYJsKycdHy1jLCe2vJN0fsBAKiLAAsAkAUCrHZYQ1fUWFWjNWaBSlGj1RrWcbgRWnDNn/Z6+sS9bcQaumr0h0PeTBgUFa1frEGe+n4Z27a4oR8GGqlGdNjYjt9fRuWlcpNUmc9bcZVv5P/DbkGKvabeSda7KnSWDx4UsBSVcxnroabQJQwzwjJIle2O6enedhW9v4h+/lgfYOj/ov2w+iBxCGdsP8vqXIotPz6m4b6mym/H9K6hnPH7y0I5Y+eRNKkv4TkQrzfFzut4PQqOFCBJKgAs+xmr86n6YFLlHO5LUQgoYTnF7wcAoAkCLABAFgiw2mENXfWGCIcghazRqTBBoYIJg5iyhqa9X/R+LcdYQzcMakJhsJAKSMLwoGm9sP2PG/rWUE8FaxI29OP3l6kTuNn6w5+x96nRr8Z/aMf0rnAlVU4pqTIIyz4OMkKp9xexnw33K2T1oSycKiqbuiywjMOzcF/Lys/eH++rhWpl51G/9cWW3WR/rZzj9VjZldVrsXXGYZ69v2pb7DjG1wXbrni5ofB8jt8PAEATBFgAgCw0DSpQzBqUZYFB2LgPyz31eqws6LKGbhwomHAd8XtN+DNl2yHaFvUWkmenp30otK4XLMQNfSuXsoa22PbH7y9jy1YgpKmIQj9NYvuk7bQAJO7lo59VSKhhYd9dtfNnUsIy0DIVSOj/eB/Cck2Vvdj+xO+P2fA/baNCHgVxsTrlWTdEkX72NS7bUGpfU6/H6uxfTMe8aJvLpLbHejdVlZ2VsVj9E3u96v22n3G90XVAxyTertCO6V1hbPx+AACaIMACAGQhbFShf6mGbihs3Iflbo1ZBRJVoYk1aOPeLfZ6qqEarrvOz4TbZ9STROGJ9jMl3v865SKpHjllrBFfV7hPtr64x5otM37dKOBS7y39TEq8D2G5xj3nQnXKSuu1B5zHdSBk9aFsWVbvikIULV/He5B9Dcs7ltpXBS47pqf9a7u/HquzfzF7TyrkLZLaTns9VU9M2AsqLI+ysg/ZNsfnrL1etS/2c/H7AQBoggALAJCFsFGF/lmDNm7ohlKNe2vMSvh6kVSDNPW6Cddd52fi7VCvJIU3oka3piOnpnwY8zL/ioblresFQvH+1ykXqftzIT0zSs+y0rZoqhIuV/uifVLvJRtGqN456qUjek3fC+nn9T5Rj7K5U7NqlUFZuYbqlIEFbGU9/cTqQ9myrN6p7OIQxbZFRrmv9hyx+PWYlUPVz4WsTKpCn1BqO+31cQdYZUNSxX4ufj8AAE0QYAEAshA2qtA/a9DGDd1QqnGvUEThiISvx9RgV8Nd4uFZVQ3VcN11fibcjrARnmowp/bfXq8KXOr2vAnVXXYRrUsBmMIS68mk3mUamlf0/CX7nsRlb2x74n1IlWss9X5joYeeu7TBb1+qJ5dYfUgtS2x5cYhi+6oegXq9aF9VD1Uf4+UPuq+p12N19i9WNxwLpbbHXo/LLmZlHNcpe73q/baf8TlrPQjj7Yql3g8AQBMEWACALJQ1MlGfNWjLGpSpxr2CAAUCUtbQLAu6qhqq4brr/Ey4fHvoedwID6nnknowxftvDXWFIAp+Umz74/eXsecQVS07xd5vAZiOgY5FUUiXehh3KLUPqXKNldWhcBmp4xdKbUvIjk0coth2WLkUSS0/3M5+9rVOOe+Y3vVsp/j9ZWydZcuO2Xvi9VjIp1566q2XYnUsLmMre4WQGlZaJCzL+JjbdpUdI9Vl1WmJ3w8AQBMEWACALJQ1MlGfNSjjhm4obJDG5W49KsoapLaOuDEsFiikGqrhuuv8TLh9qUa4CRvK8f6HoZtCJoVNsfBn4vebHdPTvcZ+KOwZZr2omrD91XK1bQrhRIGCXgtZ2aeOT7gt8T7YeiQs15itI37/junpXvkWBYQpVh/Kft5ClPi42nakhscNc1/DuqBgSAFRzLZb4vebHdPTexxDC50ktexYajt1LKy+FAWeUvYzYTkV1Tex807iczYsg9T7LXiW+P0AADRBgAUAyEJZIxP1pRq6obDRGpd7+D29X8sJqVGvxr0UNb4tsEg1VMPl1/mZcPussaxG8u3+vWEIpfdc+JnP9Rrrou3W9ocsnNP7rn336b3/jd6/9OZbeoGDxO/XchXe6PtFzy6ycte2XetDgqIQSz161HssLjPRMEI9R0vBlMIC/V8UUFkYoPU86Mtf/5uqfdD3T119g5/bvVxjti/x++3Yax9SPeBiVh/iZYXsuMYBlgUnKi8Fe6PcV7Fjonqi+tZ0/fb9ONTUawt9XdSytW9rzj6rt46QyjkMmsq2M6wTWlZ4TqneajsU7hYdN33fwi1to+qulmNu8mGbnjNm4nNW+6Jy0pBI7UNcTtoPhXX6OYnfDwBAEwRYAIAslDUyUV9ZQ9eocX3q6hv8XHG5hz1E1BhVw1e0XBP35DAWWKQaquG66/xMuH07pnc1lkWBhwIANcK1bdpONcIVhhTtvxrxKp/w/aKv9T29X8tT0BS/30IW0fvCoEW0bVq2AjIJy82WL6l9DpcvqZ/TcrQeLVPr0LaIwhB9T+vUawo04n1IlWtMy1d5hu/XshXgiYIKPZeqiNYf9pay+hAuK2b7ru0OyzVc5yj31WgZGkqoshatS9th61fI+Ig/3jrm8fttn6RoqKDer3XbslXv9Ewx0fZIuN36Wb0er0d2TO9e92xZWrbWI/paQZqOXSzcVnuvaHlatrZf55i+LqqXCqkUbhqVk6ic9L6wnIreDwBAXQRYAIAshI019E8N2VRD16hhfurq8sa9hmepYatGZ0iNWS27qCEsFlikGqrhuuv8TLx9apArXNM+htRIXuGDEzWYFXpoG4v2X99XYzt+v4ap6efV40SN+fj9Wq+WK/rZMKQxO6ane+9Xg16N95ACH+3rlUsW+4Bgzx5Y2i7rCaMAYfPyy/1cMZWPesXEx0bbpW3WvmloXbwPet+pq4vLNVRUh8L3llF4EYZQVh/CZcVUz1Tm8XtF9XD52jt9+ewqT5WlwlMtT2Gjjme8/HB7m+5rSMc9rm86PjoPVAf0DKwd03s+9F/brWMgRT32RMdc+65eZjEtPwy9qrZTdi5r97oXlpXCtxS9V8G1Qi+j92q73+snHQNtZ+qcVTnpOIR1Uu/XulVO1psu9X4AAOogwAIAZKGskYnxUeP8Ud843c83flOh1TjYdsmRfrvKGucpanQ/65dTt0Hd5OcVTmiSYZVdWAZ1tmkmU1lqknHtq0IxhY+ajAV06t2k3n+hJvXFflbq/HwZlZOmfs6LNuqUykn6fT8AACkEWACALBBgAZhpLMCiZxEAAMNHgAUAyAIBFoCZREPuNLxQuH4BADB8BFgAgCzQAASQEz3TScMC9TyqmJ5xdZH/vobc6dljes4TAAAYLgIsAEAWCLAA5MSGB4oeMG/0kHQ9Y0r0QPcNl3yw8bOmAABAcwRYAIAsEGAByImGCOpT/cJP1jP6hD37hD7CKwAARoMACwCQBQIsALnSUMFBP50PAAAMhgALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACkEGABALJAgAUAAAAghQALAJAFAiwAAAAAKQRYAIAsEGABAAAASCHAAgBkgQALAAAAQAoBFgAgCwRYAAAAAFIIsAAAWSDAAgAAAJBCgAUAyAIBFgAAAIAUAiwAQBYIsAAAAACk/P8QlN4fIEAs5gAAAABJRU5ErkJggg==";
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
.brand { display: flex; flex-direction: column; align-items: flex-start; gap: 0.2rem; }
.logo {
  font-family: var(--serif);
  font-size: clamp(2.2rem, 5vw, 3.3rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--ink);
  text-decoration: none;
}
.byline { margin: 0; color: var(--muted); font-size: 0.82rem; letter-spacing: 0.06em; }
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
<meta name="author" content="Evan Zhang">
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
<meta name="twitter:site" content="@evanzhang_go">
<meta name="twitter:creator" content="@evanzhang_go">
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
      <div class="brand">
        <a class="logo" href="/">\u6E38\u7267\u624B\u8BB0</a>
        <p class="byline">by Evan Zhang</p>
      </div>
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
    <p>\xA9 2026 Evan Zhang \xB7 <a href="https://x.com/evanzhang_go" rel="noopener noreferrer" target="_blank">X @evanzhang_go</a></p>
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
