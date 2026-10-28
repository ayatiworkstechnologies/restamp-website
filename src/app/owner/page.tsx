import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerScreen from '@/components/owner/OwnerScreen';

export const metadata = {
  title: 'Restamp Owner Portal | Post Property Free with 0% Brokerage',
  description:
    'Dedicated Owner Screen inspired by 99acres. Sell or rent residential and commercial properties with direct buyer leads, number privacy, and zero brokerage.',
};

export default function OwnerPortalPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-[#070e17] flex items-center justify-center text-slate-400">Loading Owner Portal...</div>}>
          <OwnerScreen />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
