package storage

import (
	"context"
	"errors"
	"strconv"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"news-portal-backend/internal/adapter/storage/db"
	"news-portal-backend/internal/core/domain"
	"news-portal-backend/internal/core/port"
)

type Adapter struct {
	pool *pgxpool.Pool
	db   db.DBTX
	q    *db.Queries
}

func NewAdapter(pool *pgxpool.Pool) *Adapter {
	return &Adapter{
		pool: pool,
		db:   pool,
		q:    db.New(pool),
	}
}

// OwnerRepository implementation

func (a *Adapter) CreateOwner(ctx context.Context, name, email, passwordHash string) (*domain.Owner, error) {
	owner, err := a.q.CreateOwner(ctx, db.CreateOwnerParams{
		Name:         name,
		Email:        email,
		PasswordHash: passwordHash,
	})
	if err != nil {
		return nil, err
	}
	return &domain.Owner{
		ID:        owner.ID,
		Name:      owner.Name,
		Email:     owner.Email,
		Role:      owner.Role,
		CreatedAt: owner.CreatedAt.Time,
	}, nil
}

func (a *Adapter) GetOwnerByEmail(ctx context.Context, email string) (*domain.Owner, error) {
	owner, err := a.q.GetOwnerByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &domain.Owner{
		ID:        owner.ID,
		Name:      owner.Name,
		Email:     owner.Email,
		Password:  owner.PasswordHash,
		Role:      owner.Role,
		CreatedAt: owner.CreatedAt.Time,
	}, nil
}

