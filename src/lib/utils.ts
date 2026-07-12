import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatSalary(min: number, max: number, currency = "BDT") {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-BD", {
      notation: n >= 1000 ? "compact" : "standard",
      maximumFractionDigits: 1,
    }).format(n);

  return `${currency} ${fmt(min)} – ${fmt(max)}`;
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Truncate long text with ellipsis for cards and tables */
export function truncate(text: string, max = 120) {
  if (!text) return "";
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;
}
