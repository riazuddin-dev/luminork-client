"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/ui/Spinner";
import type { UserRole } from "@/types";

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  /** If set, user must have one of these roles */
  roles?: UserRole[];
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const redirect = pathname
        ? `?redirect=${encodeURIComponent(pathname)}`
        : "";
      router.replace(`/login${redirect}`);
      return;
    }

    if (roles?.length && user && !roles.includes(user.role)) {
      // Wrong role → send to their own dashboard home
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, user, roles, router, pathname]);

  if (loading) {
    return <PageLoader message="Checking session…" className="min-h-[60vh] pt-24" />;
  }

  if (!isAuthenticated) return null;

  if (roles?.length && user && !roles.includes(user.role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 pt-24">
        <div className="max-w-md rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
          <h2 className="text-lg font-semibold text-white">Access denied</h2>
          <p className="mt-2 text-sm text-slate-300">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/** Convenience wrapper for admin-only pages */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute roles={["admin"]}>{children}</ProtectedRoute>;
}

/** Convenience wrapper for authenticated user pages (user + admin can enter shell; page content may differ) */
export function UserRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute roles={["user", "admin"]}>{children}</ProtectedRoute>;
}
