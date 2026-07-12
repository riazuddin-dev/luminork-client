"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

/**
 * Global providers: auth context + premium toast notifications.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand
        visibleToasts={5}
        duration={3800}
        gap={10}
        offset={16}
        toastOptions={{
          classNames: {
            toast:
              "group border border-white/10 bg-slate-900/95 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl rounded-2xl",
            title: "text-white font-semibold tracking-tight",
            description: "text-slate-300 text-sm",
            actionButton:
              "bg-indigo-500 text-white hover:bg-indigo-400 rounded-lg",
            cancelButton: "bg-white/10 text-slate-200 rounded-lg",
            closeButton:
              "border border-white/10 bg-slate-800 text-slate-300 hover:bg-slate-700",
            success: "border-emerald-400/30 !bg-slate-900/95",
            error: "border-rose-400/35 !bg-slate-900/95",
            warning: "border-amber-400/30 !bg-slate-900/95",
            info: "border-cyan-400/30 !bg-slate-900/95",
            loading: "border-indigo-400/35 !bg-slate-900/95",
          },
        }}
      />
    </AuthProvider>
  );
}
