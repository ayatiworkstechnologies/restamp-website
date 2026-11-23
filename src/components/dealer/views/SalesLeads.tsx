"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, Settings2 } from 'lucide-react';
import { ACTIVITY_TABS, SalesActivityPanel, useSalesActivity, type ActivityTab } from '@/components/dealer/views/SalesActivity';
import { getDealerSubscription } from '@/lib/dealerPlan';
import { matchesLocation, useLocations } from '@/lib/locations';
import type { Property } from '@/data/properties';

const inLocation = (name: string, p: Property) => matchesLocation(name, p.locality, p.area, p.address);

/** Sales Hub: the dealer's activity with owner properties in their areas, as in the Restamp app. */
export default function SalesLeads() {
  const { lists } = useSalesActivity();
  const locations = useLocations();
  const initial = useSearchParams().get('tab');
  const [tab, setTab] = useState<ActivityTab>(ACTIVITY_TABS.some((t) => t.key === initial) ? (initial as ActivityTab) : 'wishlist');
  const [myAreas, setMyAreas] = useState<string[]>([]);
  const [area, setArea] = useState<string>('all');

  useEffect(() => {
    setMyAreas(getDealerSubscription()?.selectedLocations ?? []);
  }, []);

  // Areas from the dealer's package; an area admin has since hidden is flagged.
  const areas = useMemo(
    () =>
      myAreas.map((name) => {
        const loc = locations.find((l) => l.name.toLowerCase() === name.toLowerCase());
        return { name, hidden: !!loc && !loc.active };
      }),
    [myAreas, locations],
  );

  const filtered = useMemo(() => {
    if (area === 'all') return lists;
    return {
      wishlist: lists.wishlist.filter((p) => inLocation(area, p)),
      calls: lists.calls.filter((e) => inLocation(area, e.property)),
      messages: lists.messages.filter((e) => inLocation(area, e.property)),
      visits: lists.visits.filter((e) => inLocation(area, e.property)),
      viewed: lists.viewed.filter((e) => inLocation(area, e.property)),
    };
  }, [lists, area]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Buyer Leads</h1>
        <p className="mt-1 text-sm text-slate-500">Your activity with owner properties in your areas.</p>
      </div>

      {/* My locations */}
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_3px_18px_#15223d06]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <MapPin size={16} className="text-[#087ed9]" /> My locations
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">{areas.length}</span>
          </p>
          <Link href="/dealer/packages" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#087ed9] hover:underline">
            <Settings2 size={13} /> {areas.length ? 'Change locations' : 'Choose locations'}
          </Link>
        </div>
        {areas.length === 0 ? (
          <p className="mt-2 text-xs text-slate-500">You haven&apos;t picked any Chennai locations yet. Choose a locality package to get leads from those areas.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip on={area === 'all'} onClick={() => setArea('all')}>All my areas</Chip>
            {areas.map((a) => (
              <Chip key={a.name} on={area === a.name} onClick={() => setArea(a.name)} title={a.hidden ? 'Paused by Restamp admin' : undefined}>
                {a.name}
                {a.hidden && <span className="ml-1 text-[10px] font-bold text-amber-600">paused</span>}
              </Chip>
            ))}
          </div>
        )}
      </section>

      <div className="overflow-x-auto border-b border-slate-200">
        <div role="tablist" aria-label="Sales Hub" className="flex min-w-max gap-6">
          {ACTIVITY_TABS.map((t) => {
            const on = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.key)}
                className={`relative flex cursor-pointer items-center gap-2 px-1 pb-3 text-[15px] transition ${on ? 'font-bold text-[#2563EB]' : 'font-medium text-slate-500 hover:text-slate-800'}`}
              >
                {t.label}
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${on ? 'bg-[#EFF6FF] text-[#2563EB] ring-1 ring-[#BFDBFE]' : 'bg-slate-100 text-slate-500'}`}>{filtered[t.key].length}</span>
                {on && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-[#2563EB]" />}
              </button>
            );
          })}
        </div>
      </div>

      <SalesActivityPanel tab={tab} lists={filtered} />
    </div>
  );
}

function Chip({ on, onClick, title, children }: { on: boolean; onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={on}
      className={`inline-flex cursor-pointer items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        on ? 'bg-[#087ed9] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
      }`}
    >
      {children}
    </button>
  );
}
