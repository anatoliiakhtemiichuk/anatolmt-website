import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper logging in production for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
