# ⚙️ News Portal Backend API

High-performance Go backend for the News Portal Ecosystem.

## 🚀 Features
- **Go Chi Router**: Lightweight and fast.
- **PostgreSQL**: Robust relational data storage.
- **Auth**: JWT-based authentication with 72-hour sessions.
- **R2 Storage**: S3-compatible image hosting via Cloudflare R2.
- **Auto-Provisioning**: Automatically handles migrations, initial admin, and categories.

---

## 🧪 API Testing (Postman)

If you don't have the pre-built Postman JSON, follow these steps to test manually:

### 1. Authentication
- **POST** `/api/v1/auth/login`
- **Body (JSON)**: `{"email": "...", "password": "..."}`
- **Action**: Copy the `token` and use it as a **Bearer Token** for all protected routes.

### 2. Creating News (Multipart)
- **POST** `/api/v1/news`
- **Method**: `form-data`
- **Fields**:
  - `title`, `title_en`, `category_id`, `excerpt`, `content`, `is_featured` (Text)
  - `thumbnail` (File)
- **Note**: This endpoint handles both the image upload to R2 and the database entry atomically.

### 3. Categories & Users
- Use `application/json` for all Category and User management endpoints.

---

## 🛠 Commands
- `make run`: Run the API locally.
- `make build`: Compile the Go binary.
- `make up`: Start the PostgreSQL container.
- `make create-admin`: Manually create an admin user (though it's automated on first run).

---
*For full technical details, see the root `documentation.md`.*
