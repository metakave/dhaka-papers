ALTER TABLE news
DROP COLUMN status,
DROP COLUMN published_at;

ALTER TABLE categories
DROP COLUMN priority;
