"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="We are here to help"
          description="Questions about posting roles, account access, or partnerships? Reach the Luminork team."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div id="support" className="space-y-4">
            {[
              {
                icon: Mail,
                title: "Email",
                value: "hello@luminork.com",
                href: "mailto:hello@luminork.com",
              },
              {
                icon: Phone,
                title: "Phone",
                value: "+880 1700-000000",
                href: "tel:+8801700000000",
              },
              {
                icon: MapPin,
                title: "Office",
                value: "Dhaka, Bangladesh",
                href: "#",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-cyan-400/30"
              >
                <span className="rounded-xl bg-indigo-500/15 p-2 text-indigo-300">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.value}</p>
                </div>
              </a>
            ))}

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-400">
              <p className="font-semibold text-white">Support hours</p>
              <p className="mt-2">Sunday – Thursday: 10:00 AM – 6:00 PM (BST)</p>
              <p>Average response time: under one business day</p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                minLength={10}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
              />
            </div>
            {sent && (
              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                Thanks for reaching out. Your message has been recorded for the Luminork team.
              </p>
            )}
            <Button type="submit">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
