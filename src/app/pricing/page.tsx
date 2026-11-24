'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * Public pricing page. Plans are the business's published price list
 * (Buyer, Owner / Seller and Dealer). Prices are in rupees; GST is added at checkout.
 */

type Tab = 'buyer' | 'owner' | 'dealer';

const TABS: { id: Tab; label: string; cta: string }[] = [
  { id: 'buyer', label: 'Buyer', cta: '/plans' },
  { id: 'owner', label: 'Owner', cta: '/owner/plans' },
  { id: 'dealer', label: 'Dealer', cta: '/dealer/plans' },
];

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const buyerPlans = [
  { name: 'Starter', leads: '0–3 leads', price: 0, validity: '15 days' },
  { name: 'Basic', leads: '4–10 leads', price: 1499, validity: '30 days' },
  { name: 'Standard', leads: '11–30 leads', price: 2499, validity: '60 days', recommended: true },
  { name: 'Unlimited', leads: 'Unlimited leads', price: 4999, validity: '90 days' },
];

const ownerPlans = [
  { name: 'Super Plan', price: 1600, offer: 999, validity: '45 days', posts: '3', rm: false, social: false },
  { name: 'Premium Plan', price: 2000, offer: 1799, validity: '60 days', posts: '5', rm: false, social: false },
  { name: 'Elite Plan', price: 3000, offer: 2499, validity: '90 days', posts: '20', rm: true, social: true, recommended: true },
  { name: 'Special Plan', price: 4000, offer: 3499, validity: '90 days', posts: '50', rm: true, social: true },
  { name: 'Business Plan', price: 70000, offer: 49999, validity: '90 days', posts: '250', rm: true, social: true },
  { name: 'Unlimited Business Plan', price: 125000, offer: 99999, validity: '180 days', posts: 'Unlimited', rm: true, social: true },
];

const dealerPlans = [
  { name: '30-day access', price: 200, validity: '30 days' },
  { name: '60-day access', price: 300, validity: '60 days', recommended: true },
];

const card = (rec?: boolean) =>
  `flex flex-col rounded-2xl border bg-white p-6 ${rec ? 'border-[#087ed9] shadow-lg' : 'border-slate-100'}`;

const Badge = () => (
  <span className="mb-2 self-start rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#087ed9]">Popular</span>
);

const Cta = ({ href }: { href: string }) => (
  <Link href={href} className="mt-6 rounded-full bg-[#087ed9] py-2.5 text-center text-sm font-semibold text-white">
    Get started
  </Link>
);

const Feature = ({ on, children }: { on: boolean; children: React.ReactNode }) => (
  <li className={`flex gap-2 ${on ? '' : 'text-slate-400'}`}>
    {on ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <Minus className="mt-0.5 h-4 w-4 shrink-0" />}
    {children}
  </li>
);

export default function PricingPage() {
  const [tab, setTab] = useState<Tab>('buyer');
  const cta = TABS.find((t) => t.id === tab)!.cta;

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="border-b border-slate-100 bg-gradient-to-br from-sky-50 to-white">
          <div className="container-site py-12 sm:py-16">
            <p className="eyebrow">Pricing</p>
            <h1 className="section-title mt-2">Simple plans for every user</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Choose a plan for buying, listing your property or growing your business. Applicable GST is added at checkout. See our{' '}
              <Link className="text-[#087ed9]" href="/refund-policy">Refund &amp; Cancellation Policy</Link>.
            </p>
          </div>
        </section>

        <section className="container-site py-10 sm:py-14">
          <div role="tablist" className="inline-flex rounded-full border border-slate-200 bg-white p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={t.id === tab}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${t.id === tab ? 'bg-[#087ed9] text-white' : 'text-slate-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'buyer' && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {buyerPlans.map((p) => (
                <div key={p.name} className={card(p.recommended)}>
                  {p.recommended && <Badge />}
                  <h2 className="text-lg font-semibold text-slate-900">{p.name}</h2>
                  <p className="mt-4 text-3xl font-bold text-slate-900">{p.price === 0 ? 'Free' : inr(p.price)}</p>
                  <p className="text-xs text-slate-500">Valid for {p.validity}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                    <Feature on>{p.leads}</Feature>
                    <Feature on>Contact property owners directly</Feature>
                  </ul>
                  <Cta href={cta} />
                </div>
              ))}
            </div>
          )}

          {tab === 'owner' && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ownerPlans.map((p) => (
                <div key={p.name} className={card(p.recommended)}>
                  {p.recommended && <Badge />}
                  <h2 className="text-lg font-semibold text-slate-900">{p.name}</h2>
                  <p className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">{inr(p.offer)}</span>
                    <span className="text-sm text-slate-400 line-through">{inr(p.price)}</span>
                  </p>
                  <p className="text-xs text-slate-500">Valid for {p.validity}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                    <Feature on>{p.posts === 'Unlimited' ? 'Unlimited property posts' : `${p.posts} property posts`}</Feature>
                    <Feature on={p.rm}>Relationship manager</Feature>
                    <Feature on={p.social}>Social media promotion</Feature>
                  </ul>
                  <Cta href={cta} />
                </div>
              ))}
            </div>
          )}

          {tab === 'dealer' && (
            <>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
                {dealerPlans.map((p) => (
                  <div key={p.name} className={card(p.recommended)}>
                    {p.recommended && <Badge />}
                    <h2 className="text-lg font-semibold text-slate-900">{p.name}</h2>
                    <p className="mt-4 text-3xl font-bold text-slate-900">
                      {inr(p.price)} <span className="text-sm font-medium text-slate-500">per pincode</span>
                    </p>
                    <p className="text-xs text-slate-500">Valid for {p.validity}</p>
                    <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                      <Feature on>Access to the Sales Hub for each pincode you buy</Feature>
                      <Feature on>Receive buyer leads in your pincodes</Feature>
                    </ul>
                    <Cta href={cta} />
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-sm text-slate-600">
                A dealer plan unlocks the Sales Hub only. To list your own properties as a dealer, you also need an{' '}
                <button type="button" onClick={() => setTab('owner')} className="font-semibold text-[#087ed9]">Owner plan</button>.
              </p>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
