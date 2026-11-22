import { tagString } from "./tags";
import { authorName, canonicalUrl, clip, excerptOf, plainTitle, rankScore, toIso } from "./text";
import type { Draft, DraftInput } from "./types";

const BLOCKED =
  /remote code execution|\brce\b|\bcve-\d|vulnerability|exploit|buffer overflow|privilege escalation/i;

export function detectLanguage(title: string, excerpt: string): "zh" | "en" {
  const cjk = `${title}${excerpt}`.match(/[\u4e00-\u9fff]/g);
  return cjk && cjk.length >= 2 ? "zh" : "en";
}

export function buildDraft(input: DraftInput): Draft | null {
  const title = clip(plainTitle(input.title), 200);
  const canonical = canonicalUrl(input.url);
  if (!title || !canonical) return null;
  if (BLOCKED.test(title)) return null;
  const excerpt = excerptOf(input.excerpt ?? "", title);
  const publishedAt = toIso(input.publishedAt);
  const popularity = Math.max(0, Math.round(input.popularity ?? 0));
  const discussion = input.discussionUrl ? canonicalUrl(input.discussionUrl) : null;
  return {
    canonicalUrl: canonical,
    title,
    excerpt,
    sourceId: input.sourceId,
    sourceName: input.sourceName,
    author: authorName(input.author),
    publishedAt,
    popularity,
    popularityLabel: input.popularityLabel ?? "",
    discussionUrl: discussion && discussion !== canonical ? discussion : null,
    rankScore: rankScore(popularity, publishedAt, input.commentBonus ?? 0),
    tags: tagString(title, excerpt),
    language: detectLanguage(title, excerpt),
  };
}

export function withTag(draft: Draft | null, tag: string): Draft | null {
  if (!draft) return null;
  const ids = draft.tags.split("|").filter(Boolean);
  if (ids.includes(tag)) return draft;
  ids.unshift(tag);
  return { ...draft, tags: `|${ids.slice(0, 4).join("|")}|` };
}

export function byRank(a: Draft, b: Draft): number {
  return (
    b.rankScore - a.rankScore ||
    b.popularity - a.popularity ||
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
  );
}

export function dedupeDrafts(items: Draft[]): Draft[] {
  const byUrl = new Map<string, Draft>();
  for (const item of items) {
    const current = byUrl.get(item.canonicalUrl);
    if (!current || item.rankScore > current.rankScore) byUrl.set(item.canonicalUrl, item);
  }
  return [...byUrl.values()];
}
