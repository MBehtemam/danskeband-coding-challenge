# Data Model: Team Incident Dashboard

**Feature Branch**: `001-incident-dashboard`
**Date**: 2026-01-14
**Source**: [spec.md](spec.md) Key Entities + existing `src/api/types.ts`

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         INCIDENT                            │
├─────────────────────────────────────────────────────────────┤
│ id: string (PK)                                             │
│ title: string                                               │
│ description: string                                         │
│ status: IncidentStatus                                      │
│ severity: IncidentSeverity                                  │
│ assigneeId: string | null (FK → User.id)                   │
│ createdAt: string (ISO 8601)                               │
│ updatedAt: string (ISO 8601)                               │
│ statusHistory: StatusHistoryEntry[]                        │
└─────────────────────────────────────────────────────────────┘
           │
           │ 1:N (embedded)
           ▼
┌─────────────────────────────────────────────────────────────┐
│                   STATUS_HISTORY_ENTRY                      │
├─────────────────────────────────────────────────────────────┤
│ status: IncidentStatus                                      │
│ changedAt: string (ISO 8601)                               │
│ changedBy: string (user identifier)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          USER                               │
├─────────────────────────────────────────────────────────────┤
│ id: string (PK)                                             │
│ name: string                                                │
│ email: string                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Entities

### Incident

The core entity representing a tracked issue requiring team attention.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier (generated: `inc-{timestamp}-{random}`) |
| `title` | `string` | Yes | Brief summary of the incident (max ~200 chars) |
| `description` | `string` | No | Detailed explanation of the incident |
| `status` | `IncidentStatus` | Yes | Current workflow state |
| `severity` | `IncidentSeverity` | Yes | Impact level |
| `assigneeId` | `string \| null` | No | Reference to assigned User |
| `createdAt` | `string` | Yes | ISO 8601 timestamp of creation |
| `updatedAt` | `string` | Yes | ISO 8601 timestamp of last modification |
| `statusHistory` | `StatusHistoryEntry[]` | Yes | Chronological log of status changes |

**Existing Type** (from `src/api/types.ts`):
```typescript
interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}
```

---

### User

A team member who can be assigned to incidents.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier (e.g., `user-1`) |
| `name` | `string` | Yes | Display name |
| `email` | `string` | Yes | Contact email |

**Existing Type** (from `src/api/types.ts`):
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

**Note**: Users are read-only in this application (pre-seeded data).

---

### StatusHistoryEntry

An immutable record of a status transition.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `IncidentStatus` | Yes | The status after the change |
| `changedAt` | `string` | Yes | ISO 8601 timestamp |
| `changedBy` | `string` | Yes | User identifier who made the change |

**Existing Type** (from `src/api/types.ts`):
```typescript
interface StatusHistoryEntry {
  status: IncidentStatus;
  changedAt: string;
  changedBy: string;
}
```

---

## Enumerations

### IncidentStatus

```typescript
type IncidentStatus = "Open" | "In Progress" | "Resolved";
```

| Value | Description | MUI Chip Color |
|-------|-------------|----------------|
| `Open` | New, unaddressed incident | `info` (Blue) |
| `In Progress` | Being actively worked on | `warning` (Amber) |
| `Resolved` | Completed, no further action needed | `success` (Green) |

**Valid Transitions**:
```
Open ──────────► In Progress ──────────► Resolved
  ▲                    │                    │
  │                    │                    │
  └────────────────────┴────────────────────┘
         (reverse transitions allowed)
```

---

### IncidentSeverity

```typescript
type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";
```

| Value | Description | MUI Chip Color | Sort Priority |
|-------|-------------|----------------|---------------|
| `Critical` | Severe impact, immediate action required | `error` (Red) | 1 (highest) |
| `High` | Significant impact, needs attention | `warning` (Orange) | 2 |
| `Medium` | Moderate impact, standard priority | `info` (Blue) | 3 |
| `Low` | Minor issue, low impact | `success` (Green) | 4 (lowest) |

---

## Input Types (DTOs)

### CreateIncidentInput

Used when creating a new incident via POST `/api/incidents`.

```typescript
interface CreateIncidentInput {
  title: string;              // Required, non-empty
  description: string;        // Optional (defaults to "")
  severity: IncidentSeverity; // Required
  assigneeId: string | null;  // Optional
}
```

**Validation Rules**:
| Field | Rule | Error Message |
|-------|------|---------------|
| `title` | Required, non-empty after trim | "Title is required" |
| `title` | Max 200 characters | "Title must be 200 characters or less" |
| `severity` | Required, valid enum | "Severity is required" |
| `assigneeId` | If provided, valid User.id | "Invalid assignee" |

**Server Behavior**:
- Generates unique `id` (`inc-{timestamp}-{random}`)
- Sets initial `status` to `"Open"`
- Sets `createdAt` and `updatedAt` to current ISO timestamp
- Creates initial `statusHistory` entry

