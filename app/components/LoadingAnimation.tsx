"use client";

interface LoadingProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingAnimation({ label = "Processing…", size = "md" }: LoadingProps) {
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-3 w-3" : "h-2 w-2";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-12">
      {/* Neural network spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute h-16 w-16 rounded-full border border-cyan-500/20 animate-spin"
          style={{ borderTopColor: "rgba(34,211,238,0.6)", animationDuration: "1.2s" }}
        />
        {/* Middle ring */}
        <div className="absolute h-11 w-11 rounded-full border border-violet-500/20 animate-spin"
          style={{
            borderRightColor: "rgba(167,139,250,0.5)",
            animationDuration: "0.8s",
            animationDirection: "reverse",
          }}
        />
        {/* Center dot */}
        <div className="h-3 w-3 rounded-full bg-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
      </div>

      {/* Animated dots label */}
      <div className={`flex items-center gap-2 ${textSize} font-display font-medium text-white/50`}>
        <span>{label}</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`${dotSize} rounded-full bg-cyan-400/70 animate-bounce`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      </div>

      {/* Shimmer lines */}
      <div className="w-48 flex flex-col gap-2">
        {[100, 70, 85].map((w, i) => (
          <div
            key={i}
            className="shimmer-line h-2 rounded-full"
            style={{ width: `${w}%`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
