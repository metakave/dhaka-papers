-- name: CreateOwner :one
INSERT INTO owners (name, name_en, email, password_hash, role)
VALUES ($1, $2, $3, $4, 'admin')
RETURNING *;

-- name: GetOwnerByEmail :one
SELECT * FROM owners
WHERE email = $1 LIMIT 1;

-- name: GetOwnerByID :one
SELECT * FROM owners
WHERE id = $1 LIMIT 1;

-- name: ListOwners :many
SELECT * FROM owners ORDER BY name ASC;

-- name: UpdateOwner :exec
UPDATE owners
SET name = $2,
    name_en = $3,
    profile_image = $4,
    hide_profile_image = $5,
    updated_at = NOW()
WHERE id = $1;

-- name: CreateNews :one
INSERT INTO news (
    author_id, category_id, title, title_en, excerpt, content, thumbnail, thumbnail_caption, slug, 
    published_at, status, meta_title, meta_description, tags, lang
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9,
    NOW(), 'published', $3, $5, $10, $11
)
RETURNING *;

-- name: GetNews :one
SELECT 
    n.id, n.author_id, n.category_id, n.title, 
    COALESCE(n.title_en, '') as title_en,
    COALESCE(n.excerpt, '') as excerpt,
    n.content, n.thumbnail, 
    COALESCE(n.thumbnail_caption, '') as thumbnail_caption,
    n.slug, n.status, n.views_count, n.lang,
    COALESCE(n.meta_title, '') as meta_title,
    COALESCE(n.meta_description, '') as meta_description,
    n.tags, n.published_at, n.created_at, n.updated_at,
    c.name as category_name, c.slug as category_slug, o.name as author_name,
    COALESCE(o.name_en, '') as author_name_en,
    o.profile_image as author_profile_image,
    o.hide_profile_image as author_hide_profile_image
FROM news n
LEFT JOIN categories c ON n.category_id = c.id
LEFT JOIN owners o ON n.author_id = o.id
WHERE TRIM(n.slug) = $1 AND (n.lang = $2 OR $2 = '') LIMIT 1;

-- name: CheckSlugExists :one
SELECT EXISTS(SELECT 1 FROM news WHERE TRIM(slug) = $1 AND (lang = $2 OR $2 = ''));

-- name: ListNews :many
SELECT 
    n.id, n.title, 
    COALESCE(n.title_en, '') as title_en,
    n.thumbnail, 
    COALESCE(n.thumbnail_caption, '') as thumbnail_caption,
    n.slug, n.status, n.views_count, n.published_at, n.created_at, n.updated_at, n.lang,
    c.name as category_name, c.slug as category_slug, o.name as author_name,
    COALESCE(o.name_en, '') as author_name_en,
    o.profile_image as author_profile_image,
    o.hide_profile_image as author_hide_profile_image
FROM news n
LEFT JOIN categories c ON n.category_id = c.id
LEFT JOIN owners o ON n.author_id = o.id
WHERE n.status = 'published' AND n.published_at <= NOW()
AND ($3::uuid IS NULL OR n.category_id = $3)
AND ($5::text IS NULL OR $5 = ANY(n.tags))
AND ($6::text IS NULL OR n.lang = $6)
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
    tags = $9,
    lang = $10,
    updated_at = NOW()
WHERE id = $1;

-- name: DeleteNews :execresult
DELETE FROM news
WHERE id = $1;

-- name: IncrementNewsViews :exec
UPDATE news 
SET views_count = views_count + 1 
WHERE TRIM(slug) = $1;

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
