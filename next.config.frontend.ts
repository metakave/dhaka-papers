import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },

      // ✅ ADD THIS
      {
        protocol: "https",
        hostname: "t3.ftcdn.net",
      },

      {
        protocol: "https",
        hostname: "pub-a6f30b17c688489f85618f1bdd18fc81.r2.dev",
      },

      // ⚠️ FIX wildcard syntax (important)
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
