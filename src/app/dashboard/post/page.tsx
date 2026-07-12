"use client";

import Link from "next/link";
import { JobPostForm } from "@/components/dashboard/JobPostForm";
import { RoleGate } from "@/components/dashboard/RoleGate";
import { Button } from "@/components/ui/Button";

function PostJobContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Post Job
          </h1>
          <p className="mt-1 text-slate-400">
            Create a new listing with salary, media, and requirements.
          </p>
        </div>
        <Link href="/dashboard/manage">
          <Button variant="outline">Manage Jobs</Button>
        </Link>
      </div>
      <JobPostForm />
    </div>
  );
}

export default function DashboardPostJobPage() {
  return (
    <RoleGate allow={["admin"]}>
      <PostJobContent />
    </RoleGate>
  );
}
