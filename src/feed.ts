import { authorName, excerptOf, plainTitle, toIso } from "./text";

export interface FeedEntry {
  url: string;
  title: string;
  excerpt: string;
  author: string | null;
  publishedAt: string | null;
  /** Raw `content:encoded` or Atom `content`, when the feed has one. */
  contentHtml: string | null;
}

function inner(block: string, names: string[]): string {
  for (const name of names) {
    const match = block.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, "i"));
    if (match?.[1]) return match[1];
  }
  return "";
}

function rssLink(block: string): string {
  const match = block.match(/<link\b[^>]*>([^<]*)<\/link>/i);
  return (match?.[1] ?? "").trim();
}

function atomLink(block: string): string {
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

function entryAuthor(block: string): string | null {
  const creator = authorName(inner(block, ["dc:creator", "creator"]));
  if (creator) return creator;
  const named = authorName(inner(inner(block, ["author"]), ["name"]));
  if (named) return named;
  return authorName(inner(block, ["author"]));
}

function entryFrom(block: string, link: string): FeedEntry | null {
  const title = plainTitle(inner(block, ["title"]));
  const url = link || inner(block, ["guid", "id"]).trim();
  if (!title || !url) return null;
  const author = entryAuthor(block);
  const publishedAt = toIso(
    plainTitle(inner(block, ["pubDate", "published", "updated", "dc:date", "date"])),
  );
  const encoded = inner(block, ["content:encoded"]) || inner(block, ["content"]);
  const rawExcerpt = inner(block, ["description", "summary"]) || encoded;
  return {
    url,
    title: title.slice(0, 300),
    excerpt: excerptOf(rawExcerpt, title),
    author,
    publishedAt,
    contentHtml: encoded || null,
  };
}

export function parseFeed(xml: string): FeedEntry[] {
  const source = xml.replace(/^\uFEFF/, "");
  const items = [...source.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) =>
    entryFrom(match[1] ?? "", rssLink(match[1] ?? "")),
  );
  if (items.length) return items.filter((entry): entry is FeedEntry => entry !== null);
  const entries = [...source.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((match) =>
    entryFrom(match[1] ?? "", atomLink(match[1] ?? "")),
  );
  return entries.filter((entry): entry is FeedEntry => entry !== null);
}
