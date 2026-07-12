"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChartColumnIncreasing,
  Filter,
  Headphones,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Job, JobStats } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { JobCard } from "@/components/jobs/JobCard";
import { JobSkeletonGrid } from "@/components/jobs/JobSkeleton";
import { Badge } from "@/components/ui/Badge";

const features = [
  {
    icon: Search,
    title: "Precision search",
    description:
      "Find roles by title, company, category, salary band, and work model in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Verified listings",
    description:
      "Every opportunity includes salary context, deadlines, and hiring contact details.",
  },
  {
    icon: Rocket,
    title: "Fast posting",
    description:
      "Employers publish polished openings with media, requirements, and clear compensation.",
  },
  {
    icon: Filter,
    title: "Smart filters",
    description:
      "Sort by newest, salary, rating, or deadline and narrow results with multi-field filters.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Market insights",
    description:
      "Visual charts surface category demand and hiring trends so you can plan with confidence.",
  },
  {
    icon: Headphones,
    title: "Human support",
    description:
      "Need help? Reach the Luminork team through our contact channels for guided onboarding.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your account",
    text: "Register in under a minute and unlock posting, management, and personalized browsing.",
  },
  {
    step: "02",
    title: "Explore or publish",
    text: "Browse curated openings or post a role with salary, media, and structured requirements.",
  },
  {
    step: "03",
    title: "Manage with clarity",
    text: "Track your listings, update details, and keep your hiring pipeline organized.",
  },
];

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "Frontend Engineer",
    quote:
      "Luminork made my job search feel premium. Filters were accurate and every listing had the details I actually needed.",
    rating: 5,
  },
  {
    name: "Imran Hossain",
    role: "Talent Lead, Designify",
    quote:
      "We posted two design roles and received higher-quality applications within the first week. The workflow is clean and fast.",
    rating: 5,
  },
  {
    name: "Nusrat Jahan",
    role: "Product Designer",
    quote:
      "The interface is stunning and the job cards are consistent. I shortlisted roles in minutes instead of hours.",
    rating: 4,
  },
];

const faqs = [
  {
    q: "Is Luminork free for candidates?",
    a: "Yes. Exploring jobs, viewing details, and creating an account are free for candidates.",
  },
  {
    q: "Who can post jobs?",
    a: "Any registered user can post and manage job listings. Admins can manage all listings across the platform.",
  },
  {
    q: "Can I filter by salary and category?",
    a: "Absolutely. The explore page supports search, category, job type, location, salary range, sorting, and pagination.",
  },
  {
    q: "Are demo credentials available?",
    a: "Yes. Use user@luminork.com / User@12345 or admin@luminork.com / Admin@12345 from the login page.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Luminork"
          title="A career platform designed for clarity and speed"
          description="Every surface is crafted for professional hiring — from search precision to premium presentation."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoriesSection({ stats }: { stats: JobStats | null }) {
  const categories =
    stats?.categories?.length
      ? stats.categories
      : [
          { name: "Engineering", count: 3 },
          { name: "Design", count: 1 },
          { name: "Marketing", count: 2 },
          { name: "Data Science", count: 1 },
          { name: "Product", count: 1 },
          { name: "Management", count: 1 },
        ];

  return (
    <section className="section-pad border-y border-white/5 bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categories"
          title="Explore opportunities by specialty"
          description="Browse active openings across the disciplines shaping modern product teams."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Link key={cat.name} href={`/jobs?category=${encodeURIComponent(cat.name)}`}>
              <motion.div
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-5 transition hover:border-cyan-400/30"
              >
                <div>
                  <h3 className="font-semibold text-white">{cat.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {cat.count} open role{cat.count === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="rounded-xl bg-cyan-500/10 p-2 text-cyan-300">
                  <Target className="h-5 w-5" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HotJobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getJobs({ limit: 8, sort: "rating" })
      .then((res) => setJobs(res.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            className="mb-0"
            eyebrow="Featured openings"
            title="Hot jobs worth your attention"
            description="High-rated roles with clear compensation and application deadlines."
          />
          <Link href="/jobs">
            <Button variant="outline">
              View all jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {loading ? (
          <JobSkeletonGrid count={8} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jobs.map((job, i) => (
              <JobCard key={job._id} job={job} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function StatsSection({ stats }: { stats: JobStats | null }) {
  const cards = [
    {
      label: "Active roles",
      value: stats?.activeJobs ?? "—",
      icon: BriefcaseIcon,
    },
    {
      label: "Total listings",
      value: stats?.totalJobs ?? "—",
      icon: Building2,
    },
    {
      label: "Avg salary band",
      value: stats
        ? `${Math.round(stats.averageSalary.min / 1000)}k–${Math.round(stats.averageSalary.max / 1000)}k`
        : "—",
      icon: Zap,
    },
    {
      label: "Categories",
      value: stats?.categories?.length ?? "—",
      icon: Sparkles,
    },
  ];

  const chartData =
    stats?.jobTypes?.map((t) => ({ name: t.name, roles: t.count })) || [
      { name: "Hybrid", roles: 3 },
      { name: "Remote", roles: 3 },
      { name: "Full-Time", roles: 3 },
    ];

  return (
    <section className="section-pad border-y border-white/5 bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Statistics"
          title="Hiring signals at a glance"
          description="Live aggregates from the Luminork job database help you understand where demand is strongest."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="mt-1 text-sm text-slate-400">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/50 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Roles by work model</h3>
            <Badge tone="violet">Recharts</Badge>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="roles" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function HowItWorksSection() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from curiosity to clarity"
          description="Whether you are hiring or exploring, Luminork keeps the path simple and intentional."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 p-6"
            >
              <p className="text-4xl font-black text-indigo-500/30">{item.step}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-pad border-y border-white/5 bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by candidates and hiring teams"
          description="Real feedback from people using Luminork to find roles and fill them."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-slate-950/50 p-6"
            >
              <div className="mb-4 flex gap-1 text-amber-300">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-amber-300" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-slate-300">“{t.quote}”</p>
              <footer className="mt-5 border-t border-white/10 pt-4">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-slate-400">{t.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-indigo-600/30 via-slate-900 to-cyan-500/10 p-8 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge tone="cyan">Newsletter</Badge>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                Get weekly roles that match your ambition
              </h2>
              <p className="mt-3 max-w-lg text-slate-300">
                Curated openings, salary trends, and hiring tips — delivered without the noise.
              </p>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-12 flex-1 rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none focus:border-cyan-400/50"
              />
              <Button type="submit" size="lg">
                Subscribe
              </Button>
            </form>
            {done && (
              <p className="text-sm text-emerald-300 lg:col-span-2">
                Thanks! You are on the list for Luminork career updates.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section-pad border-y border-white/5 bg-slate-900/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Answers before you dive in"
          description="Quick clarity on how Luminork works for candidates and hiring teams."
        />
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-white/10 bg-slate-950/50"
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="font-medium text-white">{item.q}</span>
                  <BadgeCheck
                    className={`h-5 w-5 shrink-0 transition ${
                      isOpen ? "text-cyan-300" : "text-slate-500"
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="border-t border-white/10 px-5 py-4 text-sm leading-relaxed text-slate-400">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 px-6 py-12 text-center sm:px-10">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to move your career forward?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Explore open roles today or create an account to post jobs, manage listings, and
            join the Luminork talent network.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/jobs">
              <Button size="lg">Browse Jobs</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
