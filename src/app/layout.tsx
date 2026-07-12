import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppChrome } from "@/components/layout/AppChrome";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luminork-client.vercel.app"),
  title: {
    default: "Luminork | Premium Career Platform",
    template: "%s | Luminork",
  },
  description:
    "Luminork is a modern full-stack job portal for discovering roles, posting openings, and managing hiring with a premium experience.",
  openGraph: {
    title: "Luminork | Premium Career Platform",
    description:
      "Discover verified roles, apply with confidence, and manage hiring from a premium dashboard.",
    url: "https://luminork-client.vercel.app",
    siteName: "Luminork",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-200">
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
