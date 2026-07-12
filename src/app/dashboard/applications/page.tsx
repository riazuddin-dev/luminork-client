"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  FileText,
  Mail,
  Phone,
  Search,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/RoleGate";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { ApplicationStatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { asJob } from "@/lib/jobHelpers";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/types";

/** Job seeker: personal application list */
function MyApplicationsContent() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMyApplications()
      .then((res) => setItems(res.data))
      .catch((err) =>
        toast.error(
          err instanceof Error ? err.message : "Failed to load applications"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const onWithdraw = async (id: string) => {
    try {
      await api.withdrawApplication(id);
      toast.success("Application withdrawn");
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to withdraw");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          My Applications
        </h1>
        <p className="mt-1 text-slate-400">
          Track every role you have applied for. Only you can see this list.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your applications</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${items.length} total`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <ListSkeleton rows={4} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No applications yet"
              description="Explore open roles and apply — your submissions will show up here."
              actionLabel="Explore jobs"
              actionHref="/jobs"
            />
          ) : (
            items.map((app) => {
              const job = asJob(app.jobId);
              return (
                <div
                  key={app._id}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/10 bg-slate-800">
                      {job?.companyLogo && (
                        <Image
                          src={job.companyLogo}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {job?.title || "Job listing"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {job?.company || "Company"} · {formatDate(app.createdAt)}
                      </p>
                      {app.phone && (
                        <p className="text-xs text-slate-500">{app.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ApplicationStatusBadge status={app.status} />
                    {job?._id && (
                      <Link href={`/jobs/${job._id}`}>
                        <Button size="sm" variant="outline">
                          View job
                        </Button>
                      </Link>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onWithdraw(app._id)}
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Admin: full hiring inbox */
function AdminApplicationsContent() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getInboxApplications();
      setItems(res.data);
      if (res.data.length > 0) setSelected(res.data[0]);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load applications"
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((app) => {
      const job = asJob(app.jobId);
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        app.userName.toLowerCase().includes(q) ||
        app.userEmail.toLowerCase().includes(q) ||
        (app.phone || "").toLowerCase().includes(q) ||
        (job?.title || "").toLowerCase().includes(q) ||
        (job?.company || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const onStatus = async (id: string, status: string) => {
    try {
      await api.updateApplicationStatus(id, status);
      toast.success("Status updated");
      setItems((prev) =>
        prev.map((i) =>
          i._id === id ? { ...i, status: status as Application["status"] } : i
        )
      );
      setSelected((prev) =>
        prev && prev._id === id
          ? { ...prev, status: status as Application["status"] }
          : prev
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Hiring inbox
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            All applications
          </h1>
          <p className="mt-1 max-w-2xl text-slate-400">
            Admin view: every application across all jobs on Luminork.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/manage">
            <Button variant="outline">Manage jobs</Button>
          </Link>
          <Link href="/dashboard/post">
            <Button>Post a job</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:grid-cols-[1fr_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            className="pl-9"
            placeholder="Search name, email, phone, job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          {["pending", "reviewed", "shortlisted", "rejected", "hired"].map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="h-96 animate-pulse rounded-2xl bg-slate-800" />
          <div className="h-96 animate-pulse rounded-2xl bg-slate-800" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-500" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              No applications yet
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              When candidates apply to any job, they will appear here.
            </p>
            <Link href="/jobs" className="mt-5 inline-block">
              <Button>Browse jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader>
              <CardTitle>Applicant list</CardTitle>
              <CardDescription>
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[70vh] space-y-3 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">
                  No applicants match your filters.
                </p>
              ) : (
                filtered.map((app) => {
                  const job = asJob(app.jobId);
                  const active = selected?._id === app._id;
                  return (
                    <button
                      key={app._id}
                      type="button"
                      onClick={() => setSelected(app)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-cyan-400/40 bg-cyan-500/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">
                            {app.userName}
                          </p>
                          <p className="truncate text-sm text-slate-400">
                            {job?.title || "Job"} · {job?.company || ""}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(app.createdAt)}
                          </p>
                        </div>
                        <ApplicationStatusBadge status={app.status} />
                      </div>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="lg:sticky lg:top-24 lg:self-start">
            <CardHeader>
              <CardTitle>Applicant details</CardTitle>
              <CardDescription>
                Name, email, phone, cover letter, and date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selected ? (
                <p className="text-sm text-slate-400">
                  Select an applicant to view details.
                </p>
              ) : (
                <div className="space-y-5">
                  {(() => {
                    const job = asJob(selected.jobId);
                    return (
                      <>
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200">
                            <UserRound className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {selected.userName}
                            </h3>
                            <div className="mt-1">
                              <ApplicationStatusBadge status={selected.status} />
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <Detail
                            icon={Mail}
                            label="Email"
                            value={selected.userEmail}
                            href={`mailto:${selected.userEmail}`}
                          />
                          <Detail
                            icon={Phone}
                            label="Phone"
                            value={selected.phone || "Not provided"}
                            href={
                              selected.phone
                                ? `tel:${selected.phone}`
                                : undefined
                            }
                          />
                          <Detail
                            icon={Calendar}
                            label="Applied on"
                            value={formatDate(selected.createdAt)}
                          />
                          <Detail
                            icon={FileText}
                            label="Job"
                            value={job?.title || "Unknown role"}
                          />
                        </div>

                        {job && (
                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                            <div className="relative h-11 w-11 overflow-hidden rounded-xl">
                              <Image
                                src={job.companyLogo}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-white">
                                {job.title}
                              </p>
                              <p className="truncate text-sm text-slate-400">
                                {job.company} · {job.location}
                              </p>
                            </div>
                            <Link href={`/jobs/${job._id}`}>
                              <Button size="sm" variant="outline">
                                Open job
                              </Button>
                            </Link>
                          </div>
                        )}

                        <div>
                          <p className="mb-2 text-sm font-medium text-slate-300">
                            Cover letter
                          </p>
                          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                            {selected.coverLetter ||
                              "No cover letter provided."}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-sm font-medium text-slate-300">
                            Update status
                          </p>
                          <Select
                            value={selected.status}
                            onChange={(e) =>
                              onStatus(selected._id, e.target.value)
                            }
                          >
                            {[
                              "pending",
                              "reviewed",
                              "shortlisted",
                              "rejected",
                              "hired",
                            ].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5 text-cyan-300" />
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium text-white">{value}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="transition hover:opacity-90">
        {content}
      </a>
    );
  }
  return content;
}

function DashboardApplicationsBody() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
      </div>
    );
  }

  if (user.role === "admin") {
    return <AdminApplicationsContent />;
  }

  return <MyApplicationsContent />;
}

export default function DashboardApplicationsPage() {
  return (
    <RoleGate allow={["user", "admin"]}>
      <DashboardApplicationsBody />
    </RoleGate>
  );
}
