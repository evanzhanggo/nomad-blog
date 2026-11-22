-- 游牧手记只保存标题、短摘要和出处，不保存正文。
-- excerpt 由采集器截到 300 个字符以内。

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  canonical_url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  author TEXT,
  published_at TEXT,
  collected_at TEXT NOT NULL,
  popularity INTEGER NOT NULL DEFAULT 0,
  popularity_label TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '',
  language TEXT NOT NULL DEFAULT 'en',
  discussion_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_items_collected
  ON items (collected_at DESC, popularity DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_items_source
  ON items (source_id, collected_at DESC);

CREATE TABLE IF NOT EXISTS collect_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  trigger TEXT NOT NULL,
  status TEXT NOT NULL,
  inserted_count INTEGER NOT NULL DEFAULT 0,
  duplicate_count INTEGER NOT NULL DEFAULT 0,
  capped_count INTEGER NOT NULL DEFAULT 0,
  report TEXT NOT NULL DEFAULT ''
);
