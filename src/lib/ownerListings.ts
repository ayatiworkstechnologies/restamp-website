import { listOwnerListings, deleteOwnerListing, type OwnerListingOut } from '@/lib/api/owner';
import { msUntilVerified } from '@/lib/auto-verify';
import { updateUsage } from '@/lib/subscription-store';
import { getProfile } from '@/lib/profile';

export type ListingPurpose = 'Sell' | 'Resale' | 'Rent' | 'Lease';
export type ListingCategory = 'Residential' | 'Commercial';

export type PhotoCategory =
  | 'Exterior'
  | 'Living Room'
  | 'Bedroom'
  | 'Kitchen'
  | 'Bathroom'
  | 'Balcony'
  | 'Floor Plan'
  | 'Other Rooms';

export type ListingPhoto = { id: string; src: string; category: PhotoCategory };

export type OwnerListing = {
  id: string;
  // Local draft, or the backend state of a real listing (see fetchOwnerListings).
  status: 'Draft' | 'Pending Verification' | 'Live' | 'Rejected' | 'Closed' | 'Sold' | 'Rented' | 'Leased' | 'Expired';
  createdAt: string;
  updatedAt: string;

  // Basic
  purpose: ListingPurpose;
  category: ListingCategory;
  propertyType: string;
  bhk: string;
  phone: string;
  email: string;

  // Location
  city: string;
  district: string;
  locality: string;
  pincode: string;
  subLocality: string;
  society: string;
  houseNo: string;
  landmark: string;

  // Property details
  propertyName?: string;
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  carpetArea: string;
  builtUpArea: string;
  superBuiltUpArea: string;
  totalFloors: string;
  floor: string;
  duplex: boolean;
  availability: string;
  propertyAge: string;
  furnishing: string;

  // Pricing
  price: string;
  securityDeposit: string;
  bookingAmount: string;
  maintenance: string;
  maintenanceFrequency: string;
  negotiable: boolean;
  availableFrom: string;
  tenantPreference: string[];
  lockInPeriod: string;
  agreementDuration: string;

  // Photos & details
  photos: ListingPhoto[];
  coveredParking: number;
  openParking: number;
  description: string;
  ownership: string;
  features: string[];
  amenities: string[];
  facing: string;
  overlooking: string[];
  openSides: string;
};

const LISTINGS_KEY = 'restamp_owner_listings';
const DRAFT_KEY = 'restamp_owner_draft';

