# 🗞️ Enterprise-Grade Multi-Service News Ecosystem

A mission-critical, high-performance news portal ecosystem designed for scale.

---

## 🌟 Resume Highlights (Technical Excellence)

This project isn't just a "news site"; it's a demonstration of complex engineering challenges solved:
- **Full-Cycle DevSecOps**: Containerized with Docker and orchestrated with specialized routing for production.
- **Micro-Gateway Routing**: Implemented path-based reverse proxying (Caddy) to serve three distinct services from a single domain.
- **Automated Infrastructure**: Zero-downtime deployment pipeline using GitHub Actions.
- **Bilingual SEO Architecture**: Dynamic slug generation based on English titles for a primarily Bengali content site to maximize search engine discoverability.
- **Security First**: HTTP-only JWT cookie authentication and strict HTML sanitization for content integrity.

---

## 🏗 System Architecture

The ecosystem consists of three specialized services:

### 1. ⚙️ News API (Golang)
The high-concurrency engine powering the data.
- **Tech**: Go (1.25+), Chi Router, PostgreSQL, Cloudflare R2 (S3-compatible).
- **Hardened Features**: Atomic transactions for news+media uploads, `bluemonday` sanitization, and automated database migrations.
- **Storage**: S3-compatible image handling with pre-signed URL capabilities.

### 2. 📱 Reader Frontend (Next.js)
Optimized for Core Web Vitals and user engagement.
- **Tech**: Next.js (App Router), Tailwind CSS, TanStack Query v5.
- **Performance**: Static Site Generation (SSG) with ISR for news articles to handle thousands of concurrent readers.
- **UX**: Infinite scroll, smart category filtering, and mobile-first responsive design.

### 3. 🔐 Admin CMS (Next.js)
The command center for editors.
- **Tech**: Next.js, Shadcn UI, TipTap Editor.
- **Features**: Full CRUD for news/categories, image management, user administration.
- **Path-Based Routing**: Configured to run under `/admin` subpath for unified domain management.

---

## 🌐 Production Architecture

The project is deployed on a **Linux VPS** using a modern infrastructure stack:

- **Reverse Proxy**: **Caddy Server** with automated SSL (Let's Encrypt).
- **Routing**: Optimized path-based routing:
  - `/` -> Reader Frontend
  - `/admin/*` -> Management CMS
  - `/api/*` -> Backend Engine
- **CI/CD**: Fully automated deployment via **GitHub Actions** on push to `main`.
- **Database**: Port-secured PostgreSQL living within the Docker internal network.

---

## 🚀 Quick Start (Local Development)

### Docker Compose (Recommended)
```bash
# 1. Clone the repo
git clone https://github.com/yourusername/news_portal_ecosystem.git

# 2. Configure .env
cp .env.example .env

# 3. Launch
docker compose up --build
```

### Access Points
- **Frontend**: `http://localhost:3000`
- **CMS**: `http://localhost:3000/admin`
- **API**: `http://localhost:3000/api/v1`

---

## 🛠 Features in Depth

| Feature | Description |
| :--- | :--- |
| **Bilingual Support** | Store news in both Bengali and English for global SEO reach. |
| **Automated Slugs** | English titles automatically convert to clean SEO slugs even for Bengali articles. |
| **Media Handling** | High-speed image uploads to Cloudflare R2 with automatic cleanup logic. |
| **Rich Text** | Advanced content editing with TipTap (Bold, Colors, Alignment, Images). |
| **Analytics** | Dashboard providing real-time stats on news volume and category health. |

---

## 📝 License
MIT License - Developed with focus on Scalability & Technical Excellence 🚀
