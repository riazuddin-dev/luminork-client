"use client";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { useAuth } from "@/context/AuthContext";

/**
 * Role-split overview:
 * - admin → full platform control dashboard
 * - user  → personal applications / saved jobs dashboard
 */
export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "admin") {
    return <AdminDashboard user={user} />;
  }

  return <UserDashboard user={user} />;
}
