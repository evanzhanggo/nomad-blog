export interface Env {
  DB: D1Database;
  ADMIN_TOKEN?: string;
}

export interface DraftInput {
  url: string;
  title: string;
  excerpt?: string;
  sourceId: string;
  sourceName: string;
  author?: string | null;
  publishedAt?: string | number | null;
  popularity?: number;
  popularityLabel?: string;
  discussionUrl?: string | null;
  commentBonus?: number;
}

export interface Draft {
  canonicalUrl: string;
  title: string;
  excerpt: string;
  sourceId: string;
  sourceName: string;
  author: string | null;
  publishedAt: string | null;
  popularity: number;
  popularityLabel: string;
  discussionUrl: string | null;
  rankScore: number;
  tags: string;
  language: "zh" | "en";
}

export interface ItemRow {
  id: number;
  canonical_url: string;
  title: string;
  excerpt: string;
  source_id: string;
  source_name: string;
  author: string | null;
  published_at: string | null;
  collected_at: string;
  popularity: number;
  popularity_label: string;
  tags: string;
  language: string;
  discussion_url: string | null;
}

export interface Source {
  id: string;
  name: string;
  /** 给人看的抓取地址，方便在关于页和 README 里对照。 */
  hint: string;
  fetch: () => Promise<Draft[]>;
}

export interface SourceLoad {
  id: string;
  name: string;
  ok: boolean;
  error: string | null;
  items: Draft[];
}

export interface CollectReport {
  ok: boolean;
  trigger: "cron" | "manual";
  status: "ok" | "partial" | "error";
  inserted: number;
  duplicates: number;
  capped: number;
  sources: Array<{
    id: string;
    name: string;
    ok: boolean;
    fetched: number;
    error: string | null;
  }>;
}
