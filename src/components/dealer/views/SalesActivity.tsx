"use client";

// Sales Hub activity tabs, as in the Restamp app's dealer "Buyer Leads"
// screen: the dealer's own activity with owner properties in their areas.
import { useMemo } from 'react';
import Link from 'next/link';
import { CalendarClock, ChevronRight, Eye, Heart, MessageSquare, Phone, type LucideIcon } from 'lucide-react';
import { properties, type Property } from '@/data/properties';
import { contactFor, useActivity, type Activity } from '@/lib/activity';
import { toggleWishlist, useWishlist } from '@/lib/wishlist';
import { dealerCard } from '@/app/dealer/dashboard/ui';

export type ActivityTab = 'wishlist' | 'calls' | 'messages' | 'visits' | 'viewed';

export const ACTIVITY_TABS: { key: ActivityTab; label: string; icon: LucideIcon; emptyTitle: string; emptyText: string }[] = [
  { key: 'wishlist', label: 'Wishlist', icon: Heart, emptyTitle: 'Nothing saved yet', emptyText: 'Tap the heart on a property to keep it here.' },
  { key: 'calls', label: 'Calls', icon: Phone, emptyTitle: 'No calls yet', emptyText: 'Properties where you tap "View Number" will appear here.' },
  { key: 'messages', label: 'Messages', icon: MessageSquare, emptyTitle: 'No messages yet', emptyText: 'Owners you message about a property will appear here so you can follow up.' },
  { key: 'visits', label: 'Visits', icon: CalendarClock, emptyTitle: 'No site visits yet', emptyText: 'Open a property and tap Schedule Visit to book one.' },
  { key: 'viewed', label: 'Viewed', icon: Eye, emptyTitle: 'Nothing viewed yet', emptyText: 'Properties you open will appear here so you can find them again.' },
];

type Entry = Activity & { property: Property };
const byId = (id: number) => properties.find((p) => p.id === id);
const fmt = (iso: string) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

/** Counts and lists for each activity tab. */
export function useSalesActivity() {
  const activity = useActivity();
  const wishlistIds = useWishlist();
  return useMemo(() => {
    const entries = (type: Activity['type']) =>
      activity
        .filter((a) => a.type === type)
        .map((a) => ({ ...a, property: byId(a.propertyId) }))
        .filter((a): a is Entry => !!a.property);
    const lists = {
      wishlist: wishlistIds.map(byId).filter((p): p is Property => !!p),
      calls: entries('call'),
      messages: entries('message'),
      visits: entries('siteVisit'),
      viewed: entries('viewed'),
    };
    const counts: Record<ActivityTab, number> = {
      wishlist: lists.wishlist.length,
      calls: lists.calls.length,
      messages: lists.messages.length,
      visits: lists.visits.length,
      viewed: lists.viewed.length,
    };
    return { lists, counts };
  }, [activity, wishlistIds]);
}

export function SalesActivityPanel({ tab, lists }: { tab: ActivityTab; lists: ReturnType<typeof useSalesActivity>['lists'] }) {
  const meta = ACTIVITY_TABS.find((t) => t.key === tab)!;
  const items = lists[tab];

  if (items.length === 0) {
    return (
      <div className={`${dealerCard} px-6 py-14 text-center`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
          <meta.icon size={24} />
        </div>
        <h2 className="mt-4 font-bold text-slate-900">{meta.emptyTitle}</h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500">{meta.emptyText}</p>
        <Link href="/buy" className="mt-5 inline-flex h-11 items-center gap-1 rounded-full bg-[#087ed9] px-5 text-sm font-semibold text-white hover:bg-sky-600">
          Explore Properties <ChevronRight size={16} />
        </Link>
      </div>
    );
  }

  if (tab === 'wishlist') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {lists.wishlist.map((p) => (
          <PropertyTile key={p.id} property={p}>
            <button
              type="button"
              onClick={() => toggleWishlist(p)}
              aria-label={`Remove ${p.name} from wishlist`}
              className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-rose-500 shadow-sm hover:bg-white"
            >
              <Heart size={16} fill="currentColor" />
            </button>
          </PropertyTile>
        ))}
      </div>
    );
  }

  if (tab === 'viewed') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {lists.viewed.map((e) => (
          <PropertyTile key={e.propertyId} property={e.property} caption={`Viewed · ${fmt(e.at)}`} />
        ))}
      </div>
    );
  }

  // calls, messages, visits: contact rows
  const rows = lists[tab] as Entry[];
  return (
    <div className={`${dealerCard} divide-y divide-slate-100 overflow-hidden`}>
      {rows.map((e, i) => {
        const d = e.details ?? contactFor(e.property);
        const digits = d.contactPhone.replace(/[^0-9]/g, '');
        return (
          <article key={`${e.at}-${e.propertyId}-${i}`} className="flex items-center gap-4 px-4 py-3.5 transition hover:bg-slate-50">
            <Link href={`/properties/${e.property.id}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={e.property.image} alt="" className="h-14 w-14 rounded-xl bg-slate-100 object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <Link href={`/properties/${e.property.id}`} className="truncate text-sm font-semibold text-slate-900 hover:text-[#087ed9]">
                  {e.property.name}
                </Link>
                <span className="shrink-0 text-xs text-slate-400">{fmt(e.at)}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {d.contactName} · {d.contactRole} · {d.contactPhone}
              </p>
              {tab === 'messages' && <p className="mt-1 truncate text-xs text-slate-600">{d.message || 'Enquiry about this property.'}</p>}
              {tab === 'visits' && (
                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  <CalendarClock size={12} /> Visit requested
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <a href={`tel:${digits}`} aria-label={`Call ${d.contactName}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#087ed9] hover:border-[#087ed9] hover:bg-sky-50">
                <Phone size={15} />
              </a>
              <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${d.contactName}`} className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-emerald-600 hover:border-emerald-500 hover:bg-emerald-50 sm:flex">
                <MessageSquare size={15} />
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PropertyTile({ property: p, caption, children }: { property: Property; caption?: string; children?: React.ReactNode }) {
  return (
    <div className={`${dealerCard} relative overflow-hidden`}>
      <Link href={`/properties/${p.id}`} className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt="" className="h-40 w-full bg-slate-100 object-cover" loading="lazy" />
        <div className="p-4">
          {caption && <p className="mb-1 text-[11px] text-slate-400">{caption}</p>}
          <p className="text-base font-bold text-[#087ed9]">{p.price}</p>
          <p className="truncate font-semibold text-slate-900">{p.name}</p>
          <p className="truncate text-xs text-slate-500">{[p.bhk, p.locality || p.area, p.city].filter(Boolean).join(' · ')}</p>
        </div>
      </Link>
      {children}
    </div>
  );
}
