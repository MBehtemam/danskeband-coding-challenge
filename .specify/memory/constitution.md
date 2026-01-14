<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 → 1.0.0 (MAJOR - initial ratification)

  Modified principles: N/A (initial creation)

  Added sections:
  - Core Principles (5 principles defined)
  - Technology Standards
  - Development Workflow
  - Governance

  Removed sections: N/A (initial creation)

  Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (already compatible)
  - .specify/templates/spec-template.md ✅ (already compatible)
  - .specify/templates/tasks-template.md ✅ (already compatible)

  Follow-up TODOs: None
-->

# Team Incident Dashboard Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

All features MUST follow Test-Driven Development (TDD):

- Tests MUST be written BEFORE implementation code
- Red-Green-Refactor cycle MUST be strictly followed:
  1. Write a failing test (Red)
  2. Write minimal code to make it pass (Green)
  3. Refactor while keeping tests green (Refactor)
- No pull request may merge without corresponding test coverage
- Integration tests MUST cover all critical user flows
- Component tests MUST verify UI behavior and user interactions

**Rationale**: TDD ensures code correctness from the start, reduces debugging time, and serves as living documentation. For an incident management system, reliability is paramount.

### II. TypeScript Strict Mode

All code MUST adhere to TypeScript strict mode standards:

- `strict: true` MUST be enabled in tsconfig.json
- `any` type is FORBIDDEN except in exceptional circumstances (must be documented)
- All function parameters and return types MUST be explicitly typed
- Null/undefined MUST be handled explicitly (strict null checks)
- Type assertions (`as`) SHOULD be avoided; prefer type guards
- Shared types MUST be defined in dedicated type files (e.g., `src/types/`)

**Rationale**: Strong typing catches errors at compile time, improves IDE support, and makes refactoring safer. For a team tool, maintainability is critical.

### III. Code Quality Standards

All code MUST meet quality gates before merging:

- ESLint errors MUST be resolved before commit (zero tolerance)
- Prettier formatting MUST be applied to all files
- No commented-out code in production branches
- Functions MUST be focused and under 50 lines where practical
- Components MUST follow single responsibility principle
- Magic numbers and strings MUST be extracted to named constants
- Dead code MUST be removed, not commented

**Rationale**: Consistent code quality reduces cognitive load for team members and prevents technical debt accumulation.

### IV. User Experience Excellence

The incident dashboard MUST prioritize user experience:

- Loading states MUST provide feedback within 100ms of user action
- Error states MUST be clear, actionable, and non-technical
- Forms MUST validate inline and prevent invalid submissions
- UI MUST be responsive across desktop and tablet viewports (≥768px)
- Critical actions (delete, status change) MUST require confirmation
- Data MUST persist correctly (localStorage) and survive page refreshes
- State changes MUST be immediately visible without manual refresh

**Rationale**: An incident management tool is used during high-stress situations. The UI must be intuitive and reliable to reduce friction.

### V. Accessibility (WCAG 2.1 AA)

The application MUST meet WCAG 2.1 Level AA standards:

- All interactive elements MUST be keyboard navigable
- Focus indicators MUST be visible and meet contrast requirements
- Color MUST NOT be the only means of conveying information
- Text contrast MUST meet minimum ratios (4.5:1 normal, 3:1 large)
- Form inputs MUST have associated labels
- Error messages MUST be programmatically associated with fields
- Screen reader announcements MUST accompany dynamic content changes
- Semantic HTML elements MUST be used appropriately (buttons, headings, lists)

**Rationale**: Accessibility ensures the tool is usable by all team members, including those using assistive technologies. It is also a legal requirement in many jurisdictions.

## Technology Standards

### Stack Requirements

- **Runtime**: Node.js 18+
- **Framework**: React 18 with functional components and hooks
- **Language**: TypeScript 5.6+ with strict mode
- **Build Tool**: Vite 6+
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint 9+ with TypeScript plugin
- **Formatting**: Prettier 3+

### Dependency Policy

- New dependencies MUST be justified in PR description
- Prefer built-in browser/React APIs over external libraries when reasonable
- Security vulnerabilities in dependencies MUST be addressed within 48 hours
- Bundle size impact MUST be considered for new dependencies

## Development Workflow

### Branch Strategy

- Feature branches MUST be named descriptively (e.g., `feat/incident-list`, `fix/status-update`)
- All changes MUST go through pull request review
- Direct commits to `main` are FORBIDDEN

### Commit Standards

- Commits MUST follow conventional commit format (feat:, fix:, docs:, test:, refactor:)
- Commits SHOULD be atomic (one logical change per commit)
- Commit messages MUST be descriptive and reference issues when applicable

### Code Review Requirements

- All PRs MUST pass automated checks (tests, lint, type check) before review
- Reviewers MUST verify constitution compliance
- At least one approval required before merge

## Governance

### Amendment Process

1. Propose amendment via pull request to this file
2. Document rationale for change
3. If principle is added or removed, update version MAJOR
4. If principle is materially modified, update version MINOR
5. If clarification only, update version PATCH
6. Update LAST_AMENDED_DATE upon merge

### Compliance

- All PRs and code reviews MUST verify adherence to these principles
- Constitution violations MUST be resolved before merge
- Complexity that violates principles MUST be explicitly justified in PR description

### Living Document

This constitution supersedes all other development practices for this project. When in doubt, refer to these principles.

**Version**: 1.0.0 | **Ratified**: 2025-01-14 | **Last Amended**: 2025-01-14
