/**
 * Buyer endpoints (/buyer/*), shapes verified against Restamp-backend
 * app/schemas.py (ListingCard, ListingDetail, ListingContactRevealOut,
 * EnquiryCreate/EnquiryOut) and app/routers/buyer.py.
 *
 * Browsing (search, detail, similar) is public and never sends the token.
 * Everything else needs a signed-in user whose current backend role is BUYER
 * (or BROKER), so it runs through withRole / inRole.
 */
import { apiDelete, apiGet, apiPost, apiRequest, isApiError, ApiError, Page } from './client';
import { inRole, withRole } from './auth';

export type ListingCard = {
  listing_id: number;
  title: string;
  price_paise: number;
  price_period: string;
  price_display: string;
  transaction_type: string;
  property_type: string;
  construction_status: string | null;
  description: string | null;
  area_value: number | null;
  area_unit: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  address_line: string | null;
  locality: string;
  city: string;
  pincode: string;
  location_label: string;
  cover_image_url: string | null;
};

export type ListingDetail = ListingCard & {
  gallery: string[];
  verification_status: string;
  listing_status: string;
  owner_name?: string | null;
  furnishing?: string | null;
  facing?: string | null;
  floor_on?: string | null;
  total_floors?: number | null;
};

export type ListingSearch = {
  deal?: 'BUY' | 'RESALE' | 'RENT' | 'LEASE';
  property_type?: 'APARTMENT' | 'VILLA' | 'HOUSE' | 'COMMERCIAL' | 'PLOT' | 'AGRICULTURAL_LAND';
  locality?: string;
  city?: string;
  bedrooms?: number;
  bedrooms_min?: number;
  min_price_paise?: number;
  max_price_paise?: number;
  q?: string;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';
};

export type BuyerEnquiry = {
  id: number;
  property_listing_id: number;
  message: string | null;
  status: string;
  created_at?: string | null;
};

// --- public browsing --------------------------------------------------------

export function searchListings(filters: ListingSearch, page = 1, pageSize = 100, signal?: AbortSignal) {
  return apiRequest<Page<ListingCard>>('/buyer/listings', {
    query: { ...filters, page, page_size: pageSize },
    auth: false,
    signal,
  });
}

export const getListing = (id: number) => apiGet<ListingDetail>(`/buyer/listings/${id}`, undefined, false);

export const getSimilarListings = (id: number, limit = 3) =>
  apiGet<ListingCard[]>(`/buyer/listings/${id}/similar`, { limit }, false);

// --- signed-in buyer actions ------------------------------------------------

export type RevealedContact = { phone: string; ownerName: string | null; ownListing: boolean };

/** POST /buyer/listings/{id}/contact (audited; may 402 when the buyer plan quota is used up). */
export async function revealContact(listingId: number): Promise<RevealedContact> {
  const res = await withRole('BUYER', () =>
    apiPost<{ phone: string; owner_name?: string | null; own_listing?: boolean }>(`/buyer/listings/${listingId}/contact`),
  );
  const ownerName = typeof res.owner_name === 'string' && res.owner_name.trim() ? res.owner_name.trim() : null;
  return { phone: res.phone, ownerName, ownListing: !!res.own_listing };
}

/** POST /buyer/enquiries {property_listing_id, message|null}: 201 new lead, 200 appended to the open one. */
export function sendEnquiry(listingId: number, message: string): Promise<BuyerEnquiry> {
  return withRole('BUYER', () =>
    apiPost<BuyerEnquiry>('/buyer/enquiries', { property_listing_id: listingId, message: message.trim() || null }),
  );
}

/** `passive`: background load that never switches the role. */
export function listSaved(page = 1, pageSize = 100, { passive = false } = {}) {
  const request = () => apiGet<Page<ListingCard>>('/buyer/saved', { page, page_size: pageSize });
  return passive ? inRole('BUYER', request) : withRole('BUYER', request);
}

export async function saveListing(listingId: number): Promise<void> {
  await withRole('BUYER', () => apiPost(`/buyer/saved/${listingId}`));
}