export function emptyListing(): OwnerListing {
  const now = new Date().toISOString();
  return {
    id: `L${Date.now()}`,
    status: 'Draft',
    createdAt: now,
    updatedAt: now,
    purpose: 'Sell',
    category: 'Residential',
    propertyType: '',
    bhk: '',
    phone: '',
    email: '',
    city: 'Chennai',
    district: 'Chennai',
    locality: '',
    pincode: '',
    subLocality: '',
    society: '',
    houseNo: '',
    landmark: '',
    propertyName: '',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    carpetArea: '',
    builtUpArea: '',
    superBuiltUpArea: '',
    totalFloors: '',
    floor: '',
    duplex: false,
    availability: 'Ready to Move',
    propertyAge: '',
    furnishing: 'Unfurnished',
    price: '',
    securityDeposit: '',
    bookingAmount: '',
    maintenance: '',
    maintenanceFrequency: 'Monthly',
    negotiable: false,
    availableFrom: '',
    tenantPreference: [],
    lockInPeriod: '',
    agreementDuration: '',
    photos: [],
    coveredParking: 0,
    openParking: 0,
    description: '',
    ownership: 'Freehold',
    features: [],
    amenities: [],
    facing: '',
    overlooking: [],
    openSides: '',
  };
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Returns false when the browser refuses to store it (usually too many photos)
function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Listings submitted for verification go live automatically AUTO_VERIFY_MINUTES later. */
export const getOwnerListings = () =>
  read<OwnerListing[]>(LISTINGS_KEY, []).map((l) =>
    l.status === 'Pending Verification' && msUntilVerified(l.updatedAt) === 0 ? { ...l, status: 'Live' as const } : l,
  );

export function publishListing(listing: OwnerListing): boolean {
  const published = { ...listing, status: 'Pending Verification' as const, updatedAt: new Date().toISOString() };
  const ok = write(LISTINGS_KEY, [published, ...getOwnerListings().filter((l) => l.id !== listing.id)]);
  if (ok) {
    clearDraft();
    syncUsage();
  }
  return ok;
}

export const getDraft = () => read<{ listing: OwnerListing; step: number } | null>(DRAFT_KEY, null);
export const saveDraft = (listing: OwnerListing, step: number) =>
  write(DRAFT_KEY, { listing: { ...listing, updatedAt: new Date().toISOString() }, step });
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export function deleteListing(id: string) {
  write(LISTINGS_KEY, getOwnerListings().filter((l) => l.id !== id));
  syncUsage();
}

/** Keeps the admin-visible usage counter on the owner's subscription current. */
function syncUsage() {
  const me = getProfile();
  if (me?.mobile && me.role !== 'buyer') updateUsage(me.role, me.mobile, { listingsUsed: getOwnerListings().length });
}

// ---------------------------------------------------------------------------
// Real listings from the backend (GET /owner/listings, owner-scoped by the
// token). Mapped onto the row shape the existing owner pages render; values
// the backend does not return stay empty. `id` is the backend listing_id.
// ---------------------------------------------------------------------------

const PURPOSE_FROM_DEAL: Record<string, ListingPurpose> = { BUY: 'Sell', RESALE: 'Resale', RENT: 'Rent', LEASE: 'Lease' };
const TYPE_LABEL: Record<string, string> = {
  APARTMENT: 'Apartment',
  VILLA: 'Villa',
  HOUSE: 'House',
  COMMERCIAL: 'Commercial',
  PLOT: 'Plot',
  AGRICULTURAL_LAND: 'Agricultural Land',
};

/**
 * Verification (PENDING / VERIFIED / REJECTED) and availability (AVAILABLE /
 * CLOSED / SOLD / RENTED / LEASED / EXPIRED) are separate backend fields;
 * a listing is "Live" only when it is VERIFIED and AVAILABLE.
 */
export function ownerStatusOf(l: Pick<OwnerListingOut, 'verification_status' | 'listing_status'>): OwnerListing['status'] {
  if (l.verification_status === 'REJECTED') return 'Rejected';
  if (l.verification_status !== 'VERIFIED') return 'Pending Verification';
  switch (l.listing_status) {
    case 'AVAILABLE':
      return 'Live';
    case 'SOLD':
      return 'Sold';
    case 'RENTED':
      return 'Rented';
    case 'LEASED':
      return 'Leased';
    case 'EXPIRED':
      return 'Expired';
    default:
      return 'Closed';
  }
}

function fromBackend(o: OwnerListingOut): OwnerListing {
  const created = o.submitted_at || '';
  const cover = o.cover_image_url && /^https?:\/\//i.test(o.cover_image_url) ? o.cover_image_url : '';
  return {
    ...emptyListing(),
    id: String(o.listing_id),
    status: ownerStatusOf(o),
    createdAt: created,
    updatedAt: created,
    purpose: PURPOSE_FROM_DEAL[o.transaction_type] || 'Sell',
    category: o.property_type === 'COMMERCIAL' ? 'Commercial' : 'Residential',
    propertyType: TYPE_LABEL[o.property_type] || o.property_type,
    bhk: o.bedrooms ? `${o.bedrooms} BHK` : '',
    city: o.city,
    district: o.district || '',
    locality: o.locality,
    pincode: o.pincode,
    subLocality: o.sub_locality || '',
    society: o.society_name || '',
    houseNo: o.house_no || '',
    bedrooms: o.bedrooms != null ? String(o.bedrooms) : '',
    bathrooms: o.bathrooms != null ? String(o.bathrooms) : '',
    balconies: o.balconies != null ? String(o.balconies) : '',
    carpetArea: o.area_value != null ? String(o.area_value) : '',
    builtUpArea: o.built_up_area != null ? String(o.built_up_area) : '',
    superBuiltUpArea: o.super_built_up_area != null ? String(o.super_built_up_area) : '',
    furnishing: o.furnishing || '',
    facing: o.facing || '',
    price: String(Math.round(o.price_paise / 100)),
    description: o.description || '',
    photos: cover ? [{ id: 'cover', src: cover, category: 'Exterior' }] : [],
  };
}

/** All of the signed-in owner's listings (newest first), up to the backend page cap. */
export async function fetchOwnerListings(): Promise<OwnerListing[]> {
  const page = await listOwnerListings(1, 100);
  return page.items.filter((o) => !o.removed).map(fromBackend);
}

/** Soft-delete a real listing (DELETE /owner/listings/{id}). */
export async function removeOwnerListing(id: string): Promise<void> {
  await deleteOwnerListing(Number(id));
}
