-- Migration: Set default name_en for existing owners
-- This sets name_en = name for any owner that doesn't have an English name set yet.
UPDATE owners SET name_en = name WHERE name_en IS NULL OR name_en = '';
