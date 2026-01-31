-- Add title_en column to news table
ALTER TABLE news ADD COLUMN title_en TEXT;

-- For existing records, populate title_en with a placeholder or copy the existing title 
-- to avoid NULL issues if we make it NOT NULL later.
-- For now, we leave it nullable but we can set a default.
UPDATE news SET title_en = title WHERE title_en IS NULL;
