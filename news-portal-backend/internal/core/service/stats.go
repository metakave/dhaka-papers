package service

import (
	"context"
	"log"
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
	// Pointers for languages
	bn := "bn"
	en := "en"

	// 1. Total News
	totalNews, err := s.newsRepo.CountNews(ctx, nil, nil, nil, "", "all", nil, nil)
	if err != nil {
		log.Printf("Error counting total news: %v", err)
		return nil, err
	}
	totalNewsBN, errBN := s.newsRepo.CountNews(ctx, nil, nil, nil, "", "all", nil, &bn)
	if errBN != nil {
		log.Printf("Error counting total news BN: %v", errBN)
	}
	totalNewsEN, errEN := s.newsRepo.CountNews(ctx, nil, nil, nil, "", "all", nil, &en)
	if errEN != nil {
		log.Printf("Error counting total news EN: %v", errEN)
	}

	// 2. Categories & Users
	totalCategories, err := s.categoryRepo.CountCategories(ctx)
	if err != nil {
		return nil, err
	}

	totalUsers, err := s.ownerRepo.CountOwners(ctx)
	if err != nil {
		return nil, err
	}

	// 3. Views
	totalViews, err := s.newsRepo.CountTotalViews(ctx, nil)
	if err != nil {
		return nil, err
	}
	totalViewsBN, _ := s.newsRepo.CountTotalViews(ctx, &bn)
	totalViewsEN, _ := s.newsRepo.CountTotalViews(ctx, &en)

	// 4. Category Stats
	categoryStats, err := s.newsRepo.GetCategoryViewStats(ctx, nil)
	if err != nil {
		return nil, err
	}
	categoryStatsBN, _ := s.newsRepo.GetCategoryViewStats(ctx, &bn)
	categoryStatsEN, _ := s.newsRepo.GetCategoryViewStats(ctx, &en)

	// 5. Top News
	topNews, err := s.newsRepo.GetMonthlyTopNews(ctx, 5, nil) // Limit 5
	if err != nil {
		return nil, err
	}
	topNewsBN, _ := s.newsRepo.GetMonthlyTopNews(ctx, 5, &bn)
	topNewsEN, _ := s.newsRepo.GetMonthlyTopNews(ctx, 5, &en)

	return &port.DashboardStats{
		TotalNews:       totalNews,
		TotalNewsBN:     totalNewsBN,
		TotalNewsEN:     totalNewsEN,
		TotalCategories: totalCategories,
		TotalUsers:      totalUsers,
		TotalViews:      totalViews,
		TotalViewsBN:    totalViewsBN,
		TotalViewsEN:    totalViewsEN,
		CategoryStats:   categoryStats,
		CategoryStatsBN: categoryStatsBN,
		CategoryStatsEN: categoryStatsEN,
		TopNews:         topNews,
		TopNewsBN:       topNewsBN,
		TopNewsEN:       topNewsEN,
	}, nil
}
