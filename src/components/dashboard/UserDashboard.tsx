"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Clock3,
  FileText,
  MapPin,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  CHART_COLORS,
  DashboardHero,
  Panel,
  StatCard,
  chartTooltipStyle,
} from "@/components/dashboard/dashboard-ui";
import { api } from "@/lib/api";
import { asJob } from "@/lib/jobHelpers";
import { formatDate, formatSalary, getInitials } from "@/lib/utils";
import type { Application, SavedJobItem, User } from "@/types";

const statusTone: Record<
  string,
  "amber" | "cyan" | "emerald" | "slate" | "violet"
> = {
  pending: "amber",
  reviewed: "cyan",
  shortlisted: "violet",
  rejected: "slate",
  hired: "emerald",
};

export function UserDashboard({ user }: { user: User }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [saved, setSaved] = useState<SavedJobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getMyApplications(), api.getSavedJobs()])
      .then(([apps, savedJobs]) => {
        setApplications(apps.data);
        setSaved(savedJobs.data);
      })
      .catch(() => {
        setApplications([]);
        setSaved([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Applied jobs",
        value: applications.length,
        icon: FileText,
        accent: "bg-indigo-500/20 text-indigo-300",
        hint: "Total",
      },
      {
        label: "Saved jobs",
        value: saved.length,
        icon: Bookmark,
        accent: "bg-cyan-500/20 text-cyan-300",
        hint: "Bookmarks",
      },
      {
        label: "Pending",
        value: applications.filter((a) => a.status === "pending").length,
        icon: Clock3,
        accent: "bg-amber-500/20 text-amber-300",
        hint: "Waiting",
      },
      {
        label: "Shortlisted",
        value: applications.filter((a) => a.status === "shortlisted").length,
        icon: Star,
        accent: "bg-violet-500/20 text-violet-300",
        hint: "Hot",
      },
    ],
    [applications, saved]
  );

  const statusChart = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of applications) {
      map[a.status] = (map[a.status] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [applications]);

  const trendData = useMemo(() => {
    const buckets = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      buckets.set(key, 0);
    }
    for (const app of applications) {
      const key = new Date(app.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
    }
    return Array.from(buckets.entries()).map(([label, count]) => ({
      label,
      applications: count,
    }));
  }, [applications]);

  const activity = useMemo(() => {
    const appEvents = applications.slice(0, 4).map((app) => {
      const job = asJob(app.jobId);
      return {
        id: `app-${app._id}`,
        title: `Applied to ${job?.title || "a role"}`,
        meta: `${app.status} · ${formatDate(app.createdAt)}`,
      };
    });
    const saveEvents = saved.slice(0, 3).map((item) => {
      const job = asJob(item.jobId);
      return {
        id: `save-${item._id}`,
        title: `Saved ${job?.title || "a job"}`,
        meta: formatDate(item.createdAt),
      };
    });
    return [...appEvents, ...saveEvents].slice(0, 6);
  }, [applications, saved]);

  return (
    <div className="space-y-7">
      <DashboardHero
        gradient="from-indigo-600/30 via-slate-950 to-cyan-500/15"
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
            <Sparkles className="h-3.5 w-3.5" />
            Career workspace
          </span>
        }
        title={
          <>
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-cyan-200 to-indigo-200 bg-clip-text text-transparent">
              {user.name.split(" ")[0]}
            </span>
          </>
        }
        description="Track applications, watch pipeline status, and jump back into saved roles — all in one polished dashboard."
        actions={
          <>
            <Link href="/jobs">
              <Button>
                <Target className="h-4 w-4" />
                Explore jobs
              </Button>
            </Link>
            <Link href="/dashboard/applications">
              <Button variant="outline">My applications</Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button variant="ghost">Edit profile</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            index={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            accent={stat.accent}
            hint={stat.hint}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel
          className="xl:col-span-3"
          title="Application activity"
          description="Your applications over the last week"
          delay={0.08}
        >
          <div className="h-64">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-800/80" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="userAppFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="label"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#22d3ee"
                    strokeWidth={2.5}
                    fill="url(#userAppFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-2"
          title="Status mix"
          description="Where your applications stand"
          delay={0.12}
        >
          <div className="h-64">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-800/80" />
            ) : statusChart.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-400">
                Apply to roles to unlock charts
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {statusChart.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Panel
          title="My applications"
          description="Latest roles you applied to"
          delay={0.14}
          action={
            <Link href="/dashboard/applications">
              <Button size="sm" variant="outline">
                See all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          }
        >
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-slate-800/80"
                />
              ))
            ) : applications.length === 0 ? (
              <EmptyBlock
                title="No applications yet"
                href="/jobs"
                cta="Browse open roles"
              />
            ) : (
              applications.slice(0, 5).map((app) => {
                const job = asJob(app.jobId);
                return (
                  <div
                    key={app._id}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/8 bg-gradient-to-r from-white/[0.03] to-transparent p-4 transition hover:border-indigo-400/30 hover:from-indigo-500/10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-slate-800 shadow-lg">
                        {job?.companyLogo ? (
                          <Image
                            src={job.companyLogo}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {job?.title || "Job listing"}
                        </p>
                        <p className="text-sm text-slate-400">
                          {job?.company || "Company"}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                          {job?.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-3 w-3" />
                            {formatDate(app.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={statusTone[app.status] || "slate"}>
                        {app.status}
                      </Badge>
                      {job?._id && (
                        <Link href={`/jobs/${job._id}`}>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Profile" description="Your account snapshot" delay={0.16}>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-indigo-500/30 ring-2 ring-white/10">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
                <Badge className="mt-2" tone="cyan">
                  {user.role}
                </Badge>
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full">
                  Open profile
                </Button>
              </Link>
              <Link href="/dashboard/saved">
                <Button variant="ghost" className="w-full">
                  Saved jobs ({saved.length})
                </Button>
              </Link>
            </div>
          </Panel>

          <Panel
            title="Recent activity"
            description="Your latest actions"
            delay={0.18}
          >
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-xl bg-slate-800/80"
                  />
                ))
              ) : activity.length === 0 ? (
                <p className="text-sm text-slate-400">No recent activity yet.</p>
              ) : (
                activity.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3"
                  >
                    <span
                      className="mt-1 h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.meta}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </div>

      <Panel
        title="Saved jobs"
        description="Roles you bookmarked for later"
        delay={0.2}
        action={
          <Link href="/dashboard/saved">
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </Link>
        }
      >
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl bg-slate-800/80"
              />
            ))}
          </div>
        ) : saved.length === 0 ? (
          <EmptyBlock
            title="No saved jobs"
            href="/jobs"
            cta="Find roles to save"
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {saved.slice(0, 3).map((item) => {
              const job = asJob(item.jobId);
              if (!job) return null;
              return (
                <Link
                  key={item._id}
                  href={`/jobs/${job._id}`}
                  className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/35 hover:shadow-lg hover:shadow-cyan-950/30"
                >
                  <p className="font-semibold text-white group-hover:text-cyan-100">
                    {job.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{job.company}</p>
                  <p className="mt-3 text-xs font-medium text-indigo-200">
                    {formatSalary(
                      job.salaryRange.min,
                      job.salaryRange.max,
                      job.salaryRange.currency
                    )}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}

function EmptyBlock({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-12 text-center">
      <p className="text-sm text-slate-400">{title}</p>
      <Link href={href} className="mt-4 inline-block">
        <Button size="sm">{cta}</Button>
      </Link>
    </div>
  );
}
