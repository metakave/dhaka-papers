# 🧪 API Testing Guide (Postman & Manual)

This guide explains how to manually test the News Portal API endpoints using Postman or any HTTP client.

---

## 📍 Environment Setup

- **Base URL**: `http://localhost:8080/api/v1` (Local) or `https://yourdomain.com/api/v1` (Production)
- **Content-Type**: Generally `application/json`, except for News Creation/Updates which use `multipart/form-data`.

---

## 🔐 Authentication Flow

Most administrative actions require a **Bearer Token**.

### 1. Login
- **Endpoint**: `POST /auth/login`
- **Body (JSON)**:
```json
{
    "email": "admin@news.com",
    "password": "password123"
}
```
- **Response**: Copy the `token` value from the response.

### 2. Using the Token
In Postman:
1. Go to the **Authorization** tab of any request.
2. Select **Type**: `Bearer Token`.
3. Paste the token into the **Token** field.

---

## 📰 News Management (Complex Requests)

News creation and updates are distinct because they handle **Image Uploads**.

### Create News
- **Endpoint**: `POST /news`
- **Auth**: Required (Bearer Token)
- **Body Type**: `form-data` (Multipart)
- **Fields**:
    - `title`: (Text) Bengali News Title
    - `title_en`: (Text) English Title (Used to generate the URL slug)
    - `category_id`: (Text) The UUID of the category
    - `excerpt`: (Text) Short summary
    - `content`: (Text) Full HTML content (from your editor)
    - `is_featured`: (Text) `true` or `false`
    - `thumbnail`: (File) **Change Key Type to 'File'** and select an image from your PC.

### List News (Public)
- **Endpoint**: `GET /news`
- **Query Params**:
    - `page`: (e.g. 1)
    - `limit`: (e.g. 10)
    - `category`: (e.g. sports)
    - `search`: (Text query)

---

## 📁 Category Management

### Create Category
- **Endpoint**: `POST /categories`
- **Auth**: Required
- **Body (JSON)**:
```json
{
    "name": "Technology",
    "name_bn": "প্রযুক্তি",
    "description": "Latest tech news"
}
```

---

## 👥 User Management

### Register New Editor
- **Endpoint**: `POST /users`
- **Auth**: Required (Admin only)
- **Body (JSON)**:
```json
{
    "name": "John Doe",
    "email": "john@news.com",
    "password": "securepassword"
}
```

---

## 💡 Pro Tips for Postman

1. **Variables**: Create a Postman Environment and set a variable `{{baseUrl}}`. This makes switching from Local to Production easy.
2. **Auto-Token**: You can use a "Tests" script in your Login request to automatically save the token:
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.token);
   ```
3. **JSON vs Form-Data**: Always remember that if you are uploading an image, you **must** use `form-data`. If you are just sending text/data (like Category creation), use `raw` -> `JSON`.

---
*Reference for backend developers and QA engineers.*
