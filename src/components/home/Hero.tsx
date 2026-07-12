"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Briefcase, Search, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ParticleField } from "@/components/home/ParticleField";

const slides = [
  {
    eyebrow: "Career intelligence platform",
    title: "Find work that lights up your ambition",
    subtitle:
      "Discover verified roles, filter with precision, and apply to opportunities designed for modern talent.",
  },
  {
    eyebrow: "For hiring teams",
    title: "Publish premium roles in minutes",
    subtitle:
      "Post openings with rich media, salary clarity, and structured requirements that attract the right candidates.",
  },
  {
    eyebrow: "Built for momentum",
    title: "Search smarter. Decide faster.",
    subtitle:
      "Explore curated categories, compare salaries, and track the jobs that match your skills and timeline.",
  },
];

export function Hero() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4800);
    return () => clearInterval(id);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/jobs?search=${encodeURIComponent(q)}` : "/jobs");
  };

  return (
    <section className="relative flex min-h-[65vh] items-center overflow-hidden pt-20 sm:min-h-[68vh]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.35),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(34,211,238,0.18),_transparent_45%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#020617_100%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%2394a3b8\\' fill-opacity=\\'0.05\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      <ParticleField />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Trusted by modern teams across Bangladesh
          </motion.div>

          <div className="relative min-h-[220px] sm:min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.55 }}
              >
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-indigo-300">
                  {slides[index].eyebrow}
                </p>
                <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
                  <span className="bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
                    {slides[index].title}
                  </span>
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  {slides[index].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <form
            onSubmit={onSearch}
            className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-2 shadow-2xl shadow-indigo-950/40 backdrop-blur sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roles, companies, or skills..."
                className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Search Jobs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/jobs">
              <Button size="lg">
                Explore Open Roles
                <Briefcase className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Create Free Account
                <Users className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-cyan-300" : "w-3 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-indigo-500/30 via-transparent to-cyan-400/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Live market pulse</p>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                Updated today
              </span>
            </div>

            <div className="grid gap-3">
              {[
                { label: "Engineering", value: "42% demand", tone: "from-indigo-500 to-violet-500" },
                { label: "Design", value: "18% growth", tone: "from-cyan-400 to-indigo-500" },
                { label: "Remote roles", value: "31% share", tone: "from-violet-500 to-cyan-400" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-200">{item.label}</span>
                    <span className="text-cyan-300">{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${item.tone}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${70 - i * 12}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { k: "12+", v: "Featured roles" },
                { k: "10", v: "Categories" },
                { k: "4.7", v: "Avg rating" },
              ].map((stat) => (
                <div
                  key={stat.v}
                  className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-center"
                >
                  <p className="text-lg font-bold text-white">{stat.k}</p>
                  <p className="text-[11px] text-slate-400">{stat.v}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}
