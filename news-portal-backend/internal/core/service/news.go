package service

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"time"

	"news-portal-backend/internal/core/domain"
	"news-portal-backend/internal/core/port"

	"github.com/google/uuid"
	"github.com/microcosm-cc/bluemonday"
)

type NewsService struct {
	repo         port.NewsRepository
	categoryRepo port.CategoryRepository
	p            *bluemonday.Policy
}

func NewNewsService(repo port.NewsRepository, categoryRepo port.CategoryRepository) *NewsService {
	p := bluemonday.UGCPolicy()

	// Allow manual spacing and line breaks
	p.AllowElements("br")

	// CRITICAL: Allow empty paragraphs and divs because TipTap uses them for manual spacing
	// Without this, bluemonday strips "<p></p>" or "<p><br></p>"
	p.AllowElements("p", "div").AllowAttrs("class", "style").OnElements("p", "div")
	p.AllowStandardAttributes()

	// Allow TipTap alignment classes
	p.AllowAttrs("class").Matching(regexp.MustCompile(`^(text-align-(left|center|right|justify)|tiptap)$`)).OnElements("p", "h1", "h2", "h3", "h4", "h5", "h6", "div", "span")

	// Allow inline styles for colors and fonts
	p.AllowAttrs("style").OnElements("span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "div")

	// Allow YouTube, Facebook & Generic Media Embeds
	p.AllowElements("iframe").AllowAttrs("src", "width", "height", "frameborder", "allow", "allowfullscreen", "title", "scrolling", "style").OnElements("iframe")
	p.AllowAttrs("data-youtube-video", "data-facebook-video", "data-media-embed", "data-ratio", "data-max-width", "style").OnElements("div")
	p.AllowStyles("aspect-ratio", "max-width").OnElements("div")

	return &NewsService{
		repo:         repo,
		categoryRepo: categoryRepo,
		p:            p,
	}
}

func (s *NewsService) CreateNews(ctx context.Context, authorID, categoryID uuid.UUID, title, titleEn, excerpt, content, thumbnail, thumbnailCaption string, tags []string, isFeatured bool, status string, publishedAt time.Time) (*domain.News, error) {
	// Use English Title for Slug generation
	slug := generateUniqueSlug(titleEn)
	sanitizedContent := s.p.Sanitize(content)

	news := &domain.News{
		AuthorID:    authorID,
		CategoryID:  categoryID,
		Title:       title,
		TitleEn:     titleEn,
		Excerpt:     &excerpt,
		Content:     sanitizedContent,
		Thumbnail:        thumbnail,
		ThumbnailCaption: &thumbnailCaption,
		Tags:             tags,
		Slug:             slug,
		IsFeatured:       isFeatured,
		Status:           status,
		PublishedAt:      publishedAt,
	}
	return s.repo.CreateNews(ctx, news)
}

func (s *NewsService) UpdateNews(ctx context.Context, id uuid.UUID, categoryID uuid.UUID, title, titleEn, excerpt, content, thumbnail, thumbnailCaption string, tags []string, isFeatured bool, status string, publishedAt time.Time) error {
	sanitizedContent := s.p.Sanitize(content)
	news := &domain.News{
		ID:          id,
		CategoryID:  categoryID,
		Title:       title,
		TitleEn:     titleEn,
		Excerpt:     &excerpt,
		Content:     sanitizedContent,
		Thumbnail:        thumbnail,
		ThumbnailCaption: &thumbnailCaption,
		Tags:             tags,
		IsFeatured:       isFeatured,
		Status:           status,
		PublishedAt:      publishedAt,
	}
	return s.repo.UpdateNews(ctx, news)
}

func (s *NewsService) DeleteNews(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteNews(ctx, id)
}

func (s *NewsService) GetNewsBySlug(ctx context.Context, slug string) (*domain.News, error) {
	news, err := s.repo.GetNewsBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	if news != nil {
		// Increment views in background
		go func() {
			_ = s.repo.IncrementNewsViews(context.Background(), slug)
		}()
	}
	return news, nil
}
func (s *NewsService) ListNews(ctx context.Context, page, limit int32, categorySlug string, authorID *uuid.UUID, sortBy string, isFeatured *bool, search string, statusFilter string, tag string) ([]*domain.News, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	var categoryID *uuid.UUID
	if categorySlug != "" {
		cat, err := s.categoryRepo.GetCategoryBySlug(ctx, categorySlug)
		if err != nil {
			return nil, 0, err
		}
		if cat != nil {
			categoryID = &cat.ID
		}
	}

	var searchPtr *string
	if search != "" {
		searchPtr = &search
	}
	
	var tagPtr *string
	if tag != "" {
		tagPtr = &tag
	}

	news, err := s.repo.ListNews(ctx, limit, offset, categoryID, authorID, sortBy, isFeatured, searchPtr, statusFilter, tagPtr)
	if err != nil {
		return nil, 0, err
	}

	// Get total count with filters applied
	total, err := s.repo.CountNews(ctx, categoryID, authorID, isFeatured, search, statusFilter, tagPtr)
	if err != nil {
		return nil, 0, err
	}

	return news, total, nil
}

func (s *NewsService) CheckSlug(ctx context.Context, slug string) (bool, error) {
	return s.repo.CheckSlugExists(ctx, slug)
}

func (s *NewsService) GetHomepageData(ctx context.Context) (*port.HomepageData, error) {
	// 1. Fetch Featured News (Limit 1)
	isFeatured := true
	featuredList, err := s.repo.ListNews(ctx, 1, 0, nil, nil, "latest", &isFeatured, nil, "", nil)
	if err != nil {
		return nil, err
	}

	var featured *domain.News
	var featuredID uuid.UUID
	if len(featuredList) > 0 {
		featured = featuredList[0]
		featuredID = featured.ID
	}

	// 2. Fetch Latest News (Limit 21 - fetching one extra in case we filter out featured)
	latestList, err := s.repo.ListNews(ctx, 21, 0, nil, nil, "latest", nil, nil, "", nil)
	if err != nil {
		return nil, err
	}

	// Filter out Featured from Latest
	var latest []*domain.News
	count := 0
	for _, news := range latestList {
		if news.ID != featuredID {
			latest = append(latest, news)
			count++
			if count >= 20 { // We want 20 latest news
				break
			}
		}
	}

	// 3. Fetch Popular News (Limit 5)
	popularList, err := s.repo.ListNews(ctx, 5, 0, nil, nil, "popular", nil, nil, "", nil)
	if err != nil {
		return nil, err
	}

	return &port.HomepageData{
		Featured: featured,
		Latest:   latest,
		Popular:  popularList,
	}, nil
}

func generateRawSlug(title string) string {
	// Convert to lowercase
	slug := strings.ToLower(title)

	// Remove all special characters except alphanumeric and spaces
	// This regex keeps letters (including unicode), numbers, and spaces
	reg := regexp.MustCompile(`[^a-z0-9\p{L}\s-]+`)
	slug = reg.ReplaceAllString(slug, "")

	// Replace spaces with hyphens
	slug = strings.ReplaceAll(slug, " ", "-")

	// Replace multiple consecutive hyphens with single hyphen
	multiHyphen := regexp.MustCompile(`-+`)
	slug = multiHyphen.ReplaceAllString(slug, "-")

	// Trim leading and trailing hyphens
	slug = strings.Trim(slug, "-")

	return slug
}

func generateCleanSlug(title string) string {
	return generateRawSlug(title)
}

func generateUniqueSlug(title string) string {
	return fmt.Sprintf("%s-%d", generateRawSlug(title), time.Now().Unix())
}

// Category Service

type CategoryService struct {
	repo port.CategoryRepository
}

func NewCategoryService(repo port.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) CreateCategory(ctx context.Context, name, nameBN, description string, priority int) (*domain.Category, error) {
	slug := generateCleanSlug(name)
	category := &domain.Category{
		Name:        name,
		NameBN:      &nameBN,
		Slug:        slug,
		Description: &description,
		Priority:    priority,
	}
	return s.repo.CreateCategory(ctx, category)
}

func (s *CategoryService) UpdateCategory(ctx context.Context, id uuid.UUID, name, nameBN, description string, priority int) error {
	slug := generateCleanSlug(name)
	category := &domain.Category{
		ID:          id,
		Name:        name,
		NameBN:      &nameBN,
		Slug:        slug,
		Description: &description,
		Priority:    priority,
	}
	return s.repo.UpdateCategory(ctx, category)
}

func (s *CategoryService) DeleteCategory(ctx context.Context, id uuid.UUID) error {
	return s.repo.DeleteCategory(ctx, id)
}

func (s *CategoryService) ListCategories(ctx context.Context) ([]*domain.Category, error) {
	return s.repo.ListCategories(ctx)
}
