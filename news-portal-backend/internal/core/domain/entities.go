package domain

import (
	"time"

	"github.com/google/uuid"
)

type Owner struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	NameEn    string    `json:"name_en"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	Role      string    `json:"role"`
	CreatedAt        time.Time `json:"created_at"`
	ProfileImage     *string   `json:"profile_image,omitempty"`
	HideProfileImage bool      `json:"hide_profile_image"`
}

type Category struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	NameBN      *string   `json:"name_bn"`
	Slug        string    `json:"slug"`
	Description *string   `json:"description,omitempty"`
	Priority    int       `json:"priority"`
	CreatedAt   time.Time `json:"created_at"`
}

type News struct {
	ID              uuid.UUID `json:"id"`
	AuthorID        uuid.UUID `json:"author_id"`
	CategoryID      uuid.UUID `json:"category_id"`
	Title           string    `json:"title"`
	TitleEn         string    `json:"title_en"` // Bengali title is Title, English title is TitleEn
	Excerpt         *string   `json:"excerpt"`
	Content          string    `json:"content,omitempty"`
	Thumbnail        string    `json:"thumbnail"`
	ThumbnailCaption *string   `json:"thumbnail_caption"`
	Tags             []string  `json:"tags"`
	Slug             string    `json:"slug"`
	Status          string    `json:"status"`
	IsFeatured      bool      `json:"is_featured"`
	IsBrief         bool      `json:"is_brief"`
	MetaTitle       *string   `json:"meta_title"`
	MetaDescription *string   `json:"meta_description"`
	ViewsCount      int64     `json:"views_count"`
	Lang            string    `json:"lang"`
	PublishedAt     time.Time `json:"published_at"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	// Joined fields for easier frontend rendering
	AuthorName     *string `json:"author_name,omitempty"`
	AuthorNameEn           *string `json:"author_name_en,omitempty"`
	AuthorProfileImage     *string `json:"author_profile_image,omitempty"`
	AuthorHideProfileImage *bool   `json:"author_hide_profile_image,omitempty"`
	CategoryName           *string `json:"category_name,omitempty"`
	CategoryNameBN         *string `json:"category_name_bn,omitempty"`
	CategorySlug           *string `json:"category_slug,omitempty"`
}
type SpecialReport struct {
	ID              uuid.UUID `json:"id"`
	Title           string    `json:"title"`
	Slug            string    `json:"slug"`
	Description     *string   `json:"description"`
	Thumbnail       *string   `json:"thumbnail"`
	Status          string    `json:"status"` // draft, published
	MetaTitle       *string   `json:"meta_title"`
	MetaDescription *string   `json:"meta_description"`
	Keywords        *string   `json:"keywords"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	// Optional: List of items when fetching detailed report
	Items []ReportItem `json:"items,omitempty"`
}

type ReportItem struct {
	ID           uuid.UUID `json:"id"`
	ReportID     uuid.UUID `json:"report_id"`
	Title        string    `json:"title"`
	DateStr      *string   `json:"date_str"`
	Details      *string   `json:"details"`
	ImageURL     *string   `json:"image_url"`
	QRCodeURL    *string   `json:"qr_code_url"`
	NewsURL      *string   `json:"news_url"`
	SerialNumber int       `json:"serial_number"`
	Metadata     []byte    `json:"metadata"` // Raw JSONB
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
