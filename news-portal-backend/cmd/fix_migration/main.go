package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	ctx := context.Background()
	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
	defer pool.Close()

	fmt.Println("Resetting migration version to 4...")
	// Force version 4, dirty false.
	// We assume there is only one row or we want to enforce this state.
	// Safest is to delete all and insert 4, false.
	// But commonly expected behavior is one row.
	_, err = pool.Exec(ctx, "DELETE FROM schema_migrations")
	if err != nil {
		log.Fatalf("Error clearing schema_migrations: %v", err)
	}
	_, err = pool.Exec(ctx, "INSERT INTO schema_migrations (version, dirty) VALUES (4, false)")
	if err != nil {
		log.Fatalf("Error setting schema_migrations: %v", err)
	}
	fmt.Println("Migration version reset to 4.")
}
