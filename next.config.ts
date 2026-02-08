import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // <--- CRITICAL: Tells Next to dump raw HTML
  images: {
    unoptimized: true, // <--- CRITICAL: Next/Image won't work without a server
  },
};

export default nextConfig;