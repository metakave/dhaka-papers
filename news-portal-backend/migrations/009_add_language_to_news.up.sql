-- Add language column to news table
ALTER TABLE news ADD COLUMN lang VARCHAR(10) DEFAULT 'bn' NOT NULL;

-- Add index for filtering by language
CREATE INDEX idx_news_lang ON news(lang);
