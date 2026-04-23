#!/usr/bin/env bash
set -e

# ── Colors ──────────────────────────────────────────────────────
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
GRAY='\033[0;90m'
NC='\033[0m'

echo ""
echo -e "  ${CYAN}========================================${NC}"
echo -e "  ${CYAN} NeuralCode - AI Code Translator Setup ${NC}"
echo -e "  ${CYAN}========================================${NC}"
echo ""

# ── Check Node.js ────────────────────────────────────────────────
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Node.js not found. Install from: https://nodejs.org"
    exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}[OK]${NC} Node.js $NODE_VER found"

# ── Check npm ────────────────────────────────────────────────────
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} npm not found."
    exit 1
fi
NPM_VER=$(npm -v)
echo -e "${GREEN}[OK]${NC} npm $NPM_VER found"

# ── Install dependencies ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[1/3]${NC} Installing npm dependencies..."
npm install
echo -e "${GREEN}[OK]${NC} Dependencies installed"

# ── Copy .env ────────────────────────────────────────────────────
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}[OK]${NC} Created .env from .env.example"
else
    echo -e "${GREEN}[OK]${NC} .env already exists"
fi

# ── Check Ollama ─────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[2/3]${NC} Checking Ollama connection..."

if curl -s --connect-timeout 3 http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}[OK]${NC} Ollama is running"

    MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | sed 's/"name":"//;s/"//' | tr '\n' ' ')
    if [ -n "$MODELS" ]; then
        echo -e "${GRAY}     Installed models: $MODELS${NC}"
    fi

    if ! echo "$MODELS" | grep -q "codellama"; then
        echo -e "${YELLOW}[WARN]${NC} codellama not found. Run: ollama pull codellama"
    fi
else
    echo -e "${YELLOW}[WARN]${NC} Ollama is not running or not installed."
    echo ""
    echo -e "${GRAY}  Install Ollama: https://ollama.com/download${NC}"
    echo -e "${GRAY}  Then in a separate terminal:${NC}"
    echo -e "${GRAY}    ollama serve${NC}"
    echo -e "${GRAY}    ollama pull codellama${NC}"
fi

# ── Start dev server ─────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/3]${NC} Starting development server..."
echo ""
echo -e "  ${CYAN}+-----------------------------------------+${NC}"
echo -e "  ${CYAN}|  App: http://localhost:3000              |${NC}"
echo -e "  ${CYAN}|  Press Ctrl+C to stop                   |${NC}"
echo -e "  ${CYAN}+-----------------------------------------+${NC}"
echo ""

npm run dev
