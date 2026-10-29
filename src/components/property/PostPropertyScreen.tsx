"use client";

import { useSearchParams } from 'next/navigation';
import PostPropertyWizard from '@/components/owner/PostPropertyWizard';

export default function PostPropertyScreen() {
  const searchParams = useSearchParams();
  const rawPurpose = searchParams.get('purpose');
  const rawCategory = searchParams.get('category');
  const rawType = searchParams.get('type') ?? undefined;

  const initialPurpose =
    rawPurpose === 'Rent'
      ? 'Rent'
      : rawPurpose === 'Resale'
      ? 'Resale'
      : rawPurpose === 'Lease'
      ? 'Lease'
      : 'Sell';

  const initialCategory =
    rawCategory === 'Commercial' || rawPurpose === 'Commercial'
      ? 'Commercial'
      : 'Residential';

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 sm:py-14 md:py-16">
      <div className="container-site max-w-5xl">
        {/* Header matching user's design reference */}
        <div className="mb-7 sm:mb-9">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
            PROPERTY STUDIO
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Complete your property listing
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl">
            Provide accurate location, specifications, and pricing below to publish your listing.
          </p>
        </div>

        {/* Clean White Studio Card */}
        <div className="rounded-[28px] sm:rounded-[36px] border border-slate-200/90 bg-white p-5 sm:p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <PostPropertyWizard
            initialPurpose={initialPurpose}
            initialCategory={initialCategory}
            initialPropertyType={rawType}
            doneHref="/owner/dashboard/properties"
            doneLabel="View my properties"
          />
        </div>
      </div>
    </div>
  );
}
