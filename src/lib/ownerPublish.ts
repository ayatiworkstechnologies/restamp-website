import { apiPost, apiRequest } from '@/lib/api/client';
import { withRole } from '@/lib/api/auth';
import type { OwnerListingOut } from '@/lib/api/owner';
import type { OwnerListing } from '@/lib/ownerListings';

/**
 * Publish the Add Property wizard to the backend (committed contracts):
 *   1. POST /owner/listings            (OwnerListingCreate, JSON) -> OwnerListingOut (PENDING verification)
 *   2. POST /owner/listings/{id}/photos (multipart: file + category) per photo -> PhotoUploadOut
 * The backend only stores photos on an existing listing, so photos are
 * uploaded after creation. Progress is tracked so a retry never creates a
 * second listing or uploads a photo twice.
 *
 * Vocabularies verified against app/schemas.py: furnishing, ownership,
 * facing, overlooking, open sides (1/2/3/3+), age bands (en-dash),
 * maintenance period, tenant preference, lock-in/agreement (months or
 * labels), photo categories (7, no "Other Rooms"), amenity/feature names
 * (master list; "RERA Approved" and "Brand New Construction" are not in it).
 */

const DEAL: Record<string, string> = { Sell: 'BUY', Resale: 'RESALE', Rent: 'RENT', Lease: 'LEASE' };
const PROPERTY_TYPE: Record<string, string> = {
  Apartment: 'APARTMENT',
  'Studio Apartment': 'APARTMENT',
  'Builder Floor': 'APARTMENT',
  'PG / Co-living': 'APARTMENT',
  'Independent House / Villa': 'VILLA',
  'Plot / Land': 'PLOT',
};
const CONSTRUCTION: Record<string, string> = {
  'Ready to Move': 'READY_TO_MOVE',
  'Under Construction': 'UNDER_CONSTRUCTION',
  'New Launch': 'NEW_LAUNCH',
};
const AGE_BAND: Record<string, string> = {
  '0-1 Years': '0–1 Year',
  '1-5 Years': '1–5 Years',
  '5-10 Years': '5–10 Years',
  '10+ Years': '10+ Years',
};
/** Wizard feature chips that are not in the backend's amenity master list. */
const UNKNOWN_FEATURES = new Set(['RERA Approved', 'Brand New Construction']);
const MAX_PHOTOS = 20;

const isRental = (l: OwnerListing) => l.purpose === 'Rent' || l.purpose === 'Lease';
const isPlot = (l: OwnerListing) => /Plot|Land/.test(l.propertyType);
const asksRooms = (l: OwnerListing) => l.category === 'Residential' && !isPlot(l);
const asksBhk = (l: OwnerListing) => asksRooms(l) && l.propertyType !== 'PG / Co-living';

const firstNumber = (v: string): number | null => {
  const m = String(v || '').match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
};
const text = (v: string | null | undefined, max: number): string | undefined => {
  const s = String(v ?? '').trim().replace(/\s+/g, ' ');
  return s ? s.slice(0, max) : undefined;
};

/** "6 months" / "1 year" / "11" -> months; '' -> null; unreadable -> NaN. */
export function durationToMonths(value: string): number | null {
  const s = String(value || '').trim().toLowerCase();
  if (!s || s === 'none') return null;
  const m = s.match(/^(\d+)\s*(months?|mos?|years?|yrs?)?$/);
  if (!m) return NaN;
  const n = parseInt(m[1], 10);
  return m[2] && m[2].startsWith('y') ? n * 12 : n;
}

/** Wizard values the publish API cannot store or would reject; publishing is blocked while any exist. */
export function publishBlockers(l: OwnerListing): string[] {
  const rental = isRental(l);
  const out: string[] = [];
  if (l.bookingAmount.trim()) out.push('Booking Amount');
  if (!rental && l.maintenance.trim()) out.push('Maintenance (sale listings)');
  if (!rental && l.negotiable) out.push('Negotiable (sale listings)');
  if (l.overlooking.length > 1) out.push('more than one Overlooking option');
  if (rental && l.tenantPreference.length > 1) out.push('more than one Tenant Preference');
  if (l.photos.some((p) => p.category === 'Other Rooms')) out.push('photos in the "Other Rooms" category');
  const unknown = l.features.filter((f) => UNKNOWN_FEATURES.has(f));
  if (unknown.length) out.push(`the feature${unknown.length > 1 ? 's' : ''} ${unknown.map((f) => `"${f}"`).join(', ')}`);
  if (l.photos.length > MAX_PHOTOS) out.push(`more than ${MAX_PHOTOS} photos`);
  if (rental && Number.isNaN(durationToMonths(l.lockInPeriod))) out.push('Lock-in Period (use months or years, e.g. "6 months")');
  if (rental && Number.isNaN(durationToMonths(l.agreementDuration))) out.push('Agreement Duration (use months or years, e.g. "1 year")');
  return out;
}

