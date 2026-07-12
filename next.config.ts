import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  async redirects() {
    return [
      // Forced dashboard mappings
      {
        source: "/applications",
        destination: "/dashboard/applications",
        permanent: true,
      },
      {
        source: "/applications/:path*",
        destination: "/dashboard/applications",
        permanent: true,
      },
      {
        source: "/items/add",
        destination: "/dashboard/post",
        permanent: true,
      },
      {
        source: "/items/manage",
        destination: "/dashboard/manage",
        permanent: true,
      },
      {
        source: "/items",
        destination: "/dashboard/manage",
        permanent: true,
      },
      {
        source: "/items/:path*",
        destination: "/dashboard/manage",
        permanent: true,
      },
      // Other legacy → dashboard
      {
        source: "/profile",
        destination: "/dashboard/profile",
        permanent: true,
      },
      {
        source: "/dashboard/add",
        destination: "/dashboard/post",
        permanent: true,
      },
      {
        source: "/dashboard/jobs/new",
        destination: "/dashboard/post",
        permanent: true,
      },
      {
        source: "/dashboard/jobs",
        destination: "/dashboard/manage",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
