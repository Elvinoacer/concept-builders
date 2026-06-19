import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/track.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      // ── Cloudflare R2 ───────────────────────────────────────────────────
      {
        // R2 direct endpoint — used by presigned upload/download URLs
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      // ── Custom CDN (Cloudflare R2 via custom domain) ────────────────────
      {
        protocol: "https",
        hostname: "cdn.conceptbuilders.co.ke",
      },
      {
        protocol: "https",
        hostname: "conceptbuilders.co.ke",
      },
      {
        protocol: "https",
        hostname: "*.conceptbuilders.co.ke",
      },
      // ── Legacy Digital Ocean Spaces (kept for backward compat) ──────────
      {
        protocol: "https",
        hostname: "conceptbuilders.sfo3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "*.sfo3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "*.sfo2.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "*.nyc3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "*.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "*.cdn.digitaloceanspaces.com",
      },
      // ── Google user content ─────────────────────────────────────────────
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  serverExternalPackages: ["@aws-sdk/client-s3", "@aws-sdk/lib-storage"],
};

export default nextConfig;
