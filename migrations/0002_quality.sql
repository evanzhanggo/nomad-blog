-- 质量分、主题，以及每日收录 / 经典回填的分区。
ALTER TABLE items ADD COLUMN topic TEXT NOT NULL DEFAULT '';
ALTER TABLE items ADD COLUMN quality_score INTEGER NOT NULL DEFAULT 0;
ALTER TABLE items ADD COLUMN section TEXT NOT NULL DEFAULT 'daily';

CREATE INDEX IF NOT EXISTS idx_items_section
  ON items (section, topic, quality_score DESC, id DESC);
