import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
   allowedDevOrigins: ['192.168.0.8', 'localhost', '127.0.0.1'],
};

export default nextConfig;
