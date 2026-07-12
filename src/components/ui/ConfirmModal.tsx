"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  highlight?: string;
  tone?: "danger" | "warning";
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Delete this item?",
  description = "This action cannot be undone. The item will be permanently removed.",
  confirmLabel = "Delete permanently",
  cancelLabel = "Cancel",
  loading = false,
  highlight,
  tone = "danger",
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
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

  if (!mounted) return null;

  const iconWrap =
    tone === "danger"
      ? "from-rose-500/25 to-orange-500/10 text-rose-300 ring-rose-400/25"
      : "from-amber-500/25 to-yellow-500/10 text-amber-300 ring-amber-400/25";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[220] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            onClick={() => !loading && onClose()}
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-desc"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-white/10 bg-slate-900 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.75)] sm:rounded-3xl"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-500/15 blur-3xl" />

            <div className="relative p-6 sm:p-7">
              <button
                type="button"
                onClick={() => !loading && onClose()}
                className="absolute right-4 top-4 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </button>

              <div
                className={cn(
                  "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 shadow-lg",
                  iconWrap
                )}
              >
                <AlertTriangle className="h-7 w-7" />
              </div>

              <h2
                id="confirm-modal-title"
                className="pr-8 text-xl font-bold tracking-tight text-white"
              >
                {title}
              </h2>
              <p
                id="confirm-modal-desc"
                className="mt-2 text-sm leading-relaxed text-slate-400"
              >
                {description}
              </p>

              {highlight ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Item
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-white">
                    {highlight}
                  </p>
                </div>
              ) : null}

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="sm:min-w-[7rem]"
                >
                  {cancelLabel}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => void onConfirm()}
                  disabled={loading}
                  className="sm:min-w-[10rem]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {confirmLabel.toLowerCase().includes("delete")
                        ? "Deleting…"
                        : "Working…"}
                    </>
                  ) : (
                    confirmLabel
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
