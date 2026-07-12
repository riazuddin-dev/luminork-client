import type {
  AdminOverview,
  ApiResponse,
  Application,
  Job,
  JobQuery,
  JobStats,
  SavedJobItem,
  User,
} from "@/types";
import { API_BASE_URL } from "@/lib/config";

/** Public API base (always includes /api, no trailing slash). */
export function getApiUrl(): string {
  return API_BASE_URL;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("luminork_token");
}

function buildUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path), {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Network error: could not reach the Luminork API. Check your connection or try again later."
    );
  }

  let data: ApiResponse<T> & { message?: string; code?: string };
  try {
    data = await res.json();
  } catch {
    throw new Error(
      res.ok
        ? "Invalid response from server"
        : `Request failed (${res.status})`
    );
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  /** Expose base URL for diagnostics / settings UI */
  getBaseUrl: getApiUrl,

  register: (body: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => request<User>("/auth/me", {}, true),

  updateProfile: (body: {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    photoURL?: string;
  }) =>
    request<{ token: string; user: User }>(
      "/auth/profile",
      { method: "PATCH", body: JSON.stringify(body) },
      true
    ),

  changePassword: (body: {
    currentPassword: string;
    newPassword: string;
    confirmPassword?: string;
  }) =>
    request<null>(
      "/auth/password",
      { method: "PATCH", body: JSON.stringify(body) },
      true
    ),

  getJobs: (query: JobQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== "all") {
        params.set(key, String(value));
      }
    });
    const qs = params.toString();
    return request<Job[]>(`/jobs${qs ? `?${qs}` : ""}`);
  },

  getJob: (id: string) => request<Job>(`/jobs/${id}`),

  getStats: () => request<JobStats>("/jobs/stats/overview"),

  getMyJobs: () => request<Job[]>("/jobs/manage/mine", {}, true),

  createJob: (body: Record<string, unknown>) =>
    request<Job>(
      "/jobs",
      { method: "POST", body: JSON.stringify(body) },
      true
    ),

  updateJob: (id: string, body: Record<string, unknown>) =>
    request<Job>(
      `/jobs/${id}`,
      { method: "PUT", body: JSON.stringify(body) },
      true
    ),

  deleteJob: (id: string) =>
    request<{ message?: string }>(
      `/jobs/${id}`,
      { method: "DELETE" },
      true
    ),

  addReview: (id: string, body: { rating: number; comment: string }) =>
    request(
      `/jobs/${id}/reviews`,
      { method: "POST", body: JSON.stringify(body) },
      true
    ),

  applyToJob: (body: {
    jobId: string;
    coverLetter: string;
    phone?: string;
    resumeUrl?: string;
  }) =>
    request<Application>(
      "/applications",
      { method: "POST", body: JSON.stringify(body) },
      true
    ),

  getMyApplications: () =>
    request<Application[]>("/applications/me", {}, true),

  getInboxApplications: () =>
    request<Application[]>("/applications/inbox", {}, true),

  getAllApplications: () =>
    request<Application[]>("/applications/inbox", {}, true),

  getApplicationsForJob: (jobId: string) =>
    request<Application[]>(`/applications/job/${jobId}`, {}, true),

  checkMyApplication: (jobId: string) =>
    request<{ applied: boolean; application: Application | null }>(
      `/applications/check/${jobId}`,
      {},
      true
    ),

  updateApplicationStatus: (id: string, status: string) =>
    request<Application>(
      `/applications/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      true
    ),

  withdrawApplication: (id: string) =>
    request(`/applications/${id}`, { method: "DELETE" }, true),

  getSavedJobs: () => request<SavedJobItem[]>("/saved-jobs", {}, true),

  saveJob: (jobId: string) =>
    request<SavedJobItem>(
      "/saved-jobs",
      { method: "POST", body: JSON.stringify({ jobId }) },
      true
    ),

  unsaveJob: (jobId: string) =>
    request(`/saved-jobs/${jobId}`, { method: "DELETE" }, true),

  getAdminOverview: () =>
    request<AdminOverview>("/admin/overview", {}, true),

  getUsers: () =>
    request<
      {
        id: string;
        name: string;
        email: string;
        role: string;
        photoURL?: string;
        createdAt: string;
      }[]
    >("/admin/users", {}, true),
};
