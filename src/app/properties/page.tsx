import { Suspense } from 'react';
import BuyerSearchPage from '@/components/property/BuyerSearchPage';

export const metadata = {
  title: 'All Properties - Find Luxury Homes, Apartments, Villas | Restamp',
  description:
    'Explore curated properties, luxury apartments, villas, and residential projects with instant filters on Restamp.',
};

export default function PropertiesIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#087ed9] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BuyerSearchPage />
    </Suspense>
  );
}
