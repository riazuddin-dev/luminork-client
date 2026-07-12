"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Star } from "lucide-react";
import type { Job } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatSalary } from "@/lib/utils";

export function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
      whileHover={{ y: -6 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/20 backdrop-blur"
    >
      <div className="relative h-40 overflow-hidden bg-slate-800">
        <Image
          src={
            job.images?.[0] ||
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop"
          }
          alt={job.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge tone="cyan">{job.jobType}</Badge>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/20 bg-white">
            <Image
              src={job.companyLogo}
              alt={job.company}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div>
            <p className="text-xs font-medium text-white">{job.company}</p>
            <p className="text-[11px] text-slate-300">{job.category}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-white">{job.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-slate-400">
          {job.shortDescription}
        </p>

        <div className="mt-4 space-y-2 text-xs text-slate-400">
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-cyan-300" />
            <span className="line-clamp-1">{job.location}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-indigo-300" />
            Deadline {formatDate(job.applicationDeadline)}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-indigo-200">
              {formatSalary(
                job.salaryRange.min,
                job.salaryRange.max,
                job.salaryRange.currency
              )}
            </p>
            <p className="inline-flex items-center gap-1 text-amber-300">
              <Star className="h-3.5 w-3.5 fill-amber-300" />
              {job.rating.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Link href={`/jobs/${job._id}`} className="block">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
