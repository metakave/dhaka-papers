# 🗞️ Enterprise-Grade Multi-Service News Ecosystem

A robust, high-performance news portal ecosystem designed for scale and enterprise reliability. This project implements a micro-service inspired architecture featuring a fast Go backend, a dynamic Next.js reader frontend, and a professional management CMS.

---

## 🏗 System Architecture

The ecosystem is built with a clear separation of concerns, orchestrated through a unified reverse-proxy gateway:

### 🚀 Technical Overview
- **Unified Domain Routing**: Utilizes Caddy as a reverse proxy to handle path-based routing (`/`, `/admin`, `/api`) on a single domain with automated SSL.
- **High Concurrency Backend**: Built with Go for superior performance and minimal memory footprint.
- **Modern Frontend Stack**: Implements Next.js App Router with Static Site Generation (SSG) and Incremental Static Regeneration (ISR) for near-instant load times.
- **State Management**: Robust data fetching and caching using TanStack Query v5.
- **Design System**: Responsive, accessible UI built with Tailwind CSS and Shadcn UI.

### ⚙️ News API (Backend)
- **Tech Stack**: Go (1.25+), Chi Router, PostgreSQL, Cloudflare R2 (S3-compliant).
- **Core Features**:
  - Multipart news creation with atomic transactions.
  - S3-compatible media handling with efficient upload flows.
  - Advanced HTML sanitization via `bluemonday` to prevent XSS while allowing rich text.
  - Automated database migrations and schema management.

### 📱 Reader Frontend (Client)
- **Tech Stack**: Next.js (App Router), Tailwind CSS, TanStack Query.
- **Core Features**:
  - Bilingual content support (Bengali/English) with SEO-optimized slug generation.
  - Infinite scroll and advanced category filtering for smooth user experience.
  - Optimized for Core Web Vitals to ensure high search engine ranking.

### 🔐 Admin CMS (Management)
- **Tech Stack**: Next.js, Shadcn UI, TipTap Editor.
- **Core Features**:
  - Centralized dashboard for news, category, and user management.
  - Rich Text editing with full-featured TipTap integration.
  - Secure JWT-based authentication with HTTP-only cookies.

---

## 🛠 Feature Deep-Dive

| Feature | Implementation Detail |
| :--- | :--- |
| **Bilingual SEO** | Dynamic slug generation from English titles for Bengali content to maximize SERP discoverability. |
| **Atomic Media** | Synchronous news and image persistence ensuring data integrity in S3 storage. |
| **Secure Auth** | Role-based access control with secure cross-service JWT verification. |
| **Reverse Proxy** | Enterprise routing via Caddy for seamless service orchestration under a single domain. |
| **CI/CD** | Automated deployment pipelines via GitHub Actions for zero-downtime updates. |

---

## 🌐 Production Infrastructure

The project is designed to run on any Linux environment:
- **Containerization**: Fully Dockerized services for consistent development and production parity.
- **Orchestration**: Docker Compose for manageable service lifecycles.
- **Networking**: Internal Docker networking keeps the PostgreSQL database isolated from public traffic.
- **Security**: Automated Let's Encrypt SSL management via Caddy.

---

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- S3-compatible storage (Cloudflare R2, AWS S3, etc.)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/your-org/news-ecosystem.git

# 2. Setup environment variables
cp .env.example .env

# 3. Spin up the infrastructure
docker compose up --build -d
```

### Direct Access
- **Main Portal**: `https://your-domain.com`
- **Admin Dashboard**: `https://your-domain.com/admin`
- **Data Engine**: `https://your-domain.com/api/v1`

---

## 📝 License
This project is licensed under the MIT License.
