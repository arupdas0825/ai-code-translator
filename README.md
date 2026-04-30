<div align="center">

# ⚡ NeuralCode — AI Code Translator & Explainer

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-ff6b35?style=flat-square)](https://ollama.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-34d399?style=flat-square)](CONTRIBUTING.md)

**A production-grade, privacy-first AI code assistant.**  
Translate, explain, and comment code using a 100% local LLM — zero API keys, zero data leaks.

[🚀 Live Demo](#) · [📖 Docs](#-how-it-works) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

---

<img width="1600" height="676" alt="ai code " src="https://github.com/user-attachments/assets/517003f3-62b3-4a71-b9b9-6264e2126ccf" />
<img width="1600" height="642" alt="ai code 1" src="https://github.com/user-attachments/assets/e3af9b92-36ed-4078-ba21-68574bd4aa1d" />


> *NeuroGlass dark UI — glassmorphism panels with cyan/violet neural accents*

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌐 **Code Translation** | Convert code between 14 languages instantly |
| 📖 **Code Explanation** | Plain-English breakdown of any code snippet |
| 🧒 **Explain Like I'm 10** | Child-friendly explanations with fun analogies |
| 💬 **Comment Generator** | Auto-generates meaningful inline documentation |
| 🔍 **Language Detection** | AI-powered auto-detection of source language |
| 📜 **Query History** | Browse and restore your 20 most recent queries |
| 🔒 **100% Local** | All processing via Ollama — your code never leaves your machine |
| ⚡ **Zero Latency** | No external API calls, no rate limits, no monthly bills |
| 🎨 **NeuroGlass UI** | Stunning glassmorphism dark theme with syntax highlighting |
| 📋 **Copy & Download** | One-click copy or download output as a file |

---

## 🌐 Supported Languages

`Python` · `JavaScript` · `TypeScript` · `Java` · `C++` · `C` · `Go` · `Rust` · `PHP` · `Ruby` · `Swift` · `Kotlin` · `Bash/Shell` · `SQL`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) — App Router + Server Components |
| **Language** | [TypeScript 5.5](https://www.typescriptlang.org/) — strict mode |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) — custom NeuroGlass design system |
| **AI Backend** | [Ollama](https://ollama.ai/) — local LLM (CodeLlama, Llama 3, Mistral) |
| **Syntax Highlight** | [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) — Prism |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) — serverless functions |

---

## 📸 Screenshots

> *Screenshots coming soon. Clone the repo and run locally to see the full UI.*

| Translate | Explain | Comment |
|---|---|---|
| ![Translate](public/ss-translate.png) | ![Explain](public/ss-explain.png) | ![Comment](public/ss-comment.png) |

---

## ⚙️ Setup & Installation

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | `≥ 18.17` | [nodejs.org](https://nodejs.org/) |
| npm | `≥ 9.0` | Included with Node |
| Ollama | Latest | [ollama.ai](https://ollama.ai/) |
| Git | Any | [git-scm.com](https://git-scm.com/) |

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-code-translator.git
cd ai-code-translator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=codellama
```

### 4. Start Ollama and pull a model

```bash
# Start Ollama server (runs in background)
ollama serve

# In a new terminal — pull the AI model (one-time, ~4 GB download)
ollama run codellama

# Alternative lightweight models:
# ollama run llama3          # General purpose
# ollama run mistral         # Fast & efficient
# ollama run deepseek-coder  # Code specialist
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is live! 🎉

---

## 🧠 How It Works

NeuralCode uses a **prompt engineering pipeline** to interact with your local Ollama instance:

```
User Input (code + settings)
        │
        ▼
┌───────────────────┐
│  Next.js API Route │  /api/translate | /api/explain | /api/comment
│  (Serverless Fn)  │
└────────┬──────────┘
         │  Engineered prompt
         ▼
┌───────────────────┐
│  Ollama REST API  │  POST http://localhost:11434/api/generate
│  (Local LLM)      │  model: codellama | llama3 | mistral
└────────┬──────────┘
         │  Raw text response
         ▼
┌───────────────────┐
│  Response Parser  │  Strip code fences, validate, format
└────────┬──────────┘
         │
         ▼
    Rendered Output (syntax-highlighted or markdown)
```

### Prompt Engineering Strategy

Each feature uses a carefully tuned system prompt:

- **Translation**: Low temperature (0.1) for deterministic, idiomatic output
- **Explanation**: Medium temperature (0.3) for natural language variety
- **ELI5 Mode**: Instructs the model to use analogies and avoid jargon
- **Comments**: Strict rules to never modify code — only add comments

---

## 🚀 Deployment on Vercel

> **Important**: Vercel's serverless functions cannot reach `localhost:11434` directly.  
> You need to expose your local Ollama via a tunnel.

### Option A — Tunnel with ngrok (Recommended for testing)

```bash
# Install ngrok
brew install ngrok   # macOS
# or download from https://ngrok.com/download

# Start Ollama
ollama serve

# Expose Ollama publicly
ngrok http 11434
# → You'll get a URL like: https://abc123.ngrok.io
```

Set environment variable in Vercel Dashboard:
```
OLLAMA_BASE_URL = https://abc123.ngrok.io
OLLAMA_MODEL    = codellama
```

### Option B — Deploy Ollama to a cloud VPS

For production, run Ollama on a GPU-enabled VPS (e.g., Vast.ai, RunPod, DigitalOcean):

```bash
# On your VPS:
ollama serve --host 0.0.0.0   # listens on all interfaces
```

Then set `OLLAMA_BASE_URL=http://YOUR_VPS_IP:11434` in Vercel.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to link your GitHub repo
# Set environment variables when asked
```

Or use the Vercel Dashboard:  
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-code-translator)

---

## 📁 Project Structure

```
ai-code-translator/
├── app/
│   ├── api/
│   │   ├── translate/route.ts   # Code translation endpoint
│   │   ├── explain/route.ts     # Code explanation endpoint
│   │   ├── comment/route.ts     # Comment generation endpoint
│   │   ├── detect/route.ts      # Language detection endpoint
│   │   └── health/route.ts      # Ollama health check
│   ├── components/
│   │   ├── Header.tsx           # Nav with Ollama status indicator
│   │   ├── CodeInput.tsx        # Monaco-style input panel
│   │   ├── CodeOutput.tsx       # Syntax-highlighted output panel
│   │   ├── LanguageSelector.tsx # Language dropdown
│   │   ├── ModelSelector.tsx    # Ollama model picker
│   │   ├── LoadingAnimation.tsx # Neural spinner
│   │   ├── HistoryPanel.tsx     # Query history
│   │   └── Toast.tsx            # Toast notification system
│   ├── utils/
│   │   ├── ollama.ts            # Ollama API client
│   │   ├── prompts.ts           # All AI prompts
│   │   └── helpers.ts           # Utility functions
│   ├── layout.tsx               # Root layout + fonts
│   └── page.tsx                 # Main application page
├── styles/
│   └── globals.css              # NeuroGlass design system
├── public/                      # Static assets
├── .env.example                 # Environment template
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🧪 API Reference

### `POST /api/translate`
```json
{
  "code": "def hello(): print('Hello')",
  "sourceLang": "python",
  "targetLang": "javascript",
  "model": "codellama"
}
```

### `POST /api/explain`
```json
{
  "code": "...",
  "language": "python",
  "eli5": false,
  "model": "codellama"
}
```

### `POST /api/comment`
```json
{
  "code": "...",
  "language": "java",
  "model": "codellama"
}
```

### `POST /api/detect`
```json
{
  "code": "fmt.Println('Hello')",
  "model": "codellama"
}
```

### `GET /api/health`
```json
{
  "alive": true,
  "models": ["codellama:latest"],
  "preferredModel": "codellama",
  "modelInstalled": true,
  "recommendation": "All systems operational."
}
```

---

## 📌 Future Improvements

- [ ] 🎤 Voice input for code dictation
- [ ] 🌙 Light mode toggle
- [ ] 📦 More language support (Scala, Dart, Elixir)
- [ ] 🔗 Share output via URL
- [ ] 💾 Persistent history with IndexedDB
- [ ] ⚙️ Custom system prompt editor
- [ ] 🖥️ VS Code extension
- [ ] 🌐 Chrome DevTools integration
- [ ] 📊 Token usage stats
- [ ] 🚀 Streaming output (real-time token generation)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Author

**[Your Name]**

- GitHub: [@your-github-username](https://github.com/your-github-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Portfolio: [yourportfolio.dev](https://yourportfolio.dev)

---

<div align="center">

**Built with ❤️ using Next.js, Tailwind CSS, and Ollama**

*If this project helped you, please give it a ⭐ on GitHub!*

</div>
