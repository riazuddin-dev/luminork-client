"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

/**
 * Premium loading spinner (lucide-react).
 * Use for buttons, inline waits, and page loaders.
 */
export function Spinner({
  size = "md",
  className,
  label = "Loading",
}: {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}) {
  return (
    <Loader2
      className={cn(
        "animate-spin text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.45)]",
        sizeMap[size],
        className
      )}
      aria-label={label}
      role="status"
    />
  );
}

/** Full-area centered spinner with optional message */
export function PageLoader({
  message = "Loading…",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-4",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
        <span className="absolute inset-2 rounded-full border border-white/10 bg-slate-900/80" />
        <Spinner size="lg" className="relative" />
      </div>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}

/** Semi-transparent overlay while a request is in flight */
export function LoadingOverlay({
  show,
  message = "Please wait…",
}: {
  show: boolean;
  message?: string;
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 px-8 py-6 shadow-2xl">
        <Spinner size="lg" />
        <p className="text-sm text-slate-300">{message}</p>
      </div>
    </div>
  );
}
