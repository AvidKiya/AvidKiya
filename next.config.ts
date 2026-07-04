import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com'
      },
      {
        protocol: 'https',
        hostname: 'api.github.com'
      }
    ]
  }
};

export default nextConfig;
