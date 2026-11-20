'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Info, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProfile, type Profile } from '@/lib/profile';
import { getBuyerPlanStatus, type BuyerPlanCard, type BuyerPlanStatus } from '@/lib/api/buyer';
import { bypassActivate, listPublicPlans } from '@/lib/api/subscriptions';
import { errorMessage } from '@/lib/api/client';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
// Backend plans limit owner-contact reveals ("leads"), not the shortlist.
const limitText = (limit: number | null) => (limit === null ? 'Unlimited owner contacts' : `Contact up to ${limit} property owners`);

/**
 * Buyer plans from the backend: GET /buyer/plans (public catalogue) and
 * GET /buyer/plan (the signed-in buyer's plan and lead usage).
 * Plans: GET /subscriptions/plans?role=BUYER (the admin-managed catalogue).
 * Continue (TEMPORARY payment bypass): POST /subscriptions/bypass activates the plan
 * on the backend without payment (recorded as BYPASS, never as paid); the current
 * plan is then re-read from GET /buyer/plan. No payment gateway is called.
 * The backend does not state whether prices include GST, so no GST is shown.
 */
export default function BuyerPlansPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [buyerPlans, setBuyerPlans] = useState<BuyerPlanCard[]>([]);
  const [loadError, setLoadError] = useState('');
  const [current, setCurrent] = useState<BuyerPlanStatus | null>(null);
  const [me, setMe] = useState<Profile | null>(null);
  const [selected, setSelected] = useState<BuyerPlanCard | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    const profile = getProfile();
    setMe(profile);
    listPublicPlans('BUYER')
      .then((items) =>
        setBuyerPlans(
          items.map((p) => ({
            code: p.code,
            name: p.name,
            price_paise: p.price_paise,
            duration_days: p.duration_days ?? 0,
            lead_limit: p.lead_limit === null || p.lead_limit < 0 ? null : p.lead_limit,
            leads_label: p.description || '',
            is_free: p.is_free,
          })),
        ),
      )
      .catch((e) => setLoadError(errorMessage(e, 'Could not load buyer plans.')))
      .finally(() => setReady(true));
    // Current plan only for a signed-in buyer; a failure just leaves the strip hidden.
    if (profile) getBuyerPlanStatus().then(setCurrent).catch(() => setCurrent(null));
  }, []);

  const choose = (p: BuyerPlanCard) => {
    setError('');
    if (!me) {
      router.push('/login?role=buyer&next=/plans');
      return;
    }
    setSelected(p);
  };

  // Continue: payment is bypassed for now; the backend activates the plan (never recorded as paid).
  const confirm = async () => {
    if (!selected || busy) return;
    if (selected.is_free) {
      setError('The free plan is already included with every buyer account.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await bypassActivate('BUYER', selected.code);
      setCurrent(await getBuyerPlanStatus());
      setDone(selected.name);
      setSelected(null);
    } catch (e) {
      setError(errorMessage(e, 'Could not activate the plan. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  const price = (p: BuyerPlanCard) => Math.round(p.price_paise / 100);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50/80 py-10 sm:py-14">
        <div className="container-site mx-auto max-w-5xl px-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Buyer plans</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Save and compare more properties while you search.</p>

          {current && (
            <p className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-slate-700">
              Your current plan: <strong>{current.plan_name}</strong>
              {current.lead_limit === null
                ? ` · ${current.leads_used} owner contacts used (unlimited)`
                : ` · ${current.leads_used} of ${current.lead_limit} owner contacts used`}
              {current.leads_remaining !== null ? ` · ${current.leads_remaining} remaining` : ''}
              {current.valid_until ? ` · valid until ${new Date(current.valid_until).toLocaleDateString('en-IN')}` : ''}
            </p>
          )}
          {done && (
            <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {done} is now active. <Link href="/buy" className="font-semibold underline">Browse properties</Link>
            </p>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {!ready &&
              [0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white" />)}
            {ready && buyerPlans.length === 0 && (
              <p className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                {loadError || 'No buyer plans are available right now.'}
              </p>
            )}
            {buyerPlans.map((p) => {
              const isCurrent = current?.plan_code === p.code;
              // The backend marks no plan as recommended, so the badge is never shown.
              const recommended = false;
              return (
                <div
                  key={p.code}
                  className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm ${
                    recommended ? 'border-[#087ed9] ring-1 ring-[#087ed9]' : 'border-slate-200'
                  }`}
                >
                  {recommended && (
                    <span className="absolute -top-3 left-6 rounded-full bg-[#087ed9] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                      Recommended
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-slate-900">{p.name}</h2>
                  {/* No plan description in the backend; the line keeps its space empty. */}
                  <p className="mt-1 min-h-10 text-sm text-slate-500">{''}</p>
                  <div className="mt-4 text-3xl font-extrabold text-slate-900">
                    {p.is_free ? 'Free' : inr(price(p))}
                  </div>
                  <ul className="mt-5 flex-1 space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[#087ed9]" />{limitText(p.lead_limit)}</li>
                    <li className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[#087ed9]" />{`Valid for ${p.duration_days} days`}</li>
                  </ul>
                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => choose(p)}
                    className="mt-6 rounded-xl bg-[#087ed9] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#066db9] disabled:cursor-default disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    {isCurrent ? 'Current plan' : p.is_free ? 'Use free plan' : 'Choose plan'}
                  </button>
                </div>
              );
            })}
          </div>

          {selected && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Confirm {selected.name}</h2>
              <dl className="mt-4 max-w-sm space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Plan price</dt><dd>{inr(price(selected))}</dd></div>
              </dl>
              <p className="mt-4 flex gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Info size={14} className="mt-0.5 shrink-0" />
                Online payment is not connected yet. Press Continue to activate this plan now — no money is charged.
              </p>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={confirm} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#087ed9] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#066db9] disabled:opacity-60">
                  {busy && <Loader2 size={16} className="animate-spin" />}
                  {selected.is_free ? 'Activate' : 'Continue'}
                </button>
                <button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
