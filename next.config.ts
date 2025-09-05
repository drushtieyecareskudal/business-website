import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**",
            },
        ],
    },
    eslint: {
        // Disables eslint during build
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Disables type checking during build
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
