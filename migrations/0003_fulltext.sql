-- 文章全文和 AI 摘要。items 就是文章表。
-- content_html 为空时页面回退到摘要。content_fetched_at 记下最近一次抓取尝试。
-- ai_summary 为空时列表用原来的 RSS 摘要。ai_summary_at 记下最近一次摘要尝试。
ALTER TABLE items ADD COLUMN content_html TEXT;
ALTER TABLE items ADD COLUMN content_fetched_at TEXT;
ALTER TABLE items ADD COLUMN ai_summary TEXT;
ALTER TABLE items ADD COLUMN ai_summary_at TEXT;
