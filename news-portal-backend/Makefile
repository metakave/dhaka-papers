ifneq (,$(wildcard ./.env))
    include .env
    export
endif

.PHONY: up down migrate-up migrate-down sqlc run

up:
	docker compose up -d

down:
	docker compose down

migrate-up:
	docker run --rm -v $(PWD)/migrations:/migrations --network host migrate/migrate -path=/migrations/ -database "$(DATABASE_URL)" up

migrate-down:
	docker run --rm -v $(PWD)/migrations:/migrations --network host migrate/migrate -path=/migrations/ -database "$(DATABASE_URL)" down

sqlc:
	docker run --rm -v $(PWD):/src -w /src sqlc/sqlc generate

create-admin:
	go run cmd/admin/main.go -name="$(if $(NAME),$(NAME),$(INITIAL_ADMIN_NAME))" -email="$(if $(EMAIL),$(EMAIL),$(INITIAL_ADMIN_EMAIL))" -password="$(if $(PASSWORD),$(PASSWORD),$(INITIAL_ADMIN_PASSWORD))"

run:
	go run cmd/api/*.go
