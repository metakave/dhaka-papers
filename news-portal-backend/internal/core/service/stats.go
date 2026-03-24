package service

import (
	"context"
	"news-portal-backend/internal/core/port"
)

type StatsService struct {
	newsRepo     port.NewsRepository
	categoryRepo port.CategoryRepository
	ownerRepo    port.OwnerRepository
}

func NewStatsService(newsRepo port.NewsRepository, categoryRepo port.CategoryRepository, ownerRepo port.OwnerRepository) *StatsService {
	return &StatsService{
		newsRepo:     newsRepo,
		categoryRepo: categoryRepo,
		ownerRepo:    ownerRepo,
	}
}

func (s *StatsService) GetDashboardStats(ctx context.Context) (*port.DashboardStats, error) {
	totalNews, err := s.newsRepo.CountNews(ctx, nil, nil, nil, "", "all", nil)
	if err != nil {
		return nil, err
	}

	totalCategories, err := s.categoryRepo.CountCategories(ctx)
	if err != nil {
		return nil, err
	}

	totalUsers, err := s.ownerRepo.CountOwners(ctx)
	if err != nil {
		return nil, err
	}

	totalViews, err := s.newsRepo.CountTotalViews(ctx)
	if err != nil {
		return nil, err
	}

	categoryStats, err := s.newsRepo.GetCategoryViewStats(ctx)
	if err != nil {
		return nil, err
	}

	topNews, err := s.newsRepo.GetMonthlyTopNews(ctx, 5) // Limit 5
	if err != nil {
		return nil, err
	}

	return &port.DashboardStats{
		TotalNews:       totalNews,
		TotalCategories: totalCategories,
		TotalUsers:      totalUsers,
		TotalViews:      totalViews,
		CategoryStats:   categoryStats,
		TopNews:         topNews,
	}, nil
}
