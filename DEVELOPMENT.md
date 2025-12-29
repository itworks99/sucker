# Sucker - Development Guide

## Local Development Setup

### Prerequisites

- Python 3.x
- Node.js (v14 or higher)
- Yarn package manager

### Quick Start

The easiest way to run the full stack locally:

```bash
./dev.sh
```

Or using yarn:

```bash
yarn dev:full
```

This will start:
- Backend API server on `http://localhost:8000`
- Frontend dev server on `http://localhost:3000` (with hot reload)

### Manual Setup

If you prefer to run services separately:

#### 1. Install Dependencies

**Python backend:**
```bash
python3 -m pip install -e srv/
```

**Node.js frontend:**
```bash
yarn install
```

#### 2. Start Backend (Terminal 1)

```bash
python3 run_backend.py
# or
yarn backend
```

Backend will run on `http://localhost:8000`

#### 3. Start Frontend (Terminal 2)

```bash
yarn dev
# or
yarn start
```

Frontend will run on `http://localhost:3000`

The Vite dev server will proxy API requests (`/json`, `/import`, `/version`) to the backend on port 8000.

## Architecture

### Development Mode

```
┌─────────────────────────────────────────┐
│  Browser: http://localhost:3000         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Vite Dev Server (Port 3000)            │
│  - Hot Module Replacement               │
│  - Proxies /json, /import, /version     │
│    to http://localhost:8000             │
└──────────────┬──────────────────────────┘
               │ API requests
               ▼
┌─────────────────────────────────────────┐
│  Python Backend (Port 8000)             │
│  - Bottle framework                     │
│  - Squid config parser                  │
└─────────────────────────────────────────┘
```

### Production Mode (Docker)

```
┌─────────────────────────────────────────┐
│  Browser: http://localhost:3000         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Python Backend (Port 3000)             │
│  - Bottle + Gunicorn                    │
│  - Serves static files from /build      │
│  - API endpoints                        │
└─────────────────────────────────────────┘
```

## Building for Production

```bash
yarn build
```

This creates optimized production files in the `build/` directory.

## Docker

Build and run with Docker:

```bash
docker build -t sucker:latest .
docker run -d -p 3000:3000 sucker:latest
```

Access at `http://localhost:3000`

## Technology Stack

- **Frontend:** React 17, Semantic UI React, Vite
- **Backend:** Python 3, Bottle, Gunicorn
- **Build:** Vite (fast builds, HMR)
- **Package Manager:** Yarn Berry (PnP mode)

## Git Configuration

The repository includes:
- **`.gitignore`** - Updated to ignore:
  - Build artifacts (`/build`, `/dist`)
  - Dependencies (`node_modules`, `.yarn/*` cache, `__pycache__`)
  - Environment files (`.env*`)
  - IDE files (`.vscode/*`, `.idea/`)
  - OS files (`.DS_Store`, `Thumbs.db`)
  - Python artifacts (`*.pyc`, `*.egg-info`, etc.)

- **`.gitattributes`** - Ensures consistent line endings (LF) across all platforms

**Note:** The `build/` directory is now ignored. The Docker build process creates the production build inside the container.

## Troubleshooting

### Port already in use

If port 3000 or 8000 is already in use:

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Python dependencies missing

```bash
python3 -m pip install -e srv/
```

### Node modules issues

```bash
yarn install --force
```

## API Endpoints

- `GET /json` - Get Squid configuration for current version
- `POST /version` - Get Squid configuration for specific version
- `POST /import` - Import existing Squid configuration
