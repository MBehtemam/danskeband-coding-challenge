# Vercel Deployment - Quick Start Guide

**Feature**: Single-command deployment workflow for the Danskebank Incident Dashboard
**Branch**: `012-vercel-deployment`
**Last Updated**: 2026-01-15

## Overview

This guide explains how to deploy the Danskebank Incident Dashboard to Vercel using the `npm run deploy` command. The deployment workflow automatically runs tests, linting, builds the application, and deploys to a production URL on Vercel.

## Prerequisites

### Required
- Node.js 18+ installed
- npm (comes with Node.js)
- Git repository initialized
- Vercel account (free tier works)
- Internet connection

### Optional
- Vercel CLI installed globally (will be used via npx if not installed)

## First-Time Setup

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

**Note**: If you don't install globally, the deployment script will use `npx vercel` automatically.

### Step 2: Authenticate with Vercel

```bash
vercel login
```

This will:
- Open your browser for authentication
- Ask you to log in via GitHub, GitLab, Bitbucket, or Email
- Store authentication credentials locally

**Important**: Email-based login was deprecated on February 1, 2026. Use GitHub, GitLab, or Bitbucket for authentication.

### Step 3: First Deployment (Interactive)

Run the deployment for the first time:

```bash
npm run deploy
```

You'll be prompted to:
1. **Set up and deploy**: Choose "Y"
2. **Which scope**: Select your personal account or team
3. **Link to existing project**: Choose "N" (for first deployment)
4. **Project name**: Accept default or provide custom name (e.g., `danskebank-incident-dashboard`)
5. **Directory**: Press Enter (current directory is correct)
6. **Override settings**: Choose "N" (Vercel will auto-detect Vite project)

The deployment will:
- Run all tests (must pass)
- Run ESLint (must pass)
- Build the application
- Upload to Vercel
- Return a production URL

**Example Output**:
```
🔍  Inspect: https://vercel.com/your-account/danskebank-incident-dashboard/abc123
✅  Production: https://danskebank-incident-dashboard.vercel.app
```

### Step 4: Verify Deployment

1. Open the production URL in your browser
2. Verify the application loads correctly
3. Test key functionality:
   - Dashboard page loads
   - Incident table displays
   - Filtering and saved views work
   - Theme switcher functions
   - Navigation works (routes like `/developer` should load)

## Subsequent Deployments

After the first deployment, the workflow is fully automated:

```bash
npm run deploy
```

This will:
1. Run all tests (if any fail, deployment stops)
2. Run ESLint (if any errors, deployment stops)
3. Build the application (if build fails, deployment stops)
4. Deploy to the same production URL
5. Return the deployment URL

**No prompts** - it remembers your configuration from the first deployment.

## Deployment Scripts

The following npm scripts are available:

### `npm run deploy`
- **Purpose**: Deploy to production (default workflow)
- **Runs**: Tests → Lint → Build → Deploy to production
- **Output**: Stable production URL (e.g., `https://project-name.vercel.app`)
- **Use when**: Sharing with stakeholders, releasing updates

### `npm run predeploy`
- **Purpose**: Run quality gates before deployment
- **Runs**: Tests → Lint → Build
- **Use when**: You want to verify everything passes without deploying
- **Note**: This runs automatically before `npm run deploy`

## Configuration Files

### vercel.json
Located in the project root, configures Vercel deployment:

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

**Purpose**: Ensures React Router works correctly by serving `index.html` for all routes.

**Do not modify** unless you understand the implications for client-side routing.

### .vercel Directory
- **Created automatically** by Vercel CLI during first deployment
- **Contains**: `project.json` with project linking information
- **Location**: Project root (ignored by git via `.gitignore`)
- **Do not delete** - it's needed for subsequent deployments

### .vercelignore
Located in the project root, excludes files from deployment:
- Development files (src/, tests/, specs/)
- Configuration files (.git/, .vscode/, etc.)
- Build artifacts (dist/ is rebuilt by Vercel)
- Test files and coverage

**Tip**: Similar to `.gitignore` but specifically for Vercel deployments.

## Troubleshooting

### Issue: Tests Fail
**Symptom**: Deployment stops with test failures

**Solution**:
```bash
# Run tests locally to see failures
npm test

# Fix failing tests, then deploy again
npm run deploy
```

### Issue: Linting Errors
**Symptom**: Deployment stops with ESLint errors

**Solution**:
```bash
# Run linting locally
npm run lint

# Fix linting errors, then deploy again
npm run deploy
```

### Issue: Build Fails
**Symptom**: Deployment stops with TypeScript or Vite build errors

**Solution**:
```bash
# Run build locally
npm run build

# Fix build errors (usually TypeScript type errors), then deploy again
npm run deploy
```

### Issue: Authentication Expired
**Symptom**: `Error: Not authenticated`

**Solution**:
```bash
# Re-authenticate
vercel login

# Try deployment again
npm run deploy
```

### Issue: 404 Errors on Routes
**Symptom**: Direct navigation to routes like `/developer` returns 404

**Solution**: Verify `vercel.json` contains the rewrites configuration (should be present by default).

### Issue: Deployment Hangs
**Symptom**: Deployment seems stuck

**Solution**:
```bash
# Cancel with Ctrl+C and retry
npm run deploy

# If issue persists, check your internet connection
# Vercel CLI has built-in retry logic for network issues
```

### Issue: Wrong Deployment URL
**Symptom**: Deployment goes to unexpected project or URL

**Solution**:
```bash
# Check project linking
cat .vercel/project.json

# If wrong, remove and re-link
rm -rf .vercel
npm run deploy
# Follow first-time setup prompts again
```

## Advanced Usage

### Manual Vercel CLI Commands

For advanced scenarios, you can use Vercel CLI directly:

```bash
# Check deployment status
vercel ls

# View project information
vercel project ls

# Remove a deployment
vercel rm <deployment-url>

# View logs
vercel logs <deployment-url>
```

### CI/CD Integration

To deploy from GitHub Actions or other CI/CD:

1. Generate a Vercel token:
   - Visit https://vercel.com/account/tokens
   - Create a new token
   - Store as secret in CI/CD (e.g., `VERCEL_TOKEN`)

2. Use in CI/CD workflow:
```bash
vercel deploy --prod --token=$VERCEL_TOKEN --yes
```

**Note**: The `--yes` flag skips prompts (required for non-interactive CI/CD).

### Custom Domain

To use a custom domain (e.g., `incidents.danskebank.com`):

1. Visit your project in Vercel dashboard
2. Go to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Performance Expectations

- **Deployment time**: < 5 minutes (typically 2-3 minutes)
- **First load**: < 3 seconds on 3G connection
- **Build size**: < 100MB (typical: 1-2MB after gzip)

## Security Notes

- `.vercel` directory contains project linking (not secrets)
- Authentication tokens stored securely by Vercel CLI
- All deployments use HTTPS automatically
- No environment variables or secrets configured (application uses localStorage)

## Support

### Documentation
- Vercel CLI: https://vercel.com/docs/cli
- Vercel Vite Guide: https://vercel.com/docs/frameworks/frontend/vite
- React Router on Vercel: https://vercel.com/docs/frameworks/frontend/react-router

### Getting Help
- Check the troubleshooting section above
- Review Vercel deployment logs in the dashboard
- Verify all quality gates pass locally (`npm run predeploy`)

## Summary

**For most deployments, you only need**:

```bash
npm run deploy
```

This handles everything: testing, linting, building, and deploying to production. The first time requires interactive setup, but subsequent deployments are fully automated.
