// ─── Prompt Engineering ──────────────────────────────────────────────────────
// All AI prompts are centralised here for easy iteration and testing.

export type SupportedLanguage =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "cpp"
  | "c"
  | "go"
  | "rust"
  | "php"
  | "ruby"
  | "swift"
  | "kotlin"
  | "bash"
  | "sql"
  | "auto";

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  python: "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  java: "Java",
  cpp: "C++",
  c: "C",
  go: "Go",
  rust: "Rust",
  php: "PHP",
  ruby: "Ruby",
  swift: "Swift",
  kotlin: "Kotlin",
  bash: "Bash / Shell",
  sql: "SQL",
  auto: "Auto-detect",
};

export const LANGUAGE_EXTENSIONS: Partial<Record<SupportedLanguage, string>> = {
  python: "py",
  javascript: "js",
  typescript: "ts",
  java: "java",
  cpp: "cpp",
  c: "c",
  go: "go",
  rust: "rs",
  php: "php",
  ruby: "rb",
  swift: "swift",
  kotlin: "kt",
  bash: "sh",
  sql: "sql",
};

// ─── Translation Prompt ──────────────────────────────────────────────────────
export function buildTranslationPrompt(
  code: string,
  sourceLang: string,
  targetLang: string
): string {
  return `You are an expert polyglot programmer. Your task is to translate code from ${sourceLang} to ${targetLang}.

RULES:
1. Output ONLY the translated code — no explanations, no markdown fences, no commentary.
2. Preserve the exact logic, variable names (adapted to target conventions), and structure.
3. Use idiomatic ${targetLang} patterns (e.g., list comprehensions in Python, arrow functions in JS).
4. If the source uses a library that doesn't exist in the target, use the closest equivalent.
5. Preserve all existing comments, translated to ${targetLang} style.

SOURCE CODE (${sourceLang}):
\`\`\`
${code}
\`\`\`

Translated ${targetLang} code (output ONLY the code, nothing else):`;
}

// ─── Explanation Prompt ──────────────────────────────────────────────────────
export function buildExplanationPrompt(
  code: string,
  language: string,
  eli5: boolean
): string {
  if (eli5) {
    return `You are a patient teacher explaining code to a 10-year-old child.
Use simple words, fun analogies, and everyday examples (toys, food, games).
Avoid all technical jargon. If you must use a technical term, explain it in one simple sentence.

Format your answer as:
## 🧠 What does this code do?
(1–2 sentence summary a child can understand)

## 🔍 Step-by-step walkthrough
(Numbered list, each step uses a real-world analogy)

## 🎯 The big idea
(One key takeaway, stated simply)

CODE (${language}):
\`\`\`
${code}
\`\`\`

Explain it like I'm 10:`;
  }

  return `You are a senior software engineer writing clear, concise code documentation.
Explain the following ${language} code in plain English for a developer audience.

Format your answer as:
## 📋 Summary
(2–3 sentence overview of what the code does and its purpose)

## 🔍 Line-by-line breakdown
(Walk through the key sections, grouped logically — not literally every line)

## 🧩 Key concepts used
(Bullet list of patterns, algorithms, or techniques)

## ⚠️ Things to note
(Edge cases, potential bugs, or improvement suggestions — if any)

CODE (${language}):
\`\`\`
${code}
\`\`\`

Explanation:`;
}

// ─── Comment Generation Prompt ───────────────────────────────────────────────
export function buildCommentPrompt(code: string, language: string): string {
  return `You are a meticulous senior engineer who writes outstanding code documentation.
Add meaningful inline comments to the following ${language} code.

RULES:
1. Output ONLY the commented code — no preamble, no markdown fences, no explanations outside the code.
2. Add a top-level block comment describing what the code does overall.
3. Add inline comments for: functions/methods (what it does, params, return), complex logic, non-obvious variable names, algorithms.
4. Use the correct comment syntax for ${language}.
5. Comments must be concise and informative — not stating the obvious (e.g., do NOT write "// increment i by 1" for "i++").
6. Do NOT remove or change any existing code — only add comments.

CODE (${language}):
\`\`\`
${code}
\`\`\`

Commented ${language} code (output ONLY the code with comments, nothing else):`;
}

// ─── Language Detection Prompt ───────────────────────────────────────────────
export function buildDetectionPrompt(code: string): string {
  return `Identify the programming language of the following code snippet.
Respond with ONLY the language name in lowercase from this exact list:
python, javascript, typescript, java, cpp, c, go, rust, php, ruby, swift, kotlin, bash, sql

If you are unsure, respond with the closest match.
Do NOT output anything else — no explanation, no punctuation, just the single word.

CODE:
\`\`\`
${code}
\`\`\`

Language:`;
}
