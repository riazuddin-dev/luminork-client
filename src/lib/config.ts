/**
 * Client runtime / build-time configuration.
 * NEXT_PUBLIC_* values are inlined at build time on Vercel.
 */

const LOCAL_API = "http://localhost:5000/api";

/**
 * Normalize API base URL so callers always get `.../api` without a trailing slash.
 * Accepts either `https://host` or `https://host/api`.
 */
export function normalizeApiUrl(raw?: string | null): string {
  let url = (raw || "").trim();
  if (!url) return LOCAL_API;

  // Strip trailing slashes
  url = url.replace(/\/+$/, "");

  // If someone set only the host origin, append /api
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }

  return url;
}

/**
 * Resolved public API base used by all fetch calls.
 * Production: set NEXT_PUBLIC_API_URL in Vercel to your Render/Railway API.
 * Example: https://luminork-server.onrender.com/api
 */
export const API_BASE_URL = normalizeApiUrl(
  process.env.NEXT_PUBLIC_API_URL
);

export const IS_PROD =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

/** Site origin when deployed on Vercel (optional, for metadata) */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://luminork-client.vercel.app");
