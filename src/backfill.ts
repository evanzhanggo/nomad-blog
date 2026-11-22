import classics from "../data/classics.json";
import { storeAndFetchContent } from "./fulltext";
import { FEEDS, qualifyFeed } from "./sources";
import { buildDraft } from "./item";
import { TOPICS } from "./score";
import { excerptOf, fetchText, plainTitle } from "./text";
import type { Draft, Env } from "./types";

interface Seed {
  url: string;
  title: string;
  sourceId: string;
  sourceName: string;
  author: string | null;
  topic: string;
}

export interface BackfillReport {
  ok: boolean;
  inserted: number;
  skipped: number;
  byTopic: Record<string, number>;
  seeds: { ok: number; failed: number };
  feeds: Array<{ id: string; qualified: number; error: string | null }>;
}

function pageExcerpt(html: string): { title: string; excerpt: string } {
  const head = html.slice(0, 80_000);
  const title = plainTitle(head.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "");
  const raw =
    head.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] ??
    head.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1] ??
    head.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i)?.[1] ??
    "";
  return { title, excerpt: excerptOf(raw, title) };
}

async function draftFromSeed(seed: Seed): Promise<Draft | null> {
  const html = await fetchText(seed.url, 12_000);
  const page = pageExcerpt(html);
  const title = page.title || seed.title;
  return buildDraft({
    url: seed.url,
    title,
    excerpt: page.excerpt,
    sourceId: seed.sourceId,
    sourceName: seed.sourceName,
    author: seed.author,
    contentHtml: html,
  });
}

async function insertClassics(env: Env, items: Draft[]): Promise<{ inserted: number; skipped: number }> {
  if (!items.length) return { inserted: 0, skipped: 0 };
  const collectedAt = new Date().toISOString();
  const results = await env.DB.batch(
    items.map((item) =>
      env.DB.prepare(
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
          END`,
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
        item.qualityScore,
      ),
    ),
  );
  const inserted = results.reduce((sum, result) => sum + (result.meta?.changes ?? 0), 0);
  return { inserted, skipped: items.length - inserted };
}

export async function runBackfill(env: Env): Promise<BackfillReport> {
  const byTopic: Record<string, number> = Object.fromEntries(TOPICS.map((topic) => [topic.id, 0]));
  const pool: Draft[] = [];
  const seen = new Set<string>();
  const feeds: BackfillReport["feeds"] = [];

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
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  let seedOk = 0;
  let seedFailed = 0;
  for (const seed of classics as Seed[]) {
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
    feeds,
  };
}
