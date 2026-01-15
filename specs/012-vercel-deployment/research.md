# Research: Vercel Deployment for Vite + React + TypeScript SPA

**Date**: 2026-01-15
**Context**: Research for implementing `npm run deploy` command for Danskebank incident dashboard

## Decisions & Rationale

### Decision 1: Minimal vercel.json Configuration

**Decision**: Use minimal vercel.json focused on SPA routing, letting Vercel auto-detect framework settings

**Configuration**:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Rationale**:
- Vercel automatically detects Vite projects and applies correct defaults (build command, output directory)
- Only critical configuration needed is SPA routing fix for React Router
- Explicit `rewrites` prevents 404 errors when users directly access routes like `/incidents/:id`
- Simpler configuration is easier to maintain and less prone to configuration drift
- If auto-detection fails, we can add explicit `buildCommand` and `outputDirectory` later

**Alternatives considered**:
- Explicit configuration with all build settings - rejected because Vercel's auto-detection is reliable and reduces maintenance burden
- Legacy `routes` syntax - rejected because `rewrites` is the current recommended approach

### Decision 2: Layered npm Scripts Architecture

**Decision**: Create composable deployment scripts with clear separation of concerns

**Script structure**:
```json
{
  "predeploy": "npm run test && npm run lint && npm run build",
  "deploy:preview": "npm run predeploy && vercel deploy",
  "deploy:prod": "npm run predeploy && vercel deploy --prod",
  "deploy": "npm run deploy:prod"
}
```

**Rationale**:
- `predeploy` script enforces quality gates (tests, linting, build verification) before any deployment
- Separate preview and production scripts provide flexibility for testing workflow
- Default `deploy` command maps to production (safest default for stakeholder sharing)
- Composable scripts make it easy to understand and modify workflow
- Follows npm convention for pre-hooks (`predeploy` runs automatically before `deploy`)

**Alternatives considered**:
- Single monolithic script - rejected because harder to test individual steps and inflexible
- Manual retry logic in scripts - rejected because Vercel CLI has built-in retry for network failures and shell script retry logic is hard to maintain
- No quality gates - rejected because violates constitution requirement for test-first development

### Decision 3: Production-First Deployment Strategy

**Decision**: Default `npm run deploy` deploys to production environment with `--prod` flag

**Rationale**:
- Requirement: "Deploy to production (single stable URL, overwrites previous deployment)"
- Stakeholders need consistent URL for sharing (not unique preview URLs)
- Preview deployments available via explicit `deploy:preview` for testing if needed
- Production deployment URL pattern: `https://project-name.vercel.app`
- Aligns with use case: "share URL with Danskebank" implies stable production URL

**Alternatives considered**:
- Preview-first strategy - rejected because requirement explicitly states production deployment with stable URL
- Manual production promotion - rejected because adds unnecessary step for simple deployment workflow

### Decision 4: No Custom Retry Logic

**Decision**: Rely on Vercel CLI's built-in retry mechanisms and CI/CD tooling for failure handling

**Rationale**:
- Vercel CLI already implements network retry logic with exponential backoff
- Shell script retry logic in package.json is difficult to maintain and debug
- Build failures (TypeScript errors, test failures) should fail fast, not retry automatically
- CI/CD systems (GitHub Actions, etc.) provide better retry mechanisms at job level
- Automatic retries mask underlying issues and make debugging harder

**Alternatives considered**:
- Custom npm script with retry loop - rejected because Vercel CLI already handles network retries
- Retry wrapper script - rejected because adds complexity without meaningful benefit for deployment workflow
- No error handling - accepted because CLI provides sufficient error reporting and pre-deployment quality gates prevent most errors

### Decision 5: SPA Routing with Rewrites

**Decision**: Use `rewrites` configuration to serve index.html for all routes

**Implementation**:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Rationale**:
- React Router handles routing client-side, but Vercel needs to serve index.html for all routes
- Without rewrites, direct navigation to `/incidents/123` would return 404
- The `/(.*)` pattern rewrites all routes to index.html while preserving static asset serving
- Current routes requiring this fix: `/`, `/incidents/:incidentId`, `/developer`
- `rewrites` is the modern Vercel-recommended approach (vs legacy `routes` syntax)

**Alternatives considered**:
- Legacy `routes` with regex - rejected because `rewrites` is clearer and officially recommended
- Per-route configuration - rejected because catch-all pattern is simpler and handles future routes automatically
- No configuration (rely on Vercel auto-detection) - rejected because SPA routing requires explicit configuration

### Decision 6: First-Time Project Creation with --yes Flag

**Decision**: Document manual first-time setup, use `--yes` flag for subsequent deployments

**Workflow**:
```bash
# First time: Interactive authentication and project creation
vercel login
vercel deploy --prod

# Subsequent deployments: Automated via npm script
npm run deploy
```

**Rationale**:
- First deployment requires authentication and project setup decisions (project name, scope)
- Interactive workflow for first deployment provides better developer experience and clarity
- `--yes` flag useful for CI/CD but not necessary for local developer deployments
- Project linking is automatic after first deployment (creates `.vercel/project.json`)
- Documentation in quickstart.md provides clear first-time setup instructions

