import {
  Bookmark,
  Briefcase,
  ChartColumnIncreasing,
  FileText,
  LayoutDashboard,
  PlusCircle,
  UserRound,
  Users,
} from "lucide-react";
import type { UserRole } from "@/types";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
  exact?: boolean;
};

export type DashboardNavSection = {
  id: string;
  title?: string;
  items: DashboardNavItem[];
};

/**
 * All authenticated app pages live under /dashboard/*
 * Public-only outside: Home, Explore Jobs, Login/Register, About, Contact
 */
export const dashboardSections: DashboardNavSection[] = [
  {
    id: "main",
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        roles: ["user", "admin"],
        exact: true,
      },
    ],
  },
  {
    id: "seeker",
    title: "Job seeker",
    items: [
      {
        href: "/dashboard/applications",
        label: "My Applications",
        icon: FileText,
        roles: ["user"],
      },
      {
        href: "/dashboard/saved",
        label: "Saved Jobs",
        icon: Bookmark,
        roles: ["user"],
      },
    ],
  },
  {
    id: "hiring",
    title: "Hiring",
    items: [
      {
        href: "/dashboard/post",
        label: "Post Job",
        icon: PlusCircle,
        roles: ["admin"],
        exact: true,
      },
      {
        href: "/dashboard/manage",
        label: "Manage Jobs",
        icon: Briefcase,
        roles: ["admin"],
        exact: true,
      },
      {
        href: "/dashboard/applications",
        label: "All Applications",
        icon: FileText,
        roles: ["admin"],
      },
    ],
  },
  {
    id: "account",
    title: "Account",
    items: [
      {
        href: "/dashboard/profile",
        label: "Profile",
        icon: UserRound,
        roles: ["user", "admin"],
      },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      {
        href: "/dashboard/analytics",
        label: "Analytics",
        icon: ChartColumnIncreasing,
        roles: ["admin"],
      },
      {
        href: "/dashboard/users",
        label: "Users",
        icon: Users,
        roles: ["admin"],
      },
    ],
  },
];

export function getSectionsForRole(role: UserRole): DashboardNavSection[] {
  return dashboardSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((section) => section.items.length > 0);
}

export function getNavForRole(role: UserRole) {
  return getSectionsForRole(role).flatMap((s) => s.items);
}

export function isNavItemActive(pathname: string, item: DashboardNavItem) {
  if (item.exact || item.href === "/dashboard") {
    return pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
