-- Remove the global unique constraint on slug
ALTER TABLE news DROP CONSTRAINT IF EXISTS news_slug_key;

-- Add composite unique constraint for slug and language
ALTER TABLE news ADD CONSTRAINT news_slug_lang_key UNIQUE (slug, lang);

-- Ensure indexes are optimized for the new constraint
DROP INDEX IF EXISTS idx_news_slug;
CREATE INDEX idx_news_slug_lang ON news(slug, lang);
