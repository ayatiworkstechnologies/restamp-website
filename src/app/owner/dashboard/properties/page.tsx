"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { deleteListing, getOwnerListings, type OwnerListing } from '@/lib/ownerListings';
import { card, rupees, shortDate } from '../ui';
import { BedDouble, Bath, MapPin, PlusCircle, Ruler, Trash2 } from 'lucide-react';

export default function OwnerPropertiesPage() {
  const [listings, setListings] = useState<OwnerListing[]>([]);

  useEffect(() => setListings(getOwnerListings()), []);

  const remove = (l: OwnerListing) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    deleteListing(l.id);
    setListings(getOwnerListings());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Properties</h1>
          <p className="mt-1 text-sm text-slate-500">All the properties you have listed on Restamp.</p>
        </div>
        <Link href="/owner/dashboard/add-property" className="inline-flex items-center gap-2 rounded-xl bg-[#087ed9] px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 transition">
          <PlusCircle size={16} /> Add property
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className={`${card} py-16 text-center`}>
          <p className="text-sm text-slate-500">No properties listed yet.</p>
          <Link href="/owner/dashboard/add-property" className="mt-3 inline-block text-sm font-semibold text-[#087ed9] hover:underline">
            List your first property
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((l) => (
            <article key={l.id} className={`${card} overflow-hidden`}>
              <div className="relative h-44 bg-slate-100">
                {l.photos[0] ? (
                  <img src={l.photos[0].src} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">No photo</div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-amber-700">{l.status}</span>
                <span className="absolute right-3 top-3 rounded-full bg-[#087ed9] px-2.5 py-1 text-[11px] font-semibold text-white">{l.purpose}</span>
              </div>
              <div className="p-4">
                <p className="text-lg font-bold text-slate-900">
                  {l.price ? rupees(Number(l.price)) : '—'}
                  {(l.purpose === 'Rent' || l.purpose === 'Lease') && <span className="text-xs font-normal text-slate-500"> /month</span>}
                </p>
                <h3 className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                  {[l.bhk, l.propertyType].filter(Boolean).join(' ')} {l.society && `in ${l.society}`}
                </h3>
                <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                  <MapPin size={12} /> {[l.locality, l.city].filter(Boolean).join(', ')}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                  {l.bedrooms && <span className="flex items-center gap-1"><BedDouble size={13} /> {l.bedrooms} Beds</span>}
                  {l.bathrooms && <span className="flex items-center gap-1"><Bath size={13} /> {l.bathrooms} Baths</span>}
                  {(l.builtUpArea || l.carpetArea) && <span className="flex items-center gap-1"><Ruler size={13} /> {l.builtUpArea || l.carpetArea} sq.ft</span>}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] text-slate-400">Listed {shortDate(l.createdAt)}</span>
                  <button type="button" onClick={() => remove(l)} className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 cursor-pointer">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
