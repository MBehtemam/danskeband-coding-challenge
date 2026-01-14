# API Contracts: Detail Panel with Explicit Save

**Feature**: 002-detail-panel-save | **Date**: 2026-01-14

## No New API Endpoints Required

This feature uses the **existing** API endpoints from the 001-incident-dashboard feature. No new endpoints are needed.

### Existing Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/incidents` | Fetch all incidents (for table display) |
| `GET` | `/api/incidents/:id` | Fetch single incident (for detail panel) |
| `PATCH` | `/api/incidents/:id` | Update incident (for explicit save) |
| `GET` | `/api/users` | Fetch users (for assignee dropdown) |

### Update Incident Contract (PATCH /api/incidents/:id)

This is the primary endpoint used by the explicit save feature.

**Request**:
```http
PATCH /api/incidents/{id}
Content-Type: application/json

{
  "status": "In Progress",      // Optional: new status
  "assigneeId": "user-123"      // Optional: new assignee (or null)
}
```

**Response (Success 200)**:
```json
{
  "id": "incident-123",
  "title": "Database connection issues",
  "description": "Production database experiencing intermittent connection timeouts...",
  "status": "In Progress",
  "severity": "High",
  "assigneeId": "user-123",
  "createdAt": "2026-01-14T10:00:00Z",
  "updatedAt": "2026-01-14T14:30:00Z",
  "statusHistory": [
    {
      "status": "Open",
      "changedAt": "2026-01-14T10:00:00Z",
      "changedBy": "current-user"
    },
    {
      "status": "In Progress",
      "changedAt": "2026-01-14T14:30:00Z",
      "changedBy": "current-user"
    }
  ]
}
```

**Response (Error 404)**:
```json
{
  "error": "Incident not found"
}
```

**Response (Error 400)**:
```json
{
  "error": "Invalid status value"
}
```

### Key Behaviors

1. **Partial Updates**: Only fields included in the request body are updated
2. **Status History**: Status changes are automatically tracked in `statusHistory` array
3. **Timestamp Update**: `updatedAt` is automatically updated on any change
4. **Atomic Operation**: Both status and assigneeId can be updated in a single request

### OpenAPI Reference

For the full OpenAPI specification, see:
- [`/specs/001-incident-dashboard/contracts/openapi.yaml`](../../001-incident-dashboard/contracts/openapi.yaml)

No modifications to the OpenAPI spec are required for this feature.
