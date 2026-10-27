import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostPropertyWizard from '@/components/owner/PostPropertyWizard';

export const metadata = {
  title: 'Post Property | Restamp',
  description: 'List your flat, villa, plot or commercial property for sale, resale, rent or lease.',
};

export default function SellPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-[70vh]">
        <div className="container-site py-10">
          <p className="eyebrow">Restamp Owner Studio</p>
          <h1 className="section-title mt-3">List a New Property</h1>
          <p className="mt-2 text-sm text-slate-500">Add new property, rental, lease, or resale in minutes.</p>
          <div className="mt-8">
            <PostPropertyWizard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
