"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types";

function sectionTitle(pathname: string, role: string) {
  if (pathname.startsWith("/dashboard/post")) return "Post Job";
  if (pathname.startsWith("/dashboard/manage")) return "Manage Jobs";
  if (pathname.startsWith("/dashboard/applications")) {
    return role === "admin" ? "All Applications" : "My Applications";
  }
  if (pathname.startsWith("/dashboard/saved")) return "Saved Jobs";
  if (pathname.startsWith("/dashboard/profile")) return "Profile";
  if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
  if (pathname.startsWith("/dashboard/users")) return "Users";
  return role === "admin" ? "Admin overview" : "My overview";
}

export function TopNavbar({
  user,
  onMenuClick,
  onLogout,
}: {
  user: User;
  onMenuClick: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const title = sectionTitle(pathname, user.role);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-slate-950/75 px-4 shadow-lg shadow-black/10 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Dashboard
          </p>
          <p className="truncate text-base font-semibold text-white">{title}</p>
        </div>

        <div className="relative ml-auto hidden max-w-md flex-1 md:block lg:ml-8">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            readOnly
            placeholder="Search jobs, applications..."
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-slate-300 outline-none transition focus:border-indigo-400/40"
            onClick={() => {
              window.location.href = "/jobs";
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/jobs"
          className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/30 hover:text-white sm:inline-flex"
        >
          Explore site
        </Link>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:text-white"
          aria-label="Notifications"
          type="button"
        >
          <Bell className="h-4 w-4" />
        </button>
        <Link
          href="/dashboard/profile"
          className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-2.5 transition hover:border-indigo-400/40 hover:bg-white/10 sm:flex"
          title="Edit profile"
        >
          <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500/40 to-cyan-500/30 text-[11px] font-bold text-indigo-50">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoURL}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(user.name)
            )}
          </span>
          <div className="pr-1 leading-tight">
            <p className="text-xs font-semibold text-white">{user.name}</p>
            <p className="text-[10px] capitalize text-slate-400">{user.role}</p>
          </div>
        </Link>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
