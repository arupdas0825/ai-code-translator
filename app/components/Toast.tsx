"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/app/utils/helpers";

export type ToastType = "error" | "success" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

const TOAST_CONFIG = {
  error: {
    icon: AlertTriangle,
    border: "border-red-500/25",
    bg: "bg-red-500/[0.08]",
    icon_color: "text-red-400",
    text: "text-red-300/90",
    progress: "bg-red-500/40",
  },
  success: {
    icon: CheckCircle2,
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/[0.08]",
    icon_color: "text-emerald-400",
    text: "text-emerald-300/90",
    progress: "bg-emerald-500/40",
  },
  info: {
    icon: Info,
    border: "border-cyan-500/25",
    bg: "bg-cyan-500/[0.08]",
    icon_color: "text-cyan-400",
    text: "text-cyan-300/90",
    progress: "bg-cyan-500/40",
  },
};

export default function Toast({
  message,
  type = "error",
  onDismiss,
  duration = 5000,
}: ToastProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = TOAST_CONFIG[type];
  const Icon = config.icon;

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));

    // Progress bar
    const interval = setInterval(() => {
      setProgress((p) => Math.max(0, p - 100 / (duration / 100)));
    }, 100);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 shadow-lg transition-all duration-300",
        config.border,
        config.bg,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      style={{ backdropFilter: "blur(16px)", maxWidth: "420px" }}
    >
      <div className="flex items-start gap-3">
        <Icon size={16} className={cn("shrink-0 mt-0.5", config.icon_color)} />
        <p className={cn("flex-1 text-sm font-body leading-snug", config.text)}>
          {message}
        </p>
        <button
          onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
          className="shrink-0 text-white/25 hover:text-white/60 transition-colors ml-1"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06]">
        <div
          className={cn("h-full transition-all duration-100 ease-linear", config.progress)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── Toast Manager ────────────────────────────────────────────────────────────
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onDismiss={() => onDismiss(t.id)}
        />
      ))}
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, type: ToastType = "error") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
