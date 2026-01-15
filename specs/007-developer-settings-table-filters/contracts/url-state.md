# URL State Contract

**Feature Branch**: `007-developer-settings-table-filters`
**Date**: 2026-01-14

This document defines the URL query parameter contract for the incident table state.

## URL Structure

```
/                                         # Dashboard with table
/incidents/:incidentId                    # Dashboard with incident detail drawer
/developer                                # Developer Settings page
```

## Query Parameters

### Pagination

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | `1` | Current page number (1-based) |
| `pageSize` | integer | `10` | Rows per page. Allowed: 10, 20, 50, 100 |

**Examples**:
```
?page=1&pageSize=10              # First page, 10 rows (default)
?page=3&pageSize=50              # Third page, 50 rows
```

**Validation**:
- Invalid `page` (negative, NaN, > totalPages): Clamp to nearest valid page
- Invalid `pageSize`: Fallback to 10

---

### Column Filters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by incident status |
| `severity` | string | Filter by incident severity |
| `assignee` | string | Filter by assignee name |
| `search` | string | Global search across all columns |

**Examples**:
```
?status=Open                           # Only Open incidents
?severity=Critical                     # Only Critical incidents
?status=Open&severity=High             # Open AND High severity
?search=database                       # Global search for "database"
```

**Allowed Values**:
- `status`: "Open", "In Progress", "Resolved"
- `severity`: "Low", "Medium", "High", "Critical"
- `assignee`: Any user name string

---

### Date Range Filter

| Parameter | Type | Description |
|-----------|------|-------------|
| `dateOp` | string | Date comparison operator |
| `dateStart` | string | Start date (ISO format YYYY-MM-DD) |
| `dateEnd` | string | End date for 'between' operator |

**Operators** (`dateOp`):
- `gt` - Greater than (after dateStart)
- `lt` - Less than (before dateStart)
- `between` - Between dateStart and dateEnd (inclusive)

**Examples**:
```
?dateOp=gt&dateStart=2026-01-01                          # After Jan 1, 2026
?dateOp=lt&dateStart=2026-01-14                          # Before Jan 14, 2026
?dateOp=between&dateStart=2026-01-01&dateEnd=2026-01-31  # January 2026
```

**Validation**:
- `dateOp` without `dateStart`: Filter ignored
- `dateOp=between` without `dateEnd`: Filter incomplete, show validation message
- `dateEnd` before `dateStart`: Invalid, show validation error

---

### Sorting

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sortBy` | string | - | Column to sort by |
| `sortDesc` | boolean | `false` | Sort descending if true |

**Sortable Columns**:
- `title`
- `status`
- `severity`
- `assigneeId`
- `createdAt`

**Examples**:
```
?sortBy=createdAt&sortDesc=true    # Newest first
?sortBy=severity                   # By severity, ascending
```

---

### Column Visibility

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hiddenColumns` | string | `""` | Comma-separated list of hidden column IDs |

**Column IDs**:
- `title` (cannot be hidden)
- `status`
- `severity`
- `assigneeId`
- `createdAt`

**Examples**:
```
?hiddenColumns=                           # All columns visible
?hiddenColumns=severity,assigneeId        # Hide severity and assignee
?hiddenColumns=createdAt                  # Hide created date
```

**Validation**:
- Unknown column IDs are ignored
- `title` column remains visible regardless

---

## Complete URL Examples

### Default State
```
/?page=1&pageSize=10
```

### Filtered and Sorted
```
/?page=1&pageSize=20&status=Open&severity=Critical&sortBy=createdAt&sortDesc=true
```

### Date Range Filter
```
/?page=1&pageSize=10&dateOp=between&dateStart=2026-01-01&dateEnd=2026-01-14
```

### Custom Columns
```
/?page=1&pageSize=10&hiddenColumns=assigneeId,createdAt
```

### Full State (Complex)
```
/?page=2&pageSize=50&status=Open&severity=High&dateOp=gt&dateStart=2026-01-01&sortBy=severity&sortDesc=true&hiddenColumns=assigneeId&search=timeout
```

### With Incident Detail
```
/incidents/inc-123?page=2&pageSize=50&status=Open
```

---

## State Synchronization Rules

1. **On Page Load**: Read all parameters from URL and initialize table state
2. **On State Change**: Update URL parameters using `replace: true` (no history spam)
3. **On Navigation**: Preserve query string when navigating between routes
4. **Defaults in URL**: Always include `page` and `pageSize` even when default values

---

## Encoding Notes

- Space in values: Use `%20` or `+`
- Special characters: URL-encode per RFC 3986
- Comma in `hiddenColumns`: No encoding needed (part of our contract)
