"use client";

import { useCallback, useRef } from "react";
import { Wand2, Trash2, Code } from "lucide-react";
import { codeStats, cn } from "@/app/utils/helpers";

interface CodeInputProps {
  value: string;
  onChange: (code: string) => void;
  onDetect?: () => void;
  isDetecting?: boolean;
  placeholder?: string;
  label?: string;
}

const SAMPLE_PYTHON = `def fibonacci(n: int) -> list[int]:
    """Return the first n Fibonacci numbers."""
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]

# Example usage
if __name__ == "__main__":
    result = fibonacci(10)
    print(f"First 10 Fibonacci numbers: {result}")`;

export default function CodeInput({
  value,
  onChange,
  onDetect,
  isDetecting = false,
  placeholder = "Paste your code here…",
  label = "Source Code",
}: CodeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stats = value ? codeStats(value) : null;

  const handleClear = useCallback(() => {
    onChange("");
    textareaRef.current?.focus();
  }, [onChange]);

  const handleSample = useCallback(() => {
    onChange(SAMPLE_PYTHON);
    textareaRef.current?.focus();
  }, [onChange]);

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Code size={15} className="text-white/40" />
          <span className="font-display text-sm font-semibold text-white/75">{label}</span>
          {stats && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/25">
              <span>{stats.lines} lines</span>
              <span className="text-white/10">·</span>
              <span>{stats.chars} chars</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Load sample */}
          <button
            onClick={handleSample}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-xs font-display font-medium text-white/35 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white/65"
          >
            <Wand2 size={11} />
            Sample
          </button>

          {/* Auto-detect */}
          {onDetect && (
            <button
              onClick={onDetect}
              disabled={!value.trim() || isDetecting}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-display font-medium transition-all duration-200",
                !value.trim() || isDetecting
                  ? "border-white/[0.05] bg-transparent text-white/20 cursor-not-allowed"
                  : "border-cyan-500/25 bg-cyan-500/8 text-cyan-400/70 hover:border-cyan-500/40 hover:bg-cyan-500/15 hover:text-cyan-400"
              )}
            >
              {isDetecting ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-cyan-400/70 animate-ping" />
                  Detecting…
                </>
              ) : (
                <>🔍 Detect</>
              )}
            </button>
          )}

          {/* Clear */}
          {value && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-xs font-display font-medium text-white/30 transition-all duration-200 hover:border-red-500/25 hover:bg-red-500/8 hover:text-red-400/70"
            >
              <Trash2 size={11} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative flex-1 overflow-hidden">
        {/* Line number column */}
        <div className="flex h-full">
          {value && (
            <div
              className="select-none overflow-hidden border-r border-white/[0.05] px-3 pt-4 pb-4 text-right font-mono text-[11px] leading-[1.75rem] text-white/12 shrink-0 min-w-[2.5rem]"
              aria-hidden="true"
            >
              {value.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="flex-1 resize-none bg-transparent px-4 py-4 font-mono text-[13px] leading-[1.75rem] text-white/80 placeholder:text-white/18 outline-none h-full overflow-auto"
            style={{ caretColor: "rgba(34,211,238,0.8)" }}
          />
        </div>

        {/* Scan overlay when empty */}
        {!value && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
            <div
              className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent"
              style={{ animation: "scanLine 5s linear infinite" }}
            />
          </div>
        )}
      </div>

      {/* Drag hint */}
      <div className="border-t border-white/[0.04] px-5 py-2 flex items-center gap-2">
        <span className="text-[10px] font-body text-white/18">
          Tip: Paste code above or click{" "}
          <span className="text-cyan-400/40 font-semibold">Sample</span> to try it out
        </span>
      </div>
    </div>
  );
}
