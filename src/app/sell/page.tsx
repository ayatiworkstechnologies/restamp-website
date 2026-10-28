import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerScreen from '@/components/owner/OwnerScreen';

export const metadata = {
  title: 'Post Property for Free | 0% Brokerage | Restamp Owner Hub',
  description:
    'Post your flat, villa, plot, or commercial property for free on Restamp. Direct inquiries on WhatsApp, verified owner tag, and zero brokerage.',
};

export default function SellPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-[#070e17] flex items-center justify-center text-slate-400">Loading Owner Hub...</div>}>
          <OwnerScreen />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
