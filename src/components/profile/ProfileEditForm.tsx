"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  ImagePlus,
  KeyRound,
  Loader2,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types";

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  bio: string;
  photoURL: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FieldErrors = Partial<Record<string, string>>;

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

function validateProfile(form: ProfileFormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (form.name.trim().length > 80) {
    errors.name = "Name must be 80 characters or less";
  }

  if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (form.phone.trim() && !/^[+]?[\d\s().-]{7,30}$/.test(form.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (form.bio.length > 1000) {
    errors.bio = "Bio must be 1000 characters or less";
  }

  if (
    form.photoURL.trim() &&
    !form.photoURL.startsWith("http://") &&
    !form.photoURL.startsWith("https://") &&
    !form.photoURL.startsWith("data:image/")
  ) {
    errors.photoURL = "Use a valid image URL or upload an image";
  }

  return errors;
}

function validatePassword(form: PasswordFormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.currentPassword) {
    errors.currentPassword = "Current password is required";
  }
  if (!form.newPassword || form.newPassword.length < 6) {
    errors.newPassword = "New password must be at least 6 characters";
  }
  if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  if (
    form.currentPassword &&
    form.newPassword &&
    form.currentPassword === form.newPassword
  ) {
    errors.newPassword = "New password must be different";
  }
  return errors;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });
}

export function ProfileEditForm({ user }: { user: User }) {
  const { updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const initial = useMemo<ProfileFormState>(
    () => ({
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      bio: user.bio ?? "",
      photoURL: user.photoURL ?? "",
    }),
    [user]
  );

  const [form, setForm] = useState<ProfileFormState>(initial);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileErrors, setProfileErrors] = useState<FieldErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  function setField<K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setProfileErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function onPickImage(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be under 1.5MB");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setField("photoURL", dataUrl);
      toast.success("Photo ready — save profile to apply");
    } catch {
      toast.error("Could not process that image");
    }
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateProfile(form);
    setProfileErrors(errors);
    if (Object.keys(errors).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
        photoURL: form.photoURL.trim(),
      });
      updateUser(res.data.user, res.data.token);
      toast.success(res.message || "Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    const errors = validatePassword(passwordForm);
    setPasswordErrors(errors);
    if (Object.keys(errors).length) {
      toast.error("Please fix the password fields");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      toast.success(res.message || "Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setSavingPassword(false);
    }
  }

  const preview = form.photoURL.trim();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Edit profile
          </h1>
          <p className="mt-1 text-slate-400">
            Keep your public info and security settings up to date.
          </p>
        </div>
        <Badge tone={user.role === "admin" ? "violet" : "cyan"}>
          {user.role}
        </Badge>
      </div>

      <form onSubmit={handleProfileSave} className="space-y-6">
        <Card className="overflow-hidden">
          <div className="relative h-28 bg-gradient-to-r from-indigo-600/40 via-fuchsia-500/20 to-cyan-400/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
          </div>
          <CardContent className="-mt-12 space-y-6 pb-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-slate-950 bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl font-bold text-white shadow-xl shadow-indigo-500/20">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={form.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(form.name || user.name || "U")
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-slate-900 text-white shadow-lg transition hover:bg-slate-800"
                  aria-label="Upload profile photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-lg font-semibold text-white">
                  {form.name || "Your name"}
                </p>
                <p className="truncate text-sm text-slate-400">
                  {form.email || "you@example.com"}
                </p>
                <p className="text-xs text-slate-500">
                  Upload a photo (max 1.5MB) or paste an image URL below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                <UserRound className="h-4 w-4" />
              </span>
              <div>
                <CardTitle>Personal details</CardTitle>
                <CardDescription>
                  Visible across applications and your dashboard
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Alex Rivera"
                autoComplete="name"
              />
              {profileErrors.name && (
                <p className="mt-1 text-xs text-rose-400">{profileErrors.name}</p>
              )}
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
              {profileErrors.email && (
                <p className="mt-1 text-xs text-rose-400">{profileErrors.email}</p>
              )}
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+1 555 010 2030"
                autoComplete="tel"
              />
              {profileErrors.phone && (
                <p className="mt-1 text-xs text-rose-400">{profileErrors.phone}</p>
              )}
            </div>

            <div className="sm:col-span-1">
              <Label htmlFor="photoURL">Profile picture URL</Label>
              <div className="relative">
                <ImagePlus className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  id="photoURL"
                  className="pl-9"
                  value={
                    form.photoURL.startsWith("data:image/")
                      ? "(uploaded image)"
                      : form.photoURL
                  }
                  onChange={(e) => {
                    if (e.target.value === "(uploaded image)") return;
                    setField("photoURL", e.target.value);
                  }}
                  placeholder="https://… or upload above"
                />
              </div>
              {profileErrors.photoURL && (
                <p className="mt-1 text-xs text-rose-400">
                  {profileErrors.photoURL}
                </p>
              )}
              {form.photoURL.startsWith("data:image/") && (
                <button
                  type="button"
                  className="mt-1 text-xs text-cyan-300 hover:underline"
                  onClick={() => setField("photoURL", "")}
                >
                  Remove uploaded image
                </button>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="mb-1.5 flex items-center justify-between">
                <Label htmlFor="bio" className="mb-0">
                  Bio / About
                </Label>
                <span className="text-xs text-slate-500">
                  {form.bio.length}/1000
                </span>
              </div>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setField("bio", e.target.value)}
                placeholder="A short introduction about your experience, skills, and what you're looking for…"
                rows={5}
              />
              {profileErrors.bio && (
                <p className="mt-1 text-xs text-rose-400">{profileErrors.bio}</p>
              )}
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savingProfile ? "Saving…" : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={savingProfile}
                onClick={() => {
                  setForm(initial);
                  setProfileErrors({});
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <form onSubmit={handlePasswordSave}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <CardTitle>Change password</CardTitle>
                <CardDescription>
                  Use a strong password you don&apos;t reuse elsewhere
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 sm:max-w-md">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                value={passwordForm.currentPassword}
                onChange={(e) => {
                  setPasswordForm((p) => ({
                    ...p,
                    currentPassword: e.target.value,
                  }));
                  setPasswordErrors((p) => ({
                    ...p,
                    currentPassword: undefined,
                  }));
                }}
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-xs text-rose-400">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={(e) => {
                  setPasswordForm((p) => ({
                    ...p,
                    newPassword: e.target.value,
                  }));
                  setPasswordErrors((p) => ({
                    ...p,
                    newPassword: undefined,
                  }));
                }}
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-xs text-rose-400">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={passwordForm.confirmPassword}
                onChange={(e) => {
                  setPasswordForm((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }));
                  setPasswordErrors((p) => ({
                    ...p,
                    confirmPassword: undefined,
                  }));
                }}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-400">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="outline" disabled={savingPassword}>
                {savingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                {savingPassword ? "Updating…" : "Update password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
