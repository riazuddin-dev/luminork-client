"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Job, Pagination } from "@/types";
import { JOB_CATEGORIES, JOB_TYPES } from "@/types";
import { JobCard } from "@/components/jobs/JobCard";
import { JobSkeletonGrid } from "@/components/jobs/JobSkeleton";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";

function JobsExplorer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "all");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minSalary, setMinSalary] = useState(searchParams.get("minSalary") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getJobs({
        search,
        category,
        jobType,
        location,
        minSalary,
        sort,
        page,
        limit: 8,
      });
      setJobs(res.data);
      setPagination(res.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, jobType, location, minSalary, sort, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (jobType !== "all") params.set("jobType", jobType);
    if (location) params.set("location", location);
    if (minSalary) params.set("minSalary", minSalary);
    if (sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `/jobs?${qs}` : "/jobs", { scroll: false });
  }, [search, category, jobType, location, minSalary, sort, page, router]);

  const onApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore"
          title="Find your next role"
          description="Search and filter verified openings with salary clarity, deadlines, and company context."
        />

        <form
          onSubmit={onApplyFilters}
          className="mb-8 grid gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:grid-cols-2 lg:grid-cols-6"
        >
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              className="pl-9"
              placeholder="Search title or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="all">All categories</option>
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select value={jobType} onChange={(e) => { setJobType(e.target.value); setPage(1); }}>
            <option value="all">All job types</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
            <option value="deadline">Deadline soon</option>
            <option value="rating">Top rated</option>
          </Select>
          <Input
            type="number"
            min={0}
            placeholder="Min salary"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <div className="sm:col-span-2 lg:col-span-6">
            <Button type="submit">Apply Filters</Button>
          </div>
        </form>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {loading ? (
          <JobSkeletonGrid count={8} />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs matched"
            description="Try adjusting your search keywords or filter combinations."
            actionLabel="Clear filters"
            actionHref="/jobs"
            className="py-16"
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-400">
              Showing {jobs.length} of {pagination?.total ?? jobs.length} roles
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {jobs.map((job, i) => (
                <JobCard key={job._id} job={job} index={i} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 pb-16">
          <div className="mx-auto max-w-7xl px-4">
            <JobSkeletonGrid count={8} />
          </div>
        </div>
      }
    >
      <JobsExplorer />
    </Suspense>
  );
}
