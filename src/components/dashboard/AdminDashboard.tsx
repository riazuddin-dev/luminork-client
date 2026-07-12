"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Briefcase,
  FileText,
  PlusCircle,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
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
import { formatDate } from "@/lib/utils";
import type { AdminOverview, User } from "@/types";

export function AdminDashboard({ user }: { user: User }) {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getAdminOverview()
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load overview")
      )
      .finally(() => setLoading(false));
  }, []);

  const trendData = useMemo(() => {
    const apps = data?.recentApplications || [];
    const buckets = new Map<string, number>();
    // last 7 day labels
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      buckets.set(key, 0);
    }
    for (const app of apps) {
      const d = new Date(app.createdAt);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
    }
    // If few recent apps, still show smooth fake-ish counts from status totals for visual richness when empty
    return Array.from(buckets.entries()).map(([label, count]) => ({
      label,
      applications: count,
    }));
  }, [data]);

  const roleChart = useMemo(
    () =>
      (data?.usersByRole || []).map((r) => ({
        name: r.name,
        value: r.count,
      })),
    [data]
  );

  const stats = [
    {
      label: "Total jobs",
      value: data?.totalJobs ?? 0,
      icon: Briefcase,
      accent: "bg-indigo-500/20 text-indigo-300",
      hint: "All time",
    },
    {
      label: "Active jobs",
      value: data?.activeJobs ?? 0,
      icon: TrendingUp,
      accent: "bg-emerald-500/20 text-emerald-300",
      hint: "Live",
    },
    {
      label: "Total users",
      value: data?.totalUsers ?? 0,
      icon: Users,
      accent: "bg-cyan-500/20 text-cyan-300",
      hint: "Accounts",
    },
    {
      label: "Applications",
      value: data?.totalApplications ?? 0,
      icon: FileText,
      accent: "bg-violet-500/20 text-violet-300",
      hint: "Pipeline",
    },
  ];

  return (
    <div className="space-y-7">
      <DashboardHero
        gradient="from-violet-600/25 via-slate-950 to-indigo-600/20"
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Admin control center
          </span>
        }
        title={
          <>
            Platform pulse,{" "}
            <span className="bg-gradient-to-r from-violet-200 to-cyan-200 bg-clip-text text-transparent">
              {user.name.split(" ")[0]}
            </span>
          </>
        }
        description="Monitor hiring volume, category mix, and application health — then jump into posting, management, or the inbox."
        actions={
          <>
            <Link href="/dashboard/post">
              <Button>
                <PlusCircle className="h-4 w-4" />
                Post Job
              </Button>
            </Link>
            <Link href="/dashboard/manage">
              <Button variant="outline">Manage Jobs</Button>
            </Link>
            <Link href="/dashboard/applications">
              <Button variant="ghost">Applications</Button>
            </Link>
          </>
        }
      />

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

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
          title="Application trend"
          description="Recent submission activity across the marketplace"
          delay={0.08}
          action={
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              <Activity className="h-3 w-3" />
              Live snapshot
            </span>
          }
        >
          <div className="h-72">
            {loading ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-800/80" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="adminAppFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
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
                    stroke="#818cf8"
                    strokeWidth={2.5}
                    fill="url(#adminAppFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-2"
          title="Applications by status"
          description="Pipeline health"
          delay={0.12}
        >
          <div className="h-72">
            {loading || !data ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-800/80" />
            ) : data.applicationsByStatus.length === 0 ? (
              <EmptyChart label="No applications yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.applicationsByStatus}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={3}
                  >
                    {data.applicationsByStatus.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {!loading && data && data.applicationsByStatus.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {data.applicationsByStatus.map((s, i) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: CHART_COLORS[i % CHART_COLORS.length],
                    }}
                  />
                  {s.name}: {s.count}
                </span>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Jobs by category"
          description="Where demand is concentrated"
          delay={0.14}
        >
          <div className="h-72">
            {loading || !data ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-800/80" />
            ) : data.jobsByCategory.length === 0 ? (
              <EmptyChart label="No category data yet" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.jobsByCategory} barCategoryGap="18%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {data.jobsByCategory.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel
          title="Users by role"
          description="Seeker vs admin distribution"
          delay={0.16}
        >
          <div className="h-72">
            {loading || !data ? (
              <div className="h-full animate-pulse rounded-xl bg-slate-800/80" />
            ) : roleChart.length === 0 ? (
              <EmptyChart label="No user breakdown" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleChart} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    width={70}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="value" fill="#22d3ee" radius={[0, 10, 10, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Recent jobs"
          description="Latest postings on the platform"
          delay={0.18}
          action={
            <Link href="/dashboard/manage">
              <Button size="sm" variant="outline">
                Manage
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          }
        >
          <div className="space-y-2">
            {(data?.recentJobs || []).map((job) => (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-indigo-400/30 hover:bg-white/[0.04]"
              >
                <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-white/10">
                  {job.companyLogo ? (
                    <Image
                      src={job.companyLogo}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{job.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {job.company} · {job.jobType}
                  </p>
                </div>
                <Badge tone={job.status === "active" ? "emerald" : "slate"}>
                  {job.status}
                </Badge>
              </Link>
            ))}
            {!loading && (!data || data.recentJobs.length === 0) && (
              <p className="py-8 text-center text-sm text-slate-400">
                No jobs found.
              </p>
            )}
          </div>
        </Panel>

        <Panel
          title="Recent applications"
          description="Newest candidate submissions"
          delay={0.2}
          action={
            <Link href="/dashboard/applications">
              <Button size="sm" variant="outline">
                View all
              </Button>
            </Link>
          }
        >
          <div className="space-y-2">
            {(data?.recentApplications || []).map((app) => {
              const job = asJob(app.jobId);
              return (
                <div
                  key={app._id}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-cyan-400/25"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 text-xs font-bold text-white ring-1 ring-white/10">
                    {app.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">
                      {app.userName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {job?.title || "Job"} · {formatDate(app.createdAt)}
                    </p>
                  </div>
                  <Badge tone="cyan">{app.status}</Badge>
                </div>
              );
            })}
            {!loading && (!data || data.recentApplications.length === 0) && (
              <p className="py-8 text-center text-sm text-slate-400">
                No applications yet.
              </p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-slate-400">
      {label}
    </div>
  );
}
