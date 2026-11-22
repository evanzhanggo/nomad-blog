import { byRank, dedupeDrafts } from "./item";
import { SOURCES } from "./sources";
import type { CollectReport, Draft, Env, Source, SourceLoad } from "./types";

export const DAILY_LIMIT = 16;

export async function loadSource(source: Source): Promise<SourceLoad> {
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
      items: [],
    };
  }
}

export async function loadSources(sources: Source[] = SOURCES): Promise<SourceLoad[]> {
  return Promise.all(sources.map((source) => loadSource(source)));
}

export function selectHybrid(items: Draft[], limit: number): Draft[] {
  const groups = new Map<string, Draft[]>();
  for (const item of items) {
    const list = groups.get(item.sourceId) ?? [];
    list.push(item);
    groups.set(item.sourceId, list);
  }
  for (const list of groups.values()) list.sort(byRank);
  const picked: Draft[] = [];
  const seen = new Set<string>();
  const ordered = [...groups.values()].sort((a, b) => byRank(a[0] as Draft, b[0] as Draft));
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

export function selectFresh(
  items: Draft[],
  existing: Set<string>,
  limit = DAILY_LIMIT,
): { picked: Draft[]; duplicates: number; capped: number } {
  const unique = dedupeDrafts(items);
  const fresh = unique.filter((item) => !existing.has(item.canonicalUrl));
  const picked = selectHybrid(fresh, limit);
  return {
    picked,
    duplicates: unique.length - fresh.length,
    capped: fresh.length - picked.length,
  };
}

async function existingUrls(db: D1Database, urls: string[]): Promise<Set<string>> {
  const found = new Set<string>();
  for (let index = 0; index < urls.length; index += 80) {
    const chunk = urls.slice(index, index + 80);
    const placeholders = chunk.map(() => "?").join(", ");
    const rows = await db
      .prepare(`SELECT canonical_url FROM items WHERE canonical_url IN (${placeholders})`)
      .bind(...chunk)
      .all<{ canonical_url: string }>();
    for (const row of rows.results ?? []) found.add(row.canonical_url);
  }
  return found;
}

export async function runCollect(env: Env, trigger: "cron" | "manual"): Promise<CollectReport> {
  const startedAt = new Date().toISOString();
  const loaded = await loadSources();
  const pool = loaded.flatMap((source) => source.items);
  const existing = await existingUrls(
    env.DB,
    [...new Set(pool.map((item) => item.canonicalUrl))],
  );
  const { picked, duplicates, capped } = selectFresh(pool, existing, DAILY_LIMIT);
  const collectedAt = new Date().toISOString();
  let inserted = 0;
  if (picked.length) {
    const results = await env.DB.batch(
      picked.map((item) =>
        env.DB.prepare(
          `INSERT INTO items (
            canonical_url, title, excerpt, source_id, source_name, author,
            published_at, collected_at, popularity, popularity_label, tags,
            language, discussion_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(canonical_url) DO NOTHING`,
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
        ),
      ),
    );
    inserted = results.reduce((sum, result) => sum + (result.meta?.changes ?? 0), 0);
  }

  const failed = loaded.filter((source) => !source.ok).length;
  const status: CollectReport["status"] =
    failed === 0 ? "ok" : failed === loaded.length ? "error" : "partial";
  const report: CollectReport = {
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
      error: source.error,
    })),
  };

  await env.DB.prepare(
    `INSERT INTO collect_runs (
      started_at, finished_at, trigger, status, inserted_count, duplicate_count, capped_count, report
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      startedAt,
      new Date().toISOString(),
      trigger,
      status,
      inserted,
      duplicates,
      capped,
      JSON.stringify(report).slice(0, 20_000),
    )
    .run();

  console.log(
    JSON.stringify({
      trigger,
      status,
      inserted,
      duplicates,
      capped,
      titles: picked.map((item) => `${item.sourceId}: ${item.title}`),
    }),
  );
  return report;
}
