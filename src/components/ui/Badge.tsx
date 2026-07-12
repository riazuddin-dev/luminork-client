import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "indigo",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "indigo" | "cyan" | "violet" | "slate" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    indigo: "bg-indigo-500/15 text-indigo-300 ring-indigo-400/25 shadow-[0_0_12px_-4px_rgba(99,102,241,0.5)]",
    cyan: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/25 shadow-[0_0_12px_-4px_rgba(34,211,238,0.45)]",
    violet: "bg-violet-500/15 text-violet-300 ring-violet-400/25 shadow-[0_0_12px_-4px_rgba(167,139,250,0.45)]",
    slate: "bg-slate-500/15 text-slate-300 ring-slate-400/20",
    emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/25 shadow-[0_0_12px_-4px_rgba(52,211,153,0.4)]",
    amber: "bg-amber-500/15 text-amber-300 ring-amber-400/25 shadow-[0_0_12px_-4px_rgba(251,191,36,0.35)]",
    rose: "bg-rose-500/15 text-rose-300 ring-rose-400/25 shadow-[0_0_12px_-4px_rgba(251,113,133,0.4)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize tracking-wide ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

