-- name: CreateOwner :one
INSERT INTO owners (name, email, password_hash, role)
VALUES ($1, $2, $3, 'admin')
RETURNING *;

-- name: GetOwnerByEmail :one
SELECT * FROM owners
WHERE email = $1 LIMIT 1;

-- name: GetOwnerByID :one
SELECT * FROM owners
WHERE id = $1 LIMIT 1;

-- name: CreateNews :one
INSERT INTO news (
    author_id, category_id, title, title_en, excerpt, content, thumbnail, thumbnail_caption, slug, 
    published_at, status, meta_title, meta_description
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9,
    NOW(), 'published', $3, $5
)
RETURNING *;

-- name: GetNews :one
SELECT n.*, c.name as category_name, c.slug as category_slug, o.name as author_name
FROM news n
LEFT JOIN categories c ON n.category_id = c.id
LEFT JOIN owners o ON n.author_id = o.id
WHERE n.slug = $1 LIMIT 1;

-- name: CheckSlugExists :one
SELECT EXISTS(SELECT 1 FROM news WHERE slug = $1);

-- name: ListNews :many
-- name: ListNews :many
SELECT n.id, n.title, n.title_en, n.thumbnail, n.thumbnail_caption, n.slug, n.status, n.views_count, n.published_at, n.created_at, n.updated_at,
       c.name as category_name, c.slug as category_slug, o.name as author_name
FROM news n
LEFT JOIN categories c ON n.category_id = c.id
LEFT JOIN owners o ON n.author_id = o.id
WHERE n.status = 'published' AND n.published_at <= NOW()
AND ($3::uuid IS NULL OR n.category_id = $3)
ORDER BY 
    CASE WHEN $4 = 'popular' THEN n.views_count END DESC,
    CASE WHEN $4 != 'popular' OR $4 IS NULL THEN n.published_at END DESC
LIMIT $1 OFFSET $2;

-- name: UpdateNews :execresult
UPDATE news
SET 
    category_id = $2,
    title = $3, 
    title_en = $4,
    excerpt = $5,
    content = $6, 
    thumbnail = $7, 
    thumbnail_caption = $8,
    updated_at = NOW()
WHERE id = $1;

-- name: DeleteNews :execresult
DELETE FROM news
WHERE id = $1;

-- name: IncrementNewsViews :exec
UPDATE news 
SET views_count = views_count + 1 
WHERE slug = $1;

-- name: CountOwners :one
SELECT count(*) FROM owners;

-- name: CreateCategory :one
INSERT INTO categories (name, name_bn, slug, description, priority)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListCategories :many
SELECT * FROM categories ORDER BY priority ASC, name ASC;

-- name: GetCategoryBySlug :one
SELECT * FROM categories WHERE slug = $1 LIMIT 1;
