/** Premium skeleton card matching JobCard layout */
export function JobSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/20">
      <div className="h-40 animate-pulse bg-gradient-to-br from-slate-800 to-slate-800/60" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-4 w-full animate-pulse rounded-lg bg-slate-800/90" />
        <div className="h-4 w-5/6 animate-pulse rounded-lg bg-slate-800/80" />
        <div className="mt-2 h-3 w-2/3 animate-pulse rounded-lg bg-slate-800/70" />
        <div className="h-3 w-1/2 animate-pulse rounded-lg bg-slate-800/60" />
        <div className="mt-auto h-11 w-full animate-pulse rounded-xl bg-slate-800" />
      </div>
    </div>
  );
}

export function JobSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobSkeleton key={i} />
      ))}
    </div>
  );
}
