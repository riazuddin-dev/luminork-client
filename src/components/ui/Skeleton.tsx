import { cn } from "@/lib/utils";

/** Base shimmer skeleton block */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-slate-800 via-slate-700/80 to-slate-800 bg-[length:200%_100%]",
        className
      )}
    />
  );
}

/** Dashboard stats row placeholder */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
        >
          <Skeleton className="mb-4 h-12 w-12 rounded-2xl" />
          <Skeleton className="mb-2 h-8 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Generic card list skeleton */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}
