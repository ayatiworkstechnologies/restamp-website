import { useEffect, useState } from 'react';
import { errorMessage } from '@/lib/api/client';
import { getSession } from '@/lib/api/session';
import {
  listOwnerLeads,
  listOwnerVisits,
  proposeOwnerVisit,
  rescheduleOwnerVisit,
  updateOwnerLead as updateOwnerLeadApi,
  updateOwnerVisit,
  type OwnerLeadOut,
  type OwnerVisitOut,
} from '@/lib/api/owner';
import { toast } from '@/lib/notify';

/**
 * Buyer leads and site visits for the owner dashboard, from the backend:
 * GET /owner/leads, PATCH /owner/leads/{id}, GET /owner/visits,
 * POST /owner/visits, PATCH /owner/visits/{id}. Only the caller's own leads
 * and visits are ever returned (the backend filters on the token's user).
 *
 * The exported names and shapes are the ones the existing pages already use.
 * Differences the backend imposes, never papered over:
 * - The backend never shares a buyer's phone number with owners, so `phone`
 *   is always '' (the pages already show "Phone not provided").
 * - Lead statuses are NEW / CONTACTED / CLOSED only. "Visit" and
 *   "Negotiating" have no backend status, and closing needs a closing reason
 *   the existing page does not ask for: those changes are refused with a
 *   message and nothing changes.
 */

export type LeadStatus = 'New' | 'Contacted' | 'Visit' | 'Closed';
export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Visit', 'Closed'];

export type OwnerLead = {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  propertyTitle: string;
  locality: string;
  message: string;
  messageCount: number;
  status: LeadStatus;
  createdAt: string;
  /** Backend ids needed to propose a visit. */
  listingId?: number;
  buyerUserId?: number;
  /** Private notes kept on this lead. */
  notes?: string;
  /** When the status last changed. */
  statusUpdatedAt?: string;
};

export type VisitStatus = 'REQUESTED' | 'PROPOSED' | 'CONFIRMED' | 'COMPLETED' | 'DECLINED' | 'CANCELLED';

export type OwnerVisit = {
  id: string;
  leadId: string;
  customerName: string;
  phone: string;
  propertyTitle: string;
  scheduledAt: string;
  status: VisitStatus;
  note?: string;
};

export const LEADS_EVENT = 'owner-leads-change';

const LEAD_STATUS_FROM_BACKEND: Record<string, LeadStatus> = { NEW: 'New', CONTACTED: 'Contacted', CLOSED: 'Closed' };

function toLead(l: OwnerLeadOut): OwnerLead {
  return {
    id: String(l.id),
    customerName: l.buyer_display_name || (l.source_role === 'BROKER' ? 'Dealer' : 'Buyer'),
    phone: '',
    propertyTitle: l.listing?.title || 'Property',
    locality: [l.listing?.locality, l.listing?.city].filter(Boolean).join(', '),
    message: l.last_message || l.message || '',
    messageCount: l.message_count,
    status: LEAD_STATUS_FROM_BACKEND[l.status] || 'New',
    createdAt: l.created_at || new Date(0).toISOString(),
    listingId: l.property_listing_id,
    buyerUserId: l.buyer_user_id,
  };
}

function toVisit(v: OwnerVisitOut, leads: OwnerLeadOut[]): OwnerVisit {
  const lead = leads.find((l) => l.property_listing_id === v.property_listing_id && l.buyer_user_id === v.buyer_user_id);
  return {
    id: String(v.id),
    leadId: lead ? String(lead.id) : '',
    customerName: v.buyer_display_name || 'Buyer',
    phone: '',
    propertyTitle: v.listing?.title || 'Property',
    scheduledAt: v.scheduled_at,
    status: (v.status as VisitStatus) || 'REQUESTED',
    note: v.note || undefined,
  };
}

