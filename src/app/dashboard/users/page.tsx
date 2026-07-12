"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RoleGate } from "@/components/dashboard/RoleGate";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { api } from "@/lib/api";
import { formatDate, getInitials } from "@/lib/utils";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  photoURL?: string;
  createdAt: string;
};

function UsersContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getUsers()
      .then((res) => setUsers(res.data))
      .catch((err) =>
        toast.error(err instanceof Error ? err.message : "Failed to load users")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Manage Users
        </h1>
        <p className="mt-1 text-slate-400">
          Admin view of all registered accounts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `${users.length} accounts`}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-white/10">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={4} className="py-3">
                        <div className="h-10 animate-pulse rounded-lg bg-slate-800" />
                      </td>
                    </tr>
                  ))
                : users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-100">
                            {u.photoURL ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={u.photoURL}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(u.name)
                            )}
                          </span>
                          <span className="font-medium text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-300">{u.email}</td>
                      <td className="py-3">
                        <Badge tone={u.role === "admin" ? "violet" : "cyan"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UsersPage() {
  return (
    <RoleGate allow={["admin"]}>
      <UsersContent />
    </RoleGate>
  );
}
