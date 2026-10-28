import type { Metadata } from 'next';
import { AdminDashboardProviders } from './providers';

export const metadata: Metadata = {
  title: 'Restamp Admin | Asset Management & Marketplace Console',
  description: 'Official Restamp real estate marketplace administration and asset management console',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/restamplogo.svg', type: 'image/svg+xml' },
    ],
    apple: '/restamplogo.svg',
  },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardProviders>{children}</AdminDashboardProviders>;
}
