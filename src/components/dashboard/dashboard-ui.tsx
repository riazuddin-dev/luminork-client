"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const chartTooltipStyle = {
  background: "rgba(15, 23, 42, 0.96)",
  border: "1px solid rgba(129,140,248,0.25)",
  borderRadius: 16,
  boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
  color: "#e2e8f0",
  fontSize: 12,
  padding: "10px 12px",
};

export const CHART_COLORS = [
  "#818cf8",
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#60a5fa",
  "#fb7185",
];

function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const end = Number(target) || 0;
    if (end <= 0) {
      setValue(0);
      return;
    }
    let frame = 0;
    const duration = 700;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(end * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);
  return value;
}

export function DashboardHero({
  badge,
  title,
  description,
  actions,
  gradient = "from-indigo-600/30 via-slate-900 to-cyan-500/15",
}: {
  badge?: React.ReactNode;
  title: React.ReactNode;
  description: string;
  actions?: React.ReactNode;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[1.85rem] border border-white/10 p-6 shadow-[0_30px_80px_-20px_rgba(49,46,129,0.55)] sm:p-9",
        "bg-gradient-to-br",
        gradient
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {badge}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-[2.6rem] sm:leading-tight">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-2.5">{actions}</div>
        ) : null}
      </div>
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  hint,
  index = 0,
  loading,
  delta,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
  hint?: string;
  index?: number;
  loading?: boolean;
  delta?: string;
}) {
  const numeric = typeof value === "number" ? value : Number(value);
  const canAnimate = !loading && Number.isFinite(numeric);
  const animated = useCountUp(canAnimate ? numeric : 0, canAnimate);
  const display = canAnimate ? animated : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full"
    >
      <div className="absolute -inset-px rounded-[1.2rem] bg-gradient-to-br from-indigo-400/30 via-transparent to-cyan-400/20 opacity-0 blur-sm transition duration-300 group-hover:opacity-100" />
      <div className="relative h-full overflow-hidden rounded-[1.15rem] border border-white/10 bg-slate-900/85 p-5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl transition duration-300 group-hover:-translate-y-1.5 group-hover:border-indigo-400/40 group-hover:shadow-[0_28px_60px_-20px_rgba(79,70,229,0.45)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ring-1 ring-white/10 transition group-hover:scale-105",
              accent
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {hint ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {hint}
            </span>
          ) : null}
        </div>
        <p className="mt-5 text-3xl font-bold tracking-tight text-white tabular-nums">
          {loading ? (
            <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-white/10" />
          ) : (
            display
          )}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-sm text-slate-400">{label}</p>
          {delta ? (
            <span className="text-[11px] font-medium text-emerald-300/90">
              {delta}
            </span>
          ) : null}
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full w-2/3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-70 transition duration-500 group-hover:w-full group-hover:opacity-100"
          />
        </div>
      </div>
    </motion.div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  delay = 0,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group/panel overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-900/80 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl transition duration-300 hover:border-white/18 hover:shadow-[0_28px_70px_-24px_rgba(49,46,129,0.45)]",
        className
      )}
    >
      <div className="flex flex-col gap-3 border-b border-white/5 bg-white/[0.02] p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-white">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </motion.div>
  );
}
