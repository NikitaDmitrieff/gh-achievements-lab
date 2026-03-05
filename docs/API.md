# API Documentation

All API routes are located under `/api` and use the Next.js 14 App Router route handlers.

## Authentication

All endpoints (except auth routes) require authentication via NextAuth.js session cookies. Unauthenticated requests return `401 Unauthorized`.

## Endpoints

### Tasks

#### `GET /api/tasks`

List tasks for the authenticated user with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | — | Filter by status: `inbox`, `today`, `this_week`, `backlog`, `done`, `archived` |
| `priority` | string | — | Filter by priority: `p0`, `p1`, `p2`, `p3` |
| `tag` | string | — | Filter by tag name |
| `search` | string | — | Search in title and description |
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max 100) |

**Response:** `200 OK`

```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Ship landing page",
      "description": "Finalize the marketing site",
      "status": "today",
      "priority": "p1",
      "dueDate": "2026-03-10T00:00:00.000Z",
      "completedAt": null,
      "tags": [
        { "id": "uuid", "name": "marketing", "color": "#3b82f6" }
      ],
      "createdAt": "2026-03-01T12:00:00.000Z",
      "updatedAt": "2026-03-05T08:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

---

#### `POST /api/tasks`

Create a new task.

**Request Body:**

```json
{
  "title": "Ship landing page",
  "description": "Finalize the marketing site",
  "status": "inbox",
  "priority": "p1",
  "dueDate": "2026-03-10T00:00:00.000Z",
  "tagIds": ["uuid-1", "uuid-2"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Task title (1-500 chars) |
| `description` | string | No | Task description |
| `status` | string | No | Default: `inbox` |
| `priority` | string | No | Default: `p3` |
| `dueDate` | string (ISO 8601) | No | Due date |
| `tagIds` | string[] | No | Array of tag UUIDs |

**Response:** `201 Created`

```json
{
  "task": { ... }
}
```

**Errors:**
- `400 Bad Request` - Validation error (missing title, invalid status/priority)
- `401 Unauthorized` - Not authenticated

---

#### `PUT /api/tasks/[id]`

Update an existing task.

**Request Body:** Same fields as `POST /api/tasks`, all optional.

**Response:** `200 OK`

```json
{
  "task": { ... }
}
```

**Errors:**
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Task not found or not owned by user

---

#### `DELETE /api/tasks/[id]`

Delete a task.

**Response:** `204 No Content`

**Errors:**
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Task not found or not owned by user

---

### Weekly Reviews

#### `GET /api/reviews`

List weekly reviews for the authenticated user.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `week` | string (ISO date) | Filter by week start date |

**Response:** `200 OK`

```json
{
  "reviews": [
    {
      "id": "uuid",
      "weekStartDate": "2026-03-02",
      "summary": "Completed 12 tasks, focused on launch prep",
      "reflections": "Good momentum on marketing tasks",
      "goals": "Finalize pricing page, set up analytics",
      "createdAt": "2026-03-08T10:00:00.000Z"
    }
  ]
}
```

---

### Authentication

#### `GET /api/auth/[...nextauth]`

NextAuth.js handles all auth routes:

| Route | Description |
|-------|-------------|
| `GET /api/auth/signin` | Sign-in page |
| `GET /api/auth/signout` | Sign-out page |
| `GET /api/auth/session` | Current session |
| `GET /api/auth/callback/github` | GitHub OAuth callback |

## Error Format

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Task not found",
    "code": "NOT_FOUND"
  }
}
```

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | `BAD_REQUEST` | Invalid input |
| 401 | `UNAUTHORIZED` | Not authenticated |
| 404 | `NOT_FOUND` | Resource not found |
| 500 | `INTERNAL_ERROR` | Server error |
