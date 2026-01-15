# Quickstart: Team Incident Dashboard

**Feature Branch**: `001-incident-dashboard`
**Date**: 2026-01-14

---

## Prerequisites

- Node.js 18+
- npm (comes with Node.js)

---

## Setup

```bash
# Clone and enter the repository
git clone <repository-url>
cd danskeband-coding-challenge

# Switch to feature branch
git checkout 001-incident-dashboard

# Install dependencies (existing)
npm install

# Install new dependencies for this feature
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install material-react-table@^3
npm install @tanstack/react-query@^5
npm install @tanstack/react-form
npm install react-router-dom@^6
npm install dayjs
```

---

## Development

### Start Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot module replacement.

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (for TDD)
npm run test -- --watch
```

### Lint & Format

```bash
# Check linting
npm run lint

# Format code
npm run format

# Check format without changes
npm run format:check
```

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

---

## Project Structure

```
src/
├── api/                 # Mock API (existing)
│   ├── index.ts         # API exports
│   ├── mockApi.ts       # Fetch interceptor
│   ├── seedData.ts      # Default data
│   ├── storage.ts       # localStorage persistence
│   └── types.ts         # TypeScript types
├── components/          # React components (to build)
│   ├── common/          # Shared UI components
│   ├── incidents/       # Incident feature components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks (to build)
├── services/            # API client layer (to build)
├── App.tsx              # Root component
├── App.css              # Root styles
└── main.tsx             # Entry point
```

---

## API Reference

The mock API intercepts all `/api/*` requests. No backend required.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incidents` | List all incidents |
| POST | `/api/incidents` | Create incident |
| GET | `/api/incidents/:id` | Get single incident |
| PATCH | `/api/incidents/:id` | Update incident |
| DELETE | `/api/incidents/:id` | Delete incident |
| GET | `/api/users` | List team members |
| POST | `/api/reset` | Reset to seed data |

See [contracts/openapi.yaml](contracts/openapi.yaml) for full API specification.

### Usage Example (TanStack Query)

```typescript
// hooks/useIncidents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Incident, CreateIncidentInput, UpdateIncidentInput } from '../api/types';

// Fetch all incidents
export function useIncidents() {
  return useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => {
      const response = await fetch('/api/incidents');
      if (!response.ok) throw new Error('Failed to fetch incidents');
      return response.json();
    },
  });
}

// Create incident
export function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateIncidentInput) => {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to create incident');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}

// Update incident
export function useUpdateIncident(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateIncidentInput) => {
      const response = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to update incident');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });
}
```

### App Setup (main.tsx)

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import App from './App';
import { initMockApi } from './api';

// Initialize mock API
initMockApi();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
```

---

## TDD Workflow

Follow Red-Green-Refactor per the constitution:

```bash
# 1. Write failing test
# 2. Run tests (should fail)
npm test

# 3. Write minimal implementation
# 4. Run tests (should pass)
npm test

# 5. Refactor
# 6. Verify tests still pass
npm test
```

### Test File Naming

Tests are collocated with source files:

```
src/components/incidents/
├── IncidentList.tsx
└── IncidentList.test.tsx
```

### Example Test

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IncidentList } from './IncidentList';

describe('IncidentList', () => {
  it('renders loading state initially', () => {
    render(<IncidentList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

---

## Key Documents

| Document | Description |
|----------|-------------|
| [spec.md](spec.md) | Feature requirements |
| [plan.md](plan.md) | Implementation plan |
| [research.md](research.md) | Technical decisions |
| [data-model.md](data-model.md) | Entity definitions |
| [contracts/openapi.yaml](contracts/openapi.yaml) | API specification |

---

## Constitution Reminders

Before committing, verify:

- [ ] Tests written BEFORE implementation (TDD)
- [ ] TypeScript strict mode passes (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Prettier applied (`npm run format`)
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (semantic HTML, ARIA)

See [.specify/memory/constitution.md](../../.specify/memory/constitution.md) for full guidelines.
