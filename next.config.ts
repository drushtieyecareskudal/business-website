import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com']
  },
  eslint: {
    // Disables eslint during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disables type checking during build
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
