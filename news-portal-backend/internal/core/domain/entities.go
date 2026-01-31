package domain

import (
	"time"

	"github.com/google/uuid"
)

type Owner struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
}

type Category struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	NameBN      *string   `json:"name_bn"`
	Slug        string    `json:"slug"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}

type News struct {
	ID              uuid.UUID `json:"id"`
	AuthorID        uuid.UUID `json:"author_id"`
	CategoryID      uuid.UUID `json:"category_id"`
	Title           string    `json:"title"`
	TitleEn         string    `json:"title_en"` // Bengali title is Title, English title is TitleEn
	Excerpt         *string   `json:"excerpt"`
	Content         string    `json:"content,omitempty"`
	Thumbnail       string    `json:"thumbnail"`
	Slug            string    `json:"slug"`
	Status          string    `json:"status"`
	IsFeatured      bool      `json:"is_featured"`
	MetaTitle       *string   `json:"meta_title"`
	MetaDescription *string   `json:"meta_description"`
	ViewsCount      int64     `json:"views_count"`
	PublishedAt     time.Time `json:"published_at"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	// Joined fields for easier frontend rendering
	AuthorName   *string `json:"author_name,omitempty"`
	CategoryName *string `json:"category_name,omitempty"`
	CategorySlug *string `json:"category_slug,omitempty"`
}
