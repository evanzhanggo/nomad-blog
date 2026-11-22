export const USER_AGENT =
  "NomadBlogBot/1.0 (+https://nomad.evanzhang.cloud; excerpts-only; attribution)";

export const EXCERPT_MAX = 300;

const TRACKING_PARAMS = new Set([
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
  "gi",
]);

export function safeCodePoint(value: number): string {
  if (!Number.isInteger(value) || value < 0 || value > 0x10ffff) return "";
  if (value >= 0xd800 && value <= 0xdfff) return "";
  return String.fromCodePoint(value);
}

/** Decode XML/HTML entities, including one level of double-escaping. */
export function decodeXml(input: string): string {
  let text = input.replace(/^\uFEFF/, "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  for (let pass = 0; pass < 2; pass++) {
    text = text
      .replace(/&#(\d+);/g, (_, n: string) => safeCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => safeCodePoint(parseInt(n, 16)))
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  }
  return text;
}

export function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

/** Plain text for titles. Keeps URLs out of the whitespace collapse only. */
export function plainTitle(input: string): string {
  let text = decodeXml(input);
  if (/<[a-z!/]/i.test(text)) text = decodeXml(stripTags(text));
  return text.replace(/\s+/g, " ").trim();
}

/** Plain text for excerpts: no tags, no raw URLs, no markdown images. */
export function plainExcerpt(input: string): string {
  let text = decodeXml(input);
  const snippet = text.match(/medium-feed-snippet">([\s\S]*?)<\/p>/i);
  if (snippet) text = decodeXml(snippet[1]);
  if (/<[a-z!/]/i.test(text)) text = decodeXml(stripTags(text));
  return text
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function clip(text: string, max = EXCERPT_MAX): string {
  const chars = Array.from(text);
  if (chars.length <= max) return text;
  return `${chars.slice(0, max - 1).join("").trimEnd()}…`;
}

export function excerptOf(raw: string, title = ""): string {
  let text = plainExcerpt(raw);
  const normalizedTitle = plainTitle(title);
  if (normalizedTitle && text.startsWith(normalizedTitle)) {
    text = text.slice(normalizedTitle.length).trim();
  }
  return clip(text, EXCERPT_MAX);
}

export function canonicalUrl(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  url.protocol = "https:";
  url.hash = "";
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const kept: Array<[string, string]> = [];
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

export function toIso(value: string | number | null | undefined): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const ms = value < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function authorName(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const text = plainTitle(raw);
  if (!text) return null;
  const wrapped = text.match(/\(([^)]+)\)\s*$/);
  const name = (wrapped?.[1] ?? text).trim();
  if (!name || name.includes("@")) return null;
  return clip(name, 80);
}

export function rankScore(
  popularity: number,
  publishedAt: string | null,
  commentBonus = 0,
): number {
  let score = Math.max(0, popularity) + Math.max(0, commentBonus);
  if (publishedAt) {
    const ageDays = (Date.now() - Date.parse(publishedAt)) / 86_400_000;
    if (Number.isFinite(ageDays)) {
      if (ageDays < 2) score += 6;
      else if (ageDays < 10) score += 3;
      else if (ageDays > 400) score -= 4;
    }
  }
  return Math.round(score * 10) / 10;
}

export function esc(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function xmlEsc(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function safeHref(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return esc(url.toString());
  } catch {
    /* ignore */
  }
  return "#";
}

export function shanghaiDayKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function shanghaiLabel(iso: string, withWeekday = true): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: withWeekday ? "short" : undefined,
  }).format(new Date(iso));
}

export function rfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

export async function fetchText(url: string, timeoutMs = 12_000): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept:
        "application/rss+xml, application/atom+xml, application/feed+json, application/json, text/xml, */*;q=0.5",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`.trim());
  }
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > 2_500_000) throw new Error("response too large");
  return new TextDecoder("utf-8").decode(buffer);
}

export async function fetchJson<T>(url: string, timeoutMs = 12_000): Promise<T> {
  const text = await fetchText(url, timeoutMs);
  const trimmed = text.trimStart();
  if (trimmed.startsWith("<")) throw new Error("expected JSON, got HTML");
  return JSON.parse(text) as T;
}
