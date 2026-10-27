import { useEffect, useState } from 'react';

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
