import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DealerScreen from '@/components/dealer/DealerScreen';

export const metadata = {
  title: 'Restamp Dealer Portal | Dealer Network',
  description:
    'Dedicated Dealer Portal for verified RERA dealers. Access direct pre-approved buyer inquiries, analyze live market deal data, and close mandates with 0% platform commission.',
};

export default function DealerPortalPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#070e17] flex items-center justify-center text-slate-400">
              Loading Dealer Portal...
            </div>
          }
        >
          <DealerScreen />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
