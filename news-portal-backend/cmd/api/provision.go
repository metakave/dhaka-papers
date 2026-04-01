package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"golang.org/x/crypto/bcrypt"

	"news-portal-backend/internal/adapter/storage"
	"news-portal-backend/internal/core/domain"
)

// EnsureInitialData seeds the database with an admin user and default categories if they don't exist
func EnsureInitialData(ctx context.Context, store *storage.Adapter) error {
	// 1. Check for Admin
	ownerCount, err := store.CountOwners(ctx)
	if err != nil {
		return fmt.Errorf("failed to count owners: %w", err)
	}

	if ownerCount == 0 {
		name := os.Getenv("INITIAL_ADMIN_NAME")
		email := os.Getenv("INITIAL_ADMIN_EMAIL")
		password := os.Getenv("INITIAL_ADMIN_PASSWORD")

		if name != "" && email != "" && password != "" {
			slog.Info("Creating initial admin user", "email", email)
			hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
			if err != nil {
				return fmt.Errorf("failed to hash password: %w", err)
			}

			_, err = store.CreateOwner(ctx, name, "", email, string(hash))
			if err != nil {
				return fmt.Errorf("failed to create initial admin: %w", err)
			}
		}
	}

	// 2. Check for Categories
	categories, err := store.ListCategories(ctx)
	if err != nil {
		return fmt.Errorf("failed to list categories: %w", err)
	}

	if len(categories) == 0 {
		slog.Info("Seeding default categories")
		defaults := []*domain.Category{
			{Name: "Bangladesh", NameBN: stringPtr("বাংলাদেশ"), Slug: "bangladesh"},
			{Name: "International", NameBN: stringPtr("আন্তর্জাতিক"), Slug: "international"},
			{Name: "Sports", NameBN: stringPtr("খেলা"), Slug: "sports"},
			{Name: "Entertainment", NameBN: stringPtr("বিনোদন"), Slug: "entertainment"},
		}

		for _, cat := range defaults {
			_, err := store.CreateCategory(ctx, cat)
			if err != nil {
				slog.Error("Failed to create default category", "slug", cat.Slug, "error", err)
			}
		}
	}

	return nil
}

func stringPtr(s string) *string {
	return &s
}

// RunMigrations executes database migrations automatically
func RunMigrations(dbURL string) error {
	m, err := migrate.New(
		"file://migrations",
		dbURL,
	)
	if err != nil {
		return fmt.Errorf("migration instance error: %w", err)
	}
	defer m.Close()

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("migration up error: %w", err)
	}

	return nil
}
