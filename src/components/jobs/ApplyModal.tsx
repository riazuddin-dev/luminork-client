"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { api } from "@/lib/api";
import type { Job } from "@/types";

export function ApplyModal({
  open,
  onClose,
  job,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  job: Job;
  onSuccess: () => void;
}) {
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setCoverLetter("");
      setPhone("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (coverLetter.trim().length < 20) {
      toast.error("Validation error", {
        description: "Cover letter must be at least 20 characters.",
      });
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Submitting application...", {
      description: `Applying for ${job.title}`,
    });

    try {
      await api.applyToJob({
        jobId: job._id,
        coverLetter: coverLetter.trim(),
        phone: phone.trim() || undefined,
      });
      toast.success("Application submitted!", {
        id: toastId,
        description: `Your application for ${job.title} was saved successfully.`,
      });
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Application failed", {
        id: toastId,
        description:
          err instanceof Error ? err.message : "Could not submit application.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => !loading && onClose()}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-modal-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50 sm:rounded-3xl"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="border-b border-white/10 bg-gradient-to-r from-indigo-600/30 via-slate-900 to-cyan-500/20 px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    Apply now
                  </p>
                  <h2
                    id="apply-modal-title"
                    className="mt-1 text-xl font-bold text-white"
                  >
                    {job.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {job.company} · {job.location}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !loading && onClose()}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 px-5 py-5 sm:px-6">
              <div>
                <Label htmlFor="coverLetter">Cover letter *</Label>
                <Textarea
                  id="coverLetter"
                  required
                  minLength={20}
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the hiring team why you are a great fit (min 20 characters)..."
                  className="min-h-36"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {coverLetter.trim().length}/20 minimum characters
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="min-w-36">
                  <Send className="h-4 w-4" />
                  Submit application
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
