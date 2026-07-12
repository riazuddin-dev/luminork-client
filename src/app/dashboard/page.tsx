"use client";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { PageTransition } from "@/components/ui/PageTransition";
import { PageLoader } from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";

/**
 * Role-split overview:
 * - admin → full platform control dashboard
 * - user  → personal applications / saved jobs dashboard
 */
export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Loading your workspace…" />;
  }

  if (!user) return null;

  return (
    <PageTransition>
      {user.role === "admin" ? (
        <AdminDashboard user={user} />
      ) : (
        <UserDashboard user={user} />
      )}
    </PageTransition>
  );
}
