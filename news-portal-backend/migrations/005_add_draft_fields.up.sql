ALTER TABLE news
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published' NOT NULL,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update historical data to be published
UPDATE news SET status = 'published', published_at = created_at WHERE status IS NULL;

-- Categories priority
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0 NOT NULL;

-- Indexes for status and published_at
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_categories_priority ON categories(priority);
