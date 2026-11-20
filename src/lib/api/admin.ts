/**
 * Admin API (/admin/*), shapes from Restamp-backend app/schemas.py
 * (AdminMeOut, AdminDashboardOut, AdminListingRow/DetailOut, AdminUserRow/DetailOut,
 * AdminEnquiryRow/DetailOut, AdminAuditLogRow, AdminSubscriptionRow, AdminPaymentRow).
 *
 * Authorization is entirely server-side: every endpoint checks the caller's
 * admin_accounts row and one permission of its admin_role on each request.
 * Nothing here (or in the UI) decides who is an admin; a non-admin gets 403.
 */
import { apiGet, apiPost, Page } from './client';
import type { OwnerListingOut } from './owner';

export type AdminMe = { user_id: number; display_name: string; admin_role: string; role_label: string; permissions: string[] };

export type AdminDashboard = {
  listings_total: number;
  listings_live: number;
  listings_pending: number;
  listings_rejected: number;
  enquiries_total: number;
  enquiries_open: number;
  users_total: number;
  users_suspended: number;
  buyers: number;
  owners: number;
  brokers: number;
  admins: number;
  unavailable: string[];
};

export type AdminListingRow = {
  listing_id: number;
  title: string;
  property_type: string;
  transaction_type: string;
  price_paise: number;
  price_period: string;
  price_display: string;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | string;
  listing_status: string;
  removed: boolean;
  submitted_at: string | null;
  owner_user_id: number;
  owner_name: string | null;
  locality: string;
  city: string;
  pincode: string;
  cover_image_url: string | null;
};

export type VerificationEvent = {
  attempt_no: number;
  action: string | null;
  actor: string | null;
  result: string;
  reason: string | null;
  category: string | null;
  triggered_at: string | null;
  triggered_by_user_id: number | null;
};

export type AdminListingDetail = {
  listing: OwnerListingOut & { gallery?: string[]; amenities?: string[]; photos?: { url: string; category?: string | null }[] };
  owner: { user_id: number; display_name: string | null; status: string | null };
  verification_history: VerificationEvent[];
};

export type AdminUserRow = {
  user_id: number;
  display_name: string | null;
  status: 'active' | 'suspended' | 'closed' | string;
  current_role: 'BUYER' | 'OWNER' | 'BROKER' | null;
  admin_role: string | null;
  joined_at: string | null;
};

export type AdminUserDetail = AdminUserRow & {
  phone: string | null;
  providers: string[];
  activity: { listings_owned: number; enquiries_sent: number; enquiries_received: number; visits_requested: number; broker_covered_locations: number };
};

export type AdminEnquiryRow = {
  id: number;
  status: 'NEW' | 'CONTACTED' | 'CLOSED' | string;
  closing_reason: string | null;
  created_at: string | null;
  property_listing_id: number;
  listing_title: string | null;
  buyer_user_id: number;
  buyer_name: string | null;
  owner_user_id: number;
  owner_name: string | null;
  message_count: number;
  last_message: string | null;
  last_message_at: string | null;
};

export type AdminEnquiryDetail = AdminEnquiryRow & {
  messages: { id: number | null; body: string; sender: 'BUYER' | 'OWNER'; created_at: string | null }[];
};

export type AdminAuditLog = {
  id: number;
  actor_user_id: number;
  actor_name: string | null;
  action: string;
  entity: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  created_at: string | null;
};

export type AdminSubscription = {
  id: number;
  user_id: number;
  user_name: string | null;
  user_current_role: string | null;
  plan_code: string;
  plan_name: string;
  price_paise: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | string;
  start_date: string | null;
  end_date: string | null;
  payment_id: number;
  payment_provider: string;
  /** Not a real payment (simulated, temporary bypass, admin assignment or free trial): no money was charged. */
  simulated: boolean;
  plan_role?: string | null;
  source?: string | null;
  usage?: { listings_used?: number; leads_used?: number; localities_used?: number };
};

export type AdminPayment = {
  id: number;
  user_id: number;
  user_name: string | null;
  plan_code: string | null;
  plan_name: string | null;
  provider: string;
  simulated: boolean;
  provider_payment_id: string | null;
  amount_paise: number;
  currency: string;
  status: 'INITIATED' | 'SUCCESS' | 'FAILED' | string;
  created_at: string | null;
  paid_at: string | null;
};

type Q = Record<string, string | number | boolean | undefined>;
const MAX = 100; // backend page_size cap

export const getAdminMe = () => apiGet<AdminMe>('/admin/me');
export const getAdminDashboard = () => apiGet<AdminDashboard>('/admin/dashboard');

export const listAdminListings = (q: Q = {}) => apiGet<Page<AdminListingRow>>('/admin/listings', { page_size: MAX, ...q });
export const getAdminListing = (id: number) => apiGet<AdminListingDetail>(`/admin/listings/${id}`);
export const verifyAdminListing = (id: number) => apiPost<AdminListingDetail>(`/admin/listings/${id}/verify`);
export const rejectAdminListing = (id: number, reason: string, category?: string) =>
  apiPost<AdminListingDetail>(`/admin/listings/${id}/reject`, category ? { reason, category } : { reason });

export const listAdminUsers = (q: Q = {}) => apiGet<Page<AdminUserRow>>('/admin/users', { page_size: MAX, ...q });
export const getAdminUser = (id: number) => apiGet<AdminUserDetail>(`/admin/users/${id}`);
export const suspendAdminUser = (id: number, reason: string) => apiPost<AdminUserDetail>(`/admin/users/${id}/suspend`, { reason });
export const reactivateAdminUser = (id: number) => apiPost<AdminUserDetail>(`/admin/users/${id}/reactivate`);

export const listAdminEnquiries = (q: Q = {}) => apiGet<Page<AdminEnquiryRow>>('/admin/enquiries', { page_size: MAX, ...q });
export const getAdminEnquiry = (id: number) => apiGet<AdminEnquiryDetail>(`/admin/enquiries/${id}`);

export const listAdminAuditLogs = (q: Q = {}) => apiGet<Page<AdminAuditLog>>('/admin/audit-logs', { page_size: MAX, ...q });
export const listAdminSubscriptions = (q: Q = {}) => apiGet<Page<AdminSubscription>>('/admin/subscriptions', { page_size: MAX, ...q });
export const listAdminPayments = (q: Q = {}) => apiGet<Page<AdminPayment>>('/admin/payments', { page_size: MAX, ...q });

/** Fetch every page of a paginated admin list (capped to keep the console responsive). */
export async function fetchAll<T>(load: (q: Q) => Promise<Page<T>>, q: Q = {}, maxPages = 10): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const res = await load({ ...q, page });
    out.push(...res.items);
    if (out.length >= res.total || res.items.length === 0) break;
  }
  return out;
}
