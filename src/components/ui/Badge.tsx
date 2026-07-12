import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "indigo",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "indigo" | "cyan" | "violet" | "slate" | "emerald" | "amber";
}) {
  const tones = {
    indigo: "bg-indigo-500/15 text-indigo-300 ring-indigo-400/20",
    cyan: "bg-cyan-500/15 text-cyan-300 ring-cyan-400/20",
    violet: "bg-violet-500/15 text-violet-300 ring-violet-400/20",
    slate: "bg-slate-500/15 text-slate-300 ring-slate-400/20",
    emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
    amber: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
