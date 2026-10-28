"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOwnerListings, getDraft, type OwnerListing } from '@/lib/ownerListings';
import { getPayments, getSubscription, type OwnerSubscription, type Payment } from '@/lib/ownerPlan';
import { card, rupees, shortDate } from './ui';
import { Building2, Clock, CreditCard, FileText, PlusCircle, ArrowRight, type LucideIcon } from 'lucide-react';


function Stat({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <div className={`${card} p-5`}>
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-semibold text-slate-400">{label}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#087ed9]">
          <Icon size={19} />
        </span>
      </div>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

export default function OwnerDashboardPage() {
  const [listings, setListings] = useState<OwnerListing[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sub, setSub] = useState<OwnerSubscription | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    setListings(getOwnerListings());
    setPayments(getPayments());
    setSub(getSubscription());
    setHasDraft(!!getDraft());
  }, []);

  if (!sub) return null;
  const daysLeft = sub.expiresAt ? Math.max(0, Math.ceil((new Date(sub.expiresAt).getTime() - Date.now()) / 864e5)) : null;
  const pending = listings.filter((l) => l.status === 'Pending Verification').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">An overview of your listings and plan.</p>
        </div>
        <Link href="/owner/dashboard/add-property" className="inline-flex items-center gap-2 rounded-xl bg-[#087ed9] px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition">
          <PlusCircle size={16} /> Add property
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Listings used" value={`${listings.length}/${sub.listingLimit}`} detail={`${Math.max(0, sub.listingLimit - listings.length)} slots left on ${sub.planName}`} icon={Building2} />
        <Stat label="Pending verification" value={String(pending)} detail="Reviewed by Restamp within 24 hrs" icon={Clock} />
        <Stat label="Plan validity" value={daysLeft === null ? '∞' : `${daysLeft}d`} detail={sub.expiresAt ? `Expires ${shortDate(sub.expiresAt)}` : 'Until deal closed'} icon={FileText} />
        <Stat label="Total paid" value={rupees(payments.reduce((s, p) => s + p.total, 0))} detail={`${payments.length} transaction${payments.length === 1 ? '' : 's'}`} icon={CreditCard} />
      </div>

      {hasDraft && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm">
          <span className="text-amber-900">You have an unfinished listing draft.</span>
          <Link href="/owner/dashboard/add-property" className="font-semibold text-amber-700 hover:underline">Continue draft →</Link>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <section className={`${card} p-5 xl:col-span-2`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Recent properties</h2>
            <Link href="/owner/dashboard/properties" className="inline-flex items-center gap-1 text-xs font-semibold text-[#087ed9] hover:underline">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {listings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
              <p className="text-sm text-slate-500">You haven&apos;t listed any property yet.</p>
              <Link href="/owner/dashboard/add-property" className="mt-3 inline-block text-sm font-semibold text-[#087ed9] hover:underline">
                List your first property
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {listings.slice(0, 4).map((l) => (
                <li key={l.id} className="flex items-center gap-4 py-3">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {l.photos[0] && <img src={l.photos[0].src} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {[l.bhk, l.propertyType].filter(Boolean).join(' ')} for {l.purpose}
                    </p>
                    <p className="truncate text-xs text-slate-500">{[l.locality, l.city].filter(Boolean).join(', ')}</p>
                  </div>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">{l.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${card} p-5`}>
          <h2 className="mb-4 font-bold text-slate-900">Recent payments</h2>
          {payments.length === 0 ? (
            <p className="text-sm text-slate-500">No payments yet — you&apos;re on a free plan.</p>
          ) : (
            <ul className="space-y-3">
              {payments.slice(0, 4).map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">{p.planName}</p>
                    <p className="text-xs text-slate-400">{shortDate(p.paidAt)}</p>
                  </div>
                  <span className="font-semibold text-slate-900">{rupees(p.total)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/owner/dashboard/payments" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#087ed9] hover:underline">
            Plan & payments <ArrowRight size={13} />
          </Link>
        </section>
      </div>
    </div>
  );
}
