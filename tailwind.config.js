/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        neural: {
          950: "#020408",
          900: "#040b14",
          800: "#071525",
          700: "#0d2340",
          600: "#102d52",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.08)",
          hover: "rgba(255,255,255,0.07)",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
          glow: "rgba(34,211,238,0.15)",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          glow: "rgba(167,139,250,0.15)",
        },
        emerald: {
          400: "#34d399",
          glow: "rgba(52,211,153,0.15)",
        },
      },
      backgroundImage: {
        "neural-grid":
          "radial-gradient(circle at 1px 1px, rgba(34,211,238,0.06) 1px, transparent 0)",
        "glow-cyan":
          "radial-gradient(circle at center, rgba(34,211,238,0.15) 0%, transparent 70%)",
        "glow-violet":
          "radial-gradient(circle at center, rgba(167,139,250,0.12) 0%, transparent 70%)",
      },
      backdropBlur: {
        glass: "20px",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4)",
        "glass-lg":
          "0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5)",
        "cyan-glow": "0 0 20px rgba(34,211,238,0.2), 0 0 60px rgba(34,211,238,0.08)",
        "violet-glow": "0 0 20px rgba(167,139,250,0.2), 0 0 60px rgba(167,139,250,0.08)",
        "inner-glass": "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "neural-float": "neuralFloat 8s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        neuralFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
