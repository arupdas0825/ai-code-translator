import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LANGUAGE_EXTENSIONS, type SupportedLanguage } from "./prompts";

/** Tailwind class merger */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Download text content as a file */
export function downloadFile(
  content: string,
  filename: string,
  mimeType = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Build a sensible download filename based on language and action */
export function buildFilename(
  language: SupportedLanguage | string,
  action: "translated" | "explained" | "commented"
): string {
  const ext = LANGUAGE_EXTENSIONS[language as SupportedLanguage] ?? "txt";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `neural-code_${action}_${timestamp}.${ext}`;
}

/** Copy text to clipboard and return success boolean */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

/** Format milliseconds into a human-readable duration */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/** Count lines and characters in code */
export function codeStats(code: string): { lines: number; chars: number } {
  return {
    lines: code.split("\n").length,
    chars: code.length,
  };
}
