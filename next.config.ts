import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds
    ignoreDuringBuilds: false,
    dirs: ['src', 'app', 'components', 'lib'],
  },
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
