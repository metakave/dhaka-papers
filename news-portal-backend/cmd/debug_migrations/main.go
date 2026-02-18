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

	// 1. Check schema_migrations
	rows, err := pool.Query(ctx, "SELECT version, dirty FROM schema_migrations")
	if err != nil {
		log.Printf("Error querying schema_migrations: %v", err)
	} else {
		defer rows.Close()
		fmt.Println("--- schema_migrations ---")
		for rows.Next() {
			var version int64
			var dirty bool
			rows.Scan(&version, &dirty)
			fmt.Printf("Version: %d, Dirty: %v\n", version, dirty)
		}
	}

	// 2. Check columns in categories
	fmt.Println("\n--- columns in categories ---")
	rows, err = pool.Query(ctx, "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories'")
	if err != nil {
		log.Fatalf("Error querying columns: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		var colName, dataType string
		rows.Scan(&colName, &dataType)
		fmt.Printf("Column: %s (%s)\n", colName, dataType)
	}
}
