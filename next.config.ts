import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper logging in production for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Redirects from old English URLs to Polish URLs
  async redirects() {
    return [
      {
        source: '/prices',
        destination: '/cennik',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/kontakt',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
