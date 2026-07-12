import { JobSkeletonGrid } from "@/components/jobs/JobSkeleton";

export default function JobsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-white/10" />
      <div className="mb-6 h-24 animate-pulse rounded-2xl bg-white/5" />
      <JobSkeletonGrid count={8} />
    </div>
  );
}
