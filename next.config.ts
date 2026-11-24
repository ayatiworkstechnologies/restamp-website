import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  // Dev only: proxy API calls so the site works from any host (localhost, LAN IP,
  // phone) without depending on the backend's CORS allow-list. See src/lib/api/client.ts.
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return [];
    const backend = (process.env.NEXT_PUBLIC_API_URL || 'https://api.restamp.in').trim().replace(/\/+$/, '');
    return [{ source: '/backend-api/:path*', destination: `${backend}/:path*` }];
  },
  async redirects() {
    return [
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/dealer/dashboard/my-listings', destination: '/dealer/dashboard/properties?space=space', permanent: false },
      { source: '/dealer/dashboard/listing-leads', destination: '/dealer/dashboard/leads?space=space', permanent: false },
      { source: '/agent', destination: '/dealer', permanent: true },
      { source: '/agent/:path*', destination: '/dealer/:path*', permanent: true },
      { source: '/admin-dashboard/users/agents', destination: '/admin-dashboard/users/dealers', permanent: true },
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
      {
        source: '/admin',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/admin-dashboard/login',
        destination: '/admin-login',
        permanent: false,
      },
      {
        source: '/adminlogin',
        destination: '/admin-login',
        permanent: false,
      },
      {
        source: '/admin/login',
        destination: '/admin-login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;