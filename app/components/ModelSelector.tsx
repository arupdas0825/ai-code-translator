"use client";

import { ChevronDown, Cpu } from "lucide-react";

const RECOMMENDED_MODELS = [
  { id: "codellama", label: "CodeLlama", note: "Best for code" },
  { id: "llama3", label: "Llama 3", note: "Fast & balanced" },
  { id: "llama3.1", label: "Llama 3.1", note: "Latest" },
  { id: "mistral", label: "Mistral 7B", note: "Lightweight" },
  { id: "deepseek-coder", label: "DeepSeek Coder", note: "Code specialist" },
  { id: "phi3", label: "Phi-3", note: "Ultra-fast" },
];

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Cpu size={12} className="text-white/30" />
        <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-white/30">
          Model
        </span>
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-lg border border-white/[0.07] bg-white/[0.03] pl-3 pr-7 py-1.5 text-xs font-mono text-cyan-400/80 outline-none transition-all hover:border-white/[0.12] focus:border-cyan-500/40 cursor-pointer"
        >
          {RECOMMENDED_MODELS.map((m) => (
            <option key={m.id} value={m.id} style={{ background: "#071525", color: "rgba(255,255,255,0.8)" }}>
              {m.label} — {m.note}
            </option>
          ))}
        </select>
        <ChevronDown
          size={11}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/25"
        />
      </div>
    </div>
  );
}
