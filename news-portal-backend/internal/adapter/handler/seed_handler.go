package handler

// THIS FILE IS FOR DEVELOPMENT SEEDING ONLY
// DELETE THIS FILE BEFORE DEPLOYING TO PRODUCTION

import (
	"encoding/json"
	"net/http"

	"news-portal-backend/internal/core/port"

	"github.com/google/uuid"
)

type SeedHandler struct {
	svc port.NewsService
}

func NewSeedHandler(svc port.NewsService) *SeedHandler {
	return &SeedHandler{svc: svc}
}

type SeedNewsRequest struct {
	CategoryID   string `json:"category_id"`
	Title        string `json:"title"`
	TitleEn      string `json:"title_en"` // Added for seeding
	Excerpt      string `json:"excerpt"`
	Content      string `json:"content"`
	ThumbnailURL string `json:"thumbnail_url"`
	IsFeatured   bool   `json:"is_featured"`
}

// SEED_CreateNews - FOR SEEDING ONLY - Accepts thumbnail URLs instead of file uploads
// DELETE THIS ENDPOINT BEFORE PRODUCTION
func (h *SeedHandler) SEED_CreateNews(w http.ResponseWriter, r *http.Request) {
	var req SeedNewsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Title == "" || req.Content == "" {
		http.Error(w, "Title and Content are required", http.StatusBadRequest)
		return
	}

	categoryID, err := uuid.Parse(req.CategoryID)
	if err != nil {
		http.Error(w, "Invalid Category ID", http.StatusBadRequest)
		return
	}

	// Get author_id from context
	userIDStr, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	authorID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Invalid author ID", http.StatusUnauthorized)
		return
	}

	// For seeding, if TitleEn is missing, use Title (or a slugified version if you prefer)
	titleEn := req.TitleEn
	if titleEn == "" {
		titleEn = req.Title // Fallback for seeds
	}

	news, err := h.svc.CreateNews(r.Context(), authorID, categoryID, req.Title, titleEn, req.Excerpt, req.Content, req.ThumbnailURL, req.IsFeatured)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "News seeded successfully",
		"newsId":  news.ID,
	})
}
