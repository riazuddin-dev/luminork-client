"use client";

import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-white/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (!user) return null;

  return <ProfileEditForm user={user} />;
}
