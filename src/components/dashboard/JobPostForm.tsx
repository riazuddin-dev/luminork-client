"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { JOB_CATEGORIES, JOB_TYPES } from "@/types";

export function JobPostForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    location: "",
    jobType: "Full-Time",
    category: "Engineering",
    applicationDeadline: "",
    salaryMin: "",
    salaryMax: "",
    currency: "BDT",
    company: "",
    companyLogo: "",
    images: "",
    requirements: "",
    responsibilities: "",
    hrEmail: "",
    hrName: "",
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.createJob({
        ...form,
        salaryMin: Number(form.salaryMin),
        salaryMax: Number(form.salaryMax),
        images: form.images,
        requirements: form.requirements,
        responsibilities: form.responsibilities,
      });
      toast.success("Job posted successfully");
      onSuccess?.();
      router.push("/dashboard/manage"); // stay in dashboard after publish
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Senior Product Designer"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="shortDescription">Short description *</Label>
          <Input
            id="shortDescription"
            required
            maxLength={200}
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            placeholder="One-line summary for cards (max 200 chars)"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Full description *</Label>
          <Textarea
            id="description"
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Detailed overview of the role, team, and impact..."
          />
        </div>
        <div>
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            required
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            required
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Dhaka / Remote"
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            id="category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="jobType">Job type *</Label>
          <Select
            id="jobType"
            value={form.jobType}
            onChange={(e) => update("jobType", e.target.value)}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="salaryMin">Min salary *</Label>
          <Input
            id="salaryMin"
            type="number"
            required
            min={0}
            value={form.salaryMin}
            onChange={(e) => update("salaryMin", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="salaryMax">Max salary *</Label>
          <Input
            id="salaryMax"
            type="number"
            required
            min={0}
            value={form.salaryMax}
            onChange={(e) => update("salaryMax", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="applicationDeadline">Application deadline *</Label>
          <Input
            id="applicationDeadline"
            type="date"
            required
            value={form.applicationDeadline}
            onChange={(e) => update("applicationDeadline", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="hrName">HR name</Label>
          <Input
            id="hrName"
            value={form.hrName}
            onChange={(e) => update("hrName", e.target.value)}
            placeholder="Defaults to your account name"
          />
        </div>
        <div>
          <Label htmlFor="hrEmail">HR email</Label>
          <Input
            id="hrEmail"
            type="email"
            value={form.hrEmail}
            onChange={(e) => update("hrEmail", e.target.value)}
            placeholder="Defaults to your account email"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="companyLogo">Company logo URL (optional)</Label>
          <Input
            id="companyLogo"
            value={form.companyLogo}
            onChange={(e) => update("companyLogo", e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="images">Image URLs (optional, comma-separated)</Label>
          <Input
            id="images"
            value={form.images}
            onChange={(e) => update("images", e.target.value)}
            placeholder="https://image1.jpg, https://image2.jpg"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="requirements">Requirements (comma-separated)</Label>
          <Input
            id="requirements"
            value={form.requirements}
            onChange={(e) => update("requirements", e.target.value)}
            placeholder="React, TypeScript, Figma"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="responsibilities">
            Responsibilities (comma-separated)
          </Label>
          <Input
            id="responsibilities"
            value={form.responsibilities}
            onChange={(e) => update("responsibilities", e.target.value)}
            placeholder="Ship features, Review designs, Mentor juniors"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading}>
        Submit (Add Job)
      </Button>
    </form>
  );
}
