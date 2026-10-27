import { useEffect, useState } from 'react';

const KEY = 'restamp_wishlist';
const EVENT = 'wishlist-change';

export function getWishlist(): number[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

function setWishlist(ids: number[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

export function toggleWishlist(id: number) {
  const ids = getWishlist();
  setWishlist(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]);
}

export function clearWishlist() {
  setWishlist([]);
}

export function useWishlist() {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const sync = () => setIds(getWishlist());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return ids;
}
