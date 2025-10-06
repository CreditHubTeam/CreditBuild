import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TS errors will still be shown but won't fail the build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