---

### UpdateIncidentInput

Used when updating an incident via PATCH `/api/incidents/:id`.

```typescript
interface UpdateIncidentInput {
  title?: string;
  description?: string;
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  assigneeId?: string | null;
}
```

**Validation Rules**:
- All fields optional (partial update)
- If `title` provided, must be non-empty after trimming
- If `status` provided, must be valid enum value
- If `severity` provided, must be valid enum value
- If `assigneeId` provided, must be valid User.id or null

**Server Behavior**:
- Updates `updatedAt` to current timestamp
- If `status` changed, appends new entry to `statusHistory`

---

## Data Constraints

| Constraint | Entity | Rule |
|------------|--------|------|
| Title Required | Incident | `title.trim().length > 0` |
| Title Max Length | Incident | `title.length <= 200` |
| Severity Required | Incident | Must be valid enum |
| Valid Status | Incident | Must be valid enum |
| Valid Assignee | Incident | `assigneeId` references existing User or is null |
| History Immutable | StatusHistoryEntry | Entries append-only, never modified |
| Timestamp Format | All | ISO 8601 (`2026-01-14T10:30:00Z`) |

---

## UI Display Mappings

### Status Chip Styles (MUI)

Using MUI Chip component with color props:

| Status | MUI Color | Visual |
|--------|-----------|--------|
| Open | `info` | Blue chip |
| In Progress | `warning` | Amber chip |
| Resolved | `success` | Green chip |

```tsx
<Chip label={status} color={statusColorMap[status]} size="small" />
```

### Severity Chip Styles (MUI)

Using MUI Chip component with color props:

| Severity | MUI Color | Visual |
|----------|-----------|--------|
| Critical | `error` | Red chip |
| High | `warning` | Orange chip |
| Medium | `info` | Blue chip |
| Low | `success` | Green chip |

```tsx
<Chip label={severity} color={severityColorMap[severity]} size="small" />
```

### Incident List Columns (Material React Table)

| Column | Source | Format | MRT Config |
|--------|--------|--------|------------|
| Title | `incident.title` | Truncate with ellipsis | `enableGlobalFilter: true` |
| Status | `incident.status` | MUI Chip | `filterVariant: 'select'` |
| Severity | `incident.severity` | MUI Chip | `filterVariant: 'select'` |
| Assignee | `user.name` via `assigneeId` | Text or "Unassigned" | `filterVariant: 'select'` |
| Created | `incident.createdAt` | Relative time (dayjs) | `sortingFn: 'datetime'` |

### Detail Panel Fields (MUI Form Components)

| Field | Component | Editable |
|-------|-----------|----------|
| Title | `TextField` | Yes |
| Description | `TextField multiline` | Yes |
| Status | `Select` | Yes |
| Severity | `Select` | Yes |
| Assignee | `Select` | Yes |
| Status History | `Timeline` or `List` | No (read-only) |
| Created At | `Typography` | No (read-only) |
| Updated At | `Typography` | No (read-only) |

### Status History Display

| Field | Format |
|-------|--------|
| Status | MUI Chip with matching color |
| Changed At | Localized datetime (dayjs) |
| Changed By | User name (lookup) or "System" |

### Date Formatting (dayjs)

```typescript
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Relative time for table: "2 days ago", "5 minutes ago"
dayjs(incident.createdAt).fromNow();

// Localized datetime for detail panel
dayjs(entry.changedAt).format('MMM D, YYYY h:mm A');
```

---

## Sample Data

**Sample Incident** (from `src/api/seedData.ts`):
```json
{
  "id": "inc-1",
  "title": "Database connection timeout",
  "description": "The main database is experiencing intermittent connection timeouts.",
  "status": "Open",
  "severity": "High",
  "assigneeId": "user-1",
  "createdAt": "2026-01-08T10:30:00Z",
  "updatedAt": "2026-01-08T10:30:00Z",
  "statusHistory": [
    {
      "status": "Open",
      "changedAt": "2026-01-08T10:30:00Z",
      "changedBy": "user-2"
    }
  ]
}
```

**Seed Users** (4 total):
- Alice Johnson (user-1)
- Bob Smith (user-2)
- Carol Williams (user-3)
- David Brown (user-4)

**Seed Incidents** (4 total):
- Database connection timeout (High, Open)
- Payment gateway error (Critical, In Progress)
- Login page CSS broken on mobile (Medium, Resolved)
- Email notifications delayed (Low, Open)

---

## Notes

- **Existing Implementation**: All entity types exist in `src/api/types.ts`
- **Storage**: localStorage via `src/api/storage.ts`
- **API**: Mock API in `src/api/mockApi.ts` handles CRUD
- **No Schema Changes Needed**: Data model is complete as-is
