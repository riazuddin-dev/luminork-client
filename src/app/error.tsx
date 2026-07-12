"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Luminork UI Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/25">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
