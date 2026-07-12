import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="About Luminork"
          title="A premium career platform built for modern hiring"
          description="Luminork helps ambitious professionals discover high-quality roles and helps teams publish openings with clarity, polish, and speed."
        />

        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">Who we are</h2>
            <p className="mt-3">
              Luminork is a full-stack career platform designed to make job discovery and
              posting feel effortless. Candidates can explore verified listings with
              consistent cards, rich details, salary bands, and ratings. Hiring teams can
              publish structured roles, manage inventory, and keep their openings accurate.
            </p>
          </section>

          <section
            id="mission"
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold text-white">Our mission</h2>
            <p className="mt-3">
              We believe career decisions deserve premium tools. Our mission is to remove
              noise from the hiring journey — clear information, responsive design, secure
              authentication, and thoughtful workflows that respect both sides of the market.
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Clarity first",
                text: "Salary ranges, deadlines, requirements, and company context on every listing.",
              },
              {
                title: "Secure by design",
                text: "JWT-protected routes, password hashing, and ownership checks on management actions.",
              },
              {
                title: "Crafted experience",
                text: "Motion, consistent components, and responsive layouts across every page.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
              >
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.text}</p>
              </div>
            ))}
          </section>

          <section
            id="privacy"
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold text-white">Privacy</h2>
            <p className="mt-3">
              We store only the account and listing data required to operate Luminork.
              Passwords are hashed, tokens expire, and sensitive configuration stays in
              environment variables. We do not sell personal data.
            </p>
          </section>

          <section
            id="terms"
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold text-white">Terms</h2>
            <p className="mt-3">
              Users agree to post accurate job information and use Luminork respectfully.
              Listings that mislead candidates or violate local employment laws may be
              removed by administrators.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/jobs">
            <Button>Explore Jobs</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
