-- 正文纯文本，供中文子串搜索。由采集和 POST /admin/reindex 写入。
ALTER TABLE items ADD COLUMN content_text TEXT;
