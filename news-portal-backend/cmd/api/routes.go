package main

import (
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"news-portal-backend/internal/adapter/handler"
	customMiddleware "news-portal-backend/internal/adapter/middleware"
)

type RouterConfig struct {
	AllowedOrigins  []string
	RPS             float64
	Burst           int
	JWTSecret       string
	AuthHandler     *handler.AuthHandler
	CategoryHandler *handler.CategoryHandler
	NewsHandler     *handler.NewsHandler
	StatsHandler    *handler.StatsHandler
	SeedHandler     *handler.SeedHandler
}

func NewRouter(cfg RouterConfig) http.Handler {
	r := chi.NewRouter()

	// Middlewares
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.AllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(customMiddleware.RateLimitMiddleware(cfg.RPS, cfg.Burst))

	// API Routes
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("News Portal API is running"))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("News Portal API v1 is running"))
		})
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("OK"))
		})
		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", cfg.AuthHandler.Login)
			r.Group(func(r chi.Router) {
				r.Use(handler.AuthMiddleware(cfg.JWTSecret))
				r.Get("/me", cfg.AuthHandler.GetMe)
			})
		})

		r.Get("/categories", cfg.CategoryHandler.ListCategories)
		r.Get("/news", cfg.NewsHandler.ListNews)
		r.Get("/news/homepage", cfg.NewsHandler.GetHomepage)
		r.Get("/news/check-slug", cfg.NewsHandler.CheckSlug)
		r.Get("/news/{slug}", cfg.NewsHandler.GetNews)
		r.Get("/stats", cfg.StatsHandler.GetStats)

		r.Group(func(r chi.Router) {
			r.Use(handler.AuthMiddleware(cfg.JWTSecret))

			r.Post("/news", cfg.NewsHandler.CreateNews)
			r.Put("/news/{id}", cfg.NewsHandler.UpdateNews)
			r.Delete("/news/{id}", cfg.NewsHandler.DeleteNews)

			r.Post("/categories", cfg.CategoryHandler.CreateCategory)
			r.Put("/categories/{id}", cfg.CategoryHandler.UpdateCategory)
			r.Delete("/categories/{id}", cfg.CategoryHandler.DeleteCategory)

			r.Get("/users", cfg.AuthHandler.ListUsers)
			r.Post("/users", cfg.AuthHandler.Register)
			r.Post("/users/change-password", cfg.AuthHandler.ChangePassword)

			r.Post("/SEED_news", cfg.SeedHandler.SEED_CreateNews)
		})
	})

	return r
}

// FileServer conveniently sets up a http.FileServer handler at a given path.
func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
