"use client";

// Chennai locations master list. Restamp currently operates in Chennai only.
// Admin manages this list (Admin → Locations); the website search filters,
// dealer locality packages and the dealer Sales Hub all read from it.
// Stored in localStorage and seeded from the original dealer micro-markets.
import { useEffect, useState } from 'react';
import { availableDealerLocations, type DealerLocation } from '@/lib/dealerPlan';

export const OPERATING_CITY = 'Chennai';

export type LocationRegion = DealerLocation['region'];
export const LOCATION_REGIONS: LocationRegion[] = ['South & OMR', 'Central Chennai', 'Coastal & ECR', 'West Chennai'];

export type Location = DealerLocation & {
  /** Hidden from the website and new dealer packages when false. */
  active: boolean;
  createdAt: string;
  updatedAt?: string;
};

const KEY = 'restamp_locations';
const EVENT = 'locations-change';

const seed = (): Location[] => {
  const at = new Date('2026-10-01T00:00:00Z').toISOString();
  return availableDealerLocations.map((l) => ({ ...l, city: OPERATING_CITY, active: true, createdAt: at }));
};

export function getLocations(): Location[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Location[];
    const value = seed();
    localStorage.setItem(KEY, JSON.stringify(value));
    return value;
  } catch {
    return seed();
  }
}

function save(list: Location[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage unavailable */
  }
}

export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export type LocationInput = Pick<Location, 'name' | 'region' | 'tag' | 'demandIntensity' | 'demandScore' | 'avgTicketPrice' | 'activeBuyers'> & { active?: boolean };

/** Throws with a readable message when the name is empty or already used. */
export function addLocation(input: LocationInput): Location {
  const name = input.name.trim().replace(/\s+/g, ' ');
  if (!name) throw new Error('Enter a location name.');
  const list = getLocations();
  if (list.some((l) => l.name.toLowerCase() === name.toLowerCase())) throw new Error(`"${name}" already exists.`);
  let id = slugify(name) || `loc-${Date.now()}`;
  while (list.some((l) => l.id === id)) id = `${id}-2`;
  const loc: Location = { ...input, name, id, city: OPERATING_CITY, active: input.active ?? true, createdAt: new Date().toISOString() };
  save([loc, ...list]);
  return loc;
}

export function updateLocation(id: string, patch: Partial<LocationInput>) {
  const list = getLocations();
  if (patch.name !== undefined) {
    const name = patch.name.trim().replace(/\s+/g, ' ');
    if (!name) throw new Error('Enter a location name.');
    if (list.some((l) => l.id !== id && l.name.toLowerCase() === name.toLowerCase())) throw new Error(`"${name}" already exists.`);
    patch = { ...patch, name };
  }
  save(list.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l)));
}

export function deleteLocation(id: string) {
  save(getLocations().filter((l) => l.id !== id));
}

export function resetLocations() {
  save(seed());
}

export function useLocations(): Location[] {
  const [list, setList] = useState<Location[]>([]);
  useEffect(() => {
    const sync = () => setList(getLocations());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return list;
}

export const useActiveLocations = () => useLocations().filter((l) => l.active);

/** Name parts used to match a location against property localities, e.g. "Adyar & Besant Nagar" → ["adyar", "besant nagar"]. */
export function locationKeywords(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .split(/&|,|\/|\band\b/)
    .map((p) => p.trim())
    .filter((p) => p.length > 1);
}

/** True when a property's locality / area / address belongs to the given location name. */
export function matchesLocation(name: string, ...fields: (string | undefined)[]): boolean {
  const hay = fields.filter(Boolean).join(' ').toLowerCase();
  if (!hay) return false;
  const full = name.toLowerCase().trim();
  if (hay.includes(full)) return true;
  return locationKeywords(name).some((k) => {
    if (hay.includes(k)) return true;
    const words = k.split(' ').filter((w) => w.length > 3);
    return words.length > 1 && words.every((w) => hay.includes(w));
  });
}
