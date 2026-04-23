"use client";

import { useState } from "react";
import { History, Trash2, ChevronRight, Clock } from "lucide-react";
import { cn, truncate } from "@/app/utils/helpers";
import { LANGUAGE_LABELS, type SupportedLanguage } from "@/app/utils/prompts";

export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: "translated" | "explained" | "commented";
  inputCode: string;
  outputContent: string;
  sourceLang: SupportedLanguage;
  targetLang?: SupportedLanguage;
  eli5?: boolean;
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const ACTION_STYLES = {
  translated: { dot: "bg-cyan-400", label: "Translate", color: "text-cyan-400" },
  explained: { dot: "bg-violet-400", label: "Explain", color: "text-violet-400" },
  commented: { dot: "bg-emerald-400", label: "Comment", color: "text-emerald-400" },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function HistoryPanel({ entries, onSelect, onClear }: HistoryPanelProps) {
  const [open, setOpen] = useState(false);

  if (entries.length === 0 && !open) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
      >
        <div className="flex items-center gap-2.5">
          <History size={14} className="text-white/35" />
          <span className="font-display text-sm font-semibold text-white/50">
            Query History
          </span>
          {entries.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/[0.08] px-1.5 text-[10px] font-mono font-bold text-white/50">
              {entries.length}
            </span>
          )}
        </div>
        <ChevronRight
          size={14}
          className={cn(
            "text-white/25 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </button>

      {open && (
        <div className="mt-2 glass-panel overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <span className="text-xs font-display font-semibold text-white/40">
              Recent queries
            </span>
            {entries.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 text-[11px] font-display text-white/25 hover:text-red-400/60 transition-colors"
              >
                <Trash2 size={11} />
                Clear all
              </button>
            )}
          </div>

          {/* Entries */}
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <Clock size={20} className="text-white/15" />
              <p className="text-xs font-body text-white/20">No history yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04] max-h-72 overflow-y-auto">
              {entries.slice(0, 20).map((entry) => {
                const style = ACTION_STYLES[entry.action];
                return (
                  <button
                    key={entry.id}
                    onClick={() => onSelect(entry)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-white/[0.04]"
                  >
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={cn("text-[10px] font-display font-bold tracking-wide uppercase", style.color)}>
                          {style.label}
                        </span>
                        <span className="text-[10px] font-mono text-white/25">
                          {LANGUAGE_LABELS[entry.sourceLang]}
                          {entry.targetLang && ` → ${LANGUAGE_LABELS[entry.targetLang]}`}
                        </span>
                        {entry.eli5 && (
                          <span className="text-[10px] font-display text-amber-400/60">ELI5</span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-white/35 truncate">
                        {truncate(entry.inputCode, 60)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-mono text-white/20 mt-0.5">
                      {timeAgo(entry.timestamp)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
