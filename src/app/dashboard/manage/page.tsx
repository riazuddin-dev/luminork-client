"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/RoleGate";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { api } from "@/lib/api";
import { formatDate, formatSalary } from "@/lib/utils";
import type { Job } from "@/types";

function ManageJobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Job | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .getMyJobs()
      .then((res) => setJobs(res.data))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.deleteJob(pendingDelete._id);
      toast.success("Job deleted", {
        description: `"${pendingDelete.title}" was removed permanently.`,
      });
      setJobs((prev) => prev.filter((j) => j._id !== pendingDelete._id));
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Manage Jobs
          </h1>
          <p className="mt-1 text-slate-400">
            View, open, or remove listings you have published.
          </p>
        </div>
        <Link href="/dashboard/post">
          <Button>Post Job</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your listings</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${jobs.length} jobs`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-slate-800"
              />
            ))
          ) : jobs.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-slate-400">No jobs posted yet.</p>
              <Link href="/dashboard/post" className="mt-4 inline-block">
                <Button>Create first post</Button>
              </Link>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-slate-800">
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
                  <div>
                    <p className="font-medium text-white">{job.title}</p>
                    <p className="text-sm text-slate-400">
                      {job.company} · {formatDate(job.applicationDeadline)}
                    </p>
                    <p className="text-xs text-indigo-200">
                      {formatSalary(
                        job.salaryRange.min,
                        job.salaryRange.max,
                        job.salaryRange.currency
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={job.status === "active" ? "emerald" : "slate"}>
                    {job.status}
                  </Badge>
                  <Link href={`/jobs/${job._id}`}>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                    onClick={() => setPendingDelete(job)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        open={!!pendingDelete}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this job?"
        description="This listing and its application links will be permanently removed. Candidates will no longer see this role."
        highlight={pendingDelete?.title}
        confirmLabel="Yes, delete job"
        cancelLabel="Keep job"
        tone="danger"
      />
    </div>
  );
}

export default function DashboardManageJobsPage() {
  return (
    <RoleGate allow={["admin"]}>
      <ManageJobsContent />
    </RoleGate>
  );
}
