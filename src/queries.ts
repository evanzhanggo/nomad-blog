import { likePattern, SEARCH_PAGE_SIZE, topicIdsFor } from "./search";
import type { ItemRow } from "./types";

export const PAGE_SIZE = 20;

export function parsePage(raw: string | null): number {
  if (!raw) return 1;
  if (!/^\d+$/.test(raw)) return 1;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) return 1;
  return Math.min(value, 1000);
}

export function pageCount(total: number, pageSize = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function normalizePage(requested: number, total: number, pageSize = PAGE_SIZE): number {
  return Math.min(Math.max(1, requested), pageCount(total, pageSize));
}

const ITEM_COLUMNS = `id, canonical_url, title, excerpt, source_id, source_name, author,
  published_at, collected_at, popularity, popularity_label, tags, language, discussion_url,
  topic, quality_score, section, ai_summary`;

const DETAIL_COLUMNS = `${ITEM_COLUMNS}, content_html, content_fetched_at, ai_summary_at`;

function whereClause(sourceId: string, tag: string): { sql: string; binds: string[] } {
  const parts = ["section = 'daily'"];
  const binds: string[] = [];
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
    binds,
  };
}

export async function countItems(db: D1Database, sourceId: string, tag: string): Promise<number> {
  const where = whereClause(sourceId, tag);
  const row = await db
    .prepare(`SELECT COUNT(*) AS n FROM items ${where.sql}`)
    .bind(...where.binds)
    .first<{ n: number }>();
  return Number(row?.n ?? 0);
}

export async function listItems(
  db: D1Database,
  sourceId: string,
  tag: string,
  page: number,
): Promise<ItemRow[]> {
  const where = whereClause(sourceId, tag);
  const offset = (page - 1) * PAGE_SIZE;
  const rows = await db
    .prepare(
      `SELECT ${ITEM_COLUMNS}
       FROM items ${where.sql}
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...where.binds, PAGE_SIZE, offset)
    .all<ItemRow>();
  return rows.results ?? [];
}

export async function getItem(db: D1Database, id: number): Promise<ItemRow | null> {
  return db
    .prepare(
      `SELECT ${DETAIL_COLUMNS}
       FROM items WHERE id = ?`,
    )
    .bind(id)
    .first<ItemRow>();
}

export async function recentItems(db: D1Database, limit = 30): Promise<ItemRow[]> {
  const rows = await db
    .prepare(
      `SELECT ${ITEM_COLUMNS}
       FROM items
       WHERE section = 'daily'
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<ItemRow>();
  return rows.results ?? [];
}

export async function listClassics(db: D1Database, topic: string): Promise<ItemRow[]> {
  const rows = await db
    .prepare(
      `SELECT ${ITEM_COLUMNS}
       FROM items
       WHERE section = 'classic' AND (? = '' OR topic = ?)
       ORDER BY quality_score DESC, id DESC
       LIMIT ?`,
    )
    .bind(topic, topic, topic ? 12 : 6)
    .all<ItemRow>();
  return rows.results ?? [];
}

function searchWhere(query: string): { sql: string; binds: string[] } {
  const pattern = likePattern(query);
  const topics = topicIdsFor(query);
  const parts = [
    "title LIKE ? ESCAPE '\\'",
    "ifnull(ai_summary, '') LIKE ? ESCAPE '\\'",
    "excerpt LIKE ? ESCAPE '\\'",
    "source_name LIKE ? ESCAPE '\\'",
    "topic LIKE ? ESCAPE '\\'",
    "ifnull(content_text, '') LIKE ? ESCAPE '\\'",
  ];
  const binds = [pattern, pattern, pattern, pattern, pattern, pattern];
  if (topics.length) {
    parts.push(`topic IN (${topics.map(() => "?").join(", ")})`);
    binds.push(...topics);
  }
  return { sql: parts.join(" OR "), binds };
}

export async function countSearch(db: D1Database, query: string): Promise<number> {
  const where = searchWhere(query);
  const row = await db
    .prepare(`SELECT COUNT(*) AS n FROM items WHERE ${where.sql}`)
    .bind(...where.binds)
    .first<{ n: number }>();
  return Number(row?.n ?? 0);
}

export async function searchItems(db: D1Database, query: string, page: number): Promise<ItemRow[]> {
  const where = searchWhere(query);
  const offset = (page - 1) * SEARCH_PAGE_SIZE;
  const rows = await db
    .prepare(
      `SELECT ${ITEM_COLUMNS},
         substr(
           ifnull(content_text, ''),
           max(1, instr(lower(ifnull(content_text, '')), lower(?)) - 24),
           96
         ) AS content_snippet
       FROM items
       WHERE ${where.sql}
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(query, ...where.binds, SEARCH_PAGE_SIZE, offset)
    .all<ItemRow>();
  return rows.results ?? [];
}
