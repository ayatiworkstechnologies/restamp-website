import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostPropertyScreen from '@/components/property/PostPropertyScreen';

export const metadata = {
  title: 'Post Property for Free | Property Studio | Restamp',
  description:
    'Complete your property listing with accurate location, specifications, and pricing to publish your listing with 0% brokerage on Restamp.',
};

export default function SellPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-400">Loading Property Studio...</div>}>
          <PostPropertyScreen />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

