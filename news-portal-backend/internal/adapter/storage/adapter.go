package storage

import (
	"context"
	"errors"
	"strconv"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
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

func (a *Adapter) CreateOwner(ctx context.Context, name, nameEn, email, passwordHash string) (*domain.Owner, error) {
	owner, err := a.q.CreateOwner(ctx, db.CreateOwnerParams{
		Name:         name,
		NameEn:       pgtype.Text{String: nameEn, Valid: true},
		Email:        email,
		PasswordHash: passwordHash,
	})
	if err != nil {
		return nil, err
	}
	return &domain.Owner{
		ID:               owner.ID,
		Name:             owner.Name,
		NameEn:           owner.NameEn.String,
		Email:            owner.Email,
		Role:             owner.Role,
		CreatedAt:        owner.CreatedAt.Time,
		ProfileImage:     stringPtrOrNil(owner.ProfileImage.String, owner.ProfileImage.Valid),
		HideProfileImage: owner.HideProfileImage.Bool,
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
		ID:               owner.ID,
		Name:             owner.Name,
		NameEn:           owner.NameEn.String,
		Email:            owner.Email,
		Password:         owner.PasswordHash,
		Role:             owner.Role,
		CreatedAt:        owner.CreatedAt.Time,
		ProfileImage:     stringPtrOrNil(owner.ProfileImage.String, owner.ProfileImage.Valid),
		HideProfileImage: owner.HideProfileImage.Bool,
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
		ID:               owner.ID,
		Name:             owner.Name,
		NameEn:           owner.NameEn.String,
		Email:            owner.Email,
		Password:         owner.PasswordHash,
		Role:             owner.Role,
		CreatedAt:        owner.CreatedAt.Time,
		ProfileImage:     stringPtrOrNil(owner.ProfileImage.String, owner.ProfileImage.Valid),
		HideProfileImage: owner.HideProfileImage.Bool,
	}, nil
}

func (a *Adapter) CountOwners(ctx context.Context) (int64, error) {
	return a.q.CountOwners(ctx)
}

func (a *Adapter) ListOwners(ctx context.Context) ([]*domain.Owner, error) {
	dbOwners, err := a.q.ListOwners(ctx)
	if err != nil {
		return nil, err
	}

	owners := make([]*domain.Owner, len(dbOwners))
	for i, o := range dbOwners {
		owners[i] = &domain.Owner{
			ID:               o.ID,
			Name:             o.Name,
			NameEn:           o.NameEn.String,
			Email:            o.Email,
			Role:             o.Role,
			CreatedAt:        o.CreatedAt.Time,
			ProfileImage:     stringPtrOrNil(o.ProfileImage.String, o.ProfileImage.Valid),
			HideProfileImage: o.HideProfileImage.Bool,
		}
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
	return a.q.UpdateOwner(ctx, db.UpdateOwnerParams{
		ID:               owner.ID,
		Name:             owner.Name,
		NameEn:           pgtype.Text{String: owner.NameEn, Valid: true},
		ProfileImage:     pgtype.Text{String: stringValue(owner.ProfileImage), Valid: owner.ProfileImage != nil},
		HideProfileImage: pgtype.Bool{Bool: owner.HideProfileImage, Valid: true},
	})
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
		// Demote others IN THE SAME LANGUAGE
		_, err = tx.Exec(ctx, "UPDATE news SET is_featured = FALSE WHERE is_featured = TRUE AND lang = $1", news.Lang)
		if err != nil {
			return nil, err
		}
	}

	query := `INSERT INTO news (author_id, category_id, title, title_en, excerpt, content, thumbnail, thumbnail_caption, tags, slug, is_featured, published_at, status, meta_title, meta_description, lang)
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id, published_at, created_at, updated_at`
	err = tx.QueryRow(ctx, query,
		news.AuthorID, news.CategoryID, news.Title, news.TitleEn, news.Excerpt,
		news.Content, news.Thumbnail, news.ThumbnailCaption, news.Tags, news.Slug, news.IsFeatured, news.PublishedAt,
		news.Status, news.Title, news.Excerpt, news.Lang).
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
		// Demote others IN THE SAME LANGUAGE
		_, err = tx.Exec(ctx, "UPDATE news SET is_featured = FALSE WHERE is_featured = TRUE AND id != $1 AND lang = $2", news.ID, news.Lang)
		if err != nil {
			return err
		}
	}

	query := `UPDATE news SET category_id = $2, title = $3, title_en = $4, excerpt = $5, content = $6, thumbnail = $7, thumbnail_caption = $11, tags = $12, is_featured = $8, status = $9, published_at = $10, lang = $13, updated_at = NOW() WHERE id = $1`
	tag, err := tx.Exec(ctx, query, news.ID, news.CategoryID, news.Title, news.TitleEn, news.Excerpt, news.Content, news.Thumbnail, news.IsFeatured, news.Status, news.PublishedAt, news.ThumbnailCaption, news.Tags, news.Lang)
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

func (a *Adapter) GetNewsBySlug(ctx context.Context, slug string, lang string) (*domain.News, error) {
	query := `SELECT n.id, n.author_id, n.category_id, n.title, COALESCE(n.title_en, '') as title_en, n.excerpt, n.content, n.thumbnail, n.thumbnail_caption, n.tags, n.slug, n.status, n.is_featured, n.meta_title, n.meta_description, n.views_count, n.lang, n.published_at, n.created_at, n.updated_at,
	                 c.name as category_name, c.name_bn as category_name_bn, c.slug as category_slug, o.name as author_name, COALESCE(o.name_en, '') as author_name_en,
	                 o.profile_image, o.hide_profile_image
	          FROM news n
	          LEFT JOIN categories c ON n.category_id = c.id
	          LEFT JOIN owners o ON n.author_id = o.id
	          WHERE n.slug = $1 AND (n.lang = $2 OR $2 = '') LIMIT 1`

	n := &domain.News{}
	var authorID, categoryID uuid.UUID
	err := a.db.QueryRow(ctx, query, slug, lang).Scan(
		&n.ID, &authorID, &categoryID, &n.Title, &n.TitleEn, &n.Excerpt, &n.Content, &n.Thumbnail, &n.ThumbnailCaption, &n.Tags, &n.Slug, &n.Status, &n.IsFeatured, &n.MetaTitle, &n.MetaDescription, &n.ViewsCount, &n.Lang, &n.PublishedAt, &n.CreatedAt, &n.UpdatedAt,
		&n.CategoryName, &n.CategoryNameBN, &n.CategorySlug, &n.AuthorName, &n.AuthorNameEn,
		&n.AuthorProfileImage, &n.AuthorHideProfileImage,
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

func (a *Adapter) ListNews(ctx context.Context, limit, offset int32, categoryID *uuid.UUID, authorID *uuid.UUID, sortBy string, isFeatured *bool, search *string, statusFilter string, tag *string, lang *string) ([]*domain.News, error) {
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
		whereClause += " AND n.category_id = $" + strconv.Itoa(argCount)
		args = append(args, *categoryID)
		argCount++
	}

	if isFeatured != nil {
		whereClause += " AND n.is_featured = $" + strconv.Itoa(argCount)
		args = append(args, *isFeatured)
		argCount++
	}

	if search != nil {
		whereClause += " AND (n.title ILIKE $" + strconv.Itoa(argCount) + " OR n.content ILIKE $" + strconv.Itoa(argCount) + ")"
		pattern := "%" + *search + "%"
		args = append(args, pattern)
		argCount++
	}

	if authorID != nil {
		whereClause += " AND n.author_id = $" + strconv.Itoa(argCount)
		args = append(args, *authorID)
		argCount++
	}

	if tag != nil {
		whereClause += " AND $" + strconv.Itoa(argCount) + " = ANY(n.tags)"
		args = append(args, *tag)
		argCount++
	}
	if lang != nil {
		whereClause += " AND n.lang = $" + strconv.Itoa(argCount)
		args = append(args, *lang)
		argCount++
	}

	query := `SELECT n.id, n.author_id, n.title, COALESCE(n.title_en, '') as title_en, n.thumbnail, n.thumbnail_caption, n.tags, n.slug, n.status, n.is_featured, n.views_count, n.published_at, n.created_at, n.updated_at, n.lang,
	                 c.name as category_name, c.name_bn as category_name_bn, c.slug as category_slug, o.name as author_name, COALESCE(o.name_en, '') as author_name_en,
	                 o.profile_image, o.hide_profile_image
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
			&n.ID, &n.AuthorID, &n.Title, &n.TitleEn, &n.Thumbnail, &n.ThumbnailCaption, &n.Tags, &n.Slug, &n.Status, &n.IsFeatured, &n.ViewsCount, &n.PublishedAt, &n.CreatedAt, &n.UpdatedAt, &n.Lang,
			&n.CategoryName, &n.CategoryNameBN, &n.CategorySlug, &n.AuthorName, &n.AuthorNameEn,
			&n.AuthorProfileImage, &n.AuthorHideProfileImage,
		); err != nil {
			return nil, err
		}
		newsList = append(newsList, n)
	}
	return newsList, nil
}

func (a *Adapter) CheckSlugExists(ctx context.Context, slug string, lang string) (bool, error) {
	return a.q.CheckSlugExists(ctx, db.CheckSlugExistsParams{
		Slug: slug,
		Lang: lang,
	})
}

func (a *Adapter) IncrementNewsViews(ctx context.Context, slug string) error {
	return a.q.IncrementNewsViews(ctx, slug)
}

// SpecialReportRepository implementation

func (a *Adapter) CreateReport(ctx context.Context, report *domain.SpecialReport) (*domain.SpecialReport, error) {
	query := `INSERT INTO special_reports (title, slug, description, thumbnail, status, meta_title, meta_description, keywords)
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, created_at, updated_at`
	err := a.db.QueryRow(ctx, query,
		report.Title, report.Slug, report.Description, report.Thumbnail, report.Status,
		report.MetaTitle, report.MetaDescription, report.Keywords).
		Scan(&report.ID, &report.CreatedAt, &report.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return report, nil
}

func (a *Adapter) UpdateReport(ctx context.Context, report *domain.SpecialReport) error {
	query := `UPDATE special_reports SET title = $2, slug = $3, description = $4, thumbnail = $5, status = $6, meta_title = $7, meta_description = $8, keywords = $9, updated_at = NOW() WHERE id = $1`
	tag, err := a.db.Exec(ctx, query,
		report.ID, report.Title, report.Slug, report.Description, report.Thumbnail, report.Status,
		report.MetaTitle, report.MetaDescription, report.Keywords)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (a *Adapter) DeleteReport(ctx context.Context, id uuid.UUID) error {
	tag, err := a.db.Exec(ctx, "DELETE FROM special_reports WHERE id = $1", id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (a *Adapter) GetReportBySlug(ctx context.Context, slug string) (*domain.SpecialReport, error) {
	query := `SELECT id, title, slug, description, thumbnail, status, meta_title, meta_description, keywords, created_at, updated_at FROM special_reports WHERE slug = $1 LIMIT 1`
	r := &domain.SpecialReport{}
	err := a.db.QueryRow(ctx, query, slug).Scan(
		&r.ID, &r.Title, &r.Slug, &r.Description, &r.Thumbnail, &r.Status,
		&r.MetaTitle, &r.MetaDescription, &r.Keywords, &r.CreatedAt, &r.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return r, nil
}

func (a *Adapter) ListReports(ctx context.Context, limit, offset int32, statusFilter string) ([]*domain.SpecialReport, error) {
	where := "WHERE 1=1"
	args := []interface{}{limit, offset}
	if statusFilter != "" && statusFilter != "all" {
		where += " AND status = $3"
		args = append(args, statusFilter)
	}

	query := `SELECT id, title, slug, description, thumbnail, status, created_at, updated_at FROM special_reports ` + where + ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`
	rows, err := a.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	reports := []*domain.SpecialReport{}
	for rows.Next() {
		r := &domain.SpecialReport{}
		if err := rows.Scan(&r.ID, &r.Title, &r.Slug, &r.Description, &r.Thumbnail, &r.Status, &r.CreatedAt, &r.UpdatedAt); err != nil {
			return nil, err
		}
		reports = append(reports, r)
	}
	return reports, nil
}

func (a *Adapter) CountReports(ctx context.Context, statusFilter string) (int64, error) {
	where := "WHERE 1=1"
	args := []interface{}{}
	if statusFilter != "" && statusFilter != "all" {
		where += " AND status = $1"
		args = append(args, statusFilter)
	}
	query := `SELECT COUNT(*) FROM special_reports ` + where
	var count int64
	err := a.db.QueryRow(ctx, query, args...).Scan(&count)
	return count, err
}

func (a *Adapter) CreateReportItem(ctx context.Context, item *domain.ReportItem) (*domain.ReportItem, error) {
	query := `INSERT INTO report_items (report_id, title, date_str, details, image_url, qr_code_url, news_url, serial_number, metadata)
	          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at, updated_at`
	err := a.db.QueryRow(ctx, query,
		item.ReportID, item.Title, item.DateStr, item.Details, item.ImageURL, item.QRCodeURL, item.NewsURL, item.SerialNumber, item.Metadata).
		Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return item, nil
}

func (a *Adapter) UpdateReportItem(ctx context.Context, item *domain.ReportItem) error {
	query := `UPDATE report_items SET title = $2, date_str = $3, details = $4, image_url = $5, qr_code_url = $6, news_url = $7, serial_number = $8, metadata = $9, updated_at = NOW() WHERE id = $1`
	tag, err := a.db.Exec(ctx, query,
		item.ID, item.Title, item.DateStr, item.Details, item.ImageURL, item.QRCodeURL, item.NewsURL, item.SerialNumber, item.Metadata)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (a *Adapter) DeleteReportItem(ctx context.Context, id uuid.UUID) error {
	tag, err := a.db.Exec(ctx, "DELETE FROM report_items WHERE id = $1", id)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (a *Adapter) ListReportItems(ctx context.Context, reportID uuid.UUID) ([]domain.ReportItem, error) {
	query := `SELECT id, report_id, title, date_str, details, image_url, qr_code_url, news_url, serial_number, metadata, created_at, updated_at FROM report_items WHERE report_id = $1 ORDER BY serial_number ASC, created_at ASC`
	rows, err := a.db.Query(ctx, query, reportID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []domain.ReportItem{}
	for rows.Next() {
		var it domain.ReportItem
		if err := rows.Scan(&it.ID, &it.ReportID, &it.Title, &it.DateStr, &it.Details, &it.ImageURL, &it.QRCodeURL, &it.NewsURL, &it.SerialNumber, &it.Metadata, &it.CreatedAt, &it.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, it)
	}
	return items, nil
}

func (a *Adapter) BatchUpsertReportItems(ctx context.Context, reportID uuid.UUID, items []domain.ReportItem) error {
	tx, err := a.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Simple approach: Delete existing and insert new (or more complex upsert)
	// For simplicity and to ensure order matches exactly, we clear and re-insert
	_, err = tx.Exec(ctx, "DELETE FROM report_items WHERE report_id = $1", reportID)
	if err != nil {
		return err
	}

	for _, item := range items {
		query := `INSERT INTO report_items (report_id, title, date_str, details, image_url, qr_code_url, news_url, serial_number, metadata)
		          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
		_, err = tx.Exec(ctx, query, reportID, item.Title, item.DateStr, item.Details, item.ImageURL, item.QRCodeURL, item.NewsURL, item.SerialNumber, item.Metadata)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// Helper functions
func stringPtrOrNil(s string, valid bool) *string {
	if !valid {
		return nil
	}
	return &s
}

func stringValue(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

// Ensure interface implementation
var _ port.OwnerRepository = (*Adapter)(nil)
var _ port.CategoryRepository = (*Adapter)(nil)
var _ port.NewsRepository = (*Adapter)(nil)
var _ port.SpecialReportRepository = (*Adapter)(nil)
