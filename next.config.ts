import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Increase file upload size limits
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
    responseLimit: "50mb",
  },

  serverRuntimeConfig: {
    maxRequestBodySize: "50mb",
  },

  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
