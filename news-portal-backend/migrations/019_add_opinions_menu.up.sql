INSERT INTO menus (title, title_bn, url, category_id, parent_id, priority, is_published)
SELECT 'Opinions', 'মতামত', NULL, id, NULL, 10, true
FROM categories
WHERE name ILIKE '%Opinion%' OR slug ILIKE '%opinion%'
LIMIT 1;
