import type { ReactNode } from "react";
import "../styles/globals.css";

export const metadata = {
  title: "Neural Code — AI Translator & Explainer",
  description:
    "Translate, explain, and comment code across languages using local AI. No API keys. No data leaks.",
  keywords: [
    "code translator",
    "AI explainer",
    "code converter",
    "ollama",
    "LLM",
    "developer tools",
  ],
  authors: [{ name: "Neural Code Team" }],
  openGraph: {
    title: "Neural Code — AI Code Translator & Explainer",
    description: "AI-powered code translation & explanation, running locally.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#020408",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {/* Background neural orbs */}
        <div className="neural-orb-1" aria-hidden="true" />
        <div className="neural-orb-2" aria-hidden="true" />
        {/* Grid pattern overlay */}
        <div
          className="neural-grid-bg fixed inset-0 z-0 opacity-60 pointer-events-none"
          aria-hidden="true"
        />
        {/* Page content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
