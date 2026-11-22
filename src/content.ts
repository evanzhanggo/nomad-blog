import { decodeXml, stripTags } from "./text";

/** About 200KB of sanitized HTML. */
export const CONTENT_MAX_BYTES = 200_000;

const ALLOWED = new Set([
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
  "td",
]);

const DROP = new Set([
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
  "frame",
]);

const VOID = new Set(["br", "img"]);

const RENAME: Record<string, string> = { b: "strong", i: "em" };

export function visibleText(html: string): string {
  return stripTags(html).replace(/\s+/g, " ").trim();
}

/** RSS/page HTML is "full" when it is more than a one-line blurb. */
export function isFullArticle(html: string): boolean {
  const text = visibleText(html);
  if (text.length >= 800) return true;
  const blocks = html.match(/<(p|h2|h3|li|blockquote|pre|br)\b/gi)?.length ?? 0;
  return text.length >= 180 && blocks >= 2;
}

function hostOf(pageUrl: string): string {
  try {
    return new URL(pageUrl).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function attrValue(attrs: string, name: string): string {
  const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i"));
  return (match?.[2] ?? match?.[3] ?? match?.[4] ?? "").trim();
}

function classHas(attrs: string, token: string): boolean {
  return attrValue(attrs, "class").split(/\s+/).includes(token);
}

function innerFrom(html: string, start: number): string | null {
  const open = html.slice(start).match(/^<([a-zA-Z0-9]+)\b[^>]*>/);
  if (!open) return null;
  const name = open[1].toLowerCase();
  if (VOID.has(name)) return "";
  const from = start + open[0].length;
  const re = new RegExp(`<(/?)${name}\\b[^>]*>`, "gi");
  re.lastIndex = from;
  let depth = 1;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const closing = Boolean(match[1]);
    const selfClosing = !closing && /\/>\s*$/.test(match[0]);
    if (closing) depth -= 1;
    else if (!selfClosing) depth += 1;
    if (depth === 0) return html.slice(from, match.index);
  }
  return html.slice(from, from + 250_000);
}

function findTag(html: string, predicate: (name: string, attrs: string) => boolean): string | null {
  const re = /<([a-zA-Z0-9]+)\b([^>]*)>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    if (!predicate(match[1].toLowerCase(), match[2] ?? "")) continue;
    return innerFrom(html, match.index);
  }
  return null;
}

function bestRegion(html: string): string | null {
  const article = findTag(html, (name) => name === "article");
  if (article && visibleText(article).length >= 180) return article;
  const main = findTag(html, (name) => name === "main");
  if (main && visibleText(main).length >= 180) return main;
  const re = /<(div|section|article|main)\b([^>]*)>/gi;
  let match: RegExpExecArray | null;
  let best: string | null = null;
  let bestLength = 0;
  let seen = 0;
  while ((match = re.exec(html)) && seen < 40) {
    const attrs = match[2] ?? "";
    const name = match[1].toLowerCase();
    const interesting =
      name === "article" ||
      name === "main" ||
      /content|article|post|entry|rich|markdown|body/i.test(attrs);
    if (!interesting) continue;
    seen += 1;
    const inner = innerFrom(html, match.index);
    if (!inner) continue;
    const length = visibleText(inner).length;
    if (length > bestLength) {
      best = inner;
      bestLength = length;
    }
  }
  return best;
}

function pickRegion(html: string, pageUrl: string): string {
  const host = hostOf(pageUrl);
  if (host === "mp.weixin.qq.com") {
    return findTag(html, (_name, attrs) => attrValue(attrs, "id") === "js_content") ?? html;
  }
  if (host === "sspai.com" || host.endsWith(".sspai.com")) {
    return (
      findTag(html, (_name, attrs) => attrValue(attrs, "id") === "article-content") ??
      findTag(html, (_name, attrs) => classHas(attrs, "article-body")) ??
      findTag(html, (name, attrs) => name === "article" || classHas(attrs, "content")) ??
      html
    );
  }
  if (host === "zhuanlan.zhihu.com") {
    return (
      findTag(html, (_name, attrs) => classHas(attrs, "Post-RichText")) ??
      findTag(html, (_name, attrs) => classHas(attrs, "RichText")) ??
      html
    );
  }
  return bestRegion(html) ?? html;
}

function absoluteUrl(value: string, base: string): string | null {
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

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, "&quot;");
}

interface TagToken {
  kind: "start" | "end";
  name: string;
  attrs: string;
  selfClosing: boolean;
}

function parseTag(raw: string): TagToken | null {
  const match = raw.match(/^<(\/?)([a-zA-Z0-9]+)\b([^>]*)>$/);
  if (!match) return null;
  const name = (RENAME[match[2].toLowerCase()] ?? match[2].toLowerCase());
  const attrs = match[3] ?? "";
  const selfClosing = Boolean(match[1]) ? false : /\/>\s*$/.test(raw) || VOID.has(name);
  return { kind: match[1] ? "end" : "start", name, attrs, selfClosing };
}

function allowedAttrs(name: string, attrs: string, base: string): string | null {
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
    const parts: string[] = [];
    for (const key of ["colspan", "rowspan"]) {
      const value = attrValue(attrs, key);
      if (/^[1-9]\d?$/.test(value)) parts.push(` ${key}="${value}"`);
    }
    return parts.join("");
  }
  return "";
}

/**
 * Keep a small set of tags, drop scripts and event handlers, and absolutize links.
 * Returns an empty string when nothing safe remains.
 */
export function sanitizeHtml(input: string, baseUrl: string): string {
  const source = decodeXml(input)
    .replace(/<head\b[\s\S]*?<\/head>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const parts: string[] = [];
  const stack: string[] = [];
  let bytes = 0;
  let dropDepth = 0;
  let dropTag = "";
  let inPre = 0;
  let stopped = false;

  const push = (chunk: string): boolean => {
    const size = new TextEncoder().encode(chunk).length;
    if (bytes + size > CONTENT_MAX_BYTES) return false;
    bytes += size;
    parts.push(chunk);
    return true;
  };

  const closeTag = (open: string) => {
    if (open === "pre") inPre = Math.max(0, inPre - 1);
    parts.push(`</${open}>`);
  };
  const closeThrough = (name: string | null) => {
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
  };

  const re = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g;
  let match: RegExpExecArray | null;
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

/** Turn a feed fragment or an article page into sanitized HTML, or null. */
export function articleHtmlFromSource(raw: string, pageUrl: string): string | null {
  if (!raw.trim()) return null;
  const documentLike = /<html[\s>]|<body[\s>]/i.test(raw);
  const special = /mp\.weixin\.qq\.com|sspai\.com|zhuanlan\.zhihu\.com/i.test(pageUrl);
  const region = documentLike || special ? pickRegion(raw, pageUrl) : raw;
  const clean = sanitizeHtml(region, pageUrl);
  return isFullArticle(clean) ? clean : null;
}
