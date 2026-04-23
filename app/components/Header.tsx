"use client";

import { useState, useEffect, useCallback } from "react";
import { Activity, Cpu, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/app/utils/helpers";

interface HealthData {
  alive: boolean;
  models: string[];
  preferredModel: string;
  modelInstalled: boolean;
  recommendation: string;
}

export default function Header() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [showModels, setShowModels] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/health");
      const data: HealthData = await res.json();
      setHealth(data);
    } catch {
      setHealth(null);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30_000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const statusColor = health === null
    ? "text-white/30"
    : health.alive && health.modelInstalled
    ? "text-emerald-400"
    : health.alive
    ? "text-amber-400"
    : "text-red-400";

  const statusLabel = health === null
    ? "Checking…"
    : health.alive && health.modelInstalled
    ? "AI Ready"
    : health.alive
    ? "Model missing"
    : "Ollama offline";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06]"
      style={{ backdropFilter: "blur(24px)", background: "rgba(2,4,8,0.85)" }}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10">
            <Zap className="h-4.5 w-4.5 text-cyan-400" size={18} />
            <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm" />
          </div>
          <div>
            <h1 className="font-display text-base font-700 tracking-tight text-white leading-none">
              Neural<span className="text-cyan-400">Code</span>
            </h1>
            <p className="font-body text-[10px] text-white/30 tracking-widest uppercase leading-none mt-0.5">
              AI Translator · Explainer
            </p>
          </div>
        </div>

        {/* Center pills */}
        <div className="hidden md:flex items-center gap-2">
          {["Translate", "Explain", "Comment", "History"].map((tab) => (
            <span
              key={tab}
              className="px-3 py-1 rounded-lg text-xs font-display font-medium text-white/40 border border-transparent hover:text-white/70 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-150 cursor-default select-none"
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Status badge */}
        <div className="relative">
          <button
            onClick={() => setShowModels((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs font-display font-semibold transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.06]",
              statusColor
            )}
          >
            <span className="relative flex h-2 w-2">
              {health?.alive && health.modelInstalled && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              )}
              <span className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                health?.alive && health.modelInstalled ? "bg-emerald-400"
                : health?.alive ? "bg-amber-400"
                : "bg-red-400/70"
              )} />
            </span>
            <span>{statusLabel}</span>
            {health && (
              <ChevronDown size={12} className={cn("transition-transform", showModels && "rotate-180")} />
            )}
          </button>

          {showModels && health && (
            <div className="absolute right-0 top-full mt-2 w-72 glass-panel p-4 z-50">
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={14} className="text-cyan-400" />
                <span className="text-xs font-display font-semibold text-white/80">Ollama Status</span>
              </div>
              <div className="space-y-2 text-xs font-body">
                <div className="flex justify-between">
                  <span className="text-white/40">Connection</span>
                  <span className={health.alive ? "text-emerald-400" : "text-red-400"}>
                    {health.alive ? "Connected" : "Offline"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Active model</span>
                  <span className="text-cyan-400 font-mono">{health.preferredModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Model ready</span>
                  <span className={health.modelInstalled ? "text-emerald-400" : "text-amber-400"}>
                    {health.modelInstalled ? "Yes" : "Not found"}
                  </span>
                </div>
                {health.models.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06]">
                    <p className="text-white/30 mb-1.5">Installed models</p>
                    <div className="flex flex-wrap gap-1">
                      {health.models.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded-md bg-white/[0.05] text-white/60 font-mono text-[10px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!health.alive && (
                  <div className="pt-2 mt-1 rounded-lg bg-red-500/[0.08] border border-red-500/20 p-2.5 text-red-300/80">
                    {health.recommendation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </header>
  );
}
