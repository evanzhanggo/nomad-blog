import { visibleText } from "./content";
import { TOPICS } from "./score";
import { esc } from "./text";

export const SEARCH_PAGE_SIZE = 50;
const QUERY_MAX = 80;
const TEXT_MAX = 20_000;

export function normalizeSearchQuery(raw: string | null): string {
  return (raw ?? "").replace(/\s+/g, " ").trim().slice(0, QUERY_MAX);
}

/** Bound LIKE pattern. `%`, `_`, and `\` in the query stay literal. */
export function likePattern(query: string): string {
  const escaped = query.replace(/[\\%_]/g, (char) => `\\${char}`);
  return `%${escaped}%`;
}

export function topicIdsFor(query: string): string[] {
  const needle = query.toLowerCase();
  return TOPICS.filter(
    (topic) => topic.id.toLowerCase().includes(needle) || topic.label.toLowerCase().includes(needle),
  ).map((topic) => topic.id);
}

export function plainContent(html: string | null | undefined): string | null {
  if (!html) return null;
  const text = visibleText(html);
  if (!text) return "";
  return Array.from(text).slice(0, TEXT_MAX).join("");
}

export function highlight(text: string, query: string): string {
  const needle = query.trim();
  if (!needle) return esc(text);
  const haystack = text.toLowerCase();
  const target = needle.toLowerCase();
  let html = "";
  let cursor = 0;
  while (cursor < text.length) {
    const index = haystack.indexOf(target, cursor);
    if (index < 0) {
      html += esc(text.slice(cursor));
      break;
    }
    html += esc(text.slice(cursor, index));
    html += `<mark>${esc(text.slice(index, index + needle.length))}</mark>`;
    cursor = index + needle.length;
    if (cursor <= index) break;
  }
  return html;
}

export function cardSnippet(
  item: { title: string; ai_summary?: string | null; excerpt: string; content_snippet?: string | null },
  query: string,
): string {
  const summary = item.ai_summary || item.excerpt || "";
  const needle = query.trim().toLowerCase();
  if (!needle) return summary;
  if (summary.toLowerCase().includes(needle) || item.title.toLowerCase().includes(needle)) return summary;
  const snippet = item.content_snippet ?? "";
  if (snippet.toLowerCase().includes(needle)) return snippet;
  return summary;
}
