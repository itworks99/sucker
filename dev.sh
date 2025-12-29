#!/bin/bash

# Sucker Local Development Startup Script
# This script starts both the Python backend and Vite frontend

set -e

echo "============================================================"
echo "  Sucker - Local Development Environment"
echo "============================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}ERROR: Python 3 is not installed${NC}"
    exit 1
fi

# Check if bottle is installed
if ! python3 -c "import bottle" &> /dev/null; then
    echo -e "${YELLOW}Python dependencies not found.${NC}"
    echo "Please install them manually:"
    echo "  pip install bottle gunicorn simplejson"
    echo "or"
    echo "  pip install -e srv/"
    echo ""
    exit 1
fi

# Check if node_modules exist
if [ ! -d "node_modules" ] && [ ! -f ".pnp.cjs" ]; then
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    yarn install
fi

echo -e "${BLUE}Starting services...${NC}"
echo ""

# Trap to cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    # shellcheck disable=SC2236
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    # shellcheck disable=SC2236
    if [ ! -z "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Kill any existing process on port 8000
if lsof -ti:8000 > /dev/null 2>&1; then
    echo -e "${YELLOW}Port 8000 is in use. Killing existing process...${NC}"
    kill $(lsof -ti:8000) 2>/dev/null || true
    sleep 1
fi

# Start backend
echo -e "${GREEN}Starting Python backend on http://localhost:8000${NC}"
python3 run_backend.py &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start frontend
echo -e "${GREEN}Starting Vite frontend on http://localhost:3000${NC}"
echo ""
echo "============================================================"
echo -e "  ${GREEN}✓${NC} Backend:  http://localhost:8000"
echo -e "  ${GREEN}✓${NC} Frontend: http://localhost:3000"
echo "============================================================"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

yarn dev

# If yarn dev exits, cleanup will be called automatically
