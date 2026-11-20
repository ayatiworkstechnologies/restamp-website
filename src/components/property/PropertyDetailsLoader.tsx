"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import PropertyDetailsView from '@/components/property/PropertyDetailsView';
import type { Property } from '@/data/properties';
import { getListing, getSimilarListings, recordView } from '@/lib/api/buyer';
import { getSession } from '@/lib/api/session';
import { errorMessage, isApiError } from '@/lib/api/client';
import { cardToProperty, detailToProperty } from '@/lib/api/mappers';

/**
 * Loads one listing from GET /buyer/listings/{id} (public; only verified,
 * available, non-deleted listings resolve) and its similar listings
 * (GET /buyer/listings/{id}/similar, optional). A missing listing renders the
 * site's existing 404 page; loading and errors reuse an existing page style.
 */
export default function PropertyDetailsLoader({ id }: { id: string }) {
  const listingId = /^\d+$/.test(id) ? Number(id) : null;
  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>(listingId ? 'loading' : 'missing');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!listingId) return;
    let cancelled = false;
    setState('loading');
    getListing(listingId)
      .then((detail) => {
        if (cancelled) return;
        setProperty(detailToProperty(detail));
        setState('ready');
        // Signed-in buyers: record the view (POST /buyer/viewed/{id}) for Activity > Viewed.
        // Background only: never switches the role, and a failure never affects the page.
        if (getSession()?.role === 'BUYER') recordView(listingId).catch(() => undefined);
        getSimilarListings(listingId, 3)
          .then((cards) => {
            if (!cancelled) setSimilar(cards.map(cardToProperty));
          })
          .catch(() => undefined);
      })
      .catch((e) => {
        if (cancelled) return;
        if (isApiError(e, 'missing') || isApiError(e, 'validation')) {
          setState('missing');
        } else {
          setError(errorMessage(e, 'Could not load this property. Please try again.'));
          setState('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  if (state === 'missing') notFound();
  if (state === 'ready' && property) return <PropertyDetailsView property={property} similar={similar} />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-400">
      {state === 'loading' ? 'Loading property...' : error}
    </div>
  );
}
