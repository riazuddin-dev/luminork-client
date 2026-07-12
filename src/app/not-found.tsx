"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-slate-400">
          The page you are looking for does not exist or has moved into the
          dashboard.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button>
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline">
              <Search className="h-4 w-4" />
              Explore jobs
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
