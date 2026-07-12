"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/home/Hero";
import {
  CategoriesSection,
  CTASection,
  FAQSection,
  FeaturesSection,
  HotJobsSection,
  HowItWorksSection,
  NewsletterSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/home/HomeSections";
import { api } from "@/lib/api";
import type { JobStats } from "@/types";

export default function HomePage() {
  const [stats, setStats] = useState<JobStats | null>(null);

  useEffect(() => {
    api
      .getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  return (
    <>
      <Hero />
      <FeaturesSection />
      <CategoriesSection stats={stats} />
      <HotJobsSection />
      <StatsSection stats={stats} />
      <HowItWorksSection />
      <TestimonialsSection />
      <NewsletterSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
