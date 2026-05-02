import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-a63af3e8e12e44c9b482f117d6049806.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
      // Allow Server Actions from all domains the CMS is served under.
      // Without this, Next.js CSRF check fails when Origin != Host (different www/apex/beta variants).
      allowedOrigins: [
        'dhakapapers.com',
        'www.dhakapapers.com',
        'beta.dhakapapers.com',
        'dhakapaper.com',
        'www.dhakapaper.com',
      ],
    },
  },
  basePath: '/admin',
  async headers() {
    return [
      {
        // Prevent browsers from caching HTML pages — Server Action IDs change on every deploy
        source: '/((?!_next/static|_next/image|favicon).*)',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
