# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-12-29

### 🚀 Major Changes

- Added templates for Squid 6 and Squid 7
- Migrated from react-scripts to Vite
- Complete TypeScript Migration
- Frontend Architecture Refactoring

### ✨ Added

#### Development Tools
- **`run_backend.py`** - Standalone Python backend server for local development (runs on port 8000)
- **`dev.sh`** - Convenience script to start full stack (backend + frontend) with one command
- **`vite.config.js`** - Vite configuration with dev server proxy for API requests
- **`DEVELOPMENT.md`** - Comprehensive development guide with architecture diagrams
- **`MIGRATION_SUMMARY.md`** - Complete migration documentation and testing checklist
- **`.gitattributes`** - Ensures consistent line endings (LF) across all platforms

#### Package.json Scripts
- `yarn dev:full` - Start both backend and frontend
- `yarn backend` - Start Python backend only
- `yarn preview` - Preview production build locally

### 🔧 Changed

#### Build System
- Replaced react-scripts with Vite for module bundling
- Updated `index.html` - Moved to project root (Vite requirement)
- Removed webpack and babel dependencies

#### Backend
- Replaced manual file operations with context managers (`with` statements)
- Optimized JSON serialization for better performance
- Improved code readability and maintainability
- Added CORS OPTIONS handlers for `/json`, `/version`, and `/import` endpoints
- Fixed deprecated `/version` endpoint method (was OPTIONS, now POST)
- Updated backend to serve Vite-built assets from `/assets/*` path
- Added raw string prefix to regex pattern to fix Python 3.14 warning

#### Frontend
- Migrated all JavaScript files to TypeScript (`.tsx`)
- Refactored class components to functional components with hooks
- Updated import statements and module resolution for TypeScript
- Improved error handling with better type checking
- Changed API URLs from absolute (`http://localhost:3000/*`) to relative paths (`/*`)
- Updated Vite dev server to proxy API calls to backend on port 8000
- Simplified import headers in configuration import function

#### Configuration
- Updated `.gitignore` with comprehensive rules for:
  - Yarn Berry PnP files (`.pnp.cjs`, `.pnp.loader.mjs`)
  - Build artifacts (`/build`, `/dist`)
  - Python artifacts (`__pycache__`, `*.pyc`, `*.egg-info`)
  - Environment files (`.env*`)
  - IDE files (`.vscode/*`, `.idea/`, `*.swp`)
  - OS files (`.DS_Store`, `Thumbs.db`)

### 🗑️ Removed
- `react-scripts` - Replaced with Vite
- `@babel/preset-react` - Vite handles JSX transpilation
- `.eslintrc.json` - Migrated to flat config
- `.flowconfig` - Not needed with current setup
- OpenSSL legacy provider workaround in package.json scripts
- Unused React components
- `MIGRATION_SUMMARY.md` - Consolidated into changelog

### 🐛 Fixed
- Fixed CORS preflight errors by adding OPTIONS handlers to all API endpoints
- Fixed "unsupported protocol" error with `/version` endpoint
- Fixed 404 error for favicon with graceful fallback
- Fixed regex deprecation warning in Python 3.14 for image route

### 📦 Dependencies

#### Added
- `vite@^7.3.0` - Next-generation frontend build tool
- `@vitejs/plugin-react@^5.1.2` - Official Vite plugin for React
- `vitest` - Test framework for React components
- `@testing-library/react` - React testing utilities
- TypeScript type definitions for all dependencies

#### Updated
- `eslint-plugin-unicorn@^62` - Enhanced ESLint rules for modern JavaScript

#### Removed
- `react-scripts@4.0.3` - Replaced by Vite
- `@babel/preset-react@^7.26.3` - No longer needed
- All webpack and babel-related dependencies (1200+ packages removed from dependency tree)

### 🏗️ Architecture

#### Development Mode
```
Browser (3000) → Vite Dev Server (3000) → Python Backend (8000)
                    ↓ Proxies API calls
```

#### Production Mode (Docker)
```
Browser (3000) → Python/Gunicorn (3000)
                    ↓ Serves static + API
```

### 📖 Documentation
- Added comprehensive development guide (`DEVELOPMENT.md`)
- Created migration summary with testing checklist (`MIGRATION_SUMMARY.md`)
- Updated README with new development workflow (to be committed separately)

### 🔄 Breaking Changes
None - The application works identically from a user perspective, just builds faster!

### 🧪 Testing
All features tested and verified:
- ✅ Local development server with HMR
- ✅ API requests (GET /json, POST /version, POST /import)
- ✅ Production build
- ✅ Docker build and deployment
- ✅ Application functionality (config loading, import, version switching)

---

## [0.3.0] - 2021-XX-XX

### Changed
- Migrated to React Hooks
- Removed Lodash dependency
- Updated Dockerfile
- Added Squid 5 template

### Fixed
- Fixed small bug related to static component

---

## Earlier Versions

See git history for changes in versions 0.1.0 and 0.2.0.

---

## Migration Guide

### For Developers

**Before (v0.3.0):**
```bash
yarn start  # Starts webpack dev server
```

**After (v0.4.0):**
```bash
./dev.sh    # Starts both backend and frontend
# or
yarn dev:full
```

### For Production Deployment

No changes needed! Docker build process remains the same:
```bash
docker build -t sucker:latest .
docker run -d -p 3000:3000 sucker:latest
```

The Dockerfile now uses Vite for faster builds, but the deployment process is unchanged.

---

[0.4.0]: https://github.com/itworks99/sucker/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/itworks99/sucker/releases/tag/v0.3.0
