"use client";

import { useState, useCallback, useId } from "react";
import {
  ArrowRightLeft,
  BookOpen,
  MessageSquareCode,
  BrainCircuit,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "@/app/components/Header";
import CodeInput from "@/app/components/CodeInput";
import CodeOutput from "@/app/components/CodeOutput";
import LanguageSelector from "@/app/components/LanguageSelector";
import ModelSelector from "@/app/components/ModelSelector";
import HistoryPanel, { type HistoryEntry } from "@/app/components/HistoryPanel";
import LoadingAnimation from "@/app/components/LoadingAnimation";
import { ToastContainer, useToast } from "@/app/components/Toast";
import { cn } from "@/app/utils/helpers";
import type { SupportedLanguage } from "@/app/utils/prompts";

// ─── Types ────────────────────────────────────────────────────────────────────
type ActiveTab = "translate" | "explain" | "comment";

interface OutputState {
  content: string;
  isLoading: boolean;
  elapsed?: number;
  model?: string;
  action: "translated" | "explained" | "commented";
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "translate" as const,
    label: "Translate",
    icon: ArrowRightLeft,
    color: "cyan",
    description: "Convert code between languages",
  },
  {
    id: "explain" as const,
    label: "Explain",
    icon: BookOpen,
    color: "violet",
    description: "Understand what code does",
  },
  {
    id: "comment" as const,
    label: "Comment",
    icon: MessageSquareCode,
    color: "emerald",
    description: "Auto-generate inline comments",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const uid = useId();

  // ── Core state ──
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("translate");
  const [sourceLang, setSourceLang] = useState<SupportedLanguage>("python");
  const [targetLang, setTargetLang] = useState<SupportedLanguage>("javascript");
  const [model, setModel] = useState("codellama");
  const [eli5, setEli5] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // ── Output state ──
  const [output, setOutput] = useState<OutputState>({
    content: "",
    isLoading: false,
    action: "translated",
  });

  // ── Toast ──
  const { toasts, addToast, removeToast } = useToast();

  // ─── Auto-detect language ─────────────────────────────────────────────────
  const handleDetect = useCallback(async () => {
    if (!code.trim()) return;
    setIsDetecting(true);
    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, model }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSourceLang(data.language as SupportedLanguage);
      addToast(`Detected: ${data.language}`, "success");
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Detection failed", "error");
    } finally {
      setIsDetecting(false);
    }
  }, [code, model, addToast]);

  // ─── Translate ────────────────────────────────────────────────────────────
  const handleTranslate = useCallback(async () => {
    if (!code.trim()) return addToast("Please paste some code first.", "info");
    setOutput({ content: "", isLoading: true, action: "translated" });
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, sourceLang, targetLang, model }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Translation failed");
      setOutput({ content: data.result, isLoading: false, elapsed: data.elapsed, model: data.model, action: "translated" });
      addHistoryEntry("translated", data.result);
    } catch (err) {
      setOutput((p) => ({ ...p, isLoading: false }));
      addToast(err instanceof Error ? err.message : "Translation failed", "error");
    }
  }, [code, sourceLang, targetLang, model, addToast]);

  // ─── Explain ──────────────────────────────────────────────────────────────
  const handleExplain = useCallback(async () => {
    if (!code.trim()) return addToast("Please paste some code first.", "info");
    setOutput({ content: "", isLoading: true, action: "explained" });
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: sourceLang, eli5, model }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Explanation failed");
      setOutput({ content: data.result, isLoading: false, elapsed: data.elapsed, model: data.model, action: "explained" });
      addHistoryEntry("explained", data.result);
    } catch (err) {
      setOutput((p) => ({ ...p, isLoading: false }));
      addToast(err instanceof Error ? err.message : "Explanation failed", "error");
    }
  }, [code, sourceLang, eli5, model, addToast]);

  // ─── Comment ──────────────────────────────────────────────────────────────
  const handleComment = useCallback(async () => {
    if (!code.trim()) return addToast("Please paste some code first.", "info");
    setOutput({ content: "", isLoading: true, action: "commented" });
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: sourceLang, model }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Comment generation failed");
      setOutput({ content: data.result, isLoading: false, elapsed: data.elapsed, model: data.model, action: "commented" });
      addHistoryEntry("commented", data.result);
    } catch (err) {
      setOutput((p) => ({ ...p, isLoading: false }));
      addToast(err instanceof Error ? err.message : "Comment generation failed", "error");
    }
  }, [code, sourceLang, model, addToast]);

  // ─── History helpers ──────────────────────────────────────────────────────
  const addHistoryEntry = (action: HistoryEntry["action"], outputContent: string) => {
    const entry: HistoryEntry = {
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      action,
      inputCode: code,
      outputContent,
      sourceLang,
      targetLang: action === "translated" ? targetLang : undefined,
      eli5: action === "explained" ? eli5 : undefined,
    };
    setHistory((prev) => [entry, ...prev]);
  };

  const restoreFromHistory = (entry: HistoryEntry) => {
    setCode(entry.inputCode);
    setSourceLang(entry.sourceLang);
    if (entry.targetLang) setTargetLang(entry.targetLang);
    if (entry.eli5 !== undefined) setEli5(entry.eli5);
    setOutput({
      content: entry.outputContent,
      isLoading: false,
      action: entry.action,
    });
    setActiveTab(
      entry.action === "translated" ? "translate"
      : entry.action === "explained" ? "explain"
      : "comment"
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col gap-4 px-4 py-5 sm:px-6 max-w-[1600px] mx-auto w-full">

        {/* ── Hero strip ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-white leading-tight">
              AI Code{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Translator
              </span>{" "}
              &{" "}
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Explainer
              </span>
            </h2>
            <p className="mt-1 font-body text-sm text-white/35">
              Powered by Ollama · 100% local · Zero data leaks
            </p>
          </div>

          {/* Model selector */}
          <ModelSelector value={model} onChange={setModel} />
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-display font-semibold transition-all duration-200",
                  isActive
                    ? tab.color === "cyan"
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                      : tab.color === "violet"
                      ? "bg-violet-500/15 text-violet-400 border border-violet-500/25 shadow-[0_0_20px_rgba(167,139,250,0.08)]"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-[0_0_20px_rgba(52,211,153,0.08)]"
                    : "text-white/35 border border-transparent hover:text-white/60 hover:bg-white/[0.04]"
                )}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Options bar ─────────────────────────────────────────────── */}
        <div className="glass-panel px-5 py-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Language controls */}
            <div className="flex flex-1 flex-wrap items-end gap-3 min-w-0">
              <div className="min-w-[140px] flex-1 sm:max-w-[200px]">
                <LanguageSelector
                  label="Source language"
                  value={sourceLang}
                  onChange={setSourceLang}
                  includeAuto={false}
                  accentColor="cyan"
                />
              </div>

              {activeTab === "translate" && (
                <>
                  {/* Swap button */}
                  <button
                    onClick={() => {
                      if (targetLang !== "auto") {
                        setSourceLang(targetLang);
                        setTargetLang(sourceLang);
                      }
                    }}
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/35 transition-all duration-200 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                    title="Swap languages"
                  >
                    <ArrowRightLeft size={14} />
                  </button>

                  <div className="min-w-[140px] flex-1 sm:max-w-[200px]">
                    <LanguageSelector
                      label="Target language"
                      value={targetLang}
                      onChange={setTargetLang}
                      accentColor="violet"
                    />
                  </div>
                </>
              )}
            </div>

            {/* ELI5 toggle — only on explain tab */}
            {activeTab === "explain" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2">
                  <BrainCircuit size={14} className={eli5 ? "text-amber-400" : "text-white/25"} />
                  <span className={cn("text-xs font-display font-semibold", eli5 ? "text-amber-400" : "text-white/35")}>
                    Explain Like I&apos;m 10
                  </span>
                  <button
                    onClick={() => setEli5((v) => !v)}
                    role="switch"
                    aria-checked={eli5}
                    className={cn(
                      "relative ml-1 h-5 w-9 rounded-full border transition-all duration-200",
                      eli5
                        ? "border-amber-500/40 bg-amber-500/25"
                        : "border-white/[0.1] bg-white/[0.05]"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full shadow transition-all duration-200",
                        eli5
                          ? "left-[18px] bg-amber-400"
                          : "left-0.5 bg-white/30"
                      )}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Action button */}
            <button
              onClick={
                activeTab === "translate"
                  ? handleTranslate
                  : activeTab === "explain"
                  ? handleExplain
                  : handleComment
              }
              disabled={output.isLoading || !code.trim()}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2.5 font-display text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed",
                activeTab === "translate"
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/35 hover:bg-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                  : activeTab === "explain"
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/35 hover:bg-violet-500/30 shadow-[0_0_20px_rgba(167,139,250,0.1)] hover:shadow-[0_0_30px_rgba(167,139,250,0.2)]"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 hover:bg-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.1)] hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]"
              )}
            >
              {output.isLoading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  {activeTab === "translate"
                    ? "Translate Code"
                    : activeTab === "explain"
                    ? eli5
                      ? "Explain (ELI5)"
                      : "Explain Code"
                    : "Add Comments"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Split editor ────────────────────────────────────────────── */}
        <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2" style={{ minHeight: "500px" }}>
          {/* Input panel */}
          <div className="h-[500px] lg:h-auto">
            <CodeInput
              value={code}
              onChange={setCode}
              onDetect={handleDetect}
              isDetecting={isDetecting}
              label="Input Code"
              placeholder={`Paste ${currentTab.label === "Translate" ? "your source code here" : "the code you want to " + currentTab.label.toLowerCase()}…`}
            />
          </div>

          {/* Output panel */}
          <div className="h-[500px] lg:h-auto">
            <CodeOutput
              content={output.content}
              language={activeTab === "translate" ? targetLang : sourceLang}
              isLoading={output.isLoading}
              action={output.action}
              elapsed={output.elapsed}
              model={output.model}
              isMarkdown={activeTab === "explain"}
              placeholder={
                activeTab === "translate"
                  ? `Translated ${targetLang} code will appear here…`
                  : activeTab === "explain"
                  ? eli5
                    ? "A simple, child-friendly explanation will appear here…"
                    : "A clear code explanation will appear here…"
                  : "Your code with inline comments will appear here…"
              }
            />
          </div>
        </div>

        {/* ── History ─────────────────────────────────────────────────── */}
        {history.length > 0 && (
          <HistoryPanel
            entries={history}
            onSelect={restoreFromHistory}
            onClear={() => setHistory([])}
          />
        )}

        {/* ── Feature cards ────────────────────────────────────────────── */}
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: "🌐",
              title: "14 Languages",
              body: "Python, JS, TS, Java, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, Bash, SQL and more.",
              color: "cyan",
            },
            {
              icon: "🔒",
              title: "100% Local AI",
              body: "Runs entirely via Ollama on your machine. Your code never leaves your computer.",
              color: "violet",
            },
            {
              icon: "⚡",
              title: "Zero Latency",
              body: "No network round-trips to external APIs. Just fast, private AI on your own hardware.",
              color: "emerald",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="glass-panel px-5 py-4 flex items-start gap-3.5"
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base",
                  card.color === "cyan"
                    ? "border-cyan-500/20 bg-cyan-500/10"
                    : card.color === "violet"
                    ? "border-violet-500/20 bg-violet-500/10"
                    : "border-emerald-500/20 bg-emerald-500/10"
                )}
              >
                {card.icon}
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white/80">{card.title}</h3>
                <p className="mt-0.5 font-body text-xs text-white/35 leading-relaxed">{card.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <footer className="mt-2 flex items-center justify-between border-t border-white/[0.05] pt-4 pb-2">
          <p className="font-body text-xs text-white/20">
            NeuralCode · Built with Next.js + Ollama
          </p>
          <p className="font-mono text-[10px] text-white/15">
            v1.0.0 · MIT License
          </p>
        </footer>
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
