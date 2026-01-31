# 📄 Advanced Technical Handover Documentation

This document provides a deep-dive into the architectural and implementation details of the News Portal Ecosystem for incoming engineers.

---

## 🏗 Architectural Deep-Dive

The system is architected as an orchestrated ecosystem of 3 independent services bridged by a reverse-proxy gateway.

### 1. The Gateway (Caddy Server)
Caddy serves as the **Micro-Gateway**. Unlike Nginx, it was chosen for its **Automated SSL** (native ACME) and its simple configuration for path-based routing.
- **Logic**: It uses `handle` directives to route traffic without stripping paths.
- **Why?**: This allows the Next.js CMS to reside under `/admin` without confusing its internal router.

### 2. The Data Engine (Go API)
Built with **Golang 1.25** and the **Chi Router**.
- **Internal Pattern**: Follows a decoupled "Adapter-Port-Service" (Hexagonal Lite) pattern.
  - `internal/adapter/handler`: Handles HTTP requests/responses.
  - `internal/core/service`: Contains the core business logic (e.g., slug generation, news processing).
  - `internal/core/port`: Interfaces defining how components talk to each other.
- **API Mechanics**:
  - **Multipart Parsing**: Configured with a `10MB` memory limit for image-heavy uploads (`r.ParseMultipartForm(10 << 20)`).
  - **Atomic Persistence**: When news is created with an image, the image is uploaded to **Cloudflare R2** first. If successful, the database record is created. This prevents "ghost files" in storage.
  - **Security Middleware**:
    - `AuthMiddleware`: Verifies JWT tokens from headers.
    - `RateLimitMiddleware`: Prevents brute-force or DDoS on critical endpoints.
    - `bluemonday`: Automatically strips malicious `<script>` and `<onload>` tags while preserving rich text formatting.

### 3. The Management CMS (Next.js)
A professional-grade dashboard utilizing **Next.js App Router**.
- **The Editor (TipTap)**:
  - **Technology**: Built on Prosemirror.
  - **Extensions**: Configured with `StarterKit`, `TextStyle`, `Color`, `Highlight` (multi-color), `FontFamily`, and `TextAlign`.
  - **UX**: Provides a MS Word-like experience for editors while outputting clean HTML for the backend.
- **Base Path Routing**: Configured with `basePath: '/admin'` in `next.config.ts`. This is critical for the path-based deployment on the VPS.

---

## 🌐 Environment (.env) Granular Reference

The system relies on a unified `.env` file at the root. Here is the breakdown:

### Database (PostgreSQL)
- **POSTGRES_USER**: DB username (default: postgres).
- **POSTGRES_PASSWORD**: **CRITICAL** - change this in production.
- **POSTGRES_DB**: Name of the database schema.

### Backend Engine
- **JWT_SECRET**: Key used to sign and verify user sessions.
- **BACKEND_PORT**: The port the Go binary listens on (standard: 8080).
- **APP_ENV**: `development` or `production` (affects logging and security laxity).

### Cloudflare R2 (Storage)
- **R2_ACCOUNT_ID / ACCESS_KEY / SECRET**: Required for S3-compatible API access.
- **R2_PUBLIC_URL**: The public CDN URL where readers view the uploaded images.

### App Inter-Connectivity
- **NEXT_PUBLIC_API_URL**: Used by the **Browser** (Client-side) to reach `https://domain.com/api/v1`.
- **INTERNAL_API_URL**: Used by **Next.js Server Side** to talk to the Backend via Docker's internal network (`http://backend:8080/api/v1`).

---

## 🗄 Database Management & Strategy

### Current Docker Setup
- The DB runs in a container named `mm_news_portal_db`.
- Data is stored in the `postgres_data` volume.
- **Access**: Only the `backend` container can communicate with the DB. No public exposure.

### Future Roadmap: Moving to a Managed Database
While Docker is great for small production, for high-traffic production, **moving to a Managed Database** (RDS, DigitalOcean) is recommended.Also can changed the database.
- **Why?**:
  - **Auto-Backups**: Managed services take snapshots every few hours.
  - **High Availability**: They automatically restart if anything fails.
  - **Security**: They handle OS patches and firewalling for you.
- **Implementation**: To move, simply export your current data (`docker exec` -> `pg_dump`), import it to the new provider, and update the `DATABASE_URL` in your `.env`.

---

## 🛠 Automatic Provisioning (First Run)

The backend includes a **Self-Healing and Provisioning** logic in `cmd/api/provision.go`. On the first startup:
1. **Migrations**: It automatically detects the database and runs all migrations in `migrations/`.
2. **Initial Admin**: If no users exist, it creates an admin account using the `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL`, and `INITIAL_ADMIN_PASSWORD` variables from your `.env`.
3. **Seed Categories**: If no categories exist, it automatically seeds the database with defaults (Bangladesh, International, Sports, Entertainment).

### Post-Deployment Checklist
1. **Verify Services**: Ensure all containers are running (`docker compose ps`).
2. **Initial Login**: Go to `/admin/login` and use the credentials you set in `.env`.
3. **CORS**: If adding a new frontend service, ensure you add the URL to `CORS_ALLOWED_ORIGINS`.
4. **Sanitization**: If you need to allow more HTML tags (like `<iframe>`), update the policy in `news-portal-backend/internal/adapter/handler/handlers.go`.

---

