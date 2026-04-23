# 📚 NeuralCode — Complete Developer Documentation

> **For:** Full-Stack Developers, DevOps Engineers, Portfolio Builders  
> **Covers:** Local Dev Setup · GitHub Upload · Vercel Deployment · Troubleshooting

---

## 📌 TABLE OF CONTENTS

1. [Local Development in VS Code](#1-local-development-in-vs-code)
2. [GitHub Upload Guide](#2-github-upload-guide)
3. [Vercel Deployment Guide](#3-vercel-deployment-guide)
4. [Troubleshooting & Common Errors](#4-troubleshooting--common-errors)
5. [Test Cases & Example Prompts](#5-test-cases--example-prompts)

---

---

# 1. LOCAL DEVELOPMENT IN VS CODE

## Prerequisites

Before you start, verify the following are installed:

| Tool | Required Version | Check Command | Install Link |
|------|-----------------|---------------|-------------|
| Node.js | `≥ 18.17.0` | `node --version` | [nodejs.org/download](https://nodejs.org/download) |
| npm | `≥ 9.0.0` | `npm --version` | Bundled with Node.js |
| Git | Any | `git --version` | [git-scm.com](https://git-scm.com/) |
| Ollama | Latest | `ollama --version` | [ollama.ai](https://ollama.ai/) |
| VS Code | Any recent | — | [code.visualstudio.com](https://code.visualstudio.com/) |

---

## Step-by-Step Setup

### Step 1 — Download the Project

**Option A: Clone from GitHub (after uploading)**
```bash
git clone https://github.com/YOUR_USERNAME/ai-code-translator.git
cd ai-code-translator
```

**Option B: Start from the folder you already have**
```bash
cd ai-code-translator
```

### Step 2 — Open in VS Code

```bash
# Opens VS Code in the current directory
code .
```

**Recommended VS Code Extensions (install these for best experience):**

Open the Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`) and install:

| Extension | Publisher | Why |
|---|---|---|
| ESLint | Microsoft | Linting |
| Prettier | Prettier | Formatting |
| Tailwind CSS IntelliSense | Tailwind Labs | CSS autocomplete |
| TypeScript Error Lens | usernamehw | Inline TS errors |
| Prisma | Prisma | (optional) |

Or install all at once via terminal:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension usernamehw.errorlens
```

### Step 3 — Install Node Dependencies

```bash
npm install
```

Expected output:
```
added 287 packages, and audited 288 packages in 23s
found 0 vulnerabilities
```

> ⚠️ If you see `ERESOLVE` errors, try: `npm install --legacy-peer-deps`

### Step 4 — Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Open it in VS Code
code .env.local
```

Edit `.env.local` to look like this:
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=codellama
NEXT_PUBLIC_APP_NAME="NeuralCode"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

Save the file (`Ctrl+S` / `Cmd+S`).

### Step 5 — Start Ollama

Open a **new terminal** (separate from VS Code terminal) and run:

```bash
# Start the Ollama server
ollama serve
```

You should see:
```
Ollama is running on http://localhost:11434
```

> **Keep this terminal open** — Ollama needs to stay running while you use the app.

### Step 6 — Pull an AI Model

In **another new terminal**, download a model:

```bash
# Best for code tasks (recommended, ~4 GB)
ollama run codellama

# OR faster, lighter alternative (~2 GB)
ollama run mistral

# OR latest general purpose (~5 GB)
ollama run llama3
```

Wait for it to download (progress bar shows). When done, type `/bye` to exit the interactive prompt — Ollama keeps the model loaded.

### Step 7 — Run the Development Server

Back in **VS Code's integrated terminal** (`Ctrl+\`` / `Ctrl+J`):

```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 1.8s
```

### Step 8 — Open the App

Navigate to: **[http://localhost:3000](http://localhost:3000)**

### Step 9 — Verify Ollama Connection

In your browser, visit: **[http://localhost:3000/api/health](http://localhost:3000/api/health)**

You should see:
```json
{
  "alive": true,
  "models": ["codellama:latest"],
  "preferredModel": "codellama",
  "modelInstalled": true,
  "recommendation": "All systems operational."
}
```

If `alive` is `false`, Ollama is not running — go back to Step 5.

---

## VS Code Workspace Settings (Optional)

Create `.vscode/settings.json` in your project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true
  }
}
```

---

---

# 2. GITHUB UPLOAD GUIDE

## Complete Step-by-Step for Beginners

### Step 1 — Create a GitHub Account

If you don't have one, go to [github.com](https://github.com) → Sign Up (it's free).

### Step 2 — Initialize Git in Your Project

Open VS Code terminal and run:

```bash
# Navigate to project directory (if not already there)
cd ai-code-translator

# Initialize a new Git repository
git init

# Verify it worked
git status
```

You should see files listed in red as "untracked".

### Step 3 — Configure Git Identity (first-time only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### Step 4 — Stage All Files

```bash
git add .

# Verify staged files (should show green files now)
git status
```

> ✅ The `.gitignore` file is already configured to **exclude**:
> - `node_modules/` (huge, regenerated by `npm install`)
> - `.next/` (build output)
> - `.env.local` (contains your secrets — NEVER upload this)

### Step 5 — Create the First Commit

```bash
git commit -m "feat: initial commit - NeuralCode AI Code Translator"
```

**Best Commit Message Practices:**

Use the **Conventional Commits** format:

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting, no logic change |
| `refactor:` | Code refactoring |
| `perf:` | Performance improvement |
| `chore:` | Dependencies, config |

Examples:
```bash
git commit -m "feat: add ELI5 toggle to explain panel"
git commit -m "fix: handle Ollama timeout gracefully"
git commit -m "docs: update README deployment section"
```

### Step 6 — Create a Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Fill in:
   - **Repository name**: `ai-code-translator` (or `neural-code`)
   - **Description**: `AI-powered code translator, explainer & comment generator using Ollama`
   - **Visibility**: Public (for portfolio) or Private
   - **Do NOT** initialize with README (you already have one)
3. Click **Create repository**

### Step 7 — Connect Local Repo to GitHub

Copy the HTTPS URL from GitHub (looks like `https://github.com/YOUR_USERNAME/ai-code-translator.git`)

```bash
# Add the remote origin
git remote add origin https://github.com/YOUR_USERNAME/ai-code-translator.git

# Verify it was added
git remote -v
```

### Step 8 — Push to GitHub

```bash
# Rename branch to 'main' (modern standard)
git branch -M main

# Push and set upstream
git push -u origin main
```

Enter your GitHub username and a **Personal Access Token** (not password) when prompted.

> **How to create a token:** GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → Check `repo` scope → Copy the token

### Step 9 — Verify

Visit `https://github.com/YOUR_USERNAME/ai-code-translator` — all files should be there! 🎉

---

## Future Updates Workflow

After making changes:

```bash
# See what changed
git status

# Stage specific files
git add app/page.tsx app/components/Header.tsx

# Or stage everything
git add .

# Commit with a descriptive message
git commit -m "feat: add syntax highlighting to output panel"

# Push to GitHub
git push
```

---

## What NOT to Upload

The `.gitignore` already handles this, but be aware:

| Path | Why it's excluded |
|------|------------------|
| `.env.local` | Contains your Ollama URL — could expose your server |
| `node_modules/` | 200+ MB, rebuilt by `npm install` |
| `.next/` | Build artefacts, regenerated by `npm run build` |
| `*.log` | Debug logs |
| `.DS_Store` | macOS metadata (junk) |

---

---

# 3. VERCEL DEPLOYMENT GUIDE

## Understanding the Challenge

Vercel runs **serverless functions** in the cloud. Your Ollama runs **locally** on your machine. By default, these can't communicate.

### Solutions:

| Option | Use Case | Cost |
|--------|----------|------|
| **ngrok tunnel** | Testing, demos | Free (limited) |
| **Cloudflare Tunnel** | Stable personal use | Free |
| **Cloud VPS with Ollama** | Production | ~$10–30/month |

---

## Option A — ngrok Tunnel (Quickest)

### 1. Install ngrok
```bash
# macOS
brew install ngrok

# Windows — download from https://ngrok.com/download
# Linux
snap install ngrok
```

### 2. Authenticate ngrok (free account)
```bash
ngrok config add-authtoken YOUR_TOKEN_FROM_NGROK_DASHBOARD
```

### 3. Start Ollama & expose it
```bash
# Terminal 1 — start Ollama
ollama serve

# Terminal 2 — create tunnel
ngrok http 11434
```

ngrok gives you a URL like: `https://abc123.ngrok-free.app`

### 4. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

When prompted for environment variables, enter:
```
OLLAMA_BASE_URL = https://abc123.ngrok-free.app
OLLAMA_MODEL    = codellama
```

> ⚠️ **Important**: Free ngrok URLs change every restart. For a stable URL, use a paid ngrok plan or Cloudflare Tunnel.

---

## Option B — Cloudflare Tunnel (Free & Stable)

### 1. Install cloudflared
```bash
# macOS
brew install cloudflared

# Linux
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### 2. Authenticate
```bash
cloudflared tunnel login
```

### 3. Create a tunnel
```bash
cloudflared tunnel create ollama-tunnel
```

### 4. Run the tunnel (while Ollama is running)
```bash
# Quick one-shot tunnel (temporary URL)
cloudflared tunnel --url http://localhost:11434
```

Use the generated URL as `OLLAMA_BASE_URL` in Vercel.

---

## Option C — VPS Deployment (Production)

1. Rent a GPU VPS: [RunPod](https://runpod.io), [Vast.ai](https://vast.ai), [DigitalOcean](https://digitalocean.com), [Linode](https://linode.com)
2. SSH in and install Ollama:
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ollama serve --host 0.0.0.0
   ollama run codellama
   ```
3. Open port 11434 in your VPS firewall
4. Set `OLLAMA_BASE_URL=http://YOUR_VPS_IP:11434` in Vercel

---

## Vercel Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Environment |
|---|---|---|
| `OLLAMA_BASE_URL` | Your tunnel/VPS URL | Production, Preview |
| `OLLAMA_MODEL` | `codellama` | All |

---

---

# 4. TROUBLESHOOTING & COMMON ERRORS

## ❌ `Cannot reach Ollama`

**Symptom:** Red "Ollama offline" badge in the header  
**Cause:** Ollama server is not running

**Fix:**
```bash
# Start Ollama
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

---

## ❌ `Model not found`

**Symptom:** Amber "Model missing" badge  
**Cause:** Model hasn't been downloaded yet

**Fix:**
```bash
# Download the model
ollama run codellama

# List installed models
ollama list
```

---

## ❌ Port 3000 already in use

**Symptom:** `Error: listen EADDRINUSE: address already in use :::3000`

**Fix:**
```bash
# Find what's using port 3000
lsof -i :3000       # macOS/Linux
netstat -ano | findstr :3000   # Windows

# Kill it (replace PID with actual number)
kill -9 <PID>       # macOS/Linux
taskkill /PID <PID> /F   # Windows

# Or run on a different port
npm run dev -- --port 3001
```

---

## ❌ `npm install` fails with peer dependency errors

**Fix:**
```bash
npm install --legacy-peer-deps
# or
npm install --force
```

---

## ❌ Request timeout after 120 seconds

**Symptom:** Error message about timeout  
**Cause:** Model is still loading (first request is slow), or model is too large for your hardware

**Fix:**
- Wait 1–2 minutes and try again (model loads into memory once)
- Switch to a smaller model: `mistral` or `phi3`
- Increase RAM / use a machine with a GPU

---

## ❌ TypeScript errors in VS Code

**Fix:**
```bash
# Regenerate TypeScript build info
rm -rf .next tsconfig.tsbuildinfo
npm run dev
```

---

## ❌ Styles not loading (Tailwind not working)

**Fix:**
```bash
# Rebuild Tailwind
npm run build
npm run dev
```

Check `tailwind.config.js` `content` paths match your file structure.

---

## ❌ Vercel build fails

**Common cause:** Missing environment variables

**Fix:** In Vercel Dashboard → Settings → Environment Variables → Add `OLLAMA_BASE_URL` and `OLLAMA_MODEL`

---

---

# 5. TEST CASES & EXAMPLE PROMPTS

## Test Case 1 — Python → JavaScript Translation

**Input (Python):**
```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
```

**Expected Output (JavaScript):**
```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

---

## Test Case 2 — ELI5 Explanation

**Input:**
```python
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)
```

**Expected Output (ELI5):**
> "Imagine you're counting steps like a bunny 🐰. This code figures out how many ways the bunny can hop to step N by adding the ways to reach the two previous steps…"

---

## Test Case 3 — Comment Generation

**Input (Java):**
```java
public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

**Expected Output:** Same code + meaningful comments on each section explaining the divide-and-conquer approach.

---

## Recommended Models by Use Case

| Task | Best Model | Why |
|------|-----------|-----|
| Code translation | `codellama` | Trained on code |
| General explanation | `llama3` | Strong language model |
| ELI5 explanation | `mistral` | Natural, friendly tone |
| Fast prototyping | `phi3` | Very small, quick |
| Complex algorithms | `deepseek-coder` | Strong at reasoning |

---

*Last updated: 2024 · MIT License · NeuralCode Project*
