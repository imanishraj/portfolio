import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['10.51.215.188', '10.169.152.188'],
};

export default nextConfig;
