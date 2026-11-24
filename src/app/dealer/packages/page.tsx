"use client";

import { useActiveLocations } from '@/lib/locations';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProfile } from '@/lib/profile';
import {
  DEALER_GST_RATE,
  DEALER_PINCODE_PLANS,
  findPincodePlan,
  getDraftPackage,
  pincodePackage,
  saveDraftPackage,
  useLocationPackages,
  type DealerPincodePlanId,
} from '@/lib/dealerPlan';
import { ArrowRight, Check, CheckCircle2, Search, X } from 'lucide-react';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const ZONES = ['All', 'South & OMR', 'Central Chennai', 'Coastal & ECR', 'West Chennai'];

/**
 * Dealer plan: pick a validity (30 or 60 days), then the pincodes / micro-markets.
 * Price = price per pincode × number of pincodes, plus GST. Unlocks the Sales Hub.
 */
export default function DealerPackagesPage() {
  const router = useRouter();
  const backendPackages = useLocationPackages();
  const dealerLocations = useActiveLocations();

  const [rateId, setRateId] = useState<DealerPincodePlanId>('30d');
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('All');
  const [warning, setWarning] = useState<string | null>(null);

  // Restore an unfinished selection.
  useEffect(() => {
    const draft = getDraftPackage();
    if (draft?.rateId) setRateId(draft.rateId);
    if (draft?.selectedLocations?.length) setSelected(draft.selectedLocations);
  }, []);

  const rate = findPincodePlan(rateId);
  const maxLocations = Math.max(0, ...backendPackages.map((p) => p.locationLimit));

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return dealerLocations.filter(
      (l) =>
        (zone === 'All' || l.region === zone) &&
        (l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.tag.toLowerCase().includes(q)),
    );
  }, [dealerLocations, query, zone]);

  const toggle = (name: string) => {
    setWarning(null);
    if (selected.includes(name)) {
      setSelected(selected.filter((l) => l !== name));
      return;
    }
    if (maxLocations && selected.length >= maxLocations) {
      setWarning(`You can choose up to ${maxLocations} pincodes in one purchase.`);
      return;
    }
    setSelected([...selected, name]);
  };

  const subtotal = rate.pricePerLocation * selected.length;
  const gst = Math.round(subtotal * DEALER_GST_RATE);
  const total = subtotal + gst;

  const proceed = () => {
    if (selected.length === 0) {
      setWarning('Please select at least 1 pincode to continue.');
      return;
    }
    const pkg = pincodePackage(rateId, selected.length, backendPackages);
    if (!pkg.id) {
      setWarning('Plans are still loading. Please try again in a moment.');
      return;
    }
    saveDraftPackage({ packageId: pkg.id, rateId, selectedLocations: selected, updatedAt: new Date().toISOString() });
    router.push(getProfile() ? '/dealer/payment' : '/login?role=dealer&next=/dealer/payment');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50/70 py-8 sm:py-12 text-slate-900">
        <div className="container-site max-w-7xl mx-auto space-y-8">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-sky-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#087ed9]">
              Dealer Plan
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
              Choose your <span className="text-[#087ed9]">pincodes</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-500">
              Pay only for the areas you work in. Pick a validity, then select your pincodes to unlock the Sales Hub and buyer
              leads there.
            </p>
          </div>

          {/* Validity tabs */}
          <div className="flex justify-center">
            <div role="tablist" className="inline-flex gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
              {DEALER_PINCODE_PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={p.id === rateId}
                  onClick={() => setRateId(p.id)}
                  className={`rounded-full px-5 sm:px-7 py-2.5 text-left transition cursor-pointer ${
                    p.id === rateId ? 'bg-[#087ed9] text-white shadow' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-sm font-bold">{p.label}</span>
                  <span className={`block text-xs ${p.id === rateId ? 'text-sky-100' : 'text-slate-400'}`}>
                    {inr(p.pricePerLocation)} / pincode
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Location picker */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Select locations</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {inr(rate.pricePerLocation)} for each pincode · valid for {rate.validityDays} days
                </p>
              </div>
              <span className="self-start sm:self-auto rounded-2xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                {selected.length} selected
              </span>
            </div>

            {warning && (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">{warning}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Chennai locations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#087ed9] outline-none transition"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ZONES.map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZone(z)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                      zone === z ? 'bg-[#087ed9] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filtered.map((loc) => {
                const on = selected.includes(loc.name);
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => toggle(loc.name)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                      on ? 'border-[#087ed9] bg-sky-50/60 ring-2 ring-[#087ed9]' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold truncate">{loc.name}</span>
                      <span className="block text-xs text-slate-500 truncate">{loc.city}</span>
                    </span>
                    <span
                      className={`h-5 w-5 shrink-0 rounded-full border flex items-center justify-center ${
                        on ? 'border-[#087ed9] bg-[#087ed9] text-white' : 'border-slate-300'
                      }`}
                    >
                      {on && <Check size={12} strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && <p className="text-sm text-slate-500">No locations match your search.</p>}
            </div>

            {selected.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">Selected ({selected.length})</span>
                  <button type="button" onClick={() => setSelected([])} className="font-semibold text-rose-600 hover:underline cursor-pointer">
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.map((name) => (
                    <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold">
                      {name}
                      <button type="button" aria-label={`Remove ${name}`} onClick={() => toggle(name)} className="hover:text-rose-600 cursor-pointer">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Total bar */}
          <div className="sticky bottom-4 z-30 rounded-[28px] bg-slate-900/95 backdrop-blur-xl p-5 sm:p-6 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-5 sm:gap-8">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Plan</span>
                <span className="font-extrabold">{rate.label}</span>
              </div>
              <div className="border-l border-white/15 pl-5 sm:pl-8">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Pincodes</span>
                <span className="font-extrabold">
                  {selected.length} × {inr(rate.pricePerLocation)} = {inr(subtotal)}
                </span>
              </div>
              <div className="border-l border-white/15 pl-5 sm:pl-8">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total payable</span>
                <span className="text-xl sm:text-2xl font-black text-sky-300">{inr(total)}</span>{' '}
                <span className="text-xs text-slate-400">(incl. 18% GST)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={proceed}
              disabled={selected.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40 cursor-pointer"
            >
              Proceed to Payment <ArrowRight size={15} />
            </button>
          </div>

          <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <CheckCircle2 size={14} className="text-emerald-500" /> A dealer plan unlocks the Sales Hub for the pincodes you choose.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
