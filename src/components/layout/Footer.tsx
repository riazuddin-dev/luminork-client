import Link from "next/link";
import { Globe, Mail, MapPin, Phone, Share2, Sparkles, Users } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Explore Jobs" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  Company: [
    { href: "/about", label: "About Luminork" },
    { href: "/contact", label: "Contact" },
    { href: "/about#mission", label: "Our Mission" },
    { href: "/contact#support", label: "Support" },
  ],
  Legal: [
    { href: "/about#privacy", label: "Privacy" },
    { href: "/about#terms", label: "Terms" },
    { href: "/contact", label: "Report Issue" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-slate-950 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold text-white">
                Lumin<span className="text-cyan-300">ork</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Luminork is a premium career marketplace connecting ambitious
              talent with high-quality opportunities across engineering, design,
              product, and growth roles.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-300" />
                hello@luminork.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-300" />
                +880 1700-000000
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-300" />
                Dhaka, Bangladesh
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
                aria-label="Twitter / X"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
                aria-label="LinkedIn"
              >
                <Users className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
                aria-label="GitHub"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {title}
              </h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-cyan-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Luminork. All rights reserved.</p>
          <p>Built with Next.js, Express, MongoDB & TypeScript.</p>
        </div>
      </div>
    </footer>
  );
}
