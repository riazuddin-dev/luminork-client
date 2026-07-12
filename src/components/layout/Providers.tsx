"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand
        duration={3500}
        toastOptions={{
          classNames: {
            toast:
              "border border-white/10 bg-slate-900 text-slate-100 shadow-xl shadow-black/30",
            title: "text-white font-semibold",
            description: "text-slate-300",
            success: "border-emerald-500/30",
            error: "border-rose-500/30",
            loading: "border-indigo-500/30",
          },
        }}
      />
    </AuthProvider>
  );
}
