import { snackbar, toast } from '@/lib/notify';
import { useEffect, useState } from 'react';
import { getSession, loginHref } from '@/lib/api/session';
import { errorMessage } from '@/lib/api/client';
import { listSaved, saveListing, unsaveListing } from '@/lib/api/buyer';
import { cardToProperty, isBackendProperty } from '@/lib/api/mappers';
import type { Property } from '@/data/properties';

/**
 * Saved properties ("wishlist"), backed only by the backend:
 * GET /buyer/saved, POST /buyer/saved/{id}, DELETE /buyer/saved/{id}.
 *
 * - The ids held here are backend listing ids, loaded from GET /buyer/saved.
 *   Nothing is kept in localStorage any more (the old key held catalogue
 *   ids that do not exist in the backend, so it is removed).
 * - Only properties built from backend data (source 'backend') can be saved:
 *   a local catalogue id is never sent to the API.
 * - The heart changes only after the backend confirms; failures are shown
 *   with the site's existing toast and the heart stays as it was.
 */

export const WISHLIST_LIMIT_EVENT = 'wishlist-limit';

const LEGACY_KEY = 'restamp_wishlist';
const EVENT = 'wishlist-change';
const SESSION_EVENT = 'restamp-session-change';

let savedIds: number[] = [];
let loadedFor: number | null = null; // userId the ids were loaded for
let loading: Promise<void> | null = null;

function emit() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENT));
}

function setIds(ids: number[]) {
  savedIds = ids;
  emit();
}

/** Load the signed-in buyer's saved ids once per account (background: never switches role). */
function ensureLoaded(): Promise<void> {
  const session = getSession();
  if (!session) {
    loadedFor = null;
    if (savedIds.length) setIds([]);
    return Promise.resolve();
  }
  if (loadedFor === session.userId) return Promise.resolve();
  if (loading) return loading;
  loading = listSaved(1, 100, { passive: true })
    .then((page) => {
      loadedFor = session.userId;
      setIds(page.items.map((c) => c.listing_id));
    })
    .catch(() => {
      // Not in buyer mode or offline: show nothing as saved rather than guessing.
    })
    .finally(() => {
      loading = null;
    });
  return loading;
}

export function getWishlist(): number[] {
  return savedIds;
}

function goToLogin() {
  if (typeof window === 'undefined') return;
  window.location.assign(loginHref(window.location.pathname + window.location.search));
}

/**
 * Save or unsave a backend property. Resolves to what actually happened;
 * 'failed' means the backend refused or was unreachable (already shown).
 */
export async function toggleWishlist(
  property: Property,
): Promise<'saved' | 'removed' | 'login' | 'limit' | 'failed' | 'unavailable'> {
  if (!isBackendProperty(property)) {
    toast.error('This property cannot be saved.');
    return 'unavailable';
  }
  const id = property.id;
  if (!getSession()) {
    goToLogin();
    return 'login';
  }
  await ensureLoaded();

  if (savedIds.includes(id)) {
    try {
      await unsaveListing(id);
    } catch (e) {
      toast.error(errorMessage(e, 'Could not remove this property. Please try again.'));
      return 'failed';
    }
    setIds(savedIds.filter((x) => x !== id));
    snackbar('Removed from your shortlist', {
      actionLabel: 'Undo',
      onAction: () => void toggleWishlist(property),
    });
    return 'removed';
  }

  // No frontend saved-property cap: the backend (POST /buyer/saved/{id}) decides
  // whether a property can be saved, and any refusal is shown below.
  try {
    await saveListing(id);
  } catch (e) {
    toast.error(errorMessage(e, 'Could not save this property. Please try again.'));
    return 'failed';
  }
  setIds([id, ...savedIds.filter((x) => x !== id)]);
  snackbar('Saved to your shortlist', {
    actionLabel: 'View',
    onAction: () => window.location.assign('/saved'),
  });
  return 'saved';
}

/** Unsave everything on the backend. Resolves to the number that could not be removed. */
export async function clearWishlist(): Promise<number> {
  let failed = 0;
  for (const id of [...savedIds]) {
    try {
      await unsaveListing(id);
      setIds(savedIds.filter((x) => x !== id));
    } catch {
      failed += 1;
    }
  }
  if (failed) toast.error(`${failed} saved ${failed === 1 ? 'property' : 'properties'} could not be removed. Please try again.`);
  return failed;
}

/** Saved backend listing ids for heart state; empty for guests. */
export function useWishlist() {
  const [ids, setState] = useState<number[]>(savedIds);

  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {}
    const sync = () => setState(savedIds);
    const onSession = () => void ensureLoaded();
    sync();
    void ensureLoaded();
    window.addEventListener(EVENT, sync);
    window.addEventListener(SESSION_EVENT, onSession);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener(SESSION_EVENT, onSession);
    };
  }, []);

  return ids;
}

/** The saved listings themselves, for the Saved page (GET /buyer/saved). */
export function useSavedListings() {
  const ids = useWishlist();
  const [items, setItems] = useState<Property[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'guest' | 'error'>('loading');
  const [error, setError] = useState('');

  const key = ids.join(',');
  useEffect(() => {
    if (!getSession()) {
      setItems([]);
      setState('guest');
      return;
    }
    let cancelled = false;
    listSaved(1, 100)
      .then((page) => {
        if (cancelled) return;
        setItems(page.items.map(cardToProperty));
        setState('ready');
      })
      .catch((e) => {
        if (cancelled) return;
        setError(errorMessage(e, 'Could not load your saved properties.'));
        setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { items, state, error };
}
