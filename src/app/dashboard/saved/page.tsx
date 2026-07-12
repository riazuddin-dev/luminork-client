"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { api } from "@/lib/api";
import { asJob } from "@/lib/jobHelpers";
import { formatSalary } from "@/lib/utils";
import type { SavedJobItem } from "@/types";

function SavedJobsContent() {
  const [items, setItems] = useState<SavedJobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getSavedJobs()
      .then((res) => setItems(res.data))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load saved jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  const remove = async (jobId: string) => {
    try {
      await api.unsaveJob(jobId);
      setItems((prev) =>
        prev.filter((item) => {
          const job = asJob(item.jobId);
          return job?._id !== jobId;
        })
      );
      toast.success("Removed from saved jobs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Saved Jobs</h1>
        <p className="mt-1 text-slate-400">
          Roles you bookmarked while exploring the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookmarks</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${items.length} saved`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-xl bg-slate-800" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-400">No saved jobs yet.</p>
              <Link href="/jobs" className="mt-4 inline-block">
                <Button>Explore jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => {
                const job = asJob(item.jobId);
                if (!job) return null;
                return (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl">
                        <Image
                          src={job.companyLogo}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{job.title}</p>
                        <p className="text-xs text-slate-400">{job.company}</p>
                      </div>
                    </div>
                    <p className="text-sm text-indigo-200">
                      {formatSalary(
                        job.salaryRange.min,
                        job.salaryRange.max,
                        job.salaryRange.currency
                      )}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/jobs/${job._id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => remove(job._id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SavedJobsPage() {
  return (
    <RoleGate allow={["user"]}>
      <SavedJobsContent />
    </RoleGate>
  );
}