export async function unsaveListing(listingId: number): Promise<void> {
  await withRole('BUYER', () => apiDelete(`/buyer/saved/${listingId}`));
}

/** 402 from the contact reveal: the buyer's free lead quota is used up. */
export function isBuyerPlanRequired(e: unknown): e is ApiError {
  return isApiError(e) && e.status === 402;
}

// --- buyer activity (Activity page, Reva) ---------------------------------
// Shapes from the committed backend schemas: ViewedPropertyOut, CallEventItem,
// EnquiryOut (BuyerEnquiryListingSnapshot), VisitOut (VisitListingSnapshot).

export type ViewedProperty = { id: number; property_listing_id: number; viewed_at: string; listing: ListingCard };
/** One "call button tapped" event (never a completed call); listing is null once it is no longer public. */
export type CallEvent = { id: number; property_listing_id: number; created_at: string; listing: ListingCard | null };
export type BuyerEnquiryItem = BuyerEnquiry & {
  closing_reason: string | null;
  message_count?: number;
  last_message?: string | null;
  last_message_at?: string | null;
  listing: {
    title: string;
    price_paise: number;
    price_period: string;
    price_display?: string | null;
    property_type?: string | null;
    locality?: string | null;
    city?: string | null;
    cover_image_url?: string | null;
  };
};
export type BuyerVisit = {
  id: number;
  property_listing_id: number;
  scheduled_at: string;
  status: string;
  initiator: string;
  note: string | null;
  listing: { title: string; price_paise: number; price_period: string; property_type?: string | null; locality?: string | null; city?: string | null };
};

export const listCallEvents = (page = 1, pageSize = 100) =>
  withRole('BUYER', () => apiGet<Page<CallEvent>>('/buyer/call-events', { page, page_size: pageSize }));

export const listEnquiries = (page = 1, pageSize = 100) =>
  withRole('BUYER', () => apiGet<Page<BuyerEnquiryItem>>('/buyer/enquiries', { page, page_size: pageSize }));

export const listViewed = (page = 1, pageSize = 100) =>
  withRole('BUYER', () => apiGet<Page<ViewedProperty>>('/buyer/viewed', { page, page_size: pageSize }));

/** `passive`: background read for a session already in buyer mode (never switches the role). */
export const listVisits = (page = 1, pageSize = 100, { passive = false } = {}) => {
  const request = () => apiGet<Page<BuyerVisit>>('/buyer/visits', { page, page_size: pageSize });
  return passive ? inRole('BUYER', request) : withRole('BUYER', request);
};

/** Record that the signed-in buyer opened a listing (background; never switches the role). */
export const recordView = (listingId: number) => inRole('BUYER', () => apiPost(`/buyer/viewed/${listingId}`));

/** Record a "call button tapped" event for the listing. */
export const recordCall = (listingId: number) => withRole('BUYER', () => apiPost(`/buyer/listings/${listingId}/call-events`));

// --- buyer plans (lead quota) -----------------------------------------------
// GET /buyer/plans (public) and GET /buyer/plan (require_buyer). The committed
// POST /buyer/plans/{code}/subscribe only SIMULATES payment and is deliberately
// not exposed here.

export type BuyerPlanCard = {
  code: string;
  name: string;
  price_paise: number;
  duration_days: number;
  lead_limit: number | null;
  leads_label: string;
  is_free: boolean;
};

export type BuyerPlanStatus = {
  plan_code: string;
  plan_name: string;
  is_free: boolean;
  lead_limit: number | null;
  leads_used: number;
  leads_remaining: number | null;
  valid_until: string | null;
};

export async function listBuyerPlans(): Promise<BuyerPlanCard[]> {
  const res = await apiGet<{ items: BuyerPlanCard[] }>('/buyer/plans', undefined, false);
  return res.items;
}

export const getBuyerPlanStatus = () => withRole('BUYER', () => apiGet<BuyerPlanStatus>('/buyer/plan'));