func (a *Adapter) GetOwnerByID(ctx context.Context, id uuid.UUID) (*domain.Owner, error) {
	owner, err := a.q.GetOwnerByID(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &domain.Owner{
		ID:        owner.ID,
		Name:      owner.Name,
		Email:     owner.Email,
		Password:  owner.PasswordHash,
		Role:      owner.Role,
		CreatedAt: owner.CreatedAt.Time,
	}, nil
}

func (a *Adapter) CountOwners(ctx context.Context) (int64, error) {
	return a.q.CountOwners(ctx)
}

func (a *Adapter) ListOwners(ctx context.Context) ([]*domain.Owner, error) {
	query := `SELECT id, name, email, role, created_at FROM owners ORDER BY created_at DESC`
	rows, err := a.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	owners := []*domain.Owner{}
	for rows.Next() {
		o := &domain.Owner{}
		if err := rows.Scan(&o.ID, &o.Name, &o.Email, &o.Role, &o.CreatedAt); err != nil {
			return nil, err
		}
		owners = append(owners, o)
	}
	return owners, nil
}

func (a *Adapter) UpdateOwnerPassword(ctx context.Context, id uuid.UUID, passwordHash string) error {
	query := `UPDATE owners SET password_hash = $2, updated_at = NOW() WHERE id = $1`
	tag, err := a.db.Exec(ctx, query, id, passwordHash)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (a *Adapter) UpdateOwner(ctx context.Context, owner *domain.Owner) error {
	query := `UPDATE owners SET name = $2, email = $3, password_hash = $4, updated_at = NOW() WHERE id = $1`
	tag, err := a.db.Exec(ctx, query, owner.ID, owner.Name, owner.Email, owner.Password)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

// CategoryRepository implementation

func (a *Adapter) CreateCategory(ctx context.Context, category *domain.Category) (*domain.Category, error) {
	query := `INSERT INTO categories (name, name_bn, slug, description, priority) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`
	err := a.db.QueryRow(ctx, query, category.Name, category.NameBN, category.Slug, category.Description, category.Priority).Scan(&category.ID, &category.CreatedAt)
	if err != nil {
		return nil, err
	}
	return category, nil
}

func (a *Adapter) ListCategories(ctx context.Context) ([]*domain.Category, error) {
	query := `SELECT id, name, name_bn, slug, description, priority, created_at FROM categories ORDER BY priority ASC, name ASC`
	rows, err := a.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	categories := []*domain.Category{}
	for rows.Next() {
		c := &domain.Category{}
		if err := rows.Scan(&c.ID, &c.Name, &c.NameBN, &c.Slug, &c.Description, &c.Priority, &c.CreatedAt); err != nil {
			return nil, err
		}
		categories = append(categories, c)
	}
	return categories, nil
}

func (a *Adapter) UpdateCategory(ctx context.Context, category *domain.Category) error {
	query := `UPDATE categories SET name = $2, name_bn = $3, slug = $4, description = $5, priority = $6 WHERE id = $1`
	tag, err := a.db.Exec(ctx, query, category.ID, category.Name, category.NameBN, category.Slug, category.Description, category.Priority)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (a *Adapter) DeleteCategory(ctx context.Context, id uuid.UUID) error {
	tag, err := a.db.Exec(ctx, "DELETE FROM categories WHERE id = $1", id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (a *Adapter) GetCategoryByID(ctx context.Context, id uuid.UUID) (*domain.Category, error) {
	query := `SELECT id, name, name_bn, slug, description, priority, created_at FROM categories WHERE id = $1 LIMIT 1`
	c := &domain.Category{}
	err := a.db.QueryRow(ctx, query, id).Scan(&c.ID, &c.Name, &c.NameBN, &c.Slug, &c.Description, &c.Priority, &c.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return c, nil
}

func (a *Adapter) GetCategoryBySlug(ctx context.Context, slug string) (*domain.Category, error) {
	query := `SELECT id, name, name_bn, slug, description, priority, created_at FROM categories WHERE slug = $1 LIMIT 1`
	c := &domain.Category{}
	err := a.db.QueryRow(ctx, query, slug).Scan(&c.ID, &c.Name, &c.NameBN, &c.Slug, &c.Description, &c.Priority, &c.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return c, nil
}

// NewsRepository implementation

func (a *Adapter) CreateNews(ctx context.Context, news *domain.News) (*domain.News, error) {
	tx, err := a.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	if news.IsFeatured {
		// Demote others
		_, err = tx.Exec(ctx, "UPDATE news SET is_featured = FALSE WHERE is_featured = TRUE")
		if err != nil {
			return nil, err
		}
	}

	query := `INSERT INTO news (author_id, category_id, title, title_en, excerpt, content, thumbnail, slug, is_featured, published_at, status, meta_title, meta_description)
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $3, $5) RETURNING id, published_at, created_at, updated_at`
	err = tx.QueryRow(ctx, query, news.AuthorID, news.CategoryID, news.Title, news.TitleEn, news.Excerpt, news.Content, news.Thumbnail, news.Slug, news.IsFeatured, news.PublishedAt, news.Status).
		Scan(&news.ID, &news.PublishedAt, &news.CreatedAt, &news.UpdatedAt)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return news, nil
}

func (a *Adapter) UpdateNews(ctx context.Context, news *domain.News) error {
	tx, err := a.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if news.IsFeatured {
		// Demote others
		_, err = tx.Exec(ctx, "UPDATE news SET is_featured = FALSE WHERE is_featured = TRUE AND id != $1", news.ID)
		if err != nil {
			return err
		}
	}

	query := `UPDATE news SET category_id = $2, title = $3, title_en = $4, excerpt = $5, content = $6, thumbnail = $7, is_featured = $8, status = $9, published_at = $10, updated_at = NOW() WHERE id = $1`
	tag, err := tx.Exec(ctx, query, news.ID, news.CategoryID, news.Title, news.TitleEn, news.Excerpt, news.Content, news.Thumbnail, news.IsFeatured, news.Status, news.PublishedAt)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}

	return tx.Commit(ctx)
}

func (a *Adapter) DeleteNews(ctx context.Context, id uuid.UUID) error {
	tag, err := a.q.DeleteNews(ctx, id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (a *Adapter) GetNewsBySlug(ctx context.Context, slug string) (*domain.News, error) {
	query := `SELECT n.id, n.author_id, n.category_id, n.title, n.title_en, n.excerpt, n.content, n.thumbnail, n.slug, n.status, n.is_featured, n.meta_title, n.meta_description, n.views_count, n.published_at, n.created_at, n.updated_at,
	                 c.name as category_name, c.name_bn as category_name_bn, c.slug as category_slug, o.name as author_name
	          FROM news n
	          LEFT JOIN categories c ON n.category_id = c.id
	          LEFT JOIN owners o ON n.author_id = o.id
	          WHERE n.slug = $1 LIMIT 1`

	n := &domain.News{}
	var authorID, categoryID uuid.UUID
	err := a.db.QueryRow(ctx, query, slug).Scan(
		&n.ID, &authorID, &categoryID, &n.Title, &n.TitleEn, &n.Excerpt, &n.Content, &n.Thumbnail, &n.Slug, &n.Status, &n.IsFeatured, &n.MetaTitle, &n.MetaDescription, &n.ViewsCount, &n.PublishedAt, &n.CreatedAt, &n.UpdatedAt,
		&n.CategoryName, &n.CategoryNameBN, &n.CategorySlug, &n.AuthorName,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	n.AuthorID = authorID
	n.CategoryID = categoryID
	return n, nil
}

func (a *Adapter) ListNews(ctx context.Context, limit, offset int32, categoryID *uuid.UUID, authorID *uuid.UUID, sortBy string, isFeatured *bool, search *string, statusFilter string) ([]*domain.News, error) {
	orderBy := "n.published_at DESC"
	switch sortBy {
	case "popular", "views_desc":
		orderBy = "n.views_count DESC, n.published_at DESC"
	case "views_asc":
		orderBy = "n.views_count ASC, n.published_at DESC"
	case "oldest":
		orderBy = "n.published_at ASC"
	case "latest":
		orderBy = "n.published_at DESC"
	}

	whereClause := "WHERE 1=1"
	args := []interface{}{limit, offset}
	argCount := 3

	// Status Filter Logic
	if statusFilter == "all" {
		// No status restriction
	} else if statusFilter != "" {
		whereClause += " AND n.status = $" + strconv.Itoa(argCount)
		args = append(args, statusFilter)
		argCount++
	} else {
		// Default (Public view)
		whereClause += " AND n.status = 'published' AND n.published_at <= NOW()"
	}

	if categoryID != nil {
		whereClause += " AND category_id = $" + strconv.Itoa(argCount)
		args = append(args, *categoryID)
		argCount++
	}

	if authorID != nil {
		whereClause += " AND n.author_id = $" + strconv.Itoa(argCount)
		args = append(args, authorID)
		argCount++
	}

	query := `SELECT n.id, n.author_id, n.title, n.title_en, n.thumbnail, n.slug, n.status, n.is_featured, n.views_count, n.published_at, n.created_at, n.updated_at,
	                 c.name as category_name, c.name_bn as category_name_bn, c.slug as category_slug, o.name as author_name
	          FROM news n
	          LEFT JOIN categories c ON n.category_id = c.id
	          LEFT JOIN owners o ON n.author_id = o.id
	          ` + whereClause + `
	          ORDER BY ` + orderBy + ` LIMIT $1 OFFSET $2`

	rows, err := a.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	newsList := []*domain.News{}
	for rows.Next() {
		n := &domain.News{}
		if err := rows.Scan(
			&n.ID, &n.AuthorID, &n.Title, &n.TitleEn, &n.Thumbnail, &n.Slug, &n.Status, &n.IsFeatured, &n.ViewsCount, &n.PublishedAt, &n.CreatedAt, &n.UpdatedAt,
			&n.CategoryName, &n.CategoryNameBN, &n.CategorySlug, &n.AuthorName,
		); err != nil {
			return nil, err
		}
		newsList = append(newsList, n)
	}
	return newsList, nil
}

func (a *Adapter) CheckSlugExists(ctx context.Context, slug string) (bool, error) {
	return a.q.CheckSlugExists(ctx, slug)
}

func (a *Adapter) IncrementNewsViews(ctx context.Context, slug string) error {
	return a.q.IncrementNewsViews(ctx, slug)
}

// Ensure interface implementation
var _ port.OwnerRepository = (*Adapter)(nil)
var _ port.CategoryRepository = (*Adapter)(nil)
var _ port.NewsRepository = (*Adapter)(nil)
