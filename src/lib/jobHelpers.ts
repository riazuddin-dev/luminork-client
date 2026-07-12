import type { Job } from "@/types";

export function asJob(value: Job | string | null | undefined): Job | null {
  if (!value || typeof value === "string") return null;
  return value;
}
