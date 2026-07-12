"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import {
  getSectionsForRole,
  isNavItemActive,
} from "@/components/dashboard/nav-config";
import { cn, getInitials } from "@/lib/utils";
import type { User } from "@/types";

export function Sidebar({
  user,
  open,
  onClose,
}: {
  user: User;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const sections = getSectionsForRole(user.role);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={onClose}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">
              Lumin<span className="text-cyan-300">ork</span>
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
              {user.role === "admin" ? "Admin" : "Workspace"}
            </p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="rounded-xl border border-white/10 p-1.5 text-slate-300 transition hover:bg-white/5 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.id}>
            {section.title ? (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {section.title}
              </p>
            ) : (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Navigation
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isNavItemActive(pathname, item);
                return (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200",
                      active
                        ? "bg-gradient-to-r from-indigo-500/25 to-cyan-500/10 text-white shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-400/30"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition",
                        active
                          ? "bg-white/10 text-cyan-300"
                          : "bg-white/[0.03] text-slate-500 group-hover:text-slate-300"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/dashboard/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-3 transition hover:border-indigo-400/35 hover:shadow-lg hover:shadow-indigo-950/20"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/40 to-cyan-500/30 text-xs font-bold text-indigo-50 ring-1 ring-white/10">
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
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="truncate text-xs capitalize text-slate-400">
              {user.role} · Profile
            </p>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-slate-950/90 shadow-2xl shadow-black/40 backdrop-blur-xl lg:block">
        {content}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={onClose}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-[min(20rem,88vw)] border-r border-white/10 bg-slate-950 shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
