"use client";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type AppStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired"
  | string;

type JobStatus = "active" | "closed" | "draft" | string;

const APP_STATUS: Record<
  string,
  { tone: "amber" | "cyan" | "violet" | "rose" | "emerald" | "slate"; label: string }
> = {
  pending: { tone: "amber", label: "Pending" },
  reviewed: { tone: "cyan", label: "Reviewed" },
  shortlisted: { tone: "violet", label: "Shortlisted" },
  rejected: { tone: "rose", label: "Rejected" },
  hired: { tone: "emerald", label: "Hired" },
};

const JOB_STATUS: Record<
  string,
  { tone: "emerald" | "slate" | "amber" | "rose"; label: string }
> = {
  active: { tone: "emerald", label: "Active" },
  closed: { tone: "slate", label: "Closed" },
  draft: { tone: "amber", label: "Draft" },
};

/**
 * Color-coded status pill for applications and job listings.
 */
export function ApplicationStatusBadge({
  status,
  className,
}: {
  status: AppStatus;
  className?: string;
}) {
  const meta = APP_STATUS[status] || {
    tone: "slate" as const,
    label: String(status),
  };
  return (
    <Badge tone={meta.tone} className={cn(className)}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          meta.tone === "amber" && "bg-amber-400",
          meta.tone === "cyan" && "bg-cyan-400",
          meta.tone === "violet" && "bg-violet-400",
          meta.tone === "rose" && "bg-rose-400",
          meta.tone === "emerald" && "bg-emerald-400",
          meta.tone === "slate" && "bg-slate-400"
        )}
      />
      {meta.label}
    </Badge>
  );
}

export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  const meta = JOB_STATUS[status] || {
    tone: "slate" as const,
    label: String(status),
  };
  return (
    <Badge tone={meta.tone} className={className}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          meta.tone === "emerald" && "bg-emerald-400",
          meta.tone === "slate" && "bg-slate-400",
          meta.tone === "amber" && "bg-amber-400",
          meta.tone === "rose" && "bg-rose-400"
        )}
      />
      {meta.label}
    </Badge>
  );
}
