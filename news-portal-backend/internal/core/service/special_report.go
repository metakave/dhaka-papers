package service

import (
	"context"

	"news-portal-backend/internal/core/domain"
	"news-portal-backend/internal/core/port"

	"github.com/google/uuid"
)

type SpecialReportService struct {
	repo port.SpecialReportRepository
}

func NewSpecialReportService(repo port.SpecialReportRepository) *SpecialReportService {
	return &SpecialReportService{
		repo: repo,
	}
}

func (s *SpecialReportService) CreateReport(ctx context.Context, title, slug, description, thumbnail, status string) (*domain.SpecialReport, error) {
	// Generate unique slug if not provided, though typically provided by CMS
	if slug == "" {
		slug = generateUniqueSlug(title)
	}

	report := &domain.SpecialReport{
		Title:       title,
		Slug:        slug,
		Description: &description,
		Thumbnail:   &thumbnail,
		Status:      status,
	}
	return s.repo.CreateReport(ctx, report)
}

func (s *SpecialReportService) UpdateReport(ctx context.Context, id uuid.UUID, title, slug, description, thumbnail, status string) error {
	report := &domain.SpecialReport{
		ID:          id,
		Title:       title,
		Slug:        slug,
		Description: &description,
		Thumbnail:   &thumbnail,
		Status:      status,
	}
	return s.repo.UpdateReport(ctx, report)
}

func (s *SpecialReportService) DeleteReport(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteReport(ctx, id)
}

func (s *SpecialReportService) GetReportBySlug(ctx context.Context, slug string) (*domain.SpecialReport, error) {
	report, err := s.repo.GetReportBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	if report == nil {
		return nil, nil
	}

	// Fetch items
	items, err := s.repo.ListReportItems(ctx, report.ID)
	if err != nil {
		return nil, err
	}
	report.Items = items

	return report, nil
}

func (s *SpecialReportService) ListReports(ctx context.Context, page, limit int32, statusFilter string) ([]*domain.SpecialReport, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	reports, err := s.repo.ListReports(ctx, limit, offset, statusFilter)
	if err != nil {
		return nil, 0, err
	}

	total, err := s.repo.CountReports(ctx, statusFilter)
	if err != nil {
		return nil, 0, err
	}

	return reports, total, nil
}

func (s *SpecialReportService) UpsertReportItems(ctx context.Context, reportID uuid.UUID, items []domain.ReportItem) error {
	// Ensure report items have the correct report ID and serial numbers
	for i := range items {
		items[i].ReportID = reportID
		if items[i].SerialNumber == 0 {
			items[i].SerialNumber = i + 1
		}
	}
	return s.repo.BatchUpsertReportItems(ctx, reportID, items)
}

func (s *SpecialReportService) ListReportItems(ctx context.Context, reportID uuid.UUID) ([]domain.ReportItem, error) {
	return s.repo.ListReportItems(ctx, reportID)
}

// Ensure interface implementation
var _ port.SpecialReportService = (*SpecialReportService)(nil)
