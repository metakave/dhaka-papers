package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"

	"news-portal-backend/internal/core/domain"
	"news-portal-backend/internal/core/port"
	"news-portal-backend/internal/core/service"
)

type AuthHandler struct {
	svc     port.AuthService
	fileSvc port.FileService
}

func NewAuthHandler(svc port.AuthService, fileSvc port.FileService) *AuthHandler {
	return &AuthHandler{svc: svc, fileSvc: fileSvc}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, err := h.svc.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		NameEn   string `json:"name_en"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" || req.Name == "" {
		http.Error(w, "Name, Email and Password are required", http.StatusBadRequest)
		return
	}

	user, err := h.svc.Register(r.Context(), req.Name, req.NameEn, req.Email, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func (h *AuthHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.OldPassword == "" || req.NewPassword == "" {
		http.Error(w, "Old and new passwords are required", http.StatusBadRequest)
		return
	}

	// Get user_id from context (set by AuthMiddleware)
	userIDStr, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusUnauthorized)
		return
	}

	err = h.svc.ChangePassword(r.Context(), userID, req.OldPassword, req.NewPassword)
	if err != nil {
		if err.Error() == "invalid old password" {
			http.Error(w, "Invalid old password", http.StatusUnauthorized)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Password updated"})
}

func (h *AuthHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	name := r.FormValue("name")
	nameEn := r.FormValue("name_en")
	email := r.FormValue("email")
	password := r.FormValue("password")
	hideProfileImage := r.FormValue("hide_profile_image") == "true"
	existingProfileImage := r.FormValue("profile_image")

	var profileImage *string
	if existingProfileImage != "" {
		profileImage = &existingProfileImage
	}

	// Handle Image Upload if present
	file, header, err := r.FormFile("profile_image_file")
	if err == nil {
		defer file.Close()
		contentType := header.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "image/") {
			http.Error(w, "Only image files are allowed", http.StatusBadRequest)
			return
		}

		uploadedURL, err := h.fileSvc.UploadFile(file, header)
		if err != nil {
			http.Error(w, "Failed to upload image: "+err.Error(), http.StatusInternalServerError)
			return
		}
		profileImage = &uploadedURL
	}

	err = h.svc.UpdateUser(r.Context(), id, name, nameEn, email, password, profileImage, hideProfileImage)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *AuthHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.svc.ListUsers(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func (h *AuthHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	userIDStr, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusInternalServerError)
		return
	}

	user, err := h.svc.GetMe(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// News Handler

type NewsHandler struct {
	svc     port.NewsService
	fileSvc port.FileService
}

func NewNewsHandler(svc port.NewsService, fileSvc port.FileService) *NewsHandler {
	return &NewsHandler{svc: svc, fileSvc: fileSvc}
}

func (h *NewsHandler) CreateNews(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form
	if err := r.ParseMultipartForm(10 << 20); err != nil { // 10 MB
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	titleEn := r.FormValue("title_en")
	categoryIDStr := r.FormValue("category_id")
	excerpt := r.FormValue("excerpt")
	content := r.FormValue("content")
	isFeatured := r.FormValue("is_featured") == "true"
	isBrief := r.FormValue("is_brief") == "true"
	thumbnailCaption := r.FormValue("thumbnail_caption")
	lang := r.FormValue("lang")
	if lang == "" {
		lang = "bn"
	}
	
	var tags []string
	if vals, ok := r.MultipartForm.Value["tags"]; ok {
		tags = vals
	}

	if title == "" || content == "" {
		http.Error(w, "Title and Content are required", http.StatusBadRequest)
		return
	}

	categoryID, err := uuid.Parse(categoryIDStr)
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

	// Handle Image Upload if present
	var thumbnail string
	file, header, err := r.FormFile("thumbnail")
	if err == nil {
		defer file.Close()
		// Validate file type
		contentType := header.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "image/") {
			http.Error(w, "Only image files are allowed", http.StatusBadRequest)
			return
		}

		thumbnail, err = h.fileSvc.UploadFile(file, header)
		if err != nil {
			http.Error(w, "Failed to upload image: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Handle Status and PublishedAt
	status := r.FormValue("status")
	if status == "" {
		status = "draft" // Default to draft if not specified
	}

	publishedAtStr := r.FormValue("published_at")
	var publishedAt time.Time
	if publishedAtStr != "" {
		t, err := time.Parse(time.RFC3339, publishedAtStr)
		if err != nil {
			// Try simpler format if RFC3339 fails (e.g. HTML datetime-local)
			t, err = time.Parse("2006-01-02T15:04", publishedAtStr)
			if err != nil {
				http.Error(w, "Invalid published_at format", http.StatusBadRequest)
				return
			}
		}
		publishedAt = t
	} else {
		publishedAt = time.Now()
	}

	news, err := h.svc.CreateNews(r.Context(), authorID, categoryID, title, titleEn, excerpt, content, thumbnail, thumbnailCaption, tags, isFeatured, isBrief, status, publishedAt, lang)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "News saved",
		"newsId":  news.ID,
	})
}

func (h *NewsHandler) UpdateNews(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	title := r.FormValue("title")
	titleEn := r.FormValue("title_en")
	categoryIDStr := r.FormValue("category_id")
	excerpt := r.FormValue("excerpt")
	content := r.FormValue("content")
	isFeatured := r.FormValue("is_featured") == "true"
	isBrief := r.FormValue("is_brief") == "true"
	thumbnailCaption := r.FormValue("thumbnail_caption")
	lang := r.FormValue("lang")
	if lang == "" {
		lang = "bn"
	}
	existingThumbnail := r.FormValue("thumbnail") // Keep existing if no new one

	var tags []string
	if vals, ok := r.MultipartForm.Value["tags"]; ok {
		tags = vals
	}

	if title == "" || content == "" {
		http.Error(w, "Title and Content are required", http.StatusBadRequest)
		return
	}

	categoryID, err := uuid.Parse(categoryIDStr)
	if err != nil {
		http.Error(w, "Invalid Category ID", http.StatusBadRequest)
		return
	}

	// Handle Image Upload if present
	thumbnail := existingThumbnail
	file, header, err := r.FormFile("thumbnail")
	if err == nil {
		defer file.Close()
		contentType := header.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "image/") {
			http.Error(w, "Only image files are allowed", http.StatusBadRequest)
			return
		}

		thumbnail, err = h.fileSvc.UploadFile(file, header)
		if err != nil {
			http.Error(w, "Failed to upload image: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Handle Status and PublishedAt
	status := r.FormValue("status")
	if status == "" {
		status = "draft"
	}

	publishedAtStr := r.FormValue("published_at")
	var publishedAt time.Time
	if publishedAtStr != "" {
		t, err := time.Parse(time.RFC3339, publishedAtStr)
		if err != nil {
			t, err = time.Parse("2006-01-02T15:04", publishedAtStr)
			if err != nil {
				http.Error(w, "Invalid published_at format", http.StatusBadRequest)
				return
			}
		}
		publishedAt = t
	} else {
		publishedAt = time.Now()
	}

	if err := h.svc.UpdateNews(r.Context(), id, categoryID, title, titleEn, excerpt, content, thumbnail, thumbnailCaption, tags, isFeatured, isBrief, status, publishedAt, lang); err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			http.Error(w, "News not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "News updated"})
}

func (h *NewsHandler) DeleteNews(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.svc.DeleteNews(r.Context(), id); err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			http.Error(w, "News not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "News deleted"})
}

func (h *NewsHandler) ListNews(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	category := r.URL.Query().Get("category")
	sort := r.URL.Query().Get("sort")
	featuredStr := r.URL.Query().Get("featured")

	var isFeatured *bool
	if featuredStr != "" {
		b, err := strconv.ParseBool(featuredStr)
		if err == nil {
			isFeatured = &b
		}
	}

	briefStr := r.URL.Query().Get("is_brief")
	var isBrief *bool
	if briefStr != "" {
		b, err := strconv.ParseBool(briefStr)
		if err == nil {
			isBrief = &b
		}
	} else {
		// Default to false for public lists so briefs don't leak into category/general pages
		f := false
		isBrief = &f
	}

	search := r.URL.Query().Get("search")
	authorIDStr := r.URL.Query().Get("author_id")
	tag := r.URL.Query().Get("tag")
	lang := r.URL.Query().Get("lang")
	var authorID *uuid.UUID
	if authorIDStr != "" {
		id, err := uuid.Parse(authorIDStr)
		if err == nil {
			authorID = &id
		}
	}

	newsList, total, err := h.svc.ListNews(r.Context(), int32(page), int32(limit), category, authorID, sort, isFeatured, isBrief, search, "", tag, lang)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"newsList": newsList,
		"total":    total,
	})
}

func (h *NewsHandler) ListAdminNews(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	category := r.URL.Query().Get("category")
	sort := r.URL.Query().Get("sort")
	featuredStr := r.URL.Query().Get("featured")

	var isFeatured *bool
	if featuredStr != "" {
		b, err := strconv.ParseBool(featuredStr)
		if err == nil {
			isFeatured = &b
		}
	}

	briefStr := r.URL.Query().Get("is_brief")
	var isBrief *bool
	if briefStr != "" {
		b, err := strconv.ParseBool(briefStr)
		if err == nil {
			isBrief = &b
		}
	}

	search := r.URL.Query().Get("search")
	authorIDStr := r.URL.Query().Get("author_id")
	tag := r.URL.Query().Get("tag")
	lang := r.URL.Query().Get("lang")

	var authorID *uuid.UUID
	if authorIDStr != "" {
		id, err := uuid.Parse(authorIDStr)
		if err == nil {
			authorID = &id
		}
	}

	// Status Filter: "all" for admin to see everything
	newsList, total, err := h.svc.ListNews(r.Context(), int32(page), int32(limit), category, authorID, sort, isFeatured, isBrief, search, "all", tag, lang)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"newsList": newsList,
		"total":    total,
	})
}

func (h *NewsHandler) GetNews(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	lang := r.URL.Query().Get("lang")
	news, err := h.svc.GetNewsBySlug(r.Context(), slug, lang)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if news == nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(news)
}

func (h *NewsHandler) GetHomepage(w http.ResponseWriter, r *http.Request) {
	lang := r.URL.Query().Get("lang")
	data, err := h.svc.GetHomepageData(r.Context(), lang)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (h *NewsHandler) CheckSlug(w http.ResponseWriter, r *http.Request) {
	slug := r.URL.Query().Get("slug")
	lang := r.URL.Query().Get("lang")
	if slug == "" {
		http.Error(w, "Slug required", http.StatusBadRequest)
		return
	}

	exists, err := h.svc.CheckSlug(r.Context(), slug, lang)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"exists": exists})
}

// Category Handler

type CategoryHandler struct {
	svc port.CategoryService
}

func NewCategoryHandler(svc port.CategoryService) *CategoryHandler {
	return &CategoryHandler{svc: svc}
}

func (h *CategoryHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		NameBN      string `json:"name_bn"`
		Description string `json:"description"`
		Priority    int    `json:"priority"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	category, err := h.svc.CreateCategory(r.Context(), req.Name, req.NameBN, req.Description, req.Priority)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(category)
}