export function buildOwnerPayload(l: OwnerListing): Record<string, unknown> {
  const transaction_type = DEAL[l.purpose] || 'BUY';
  const rental = transaction_type === 'RENT' || transaction_type === 'LEASE';
  const property_type = l.category === 'Commercial' ? 'COMMERCIAL' : PROPERTY_TYPE[l.propertyType] || 'APARTMENT';
  const bedrooms = asksRooms(l) ? firstNumber(l.bedrooms) ?? (asksBhk(l) ? firstNumber(l.bhk) : null) : null;
  const carpet = firstNumber(l.carpetArea);
  // The title keeps the wizard's exact property type (e.g. "Studio Apartment"), which the
  // backend's property_type groups under APARTMENT.
  const title = [asksBhk(l) ? l.bhk : '', l.propertyType, 'in', l.locality].filter(Boolean).join(' ').slice(0, 255) || 'Property';

  const payload: Record<string, unknown> = {
    title,
    transaction_type,
    property_type,
    price_rupees: Math.round(Number(l.price)),
    price_period: rental ? 'MONTHLY' : 'TOTAL',
    description: text(l.description, 5000),
    construction_status: CONSTRUCTION[l.availability],
    locality: l.locality.trim(),
    city: l.city.trim() || 'Chennai',
    district: text(l.district, 255),
    pincode: l.pincode.trim(),
    sub_locality: text(l.subLocality, 255),
    society_name: text(l.society, 255),
    house_no: text(l.houseNo, 100),
    landmark: text(l.landmark, 255),
    area_value: carpet && carpet > 0 ? carpet : undefined,
    area_unit: carpet && carpet > 0 ? 'sqft' : undefined,
    bedrooms: bedrooms ?? undefined,
    bathrooms: asksRooms(l) ? firstNumber(l.bathrooms) ?? undefined : undefined,
    balconies: asksRooms(l) ? firstNumber(l.balconies) ?? undefined : undefined,
    built_up_area: firstNumber(l.builtUpArea) ?? undefined,
    super_built_up_area: firstNumber(l.superBuiltUpArea) ?? undefined,
    total_floors: firstNumber(l.totalFloors) ?? undefined,
    floor_on: text(l.floor, 10),
    is_duplex: l.duplex,
    property_age_band: AGE_BAND[l.propertyAge],
    furnishing: text(l.furnishing, 50),
    covered_parking: l.coveredParking,
    open_parking: l.openParking,
    open_sides: l.openSides === '4' ? '3+' : text(l.openSides, 10),
    overlooking: text(l.overlooking[0], 50),
    facing: text(l.facing, 20),
    ownership_type: text(l.ownership, 50),
    contact_phone: text(l.phone, 20),
    contact_email: text(l.email, 255),
    amenities: l.amenities,
    property_features: l.features,
  };
  if (rental) {
    const lockIn = durationToMonths(l.lockInPeriod);
    const agreement = durationToMonths(l.agreementDuration);
    payload.rent_terms = {
      security_deposit_rupees: firstNumber(l.securityDeposit) ?? undefined,
      maintenance_rupees: firstNumber(l.maintenance) ?? undefined,
      maintenance_period: l.maintenance ? text(l.maintenanceFrequency, 20) : undefined,
      is_negotiable: l.negotiable,
      available_from: text(l.availableFrom, 50),
      tenant_preference: text(l.tenantPreference[0], 20),
      lock_in_months: lockIn ?? undefined,
      agreement_months: agreement ?? undefined,
    };
  }
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(',');
  const mime = head.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
  const bytes = atob(body);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

/** Where a publish attempt got to; kept by the wizard so a retry resumes instead of duplicating. */
export type PublishProgress = { listingId: number | null; uploadedPhotoIds: string[] };

export type PublishResult =
  | { ok: true; listingId: number }
  | { ok: false; stage: 'create'; error: unknown }
  | { ok: false; stage: 'photos'; listingId: number; failed: number; error: unknown };

export async function publishWizardListing(listing: OwnerListing, progress: PublishProgress): Promise<PublishResult> {
  if (progress.listingId === null) {
    try {
      const created = await withRole('OWNER', () => apiPost<OwnerListingOut>('/owner/listings', buildOwnerPayload(listing)));
      progress.listingId = created.listing_id;
    } catch (error) {
      return { ok: false, stage: 'create', error };
    }
  }
  const listingId = progress.listingId;
  let failed = 0;
  let lastError: unknown = null;
  for (const photo of listing.photos) {
    if (progress.uploadedPhotoIds.includes(photo.id)) continue;
    try {
      const form = new FormData();
      form.append('file', dataUrlToBlob(photo.src), 'photo.jpg');
      form.append('category', photo.category);
      await withRole('OWNER', () => apiRequest(`/owner/listings/${listingId}/photos`, { method: 'POST', body: form }));
      progress.uploadedPhotoIds.push(photo.id);
    } catch (error) {
      failed += 1;
      lastError = error;
    }
  }
  return failed ? { ok: false, stage: 'photos', listingId, failed, error: lastError } : { ok: true, listingId };
}
