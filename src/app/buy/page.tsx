import { Suspense } from 'react';
import BuyerSearchPage from '@/components/property/BuyerSearchPage';

export const metadata = {
  title: 'Buy Properties in Chennai - Verified Homes, Apartments & Villas | Restamp',
  description:
    'Explore curated homes, luxury apartments, and residential projects by verified developers across Chennai with transparent pricing on Restamp.',
};

export default function BuyPage() {
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