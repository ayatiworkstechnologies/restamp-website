/**
 * Owner endpoints (/owner/*), shapes verified against Restamp-backend
 * app/schemas.py (OwnerListingOut, OwnerLeadOut, OwnerLeadUpdate, VisitOut,
 * VisitUpdate, OwnerVisitCreate) and app/routers/owner.py.
 *
 * - Every call runs through withRole('OWNER'): the backend's current role
 *   becomes OWNER via POST /users/me/role (the backend allows any account to
 *   enter owner mode, like the mobile app), and the backend still checks the
 *   role and listing ownership on every request. Ownership is never sent
 *   from the browser: the backend takes the owner from the token and filters
 *   on property_listings.user_id AND physical_properties.user_id.
 * - Deliberately NOT exposed: POST /owner/listings/{id}/verify and /reject.
 *   An owner must never approve (or reject) their own listing from this site.
 */
import { apiDelete, apiGet, apiPatch, apiPost, apiRequest, Page } from './client';
import { withRole } from './auth';

export type OwnerListingOut = {
  listing_id: number;
  title: string;
  transaction_type: string;
  property_type: string;
  price_paise: number;
  price_period: string;
  price_display: string;
  construction_status: string | null;
  verification_status: string; // PENDING | VERIFIED | REJECTED
  listing_status: string; // AVAILABLE | CLOSED | SOLD | RENTED | LEASED | EXPIRED
  removed?: boolean;
  description: string | null;
  locality: string;
  city: string;
  district?: string;
  pincode: string;
  address_line: string | null;
  sub_locality?: string | null;
  society_name?: string | null;
  house_no?: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  balconies?: number | null;
  built_up_area?: number | null;
  super_built_up_area?: number | null;
  area_value: number | null;
  area_unit: string | null;
  furnishing?: string | null;
  facing?: string | null;
  submitted_at?: string | null;
  cover_image_url: string | null;
  gallery?: string[];
  enquiry_count?: number;
  visit_count?: number;
  call_count?: number;
};

export type OwnerLeadOut = {
  id: number;
  property_listing_id: number;
  buyer_user_id: number;
  buyer_display_name: string | null;
  source_role: 'BUYER' | 'BROKER';
  listing_removed: boolean;
  message: string | null;
  status: 'NEW' | 'CONTACTED' | 'CLOSED' | string;
  closing_reason: string | null;
  created_at: string | null;
  message_count: number;
  last_message: string | null;
  last_message_at: string | null;
  listing: { title: string; price_paise?: number; price_period?: string; locality?: string | null; city?: string | null };
};

export type OwnerVisitOut = {
  id: number;
  property_listing_id: number;
  buyer_user_id: number;
  owner_user_id: number;
  buyer_display_name: string | null;
  scheduled_at: string;
  status: 'REQUESTED' | 'PROPOSED' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED' | string;
  initiator: string;
  note: string | null;
  listing: { title: string; locality?: string | null; city?: string | null };
  created_at: string | null;
};

const ALL = 100; // backend page_size cap

export const listOwnerListings = (page = 1, pageSize = ALL) =>
  withRole('OWNER', () => apiGet<Page<OwnerListingOut>>('/owner/listings', { page, page_size: pageSize }));

/** Soft delete (sets deleted_at; the backend never hard-deletes listings). */
export const deleteOwnerListing = (listingId: number) =>
  withRole('OWNER', () => apiDelete(`/owner/listings/${listingId}`));

export const listOwnerLeads = (page = 1, pageSize = ALL) =>
  withRole('OWNER', () => apiGet<Page<OwnerLeadOut>>('/owner/leads', { page, page_size: pageSize }));

/** Only NEW / CONTACTED / CLOSED exist; CLOSED needs one of the backend's closing reasons. */
export const updateOwnerLead = (
  leadId: number,
  status: 'NEW' | 'CONTACTED' | 'CLOSED',
  closingReason?: 'Rented' | 'Sold' | 'Leased' | 'Not Converted',
) =>
  withRole('OWNER', () =>
    apiPatch<OwnerLeadOut>(`/owner/leads/${leadId}`, closingReason ? { status, closing_reason: closingReason } : { status }),
  );

export const listOwnerVisits = (page = 1, pageSize = ALL) =>
  withRole('OWNER', () => apiGet<Page<OwnerVisitOut>>('/owner/visits', { page, page_size: pageSize }));

/** Owner proposes a time to a buyer who enquired on one of the owner's listings. */
export const proposeOwnerVisit = (listingId: number, buyerUserId: number, scheduledAt: string, note?: string) =>
  withRole('OWNER', () =>
    apiPost<OwnerVisitOut>('/owner/visits', {
      property_listing_id: listingId,
      buyer_user_id: buyerUserId,
      scheduled_at: scheduledAt,
      note: note?.trim() || null,
    }),
  );

export const updateOwnerVisit = (visitId: number, status: 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED') =>
  withRole('OWNER', () => apiPatch<OwnerVisitOut>(`/owner/visits/${visitId}`, { status }));

/** Owner reschedules an existing visit (VisitUpdate.scheduled_at). */
export const rescheduleOwnerVisit = (visitId: number, scheduledAt: string, note?: string) =>
  withRole('OWNER', () =>
    apiPatch<OwnerVisitOut>(`/owner/visits/${visitId}`, note?.trim() ? { scheduled_at: scheduledAt, note: note.trim() } : { scheduled_at: scheduledAt }),
  );

// --- listing drafts ---------------------------------------------------------
// POST /owner/drafts, GET /owner/drafts, GET/PUT/DELETE /owner/drafts/{id}
// (committed DraftCreate / DraftUpdate / DraftOut). form_data is stored as a
// JSON snapshot and PUT REPLACES it entirely (no merge). Owner-scoped by the
// token: another owner's draft id answers 404.

export type DraftOut = {
  id: number;
  transaction_type: string;
  title: string | null;
  current_step: number;
  form_data: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
};

export type DraftIn = { transaction_type: string; title: string | null; current_step: number; form_data: Record<string, unknown> };

export const listOwnerDrafts = () => withRole('OWNER', () => apiGet<{ items: DraftOut[]; total: number }>('/owner/drafts'));
export const createOwnerDraft = (body: DraftIn) => withRole('OWNER', () => apiPost<DraftOut>('/owner/drafts', body));
export const updateOwnerDraft = (id: number, body: DraftIn) =>
  withRole('OWNER', () => apiRequest<DraftOut>(`/owner/drafts/${id}`, { method: 'PUT', body }));
export const deleteOwnerDraft = (id: number) => withRole('OWNER', () => apiDelete(`/owner/drafts/${id}`));