function refresh() {
  window.dispatchEvent(new Event(LEADS_EVENT));
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (status === 'Visit' || (status as string) === 'Negotiating') {
    toast.error(`"${status}" is not a lead status the server supports. Use Propose Visit to arrange a visit.`);
    refresh();
    return false;
  }
  if (status === 'Closed') {
    toast.error('Closing a lead needs a closing reason, which this page does not collect yet.');
    refresh();
    return false;
  }
  try {
    await updateOwnerLeadApi(Number(id), status === 'New' ? 'NEW' : 'CONTACTED');
    refresh();
    return true;
  } catch (e) {
    toast.error(errorMessage(e, 'Could not update this lead. Please try again.'));
    refresh();
    return false;
  }
}

export function updateOwnerLead(id: string, patch: Partial<OwnerLead>) {
  if (patch.status) void updateLeadStatus(id, patch.status);
}

export async function proposeVisit(lead: OwnerLead, scheduledAt: string, note?: string): Promise<boolean> {
  try {
    if (!lead.listingId || !lead.buyerUserId) {
      toast.error('Missing listing or buyer information to propose a visit.');
      return false;
    }
    // An open visit for this buyer + listing is rescheduled (PATCH); otherwise a new one is proposed (POST).
    const open = (await listOwnerVisits()).items.find(
      (v) =>
        v.property_listing_id === lead.listingId &&
        v.buyer_user_id === lead.buyerUserId &&
        !['COMPLETED', 'DECLINED', 'CANCELLED'].includes(v.status),
    );
    if (open) await rescheduleOwnerVisit(open.id, scheduledAt, note);
    else await proposeOwnerVisit(lead.listingId, lead.buyerUserId, scheduledAt, note);
    toast.success(open ? 'Visit updated' : 'Visit proposed', { description: 'The buyer can accept or decline it.' });
    refresh();
    return true;
  } catch (e) {
    toast.error(errorMessage(e, 'Could not propose this visit. Please try again.'));
    return false;
  }
}

export async function updateVisitStatus(id: string, status: VisitStatus): Promise<boolean> {
  if (status === 'REQUESTED' || status === 'PROPOSED') return false; // not owner-settable
  try {
    await updateOwnerVisit(Number(id), status);
    refresh();
    return true;
  } catch (e) {
    toast.error(errorMessage(e, 'Could not update this visit. Please try again.'));
    return false;
  }
}

export const activeVisitFor = (leadId: string, visits: OwnerVisit[]) =>
  visits.find((v) => v.leadId === leadId && !['COMPLETED', 'DECLINED', 'CANCELLED'].includes(v.status));

export const visitBucket = (v: OwnerVisit): 'Awaiting' | 'Upcoming' | 'Completed' =>
  v.status === 'REQUESTED' || v.status === 'PROPOSED' ? 'Awaiting' : v.status === 'CONFIRMED' ? 'Upcoming' : 'Completed';

export const timeAgo = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 6e4);
  if (m < 60) return `${Math.max(1, m)}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
};

export const formatVisit = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

/** The owner's real leads and visits (newest first); empty while loading or for guests. */
export function useOwnerLeads() {
  const [state, setState] = useState<{ leads: OwnerLead[]; visits: OwnerVisit[] }>({ leads: [], visits: [] });
  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      if (!getSession()) return setState({ leads: [], visits: [] });
      try {
        const leads = await listOwnerLeads();
        const visits = await listOwnerVisits();
        if (!cancelled) setState({ leads: leads.items.map(toLead), visits: visits.items.map((v) => toVisit(v, leads.items)) });
      } catch (e) {
        if (!cancelled) toast.error(errorMessage(e, 'Could not load your leads and visits.'), { id: 'owner-leads-error' });
      }
    };
    void sync();
    window.addEventListener(LEADS_EVENT, sync);
    return () => {
      cancelled = true;
      window.removeEventListener(LEADS_EVENT, sync);
    };
  }, []);
  return state;
}