**Alternatives considered**:
- Fully automated first deployment with --yes - rejected because interactive setup provides better DX and error recovery
- Separate setup script - rejected because Vercel CLI handles setup elegantly during first deployment
- Require manual project creation in Vercel dashboard - rejected because CLI can create projects automatically

### Decision 7: No Environment Variables Configuration

**Decision**: Do not configure environment variables or secrets management

**Rationale**:
- Requirement: "None - application has no environment variables or secrets"
- Application uses localStorage-based Mock API with no backend services
- All configuration is build-time (embedded in JavaScript bundle)
- Simplifies deployment workflow and reduces configuration overhead
- Future consideration: If real API is added, use Vercel environment variables via dashboard or CLI

**Alternatives considered**:
- Proactive environment variable setup - rejected because application doesn't need them currently
- Build-time environment variables via Vite - rejected because no variables needed yet
- Document environment variable workflow - accepted and included in research for future reference

## Best Practices Summary

### Package.json Scripts Best Practices
1. Use `predeploy` hook for quality gates (tests, linting, build)
2. Provide separate `deploy:preview` and `deploy:prod` scripts for flexibility
3. Make `deploy` alias for production deployment (clearest intent)
4. Keep scripts simple and composable (avoid complex shell logic)

### vercel.json Best Practices
1. Prefer minimal configuration (let Vercel auto-detect framework)
2. Always configure SPA routing with `rewrites` for React Router compatibility
3. Use `framework: null` only if auto-detection fails
4. Document any explicit configuration in comments or README

### Authentication Best Practices
1. Use `vercel login` for local development (interactive, one-time setup)
2. Use `--token` flag for CI/CD pipelines (non-interactive)
3. Note: Email-based login deprecated as of February 1, 2026
4. Tokens managed at: https://vercel.com/account/tokens

### Deployment Workflow Best Practices
1. Always run tests and linting before deployment (enforced via `predeploy`)
2. Test build locally before deploying (`npm run build`)
3. Use preview deployments for testing major changes (`deploy:preview`)
4. Deploy to production for stakeholder sharing (`deploy` or `deploy:prod`)
5. Verify deployment success by loading returned URL in browser

### Error Handling Best Practices
1. Let deployments fail fast (don't mask errors with automatic retries)
2. Pre-deployment quality gates (tests, lint) prevent most deployment errors
3. Vercel CLI handles network retries automatically
4. Use clear error messages in documentation for common issues
5. Document manual recovery steps (re-authentication, project linking)

## Technical Implementation Notes

### vercel.json Location
- Must be in repository root
- JSON format (no comments allowed)
- Version controlled (committed to git)

### .vercel Directory
- Created automatically by `vercel link` or first deployment
- Contains `project.json` with project linking information
- Should be gitignored for personal projects
- May be committed for team projects (optional, per team preference)

### Vercel CLI Installation
- Recommended: Global installation (`npm install -g vercel`)
- Alternative: Use via npx (`npx vercel deploy --prod`)
- Version: Latest stable (auto-updates available)

### Build Process
1. Vercel runs `npm install` (or detected package manager)
2. Runs build command (auto-detected from package.json or specified in vercel.json)
3. For this project: `tsc -b && vite build` (TypeScript compilation + Vite build)
4. Output collected from `dist/` directory
5. Assets uploaded to Vercel CDN
6. Deployment URL returned

### Deployment URL Structure
- Production: `https://project-name.vercel.app`
- Preview: `https://project-name-abc123.vercel.app` (unique per deployment)
- Custom domains: Can be configured in Vercel dashboard

## Questions Resolved

### Q: Should retry logic be implemented in npm scripts?
**A**: No. Vercel CLI already implements network retry logic. Build failures should fail fast for debugging. Use CI/CD job-level retries if needed.

### Q: What if Vercel's auto-detection fails for Vite?
**A**: Add explicit configuration to vercel.json:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{"source": "/(.*)", "destination": "/index.html"}]
}
```

### Q: How are routing errors (404s) prevented?
**A**: The `rewrites` configuration ensures all routes serve index.html, allowing React Router to handle client-side routing.

### Q: What happens on first deployment?
**A**: Vercel CLI prompts for project name, scope, and settings. Subsequent deployments use saved configuration from `.vercel/project.json`.

### Q: How to handle authentication in CI/CD?
**A**: Use `--token` flag with authentication token from Vercel dashboard: `vercel deploy --prod --token=$VERCEL_TOKEN`

### Q: Are environment variables needed?
**A**: No, the application has no environment variables or secrets (localStorage-based Mock API, no backend).

## References

- Vercel vercel.json Documentation: https://vercel.com/docs/project-configuration
- Vite on Vercel Guide: https://vercel.com/docs/frameworks/frontend/vite
- React Router on Vercel: https://vercel.com/docs/frameworks/frontend/react-router
- Vercel CLI Documentation: https://vercel.com/docs/cli
- Vercel Deploy Command: https://vercel.com/docs/cli/deploy
- Project Linking: https://vercel.com/docs/cli/project-linking
