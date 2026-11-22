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

function whereClause(sourceId: string, tag: string): { sql: string; binds: string[] } {
  const parts: string[] = [];
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
      `SELECT id, canonical_url, title, excerpt, source_id, source_name, author,
              published_at, collected_at, popularity, popularity_label, tags, language, discussion_url
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
      `SELECT id, canonical_url, title, excerpt, source_id, source_name, author,
              published_at, collected_at, popularity, popularity_label, tags, language, discussion_url
       FROM items WHERE id = ?`,
    )
    .bind(id)
    .first<ItemRow>();
}

export async function recentItems(db: D1Database, limit = 30): Promise<ItemRow[]> {
  const rows = await db
    .prepare(
      `SELECT id, canonical_url, title, excerpt, source_id, source_name, author,
              published_at, collected_at, popularity, popularity_label, tags, language, discussion_url
       FROM items
       ORDER BY collected_at DESC, popularity DESC, id DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<ItemRow>();
  return rows.results ?? [];
}
