package port

import (
	"context"
	"mime/multipart"
	"time"

	"github.com/google/uuid"

	"news-portal-backend/internal/core/domain"
)

type OwnerRepository interface {
	CreateOwner(ctx context.Context, name, email, passwordHash string) (*domain.Owner, error)
	GetOwnerByEmail(ctx context.Context, email string) (*domain.Owner, error)
	GetOwnerByID(ctx context.Context, id uuid.UUID) (*domain.Owner, error)
	CountOwners(ctx context.Context) (int64, error)
	ListOwners(ctx context.Context) ([]*domain.Owner, error)
	UpdateOwnerPassword(ctx context.Context, id uuid.UUID, passwordHash string) error
	UpdateOwner(ctx context.Context, owner *domain.Owner) error
}

type CategoryRepository interface {
	CreateCategory(ctx context.Context, category *domain.Category) (*domain.Category, error)
	UpdateCategory(ctx context.Context, category *domain.Category) error
	DeleteCategory(ctx context.Context, id uuid.UUID) error
	ListCategories(ctx context.Context) ([]*domain.Category, error)
	GetCategoryBySlug(ctx context.Context, slug string) (*domain.Category, error)
	CountCategories(ctx context.Context) (int64, error)
	GetCategoryByID(ctx context.Context, id uuid.UUID) (*domain.Category, error)
}

type NewsRepository interface {
	CreateNews(ctx context.Context, news *domain.News) (*domain.News, error)
	UpdateNews(ctx context.Context, news *domain.News) error
	DeleteNews(ctx context.Context, id uuid.UUID) error
	GetNewsBySlug(ctx context.Context, slug string) (*domain.News, error)
	ListNews(ctx context.Context, limit, offset int32, categoryID *uuid.UUID, authorID *uuid.UUID, sortBy string, isFeatured *bool, search *string, statusFilter string, tag *string) ([]*domain.News, error)
	CountNews(ctx context.Context, categoryID *uuid.UUID, authorID *uuid.UUID, isFeatured *bool, search string, statusFilter string, tag *string) (int64, error)
	CheckSlugExists(ctx context.Context, slug string) (bool, error)
	IncrementNewsViews(ctx context.Context, slug string) error
	CountTotalViews(ctx context.Context) (int64, error)
	GetCategoryViewStats(ctx context.Context) ([]CategoryViewStat, error)
	GetMonthlyTopNews(ctx context.Context, limit int) ([]NewsViewStat, error)
}

type AuthService interface {
	Login(ctx context.Context, email, password string) (string, error)
	Register(ctx context.Context, name, email, password string) (*domain.Owner, error)
	ChangePassword(ctx context.Context, id uuid.UUID, oldPassword, newPassword string) error
	UpdateUser(ctx context.Context, id uuid.UUID, name, email, password string) error
	ListUsers(ctx context.Context) ([]*domain.Owner, error)
	GetMe(ctx context.Context, id uuid.UUID) (*domain.Owner, error)
}

type NewsService interface {
	CreateNews(ctx context.Context, authorID, categoryID uuid.UUID, title, titleEn, excerpt, content, thumbnail, thumbnailCaption string, isFeatured bool, status string, publishedAt time.Time) (*domain.News, error)
	UpdateNews(ctx context.Context, id uuid.UUID, categoryID uuid.UUID, title, titleEn, excerpt, content, thumbnail, thumbnailCaption string, isFeatured bool, status string, publishedAt time.Time) error
	DeleteNews(ctx context.Context, id uuid.UUID) error
	GetNewsBySlug(ctx context.Context, slug string) (*domain.News, error)
	ListNews(ctx context.Context, page, limit int32, categorySlug string, authorID *uuid.UUID, sortBy string, isFeatured *bool, search string, statusFilter string, tag string) ([]*domain.News, int64, error)
	CheckSlug(ctx context.Context, slug string) (bool, error)
	GetHomepageData(ctx context.Context) (*HomepageData, error)
}

type CategoryService interface {
	CreateCategory(ctx context.Context, name, nameBN, description string, priority int) (*domain.Category, error)
	UpdateCategory(ctx context.Context, id uuid.UUID, name, nameBN, description string, priority int) error
	DeleteCategory(ctx context.Context, id uuid.UUID) error
	ListCategories(ctx context.Context) ([]*domain.Category, error)
}

type FileService interface {
	UploadFile(file multipart.File, header *multipart.FileHeader) (string, error)
}

type CategoryViewStat struct {
	Name  string `json:"name"`
	Value int64  `json:"value"`
}

type NewsViewStat struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Views int64  `json:"views"`
}

type HomepageData struct {
	Featured *domain.News   `json:"featured"`
	Latest   []*domain.News `json:"latest"`
	Popular  []*domain.News `json:"popular"`
}

type DashboardStats struct {
	TotalNews       int64              `json:"total_news"`
	TotalCategories int64              `json:"total_categories"`
	TotalUsers      int64              `json:"total_users"`
	TotalViews      int64              `json:"total_views"`
	CategoryStats   []CategoryViewStat `json:"category_stats"`
	TopNews         []NewsViewStat     `json:"top_news"`
}

type StatsService interface {
	GetDashboardStats(ctx context.Context) (*DashboardStats, error)
}

type SpecialReportRepository interface {
	CreateReport(ctx context.Context, report *domain.SpecialReport) (*domain.SpecialReport, error)
	UpdateReport(ctx context.Context, report *domain.SpecialReport) error
	DeleteReport(ctx context.Context, id uuid.UUID) error
	GetReportBySlug(ctx context.Context, slug string) (*domain.SpecialReport, error)
	ListReports(ctx context.Context, limit, offset int32, statusFilter string) ([]*domain.SpecialReport, error)
	CountReports(ctx context.Context, statusFilter string) (int64, error)

	// Items (Victims)
	CreateReportItem(ctx context.Context, item *domain.ReportItem) (*domain.ReportItem, error)
	UpdateReportItem(ctx context.Context, item *domain.ReportItem) error
	DeleteReportItem(ctx context.Context, id uuid.UUID) error
	ListReportItems(ctx context.Context, reportID uuid.UUID) ([]domain.ReportItem, error)
	BatchUpsertReportItems(ctx context.Context, reportID uuid.UUID, items []domain.ReportItem) error
}

type SpecialReportService interface {
	CreateReport(ctx context.Context, title, slug, description, thumbnail, status string) (*domain.SpecialReport, error)
	UpdateReport(ctx context.Context, id uuid.UUID, title, slug, description, thumbnail, status string) error
	DeleteReport(ctx context.Context, id uuid.UUID) error
	GetReportBySlug(ctx context.Context, slug string) (*domain.SpecialReport, error)
	ListReports(ctx context.Context, page, limit int32, statusFilter string) ([]*domain.SpecialReport, int64, error)

	// Items (Victims)
	UpsertReportItems(ctx context.Context, reportID uuid.UUID, items []domain.ReportItem) error
	ListReportItems(ctx context.Context, reportID uuid.UUID) ([]domain.ReportItem, error)
}
