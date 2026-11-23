'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { listPublicPlans, type PublicPlan } from '@/lib/api/subscriptions';
import type { BackendRole } from '@/lib/api/session';

/** Public pricing: the admin-managed plan catalogue (GET /subscriptions/plans?role=). */
const TABS: { role: BackendRole; label: string; cta: string }[] = [
  { role: 'BUYER', label: 'Buyers', cta: '/plans' },
  { role: 'OWNER', label: 'Owners', cta: '/owner/plans' },
  { role: 'BROKER', label: 'Brokers', cta: '/dealer/plans' },
];

const inr = (paise: number) => `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;

export default function PricingPage() {
  const [tab, setTab] = useState(TABS[0]);
  const [plans, setPlans] = useState<Record<string, PublicPlan[]>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (plans[tab.role]) return;
    setError('');
    listPublicPlans(tab.role)
      .then((items) => setPlans((p) => ({ ...p, [tab.role]: items })))
      .catch(() => setError('Could not load plans. Please try again later.'));
  }, [tab, plans]);

  const list = plans[tab.role];

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="border-b border-slate-100 bg-gradient-to-br from-sky-50 to-white">
          <div className="container-site py-12 sm:py-16">
            <p className="eyebrow">Pricing</p>
            <h1 className="section-title mt-2">Simple plans for every user</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Choose a plan for buying, listing or growing your brokerage. Applicable GST is added at checkout. See our{' '}
              <Link className="text-[#087ed9]" href="/refund-policy">Refund &amp; Cancellation Policy</Link>.
            </p>
          </div>
        </section>

        <section className="container-site py-10 sm:py-14">
          <div role="tablist" className="inline-flex rounded-full border border-slate-200 bg-white p-1">
            {TABS.map((t) => (
              <button
                key={t.role}
                role="tab"
                aria-selected={t.role === tab.role}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${t.role === tab.role ? 'bg-[#087ed9] text-white' : 'text-slate-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {error ? (
            <p className="mt-8 text-sm text-red-600">{error}</p>
          ) : !list ? (
            <Loader2 className="mt-8 h-6 w-6 animate-spin text-slate-400" />
          ) : list.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500">No plans available right now.</p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-col rounded-2xl border bg-white p-6 ${p.recommended ? 'border-[#087ed9] shadow-lg' : 'border-slate-100'}`}
                >
                  {p.recommended && <span className="mb-2 self-start rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#087ed9]">Recommended</span>}
                  <h2 className="text-lg font-semibold text-slate-900">{p.name}</h2>
                  {p.description && <p className="mt-1 text-sm text-slate-500">{p.description}</p>}
                  <p className="mt-4 text-3xl font-bold text-slate-900">{p.is_free ? 'Free' : inr(p.price_paise)}</p>
                  <p className="text-xs text-slate-500">{p.duration_days ? `${p.duration_days} days` : 'No expiry'}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-600">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{f}</li>
                    ))}
                  </ul>
                  <Link href={tab.cta} className="mt-6 rounded-full bg-[#087ed9] py-2.5 text-center text-sm font-semibold text-white">
                    Get started
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
