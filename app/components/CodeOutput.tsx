"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Download, Code2, FileText } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { copyToClipboard, downloadFile, buildFilename, codeStats, cn } from "@/app/utils/helpers";
import type { SupportedLanguage } from "@/app/utils/prompts";
import LoadingAnimation from "./LoadingAnimation";

// Custom dark theme for syntax highlighter
const neuralTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': { color: "rgba(255,255,255,0.82)", background: "transparent", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", lineHeight: "1.75" },
  'pre[class*="language-"]': { color: "rgba(255,255,255,0.82)", background: "transparent", margin: 0, padding: 0, overflow: "auto" },
  comment: { color: "rgba(255,255,255,0.25)", fontStyle: "italic" },
  prolog: { color: "rgba(255,255,255,0.25)" },
  keyword: { color: "#a78bfa" },
  operator: { color: "rgba(255,255,255,0.5)" },
  punctuation: { color: "rgba(255,255,255,0.3)" },
  string: { color: "#34d399" },
  "attr-value": { color: "#34d399" },
  number: { color: "#fb923c" },
  boolean: { color: "#fb923c" },
  function: { color: "#22d3ee" },
  "class-name": { color: "#f472b6" },
  "template-string": { color: "#34d399" },
  "tag": { color: "#f472b6" },
  "attr-name": { color: "#a78bfa" },
  builtin: { color: "#22d3ee" },
  inserted: { color: "#34d399" },
  deleted: { color: "#f87171" },
};

// Map our language keys to Prism's language identifiers
const PRISM_LANG: Record<string, string> = {
  python: "python", javascript: "javascript", typescript: "typescript",
  java: "java", cpp: "cpp", c: "c", go: "go", rust: "rust",
  php: "php", ruby: "ruby", swift: "swift", kotlin: "kotlin",
  bash: "bash", sql: "sql",
};

interface CodeOutputProps {
  content: string;
  language: SupportedLanguage | string;
  isLoading: boolean;
  action: "translated" | "explained" | "commented";
  elapsed?: number;
  model?: string;
  isMarkdown?: boolean;
  placeholder?: string;
}

export default function CodeOutput({
  content,
  language,
  isLoading,
  action,
  elapsed,
  model,
  isMarkdown = false,
  placeholder = "Output will appear here…",
}: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!content) return;
    const ok = await copyToClipboard(content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [content]);

  const handleDownload = useCallback(() => {
    if (!content) return;
    const filename = buildFilename(language, action);
    downloadFile(content, filename);
  }, [content, language, action]);

  const stats = content ? codeStats(content) : null;
  const prismLang = PRISM_LANG[language] ?? "text";

  const actionColors: Record<string, string> = {
    translated: "text-cyan-400",
    explained: "text-violet-400",
    commented: "text-emerald-400",
  };

  const actionBadgeColors: Record<string, string> = {
    translated: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    explained: "bg-violet-500/10 border-violet-500/20 text-violet-400",
    commented: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  };

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          {isMarkdown ? (
            <FileText size={15} className={actionColors[action]} />
          ) : (
            <Code2 size={15} className={actionColors[action]} />
          )}
          <span className="font-display text-sm font-semibold text-white/75">
            {action === "translated" ? "Translated Code" : action === "explained" ? "Explanation" : "Commented Code"}
          </span>
          {content && (
            <span className={cn("tag-badge border text-[10px]", actionBadgeColors[action])}>
              {action.toUpperCase()}
            </span>
          )}
        </div>

        {/* Stats & actions */}
        <div className="flex items-center gap-3">
          {stats && (
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-white/25">
              <span>{stats.lines} lines</span>
              <span className="text-white/10">·</span>
              <span>{stats.chars} chars</span>
              {elapsed && (
                <>
                  <span className="text-white/10">·</span>
                  <span className="text-cyan-400/50">{(elapsed / 1000).toFixed(1)}s</span>
                </>
              )}
            </div>
          )}

          {content && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-display font-medium transition-all duration-200",
                  copied
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white/70"
                )}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>

              <button
                onClick={handleDownload}
                title="Download file"
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs font-display font-medium text-white/40 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.07] hover:text-white/70"
              >
                <Download size={12} />
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="relative flex-1 overflow-hidden">
        {isLoading ? (
          <LoadingAnimation
            label={
              action === "translated"
                ? "Translating code…"
                : action === "explained"
                ? "Generating explanation…"
                : "Adding comments…"
            }
          />
        ) : content ? (
          <div className="h-full overflow-auto p-5">
            {isMarkdown ? (
              /* Markdown explanation rendering */
              <div className="prose-neural font-body text-sm text-white/80 leading-relaxed space-y-4">
                {content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return (
                      <h3 key={i} className="font-display font-bold text-base text-white/90 mt-6 mb-3 flex items-center gap-2">
                        {line.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (line.startsWith("# ")) {
                    return (
                      <h2 key={i} className="font-display font-bold text-lg text-white mt-6 mb-3">
                        {line.replace("# ", "")}
                      </h2>
                    );
                  }
                  if (line.startsWith("- ") || line.startsWith("• ")) {
                    return (
                      <div key={i} className="flex gap-2 text-white/70 text-sm">
                        <span className="text-cyan-400/60 mt-1 shrink-0">▸</span>
                        <span>{line.slice(2)}</span>
                      </div>
                    );
                  }
                  if (/^\d+\. /.test(line)) {
                    const num = line.match(/^(\d+)\. /)?.[1];
                    return (
                      <div key={i} className="flex gap-2 text-white/70 text-sm">
                        <span className="text-violet-400/70 font-mono text-xs mt-0.5 shrink-0 w-4">{num}.</span>
                        <span>{line.replace(/^\d+\. /, "")}</span>
                      </div>
                    );
                  }
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  return (
                    <p key={i} className="text-white/65 text-sm leading-relaxed">
                      {line.replace(/`([^`]+)`/g, (_, code) => `<code class="inline-code">${code}</code>`)}
                    </p>
                  );
                })}
              </div>
            ) : (
              /* Syntax-highlighted code rendering */
              <div className="relative">
                {/* Line numbers gutter indicator */}
                <SyntaxHighlighter
                  language={prismLang}
                  style={neuralTheme}
                  showLineNumbers
                  lineNumberStyle={{
                    color: "rgba(255,255,255,0.12)",
                    fontSize: "11px",
                    paddingRight: "16px",
                    minWidth: "2.5em",
                    userSelect: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                  customStyle={{
                    background: "transparent",
                    margin: 0,
                    padding: 0,
                    fontSize: "13px",
                    lineHeight: "1.75",
                  }}
                  wrapLongLines={false}
                >
                  {content}
                </SyntaxHighlighter>
              </div>
            )}

            {/* Model attribution */}
            {model && (
              <div className="mt-6 pt-3 border-t border-white/[0.05] flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/20">
                  Generated by
                </span>
                <span className="text-[10px] font-mono text-cyan-400/40">{model}</span>
              </div>
            )}
          </div>
        ) : (
          /* Empty placeholder */
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {isMarkdown ? (
                <FileText size={22} className="text-white/15" />
              ) : (
                <Code2 size={22} className="text-white/15" />
              )}
            </div>
            <p className="font-body text-sm text-white/25 max-w-xs">{placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
}
