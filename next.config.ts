import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/resale',
        destination: '/buy?purpose=Resale',
        permanent: false,
      },
      {
        source: '/lease',
        destination: '/buy?purpose=Lease',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;