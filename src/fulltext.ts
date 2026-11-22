import { articleHtmlFromSource } from "./content";
import { summarizeArticle } from "./summary";
import { USER_AGENT } from "./text";
import type { Draft, Env } from "./types";

export const CONTENT_FETCH_LIMIT = 4;
export const SUMMARY_LIMIT = 4;
export const ADMIN_BATCH_DEFAULT = 4;
export const ADMIN_BATCH_MAX = 8;
const RETRY_MS = 12 * 60 * 60 * 1000;

export function parseBatchLimit(raw: string | null): number {
  if (raw == null || raw === "" || !/^\d+$/.test(raw)) return ADMIN_BATCH_DEFAULT;
  const value = Number(raw);
  if (value < 1) return ADMIN_BATCH_DEFAULT;
  return Math.min(value, ADMIN_BATCH_MAX);
}

export async function fetchPage(url: string, timeoutMs = 8_000): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (type && !/html|xml|text\/plain/i.test(type)) return null;
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > 2_000_000) return null;
    return new TextDecoder("utf-8").decode(buffer);
  } catch {
    return null;
  }
}

async function writeContent(db: D1Database, url: string, html: string | null, at: string): Promise<void> {
  await db
    .prepare(
      `UPDATE items
       SET content_html = ?, content_fetched_at = ?
       WHERE canonical_url = ? AND content_html IS NULL`,
    )
    .bind(html, at, url)
    .run();
}

async function writeSummary(db: D1Database, id: number, summary: string | null, at: string): Promise<void> {
  await db
    .prepare(
      `UPDATE items
       SET ai_summary = ?, ai_summary_at = ?
       WHERE id = ? AND ai_summary IS NULL`,
    )
    .bind(summary, at, id)
    .run();
}

async function summarizeRow(
  env: Env,
  row: { id: number; title: string; excerpt: string; content_html: string | null },
  at: string,
): Promise<boolean> {
  if (!env.AI) return false;
  const summary = await summarizeArticle(env.AI, row.title, row.content_html, row.excerpt ?? "");
  await writeSummary(env.DB, row.id, summary, at);
  return summary != null;
}

export async function storeAndFetchContent(
  env: Env,
  items: Draft[],
  fetchLimit: number,
  summaryLimit: number,
): Promise<{ fromFeed: number; fetched: number; failed: number; summarized: number }> {
  let fromFeed = 0;
  let fetched = 0;
  let failed = 0;
  let summarized = 0;
  let fetches = 0;
  let summaries = 0;
  const at = new Date().toISOString();
  for (const item of items) {
    try {
      let html = item.feedHtml ? articleHtmlFromSource(item.feedHtml, item.canonicalUrl) : null;
      let attempted = Boolean(html);
      if (html) fromFeed += 1;
      if (!html && fetches < fetchLimit) {
        fetches += 1;
        attempted = true;
        const page = await fetchPage(item.canonicalUrl);
        html = page ? articleHtmlFromSource(page, item.canonicalUrl) : null;
        if (html) fetched += 1;
        else failed += 1;
      }
      if (!attempted) continue;
      await writeContent(env.DB, item.canonicalUrl, html, at);
      if (!html || summaries >= summaryLimit || !env.AI) continue;
      const row = await env.DB.prepare(
        `SELECT id, title, excerpt, content_html FROM items WHERE canonical_url = ?`,
      )
        .bind(item.canonicalUrl)
        .first<{ id: number; title: string; excerpt: string; content_html: string | null }>();
      if (!row) continue;
      summaries += 1;
      if (await summarizeRow(env, row, at)) summarized += 1;
    } catch (error) {
      console.error("content attach failed", error instanceof Error ? error.message : error);
      failed += 1;
    }
  }
  return { fromFeed, fetched, failed, summarized };
}

export async function fillMissingContent(
  env: Env,
  limit: number,
): Promise<{ limit: number; scanned: number; filled: number; failed: number; summarized: number }> {
  const cutoff = new Date(Date.now() - RETRY_MS).toISOString();
  const rows = await env.DB.prepare(
    `SELECT id, canonical_url, title, excerpt FROM items
     WHERE content_html IS NULL
       AND (content_fetched_at IS NULL OR content_fetched_at < ?)
     ORDER BY content_fetched_at IS NOT NULL, id
     LIMIT ?`,
  )
    .bind(cutoff, limit)
    .all<{ id: number; canonical_url: string; title: string; excerpt: string }>();
  const pending = rows.results ?? [];
  let filled = 0;
  let failed = 0;
  let summarized = 0;
  const at = new Date().toISOString();
  for (const row of pending) {
    try {
      const page = await fetchPage(row.canonical_url);
      const html = page ? articleHtmlFromSource(page, row.canonical_url) : null;
      await writeContent(env.DB, row.canonical_url, html, at);
      if (!html) {
        failed += 1;
        continue;
      }
      filled += 1;
      if (!env.AI) continue;
      if (await summarizeRow(env, { ...row, content_html: html }, at)) summarized += 1;
    } catch (error) {
      console.error("fetch-content failed", error instanceof Error ? error.message : error);
      failed += 1;
    }
  }
  return { limit, scanned: pending.length, filled, failed, summarized };
}

export async function fillMissingSummaries(
  env: Env,
  limit: number,
): Promise<{ limit: number; scanned: number; summarized: number; failed: number }> {
  const cutoff = new Date(Date.now() - RETRY_MS).toISOString();
  const rows = await env.DB.prepare(
    `SELECT id, title, excerpt, content_html FROM items
     WHERE ai_summary IS NULL
       AND (ai_summary_at IS NULL OR ai_summary_at < ?)
       AND (content_html IS NOT NULL OR excerpt != '')
     ORDER BY content_html IS NULL, ai_summary_at IS NOT NULL, id
     LIMIT ?`,
  )
    .bind(cutoff, limit)
    .all<{ id: number; title: string; excerpt: string; content_html: string | null }>();
  const pending = rows.results ?? [];
  let summarized = 0;
  let failed = 0;
  const at = new Date().toISOString();
  for (const row of pending) {
    try {
      if (await summarizeRow(env, row, at)) summarized += 1;
      else failed += 1;
    } catch (error) {
      console.error("summarize failed", error instanceof Error ? error.message : error);
      failed += 1;
    }
  }
  return { limit, scanned: pending.length, summarized, failed };
}
