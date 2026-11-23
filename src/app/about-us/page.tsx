import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Users, ShieldCheck, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LEGAL } from '@/lib/legal-entity';

export const metadata: Metadata = {
  title: 'About Us | Restamp',
  description: 'RESTAMP is a real estate marketplace connecting property Owners, Buyers and Brokers across India.',
};

const values = [
  { icon: Search, title: 'Easy discovery', text: 'Search verified homes, plots and commercial spaces to buy or rent, with clear prices and details.' },
  { icon: Home, title: 'Built for Owners', text: 'List your property in minutes and get enquiries and visit requests directly from serious buyers.' },
  { icon: Users, title: 'Tools for Brokers', text: 'Manage listings, leads and clients from one dashboard with plans that grow with your business.' },
  { icon: ShieldCheck, title: 'Trust and safety', text: 'OTP-verified accounts, listing review and secure payments keep the marketplace reliable.' },
];

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="border-b border-slate-100 bg-gradient-to-br from-sky-50 to-white">
          <div className="container-site py-12 sm:py-16">
            <p className="eyebrow">About us</p>
            <h1 className="section-title mt-2">Making property simple for everyone</h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              RESTAMP is a real estate marketplace that connects property Owners, Buyers and Brokers through our website and mobile app.
              We help people find the right property, and help owners and brokers reach the right people, with less hassle.
            </p>
          </div>
        </section>

        <section className="container-site py-10 sm:py-14">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-100 bg-white p-6">
                <Icon className="h-6 w-6 text-[#087ed9]" aria-hidden />
                <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-100 bg-white p-6 sm:p-10 text-[15px] leading-7 text-slate-600">
            <h2 className="text-lg font-semibold text-slate-900">Our mission</h2>
            <p className="mt-2">
              To bring transparency and speed to buying, selling and renting property in India, so every deal starts with accurate
              information and a direct connection.
            </p>
            <h2 className="mt-6 text-lg font-semibold text-slate-900">Company</h2>
            <p className="mt-2">
              {LEGAL.legalName}, {LEGAL.address}. Email{' '}
              <a className="text-[#087ed9]" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a> or visit our{' '}
              <Link className="text-[#087ed9]" href="/contact-us">Contact page</Link>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/buy" className="rounded-full bg-[#087ed9] px-5 py-2.5 text-sm font-semibold text-white">Find a property</Link>
              <Link href="/post-property" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">Post a property</Link>
              <Link href="/pricing" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">See pricing</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
