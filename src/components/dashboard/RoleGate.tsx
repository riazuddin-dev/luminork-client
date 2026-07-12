"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/Spinner";
import type { UserRole } from "@/types";

/** Blocks render + redirects if role is not allowed */
export function RoleGate({
  allow,
  children,
  fallbackHref = "/dashboard",
}: {
  allow: UserRole[];
  children: React.ReactNode;
  fallbackHref?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !allow.includes(user.role)) {
      router.replace(fallbackHref);
    }
  }, [user, loading, allow, router, fallbackHref]);

  if (loading || !user) {
    return <PageLoader message="Verifying access…" className="min-h-[40vh]" />;
  }

  if (!allow.includes(user.role)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-rose-500/30 bg-rose-500/10 px-6 py-10 text-center shadow-xl shadow-rose-950/20">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-300">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-white">Access denied</h2>
          <p className="mt-2 text-sm text-slate-300">
            This area is restricted to {allow.join(" / ")} accounts.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
