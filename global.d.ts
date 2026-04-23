// ─── Global Type Declarations ─────────────────────────────────────────────────
// This file resolves ambient type declarations for modules that may not ship
// their own .d.ts files in every environment.

// CSS modules
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// SVG imports
declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

// Image imports
declare module "*.png" { const src: string; export default src; }
declare module "*.jpg" { const src: string; export default src; }
declare module "*.jpeg" { const src: string; export default src; }
declare module "*.webp" { const src: string; export default src; }
declare module "*.avif" { const src: string; export default src; }

// lucide-react — bundled types declaration as fallback
declare module "lucide-react" {
  import * as React from "react";
  export interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  export type LucideIcon = React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  export const Activity: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const ArrowRightLeft: LucideIcon;
  export const BookOpen: LucideIcon;
  export const BrainCircuit: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Clock: LucideIcon;
  export const Code: LucideIcon;
  export const Code2: LucideIcon;
  export const Copy: LucideIcon;
  export const Cpu: LucideIcon;
  export const Download: LucideIcon;
  export const FileText: LucideIcon;
  export const History: LucideIcon;
  export const Info: LucideIcon;
  export const MessageSquareCode: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Trash2: LucideIcon;
  export const Wand2: LucideIcon;
  export const X: LucideIcon;
  export const Zap: LucideIcon;
}
