# API Reference

Base URL: `https://yourdomain.com` (or `http://localhost:3000` in development)

## Authentication

Write endpoints (POST/PUT/DELETE) require a valid admin session cookie (`session`).  
GET endpoints are public unless otherwise noted.

---

## Auth

### POST /api/auth/login

Authenticate the admin and create a session.

**Request body:**

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Responses:**

| Status | Body                                        | Description             |
| ------ | ------------------------------------------- | ----------------------- |
| `200`  | `{ "data": { "success": true } }`           | Login successful        |
| `400`  | `{ "error": "..." }`                        | Missing/invalid fields  |
| `401`  | `{ "error": "Invalid credentials..." }`     | Wrong email or password |
| `429`  | `{ "error": "Too many login attempts..." }` | Rate limited            |
| `500`  | `{ "error": "...", "errorId": "..." }`      | Server error            |

---

### POST /api/auth/logout

Destroy the current session.

**Response:** `{ "data": { "success": true } }`

---

## Projects

### GET /api/projects

List all projects.

**Response:** `{ "data": [ProjectData, ...] }`

---

### POST /api/projects _(protected)_

Create a new project.

**Required fields:** `title`, `description`, `slug`

---

### GET /api/projects/[id]

Fetch a project by MongoDB ObjectId or slug.

---

### PUT /api/projects/[id] _(protected)_

Update a project by MongoDB ObjectId.

---

### DELETE /api/projects/[id] _(protected)_

Delete a project by MongoDB ObjectId.

---

## Skills

### GET /api/skills

List all skills, sorted by category and order.

### POST /api/skills _(protected)_

Create a skill.

**Required fields:** `name`, `category`  
**Valid categories:** `Programming Languages`, `Frontend`, `Backend`, `Databases`, `Core CS`, `Tools`

### PUT /api/skills/[id] _(protected)_

Update a skill. Category is validated if provided.

### DELETE /api/skills/[id] _(protected)_

Delete a skill.

---

## Experience

### GET /api/experience

List all experience entries, sorted by `order`.

### POST /api/experience _(protected)_

**Required fields:** `role`, `company`, `startDate`

### PUT /api/experience/[id] _(protected)_

Update an experience entry.

### DELETE /api/experience/[id] _(protected)_

Delete an experience entry.

---

## Education

### GET /api/education

List all education records, sorted by `order`.

### POST /api/education _(protected)_

**Required fields:** `institution`, `degree`, `score`

### PUT /api/education/[id] _(protected)_

Update an education record.

### DELETE /api/education/[id] _(protected)_

Delete an education record.

---

## Hackathons

### GET /api/hackathon

List all hackathons, sorted by date (newest first).

### POST /api/hackathon _(protected)_

**Required fields:** `title`, `organization`  
Slug is auto-generated from title if not provided.

### GET /api/hackathon/slug/[slug]

Fetch a visible hackathon by slug.

### PUT /api/hackathon/[id] _(protected)_

Update a hackathon.

### DELETE /api/hackathon/[id] _(protected)_

Delete a hackathon.

---

## Settings

### GET /api/settings

Fetch portfolio settings (creates defaults if none exist).

> **Privacy note:** `social.phone` is masked for unauthenticated requests (shows last 4 digits only).

### PUT /api/settings _(protected)_

Update portfolio settings. Supports partial updates.

---

## Upload

### POST /api/upload _(protected)_

Upload a file to Cloudinary.

**Content-Type:** `multipart/form-data`  
**Field:** `file` — the file to upload  
**Max size:** 10 MB

**Response:** `{ "data": { "url": "https://res.cloudinary.com/..." } }`

---

## Error Response Format

All errors follow this shape:

```json
{
  "error": "Human-readable error message",
  "errorId": "uuid-for-server-log-lookup" // only on 5xx errors
}
```

## Success Response Format

All success responses follow this shape:

```json
{
  "data": { ... }
}
```
