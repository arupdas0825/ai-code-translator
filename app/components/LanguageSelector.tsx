"use client";

import { ChevronDown } from "lucide-react";
import { LANGUAGE_LABELS, type SupportedLanguage } from "@/app/utils/prompts";
import { cn } from "@/app/utils/helpers";

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
  label: string;
  includeAuto?: boolean;
  disabled?: boolean;
  accentColor?: "cyan" | "violet";
}

const ORDERED_LANGS: SupportedLanguage[] = [
  "python",
  "javascript",
  "typescript",
  "java",
  "cpp",
  "c",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "bash",
  "sql",
];

const LANG_ICONS: Partial<Record<SupportedLanguage, string>> = {
  python: "🐍",
  javascript: "⚡",
  typescript: "📘",
  java: "☕",
  cpp: "⚙️",
  c: "🔧",
  go: "🐹",
  rust: "🦀",
  php: "🐘",
  ruby: "💎",
  swift: "🍎",
  kotlin: "🎯",
  bash: "💻",
  sql: "🗄️",
  auto: "🔍",
};

export default function LanguageSelector({
  value,
  onChange,
  label,
  includeAuto = false,
  disabled = false,
  accentColor = "cyan",
}: LanguageSelectorProps) {
  const options = includeAuto
    ? (["auto", ...ORDERED_LANGS] as SupportedLanguage[])
    : ORDERED_LANGS;

  const focusClass =
    accentColor === "violet"
      ? "focus:border-violet-500/40 focus:shadow-[0_0_0_3px_rgba(167,139,250,0.08)]"
      : "focus:border-cyan-500/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08)]";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-display font-semibold uppercase tracking-widest text-white/30">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SupportedLanguage)}
          disabled={disabled}
          className={cn(
            "neural-select pr-8",
            focusClass,
            disabled && "opacity-40 cursor-not-allowed"
          )}
        >
          {options.map((lang) => (
            <option key={lang} value={lang}>
              {LANG_ICONS[lang]} {LANGUAGE_LABELS[lang]}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
        />
      </div>
    </div>
  );
}
