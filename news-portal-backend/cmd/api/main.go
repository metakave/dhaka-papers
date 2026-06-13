package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"news-portal-backend/internal/adapter/handler"
	"news-portal-backend/internal/adapter/storage"
	"news-portal-backend/internal/core/port"
	"news-portal-backend/internal/core/port"
	"news-portal-backend/internal/core/service"
)

func main() {
	// 0. Load .env file if present
	_ = godotenv.Load()

	// 1. Logger Setup
	appEnv := os.Getenv("APP_ENV")
	var logger *slog.Logger
	if appEnv == "production" {
		logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
	} else {
		logger = slog.New(slog.NewTextHandler(os.Stdout, nil))
	}
	slog.SetDefault(logger)

	// 2. Config Loading
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		logger.Error("DATABASE_URL is required")
		os.Exit(1)
	}
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		logger.Error("JWT_SECRET is required")
		os.Exit(1)
	}
	serverPort := os.Getenv("PORT")
	if serverPort == "" {
		logger.Error("PORT is required")
		os.Exit(1)
	}

	// CORS Config
	corsOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
	if corsOrigins == "" {
		corsOrigins = "*"
		logger.Warn("CORS_ALLOWED_ORIGINS not set, allowing all origins")
	}
	allowedOrigins := strings.Split(corsOrigins, ",")

	// Rate Limit Config
	rpsStr := os.Getenv("RATE_LIMIT_RPS")
	burstStr := os.Getenv("RATE_LIMIT_BURST")
	rps, _ := strconv.ParseFloat(rpsStr, 64)
	burst, _ := strconv.Atoi(burstStr)
	if rps == 0 {
		rps = 10
	}
	if burst == 0 {
		burst = 30
	}

	// 3. Database
	ctx := context.Background()
	var dbPool *pgxpool.Pool
	var err error

	// Retry connection with exponential backoff
	maxRetries := 10
	for i := 0; i < maxRetries; i++ {
		dbPool, err = pgxpool.New(ctx, dbURL)
		if err == nil {
			// Test the connection
			err = dbPool.Ping(ctx)
			if err == nil {
				break
			}
		}

		logger.Warn("Database not ready, retrying...", "retry", i+1, "error", err)
		time.Sleep(time.Duration(2*i+1) * time.Second)
	}

	if err != nil {
		logger.Error("Could not connect to database after retries", "error", err)
		os.Exit(1)
	}
	defer dbPool.Close()

	// 3b. Auto-Provisioning (Migration & Initial Data)
	logger.Info("Checking for database migrations...")
	if err := RunMigrations(dbURL); err != nil {
		logger.Error("Failed to run migrations", "error", err)
	}

	// 4. Adapters & Services
	store := storage.NewAdapter(dbPool)

	logger.Info("Ensuring initial data...")
	if err := EnsureInitialData(ctx, store); err != nil {
		logger.Error("Failed to ensure initial data", "error", err)
	}

	authService := service.NewAuthService(store, jwtSecret)
	categoryService := service.NewCategoryService(store)
	newsService := service.NewNewsService(store, store)
	menuService := service.NewMenuService(store)

	// File Service (R2 Enforced)
	r2AccountID := os.Getenv("R2_ACCOUNT_ID")
	r2AccessKey := os.Getenv("R2_ACCESS_KEY_ID")
	r2SecretKey := os.Getenv("R2_SECRET_ACCESS_KEY")
	r2Bucket := os.Getenv("R2_BUCKET_NAME")
	r2PublicURL := os.Getenv("R2_PUBLIC_URL")

	if r2AccountID == "" || r2AccessKey == "" || r2SecretKey == "" || r2Bucket == "" {
		logger.Error("R2 configuration missing")
		os.Exit(1)
	}

	r2Service, err := service.NewR2Service(r2AccountID, r2AccessKey, r2SecretKey, r2Bucket, r2PublicURL)
	if err != nil {
		logger.Error("Failed to initialize R2 service", "error", err)
		os.Exit(1)
	}
	var fileService port.FileService = r2Service
	logger.Info("Using Cloudflare R2 Storage", "bucket", r2Bucket)

	// Handlers
	authHandler := handler.NewAuthHandler(authService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	newsHandler := handler.NewNewsHandler(newsService, fileService)
	seedHandler := handler.NewSeedHandler(newsService)
	statsService := service.NewStatsService(store, store, store)
	statsHandler := handler.NewStatsHandler(statsService)
	menuHandler := handler.NewMenuHandler(menuService)

	// 5. Router Setup
	router := NewRouter(RouterConfig{
		AllowedOrigins:  allowedOrigins,
		RPS:             rps,
		Burst:           burst,
		JWTSecret:       jwtSecret,
		AuthHandler:     authHandler,
		CategoryHandler: categoryHandler,
		NewsHandler:     newsHandler,
		StatsHandler:    statsHandler,
		SeedHandler:     seedHandler,
		MenuHandler:     menuHandler,
	})

	// 6. Graceful Shutdown Setup
	srv := &http.Server{
		Addr:    ":" + serverPort,
		Handler: router,
	}

	go func() {
		logger.Info("Server starting", "port", serverPort, "env", appEnv)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("Server failed", "error", err)
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Error("Server forced to shutdown", "error", err)
	}

	logger.Info("Server exiting")
}
