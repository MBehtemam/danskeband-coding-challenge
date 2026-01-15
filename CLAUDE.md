# danskeband-coding-challenge Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-14

## Active Technologies
- LocalStorage (via existing Mock API layer) (001-incident-dashboard)
- TypeScript 5.6+ (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7, Material React Table v3.2.1, TanStack Query v5.90.17, React Router v6.30.3 (002-detail-panel-save)
- TypeScript 5.6+ (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7, TanStack Query v5.90.17, @emotion/react for styling (003-detail-panel-enhancements)
- TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7 (@mui/material, @mui/icons-material), TanStack Query v5.90.17, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1) (004-detail-panel-ux)
- TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7 (@mui/material, @mui/icons-material), TanStack Query v5.90.17, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1), React Router v6.30.3 (005-danske-brand-theme)
- N/A (theming is purely visual - no data persistence changes) (005-danske-brand-theme)
- TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7 (@mui/material), Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1) (006-typography-theme-fix)
- TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7, Material React Table v3.2.1, TanStack Query v5.90.17, React Router v6.30.3, dayjs 1.11.19, @emotion/react 11.14.0 (007-developer-settings-table-filters)
- TypeScript 5.6.2 (strict mode enabled) + React 18.3.1, Material UI v7.3.7, Material React Table v3.2.1, TanStack Query v5.90.17, React Router v6.30.3, dayjs 1.11.19 (008-layout-filters-fix)
- LocalStorage via existing Mock API layer (008-layout-filters-fix)
- TypeScript 5.6.3 (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7 (@mui/material, @mui/icons-material), Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1), lodash-es (009-theme-switcher)
- Browser localStorage (with graceful fallback for unavailability), window.matchMedia for system preference detection (009-theme-switcher)
- TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7 (@mui/material, @mui/icons-material), Material React Table v3.2.1, TanStack Query v5.90.17, React Router v6.30.3, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1), dayjs 1.11.19, lodash-es 4.17.22 (011-saved-views)
- Browser localStorage (with graceful fallback for unavailability) via existing storage.ts module pattern (011-saved-views)
- TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1 + Material UI v7.3.7 (@mui/material, @mui/icons-material), TanStack Query v5.90.17, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1) (013-refactor-select-components)
- Browser localStorage via existing storage.ts module pattern (for incident data persistence) (013-refactor-select-components)
- Markdown (GitHub-flavored) + None (documentation only) (014-readme-features-table)
- Screenshots stored in `/screenshots/` directory at repository roo (014-readme-features-table)

- TypeScript 5.6+ (strict mode enabled in tsconfig.json) + React 18.3.1, React DOM 18.3.1 (001-incident-dashboard)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.6+ (strict mode enabled in tsconfig.json): Follow standard conventions

## Recent Changes
- 014-readme-features-table: Added Markdown (GitHub-flavored) + None (documentation only)
- 013-refactor-select-components: Added TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1 + Material UI v7.3.7 (@mui/material, @mui/icons-material), TanStack Query v5.90.17, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1)
- 011-saved-views: Added TypeScript 5.6.2 (strict mode enabled in tsconfig.json) + React 18.3.1, Material UI v7.3.7 (@mui/material, @mui/icons-material), Material React Table v3.2.1, TanStack Query v5.90.17, React Router v6.30.3, Emotion (@emotion/react@11.14.0, @emotion/styled@11.14.1), dayjs 1.11.19, lodash-es 4.17.22


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
