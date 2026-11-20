import { useEffect, useState } from 'react';
import { listCallEvents, listEnquiries, listViewed, type BuyerEnquiryItem } from '@/lib/api/buyer';
import { cardToProperty } from '@/lib/api/mappers';
import { getSession } from '@/lib/api/session';
import { errorMessage } from '@/lib/api/client';
import type { Property } from '@/data/properties';

export type ActivityType = 'call' | 'message' | 'siteVisit' | 'viewed';

export type ActivityDetails = {
  contactName: string;
  contactRole: string;
  contactPhone: string;
  senderName?: string;
  senderPhone?: string;
  senderEmail?: string;
  message?: string;
};

export type Activity = {
  type: ActivityType;
  propertyId: number;
  at: string;
  details?: ActivityDetails;
};

// Calls and messages keep full history; other types keep one entry per property
const KEEP_HISTORY: ActivityType[] = ['call', 'message'];

const KEY = 'restamp_activity';
const EVENT = 'activity-change';
const MAX_ENTRIES = 200;

export function getActivity(): Activity[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Activity[]) : [];
  } catch {
    return [];
  }
}

// Newest first
export function logActivity(type: ActivityType, propertyId: number, details?: ActivityDetails) {
  try {
    const all = getActivity();
    const rest = KEEP_HISTORY.includes(type)
      ? all
      : all.filter((a) => !(a.type === type && a.propertyId === propertyId));
    const entry: Activity = { type, propertyId, at: new Date().toISOString(), details };
    const next = [entry, ...rest].slice(0, MAX_ENTRIES);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

export function useActivity() {
  const [items, setItems] = useState<Activity[]>([]);

  useEffect(() => {
    const sync = () => setItems(getActivity());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return items;
}

export function contactFor(property: {
  builderName?: string;
  postedBy?: string;
  phoneNumber?: string;
}): ActivityDetails {
  return {
    contactName: property.builderName || 'Skyline Properties',
    contactRole: property.postedBy || 'Builder',
    contactPhone: property.phoneNumber || '+91 98402 11234',
  };
}

// ---------------------------------------------------------------------------
// Real buyer activity from the backend (the Activity page):
//   Calls    -> GET /buyer/call-events  ("call button tapped" events)
//   Messages -> GET /buyer/enquiries    (the buyer's enquiries and last message)
//   Viewed   -> GET /buyer/viewed       (listings the buyer opened)
// Only the signed-in account's own records are returned by the backend.
// Owner phone numbers are not part of these responses (they are revealed only
// through the audited contact endpoint), so contactPhone is left empty.
// ---------------------------------------------------------------------------

export type ActivityEntry = Activity & { property: Property };

function enquiryProperty(e: BuyerEnquiryItem): Property {
  const l = e.listing;
  const cover = l.cover_image_url && /^https?:\/\//i.test(l.cover_image_url) ? l.cover_image_url : '';
  return {
    source: 'backend',
    id: e.property_listing_id,
    badge: '',
    name: l.title,
    price: l.price_display || '',
    image: cover,
    locality: l.locality || undefined,
    city: l.city || undefined,
  };
}

export function useBuyerActivity() {
  const [state, setState] = useState<{
    status: 'loading' | 'ready' | 'guest' | 'error';
    error: string;
    calls: ActivityEntry[];
    messages: ActivityEntry[];
    viewed: ActivityEntry[];
  }>({ status: 'loading', error: '', calls: [], messages: [], viewed: [] });

  useEffect(() => {
    if (!getSession()) {
      setState((s) => ({ ...s, status: 'guest' }));
      return;
    }
    let cancelled = false;
    Promise.all([listCallEvents(), listEnquiries(), listViewed()])
      .then(([calls, enquiries, viewed]) => {
        if (cancelled) return;
        setState({
          status: 'ready',
          error: '',
          calls: calls.items
            .filter((c) => c.listing)
            .map((c) => ({ type: 'call', propertyId: c.property_listing_id, at: c.created_at, property: cardToProperty(c.listing!) })),
          messages: enquiries.items.map((e) => ({
            type: 'message',
            propertyId: e.property_listing_id,
            at: e.last_message_at || e.created_at || '',
            details: { contactName: 'Owner', contactRole: 'Owner', contactPhone: '', message: e.last_message || e.message || undefined },
            property: enquiryProperty(e),
          })),
          viewed: viewed.items.map((v) => ({ type: 'viewed', propertyId: v.property_listing_id, at: v.viewed_at, property: cardToProperty(v.listing) })),
        });
      })
      .catch((e) => {
        if (!cancelled) setState((s) => ({ ...s, status: 'error', error: errorMessage(e, 'Could not load your activity.') }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
