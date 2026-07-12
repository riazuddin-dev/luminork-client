"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Send,
  Star,
  Users,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Application, Job } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { JobCard } from "@/components/jobs/JobCard";
import { ApplyModal } from "@/components/jobs/ApplyModal";
import { formatDate, formatSalary } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "@/components/ui/Input";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const isOwner = useMemo(() => {
    if (!user || !job?.createdBy) return false;
    const ownerId =
      typeof job.createdBy === "object"
        ? job.createdBy._id
        : String(job.createdBy);
    return ownerId === user.id || ownerId === String(user.id);
  }, [user, job]);

  const canViewApplicants = user?.role === "admin";

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getJob(params.id);
      setJob(res.data);
      setActiveImage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  const loadApplyState = async (jobId: string) => {
    if (!isAuthenticated) {
      setAlreadyApplied(false);
      return;
    }
    try {
      const res = await api.checkMyApplication(jobId);
      setAlreadyApplied(res.data.applied);
    } catch {
      setAlreadyApplied(false);
    }
  };

  const loadApplicants = async (jobId: string) => {
    if (!canViewApplicants) return;
    setApplicantsLoading(true);
    try {
      const res = await api.getApplicationsForJob(jobId);
      setApplicants(res.data);
    } catch {
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (job?._id && isAuthenticated) {
      loadApplyState(job._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?._id, isAuthenticated]);

  useEffect(() => {
    if (job?._id && canViewApplicants) {
      loadApplicants(job._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job?._id, canViewApplicants]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.message("Login required", {
        description: "Please login to apply for this job.",
      });
      router.push(`/login?redirect=/jobs/${params.id}`);
      return;
    }
    if (user?.role === "admin") {
      toast.message("Admin account", {
        description: "Use the admin panel to manage jobs and applications.",
      });
      return;
    }
    if (isOwner) {
      toast.error("Not allowed", {
        description: "You cannot apply to your own job posting.",
      });
      return;
    }
    if (alreadyApplied) {
      toast.message("Already applied", {
        description: "You have already submitted an application for this role.",
      });
      return;
    }
    setApplyOpen(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setReviewLoading(true);
    setReviewMsg("");
    try {
      await api.addReview(job._id, { rating, comment });
      setComment("");
      setReviewMsg("Review submitted successfully.");
      toast.success("Review submitted");
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit review";
      setReviewMsg(msg);
      toast.error(msg);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 pt-28 pb-16">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/2 max-w-md" />
        <Skeleton className="h-4 w-1/3 max-w-xs" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-40 w-full lg:col-span-2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-28 text-center">
        <h1 className="text-2xl font-bold text-white">Job not found</h1>
        <p className="mt-2 text-slate-400">
          {error || "This listing may have been removed."}
        </p>
        <Link href="/jobs" className="mt-6 inline-block">
          <Button>Back to jobs</Button>
        </Link>
      </div>
    );
  }

  const gallery =
    job.images?.length > 0
      ? job.images
      : [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=700&fit=crop",
        ];

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to explore
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="relative h-64 overflow-hidden rounded-2xl border border-white/10 sm:h-80">
              <Image
                src={gallery[activeImage]}
                alt={job.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1024px) 100vw, 60vw"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${
                      activeImage === i ? "border-cyan-400" : "border-white/10"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="96px" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <div className="flex flex-wrap gap-2">
                <Badge tone="cyan">{job.jobType}</Badge>
                <Badge tone="violet">{job.category}</Badge>
                <Badge tone="emerald">{job.status}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                {job.title}
              </h1>
              <p className="mt-2 text-lg text-slate-300">{job.company}</p>
              <p className="mt-4 leading-relaxed text-slate-400">
                {job.shortDescription}
              </p>

              {/* Mobile Apply CTA */}
              <div className="mt-6 lg:hidden">
                <ApplyCta
                  alreadyApplied={alreadyApplied}
                  isOwner={isOwner}
                  onApply={handleApplyClick}
                />
              </div>
            </div>

            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <h2 className="text-xl font-semibold text-white">
                Description / Overview
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">
                {job.description}
              </p>
            </section>

            <section className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold text-white">Requirements</h2>
                <ul className="mt-3 space-y-2">
                  {job.requirements.map((item) => (
                    <li key={item} className="text-sm text-slate-300">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <h2 className="text-xl font-semibold text-white">
                  Responsibilities
                </h2>
                <ul className="mt-3 space-y-2">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="text-sm text-slate-300">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {canViewApplicants && (
              <section className="mt-6 rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                      <Users className="h-5 w-5 text-cyan-300" />
                      Applicants
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Visible to the job poster and admins only
                    </p>
                  </div>
                  <Link href="/dashboard/applications">
                    <Button size="sm" variant="outline">
                      Open applications hub
                    </Button>
                  </Link>
                </div>

                {applicantsLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 animate-pulse rounded-xl bg-slate-800"
                      />
                    ))}
                  </div>
                ) : applicants.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-slate-400">
                    No applications yet for this role.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {applicants.map((app) => (
                      <div
                        key={app._id}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-white">{app.userName}</p>
                            <p className="text-sm text-slate-400">{app.userEmail}</p>
                            {app.phone && (
                              <p className="text-sm text-slate-400">{app.phone}</p>
                            )}
                          </div>
                          <Badge tone="cyan">{app.status}</Badge>
                        </div>
                        {app.coverLetter && (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                            {app.coverLetter}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-slate-500">
                          Applied {formatDate(app.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <h2 className="text-xl font-semibold text-white">Reviews & Ratings</h2>
              <div className="mt-2 flex items-center gap-2 text-amber-300">
                <Star className="h-5 w-5 fill-amber-300" />
                <span className="text-lg font-semibold">{job.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">
                  ({job.reviewCount} review{job.reviewCount === 1 ? "" : "s"})
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {(job.reviews || []).length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No reviews yet. Be the first to share feedback.
                  </p>
                ) : (
                  job.reviews?.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-white">{review.userName}</p>
                        <p className="text-sm text-amber-300">{review.rating}/5</p>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {isAuthenticated ? (
                <form
                  onSubmit={submitReview}
                  className="mt-6 space-y-3 border-t border-white/10 pt-5"
                >
                  <h3 className="font-medium text-white">Leave a review</h3>
                  <SelectRating value={rating} onChange={setRating} />
                  <Textarea
                    required
                    minLength={10}
                    placeholder="Share your experience with this role or company..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  {reviewMsg && (
                    <p className="text-sm text-cyan-300">{reviewMsg}</p>
                  )}
                  <Button type="submit" loading={reviewLoading}>
                    Submit Review
                  </Button>
                </form>
              ) : (
                <p className="mt-5 text-sm text-slate-400">
                  <Link href="/login" className="text-cyan-300 hover:underline">
                    Login
                  </Link>{" "}
                  to leave a review.
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-indigo-950/20">
              <h2 className="text-lg font-semibold text-white">Key Information</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-cyan-300" />
                  {job.location}
                </li>
                <li className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-indigo-300" />
                  Deadline: {formatDate(job.applicationDeadline)}
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 text-violet-300" />
                  {formatSalary(
                    job.salaryRange.min,
                    job.salaryRange.max,
                    job.salaryRange.currency
                  )}
                </li>
                <li className="flex items-start gap-2">
                  <UserRound className="mt-0.5 h-4 w-4 text-cyan-300" />
                  HR: {job.hrName}
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-indigo-300" />
                  <a
                    href={`mailto:${job.hrEmail}`}
                    className="hover:text-cyan-300"
                  >
                    {job.hrEmail}
                  </a>
                </li>
              </ul>

              <div className="mt-5 hidden lg:block">
                <ApplyCta
                  alreadyApplied={alreadyApplied}
                  isOwner={isOwner}
                  onApply={handleApplyClick}
                />
              </div>

              {canViewApplicants && (
                <Link href="/dashboard/applications" className="mt-3 block">
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4" />
                    View all applications
                  </Button>
                </Link>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
              <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={job.companyLogo}
                  alt={job.company}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-center font-semibold text-white">
                {job.company}
              </p>
              <p className="mt-1 text-center text-sm text-slate-400">
                Hiring team on Luminork
              </p>
            </div>
          </aside>
        </div>

        {job.related && job.related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Related opportunities
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {job.related.map((related, i) => (
                <JobCard key={related._id} job={related} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        job={job}
        onSuccess={() => {
          setAlreadyApplied(true);
          if (canViewApplicants) loadApplicants(job._id);
        }}
      />
    </div>
  );
}

function ApplyCta({
  alreadyApplied,
  isOwner,
  onApply,
}: {
  alreadyApplied: boolean;
  isOwner: boolean;
  onApply: () => void;
}) {
  if (isOwner) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-300">
        This is your job posting
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <Button className="w-full" variant="outline" disabled>
        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
        Applied
      </Button>
    );
  }

  return (
    <Button
      onClick={onApply}
      className="w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-base shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:via-violet-400 hover:to-cyan-400"
      size="lg"
    >
      <Send className="h-4 w-4" />
      Apply Now
    </Button>
  );
}

function SelectRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 text-sm text-white outline-none"
    >
      {[5, 4, 3, 2, 1].map((n) => (
        <option key={n} value={n}>
          {n} star{n === 1 ? "" : "s"}
        </option>
      ))}
    </select>
  );
}
