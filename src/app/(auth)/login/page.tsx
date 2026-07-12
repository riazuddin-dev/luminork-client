"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Validation error", {
        description: "Email and password are required.",
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Validation error", {
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Signing you in...", {
      description: "Please wait while we verify your credentials.",
    });

    try {
      await login(email.trim(), password);
      toast.success("Login successful", {
        id: toastId,
        description: "Welcome back to Luminork.",
      });

      const redirect = searchParams.get("redirect");
      const safeRedirect =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/dashboard";

      router.push(safeRedirect);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      const isNetwork =
        message.toLowerCase().includes("fetch") ||
        message.toLowerCase().includes("network") ||
        message.toLowerCase().includes("failed to fetch");

      toast.error(isNetwork ? "Network error" : "Login failed", {
        id: toastId,
        description: isNetwork
          ? "Could not reach the server. Check your connection and try again."
          : message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: "user" | "admin") => {
    if (role === "user") {
      setEmail("user@luminork.com");
      setPassword("User@12345");
      toast.message("Demo user loaded", {
        description: "Click Login to continue as Demo User.",
      });
    } else {
      setEmail("admin@luminork.com");
      setPassword("Admin@12345");
      toast.message("Demo admin loaded", {
        description: "Click Login to continue as Admin.",
      });
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 pb-16 pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),_transparent_50%)]" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-7 shadow-2xl backdrop-blur"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Login to post jobs and manage your Luminork listings.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Login
          </Button>
        </form>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={() => fillDemo("user")}>
            Demo User
          </Button>
          <Button type="button" variant="outline" onClick={() => fillDemo("admin")}>
            Demo Admin
          </Button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          New to Luminork?{" "}
          <Link href="/register" className="font-semibold text-cyan-300 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[85vh] items-center justify-center pt-28">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