func (h *CategoryHandler) UpdateCategory(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Name        string `json:"name"`
		NameBN      string `json:"name_bn"`
		Description string `json:"description"`
		Priority    int    `json:"priority"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	err = h.svc.UpdateCategory(r.Context(), id, req.Name, req.NameBN, req.Description, req.Priority)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *CategoryHandler) DeleteCategory(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	err = h.svc.DeleteCategory(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *CategoryHandler) ListCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.svc.ListCategories(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

// Stats Handler

type StatsHandler struct {
	svc *service.StatsService
}

func NewStatsHandler(svc *service.StatsService) *StatsHandler {
	return &StatsHandler{svc: svc}
}

func (h *StatsHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.svc.GetDashboardStats(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// SpecialReport Handler

type SpecialReportHandler struct {
	svc port.SpecialReportService
}

func NewSpecialReportHandler(svc port.SpecialReportService) *SpecialReportHandler {
	return &SpecialReportHandler{svc: svc}
}

func (h *SpecialReportHandler) CreateReport(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title       string `json:"title"`
		Slug        string `json:"slug"`
		Description string `json:"description"`
		Thumbnail   string `json:"thumbnail"`
		Status      string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	report, err := h.svc.CreateReport(r.Context(), req.Title, req.Slug, req.Description, req.Thumbnail, req.Status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(report)
}

func (h *SpecialReportHandler) UpdateReport(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Title       string `json:"title"`
		Slug        string `json:"slug"`
		Description string `json:"description"`
		Thumbnail   string `json:"thumbnail"`
		Status      string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.svc.UpdateReport(r.Context(), id, req.Title, req.Slug, req.Description, req.Thumbnail, req.Status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *SpecialReportHandler) DeleteReport(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	err = h.svc.DeleteReport(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *SpecialReportHandler) ListReports(w http.ResponseWriter, r *http.Request) {
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	status := r.URL.Query().Get("status")

	reports, total, err := h.svc.ListReports(r.Context(), int32(page), int32(limit), status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"reports": reports,
		"total":   total,
	})
}

func (h *SpecialReportHandler) GetReport(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	report, err := h.svc.GetReportBySlug(r.Context(), slug)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if report == nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(report)
}

func (h *SpecialReportHandler) UpsertItems(w http.ResponseWriter, r *http.Request) {
	reportIDStr := chi.URLParam(r, "reportId")
	reportID, err := uuid.Parse(reportIDStr)
	if err != nil {
		http.Error(w, "Invalid Report ID", http.StatusBadRequest)
		return
	}

	var items []domain.ReportItem
	if err := json.NewDecoder(r.Body).Decode(&items); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.svc.UpsertReportItems(r.Context(), reportID, items)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
