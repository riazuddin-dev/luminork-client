export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  phone?: string;
  bio?: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface Job {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  location: string;
  jobType: string;
  category: string;
  applicationDeadline: string;
  salaryRange: SalaryRange;
  company: string;
  companyLogo: string;
  images: string[];
  requirements: string[];
  responsibilities: string[];
  status: "active" | "closed" | "draft";
  hrEmail: string;
  hrName: string;
  rating: number;
  reviewCount: number;
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
    photoURL?: string;
  };
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
  related?: Job[];
}

export interface Review {
  _id: string;
  jobId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
}

export interface JobStats {
  totalJobs: number;
  activeJobs: number;
  categories: { name: string; count: number }[];
  jobTypes: { name: string; count: number }[];
  averageSalary: { min: number; max: number };
}

export interface JobQuery {
  search?: string;
  category?: string;
  jobType?: string;
  location?: string;
  minSalary?: string | number;
  maxSalary?: string | number;
  sort?: string;
  page?: number;
  limit?: number;
  status?: string;
}

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Finance",
  "Data Science",
  "Management",
  "Teaching",
  "Development",
  "Product",
  "Customer Success",
] as const;

export const JOB_TYPES = [
  "Full-Time",
  "Part-Time",
  "Remote",
  "Hybrid",
  "Contractual",
  "Intern",
] as const;

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface Application {
  _id: string;
  jobId: Job | string;
  userId?: string | { _id?: string; name?: string; email?: string; photoURL?: string };
  userName: string;
  userEmail: string;
  phone?: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SavedJobItem {
  _id: string;
  jobId: Job | string;
  userId: string;
  createdAt: string;
}

export interface AdminOverview {
  totalJobs: number;
  activeJobs: number;
  totalUsers: number;
  totalApplications: number;
  applicationsByStatus: { name: string; count: number }[];
  jobsByCategory: { name: string; count: number }[];
  usersByRole: { name: string; count: number }[];
  recentJobs: Job[];
  recentApplications: Application[];
}
