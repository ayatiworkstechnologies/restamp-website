/**
 * Admin subscription management on the real backend, in the shape the original
 * admin subscription pages render (same names as lib/subscription-store, so the
 * pages keep their layout and only import from here).
 *
 *   GET    /admin/plans?include_archived=true    plans of every role      [reports.view]
 *   POST   /admin/plans, PATCH /admin/plans/{id}, POST /admin/plans/{id}/status   [settings.configure_platform]
 *   GET    /admin/plan-history                    pricing history (plan versions)
 *   GET    /admin/subscriptions, GET /admin/payments
 *   POST   /admin/users/{id}/subscription         assign / change a user's plan  [users.suspend]
 *   POST   /admin/subscriptions/{id}/extend|suspend|reactivate|cancel
 *
 * Plan ids in the UI are backend plan codes. Subscriptions are linked to users by
 * backend user id (subscriberPhone carries "uid:<id>"; see subscriberKey).
 * Payments: only a real gateway payment could be "verified"; none exists. SIMULATED,
 * BYPASS (temporary payment bypass) and ADMIN (admin assignment) rows are shown as
 * unverified with a clear method label and never count as revenue.
 */
import { useEffect, useState } from 'react';
import { apiGet, apiPatch, apiPost, errorMessage, Page } from '@/lib/api/client';
import { getSession } from '@/lib/api/session';
import { fetchAll, listAdminPayments, listAdminSubscriptions, type AdminPayment, type AdminSubscription } from '@/lib/api/admin';
import type { Actor, PlanDraft, SubscriptionSnapshot, SubscriptionView } from '@/lib/subscription-store';
import type { BillingCycle, PaymentRecord, PlanStatus, PricingHistoryEntry, SubscriberRole, SubscriptionPlan, SubscriptionStatus } from '@/types/subscription';
import { EXPIRING_WINDOW_DAYS } from '@/lib/subscription-store';

export { EXPIRING_WINDOW_DAYS, normalizePhone } from '@/lib/subscription-store';
export type { SubscriptionView, PlanDraft, Actor } from '@/lib/subscription-store';

export const BILLING_EVENT = 'admin-billing-change';
const refresh = () => typeof window !== 'undefined' && window.dispatchEvent(new Event(BILLING_EVENT));

type BackendRole = 'BUYER' | 'OWNER' | 'BROKER';
const ROLE: Record<string, SubscriberRole> = { BUYER: 'buyer', OWNER: 'owner', BROKER: 'agent' };
const BACKEND_ROLE: Record<SubscriberRole, BackendRole> = { buyer: 'BUYER', owner: 'OWNER', agent: 'BROKER' };
const rupees = (paise: number) => Math.round(paise / 100);
const iso = (v: string | null | undefined) => (v ? (v.endsWith('Z') || v.includes('+') ? v : `${v}Z`) : '');

/** Key linking subscriptions to admin user rows (backend user id). */
export const subscriberKey = (userId: string | number) => `uid:${userId}`;

export type BackendPlan = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  role: BackendRole;
  price_paise: number;
  duration_days: number | null;
  billing_cycle: BillingCycle;
  listing_limit: number | null;
  lead_limit: number | null;
  location_limit: number | null;
  features: string[];
  visible: boolean;
  recommended: boolean;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  version: number;
  is_free: boolean;
  active_subscribers: number;
  created_at: string | null;
  updated_at: string | null;
  updated_by_user_id: number | null;
};

type PlanVersion = { id: number; plan_id: number; plan_code: string; version: number; snapshot: Record<string, unknown>; change_note: string | null; changed_by_user_id: number | null; created_at: string | null };

const STATUS: Record<BackendPlan['status'], PlanStatus> = { ACTIVE: 'active', PAUSED: 'inactive', ARCHIVED: 'archived' };
const lim = (v: number | null) => (v === null ? -1 : v);

function toPlan(p: BackendPlan): SubscriptionPlan {
  const role = ROLE[p.role];
  const limits: SubscriptionPlan['limits'] =
    role === 'owner' ? { listingLimit: lim(p.listing_limit) }
    : role === 'agent' ? { locationLimit: lim(p.location_limit), ...(p.listing_limit !== null ? { listingLimit: p.listing_limit } : {}) }
    : { savedPropertyLimit: lim(p.lead_limit) }; // buyer: owner-contact (lead) limit
  return {
    id: p.code,
    role,
    name: p.name,
    description: p.description || '',
    price: rupees(p.price_paise),
    currency: 'INR',
    billingCycle: p.billing_cycle,
    validityDays: p.duration_days,
    status: STATUS[p.status],
    visible: p.visible,
    recommended: p.recommended,
    limits,
    features: p.features || [],
    sortOrder: 0,
    version: p.version,
    createdAt: iso(p.created_at),
    updatedAt: iso(p.updated_at || p.created_at),
    updatedBy: p.updated_by_user_id ? `Admin #${p.updated_by_user_id}` : 'System',
  };
}

function subStatus(s: AdminSubscription, now: number): SubscriptionStatus {
  if (s.status === 'CANCELLED') return 'cancelled';
  if (s.status === 'EXPIRED') return 'expired';
  if (s.status === 'SUSPENDED') return 'suspended';
  const end = s.end_date ? Date.parse(iso(s.end_date)) : null;
  if (end !== null && end - now <= EXPIRING_WINDOW_DAYS * 864e5) return 'expiring';
  return 'active';
}

function methodLabel(provider: string): string {
  if (provider === 'BYPASS') return 'Payment bypass (temporary, not paid)';
  if (provider === 'ADMIN') return 'Assigned by admin (not paid)';
  if (provider === 'SIMULATED') return 'Simulated (no charge)';
  if (provider === 'FREE_TRIAL') return 'Free trial';
  return provider;
}

function toPayment(p: AdminPayment, sub: AdminSubscription | undefined, role: SubscriberRole): PaymentRecord {
  const amount = rupees(p.amount_paise);
  const verified = !p.simulated && p.status === 'SUCCESS';
  return {
    id: String(p.id),
    transactionRef: p.provider_payment_id || '',
    subscriptionId: sub ? String(sub.id) : undefined,
    role,
    subscriberName: p.user_name || `User #${p.user_id}`,
    subscriberPhone: subscriberKey(p.user_id),
    planId: p.plan_code || '',
    planName: p.plan_name || '',
    baseAmount: amount,
    discount: 0,
    gst: 0,
    total: amount,
    currency: 'INR',
    method: methodLabel(p.provider),
    provider: p.provider,
    // Only a real, successful gateway payment is verified; simulated/bypass/admin rows never are.
    verification: p.simulated ? 'unverified' : p.status === 'FAILED' ? 'failed' : verified ? 'verified' : 'pending',
    // Invoice numbers exist only for verified payments.
    invoiceRef: verified ? `INV-${p.id}` : undefined,
    createdAt: iso(p.created_at),
    verifiedAt: verified ? iso(p.paid_at) || undefined : undefined,
    source: 'checkout',
  };
}

function toHistory(versions: PlanVersion[], plans: BackendPlan[]): PricingHistoryEntry[] {
  const byPlan = new Map<number, PlanVersion[]>();
  for (const v of versions) byPlan.set(v.plan_id, [...(byPlan.get(v.plan_id) || []), v]);
  const out: PricingHistoryEntry[] = [];
  for (const [planId, list] of byPlan) {
    const sorted = [...list].sort((a, b) => a.version - b.version);
    sorted.forEach((v, i) => {
      const prev = sorted[i - 1]?.snapshot;
      const cur = v.snapshot;
      const changes = Object.keys(cur)
        .filter((k) => !['price_paise', 'version'].includes(k) && prev && JSON.stringify(prev[k]) !== JSON.stringify(cur[k]))
        .map((k) => ({ field: k, from: String(prev?.[k] ?? '—'), to: String(cur[k] ?? '—') }));
      const plan = plans.find((p) => p.id === planId);
      out.push({
        id: String(v.id),
        planId: v.plan_code,
        planName: String(cur.name ?? plan?.name ?? v.plan_code),
        role: ROLE[String(cur.role ?? plan?.role ?? 'BUYER')] || 'buyer',
        changedBy: v.changed_by_user_id ? `Admin #${v.changed_by_user_id}` : 'System',
        changedAt: iso(v.created_at),
        oldPrice: prev ? rupees(Number(prev.price_paise)) : null,
        newPrice: rupees(Number(cur.price_paise)),
        changes: v.change_note ? [...changes, { field: 'note', from: '', to: v.change_note }] : changes,
        fromVersion: prev ? sorted[i - 1].version : null,
        toVersion: v.version,
      });
    });
  }
  return out.sort((a, b) => b.changedAt.localeCompare(a.changedAt));
}

const EMPTY: SubscriptionSnapshot & { error: string } = { ready: false, plans: [], subscriptions: [], payments: [], history: [], audit: [], error: '' };

/** Plans of every role, as the backend stores them (cached for the write helpers below). */
let planCache: BackendPlan[] = [];

export function useSubscriptionData(): SubscriptionSnapshot & { error: string } {
  const [data, setData] = useState(EMPTY);
  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (!getSession()) {
        setData({ ...EMPTY, ready: true });
        return;
      }
      Promise.all([
        apiGet<{ items: BackendPlan[] }>('/admin/plans', { include_archived: true }),
        fetchAll(listAdminSubscriptions),
        fetchAll(listAdminPayments),
        fetchAll((q) => apiGet<Page<PlanVersion>>('/admin/plan-history', { page_size: 100, ...q }), {}, 5).catch(() => [] as PlanVersion[]),
      ])
        .then(([plans, subs, pays, versions]) => {
          if (cancelled) return;
          planCache = plans.items;
          const now = Date.now();
          const subscriptions: SubscriptionView[] = subs.map((s) => {
            const role = ROLE[s.plan_role || ''] || ROLE[s.user_current_role || ''] || 'buyer';
            const pay = pays.find((p) => p.id === s.payment_id);
            const plan = plans.items.find((p) => p.code === s.plan_code);
            const usage = s.usage || {};
            return {
              id: String(s.id),
              role,
              subscriberName: s.user_name || `User #${s.user_id}`,
              subscriberPhone: subscriberKey(s.user_id),
              planId: s.plan_code,
              snapshot: {
                name: s.plan_name,
                price: rupees(s.price_paise),
                billingCycle: (plan?.billing_cycle || 'one_time') as BillingCycle,
                validityDays: plan?.duration_days ?? null,
                limits: plan ? toPlan(plan).limits : {},
                version: plan?.version ?? 1,
              },
              amountPaid: pay && !pay.simulated && pay.status === 'SUCCESS' ? rupees(pay.amount_paise) : 0,
              currency: 'INR',
              activatedAt: iso(s.start_date),
              expiresAt: s.end_date ? iso(s.end_date) : null,
              adminStatus: s.status === 'SUSPENDED' ? 'suspended' : s.status === 'CANCELLED' ? 'cancelled' : undefined,
              paymentId: String(s.payment_id),
              usage: { listingsUsed: usage.listings_used, savedUsed: usage.leads_used, locationsUsed: usage.localities_used },
              source: 'checkout',
              status: subStatus(s, now),
              payment: pay ? toPayment(pay, s, role) : undefined,
            };
          });
          const payments = pays.map((p) => {
            const sub = subs.find((s) => s.payment_id === p.id);
            return toPayment(p, sub, ROLE[sub?.plan_role || ''] || 'buyer');
          });
          setData({ ready: true, plans: plans.items.map(toPlan), subscriptions, payments, history: toHistory(versions, plans.items), audit: [], error: '' });
        })
        .catch((e) => {
          if (!cancelled) setData({ ...EMPTY, ready: true, error: errorMessage(e, 'Could not load subscription records.') });
        });
    };
    load();
    window.addEventListener(BILLING_EVENT, load);
    return () => {
      cancelled = true;
      window.removeEventListener(BILLING_EVENT, load);
    };
  }, []);
  return data;
}

const planByCode = (code: string) => {
  const p = planCache.find((x) => x.code === code);
  if (!p) throw new Error('This plan no longer exists. Refresh the page.');
  return p;
};

function limitFields(draft: PlanDraft) {
  const L = draft.limits || {};
  const v = (n: number | undefined) => (n === undefined ? null : n);
  if (draft.role === 'owner') return { listing_limit: v(L.listingLimit) };
  if (draft.role === 'agent') return { location_limit: v(L.locationLimit), listing_limit: v(L.listingLimit) };
  return { lead_limit: v(L.savedPropertyLimit) };
}

function codeFor(draft: PlanDraft): string {
  const base = `RESTAMP_${BACKEND_ROLE[draft.role]}_${draft.name}`.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
  return base.slice(0, 44) + '_' + Date.now().toString(36).toUpperCase().slice(-5);
}

/** Create (no id) or edit (id = plan code) a plan. Resolves to the saved plan. */
export async function savePlan(draft: PlanDraft, _actor?: Actor): Promise<SubscriptionPlan> {
  const common = {
    name: draft.name.trim(),
    description: draft.description?.trim() || null,
    price_paise: Math.round(Number(draft.price) * 100),
    duration_days: draft.validityDays ?? null,
    billing_cycle: draft.billingCycle,
    features: draft.features || [],
    visible: draft.visible,
    recommended: draft.recommended,
    ...limitFields(draft),
  };
  let saved: BackendPlan;
  if (draft.id) {
    saved = await apiPatch<BackendPlan>(`/admin/plans/${planByCode(draft.id).id}`, common);
  } else {
    saved = await apiPost<BackendPlan>('/admin/plans', {
      ...common,
      code: codeFor(draft),
      role: BACKEND_ROLE[draft.role],
      status: draft.status === 'active' ? 'ACTIVE' : 'PAUSED',
    });
  }
  refresh();
  return toPlan(saved);
}

/** active -> ACTIVE, inactive -> PAUSED, archived -> ARCHIVED (archiving is final). */
export async function setPlanStatus(code: string, to: PlanStatus, _actor?: Actor): Promise<void> {
  const status = to === 'active' ? 'ACTIVE' : to === 'archived' ? 'ARCHIVED' : 'PAUSED';
  await apiPost(`/admin/plans/${planByCode(code).id}/status`, { status });
  refresh();
}

/** Plans are never deleted (history is kept): deleting archives the plan. */
export async function deletePlan(code: string, _actor?: Actor): Promise<void> {
  await setPlanStatus(code, 'archived');
}

export function planIsReferenced(code: string): boolean {
  return (planCache.find((p) => p.code === code)?.active_subscribers ?? 0) > 0;
}

export async function setSubscriptionAdminStatus(id: string, status: 'cancelled' | 'suspended' | null, reason: string, _actor?: Actor): Promise<void> {
  const action = status === 'cancelled' ? 'cancel' : status === 'suspended' ? 'suspend' : 'reactivate';
  await apiPost(`/admin/subscriptions/${id}/${action}`, { reason: reason.trim() || null });
  refresh();
}

/** Assign or change (upgrade / downgrade) a user's plan. `subscriberPhone` carries subscriberKey(userId). */
export async function grantSubscription(
  input: { role: SubscriberRole; planId: string; subscriberName: string; subscriberPhone: string; validityDays?: number | null; reason: string },
  _actor?: Actor,
): Promise<void> {
  const userId = input.subscriberPhone.startsWith('uid:') ? input.subscriberPhone.slice(4) : '';
  if (!userId) throw new Error('This account could not be identified.');
  const plan = planByCode(input.planId);
  if (ROLE[plan.role] !== input.role) throw new Error('That plan is for a different role.');
  await apiPost(`/admin/users/${userId}/subscription`, {
    plan_code: input.planId,
    reason: input.reason,
    ...(input.validityDays ? { validity_days: input.validityDays } : {}),
  });
  refresh();
}

export async function extendSubscription(id: string, days: number, reason: string, _actor?: Actor): Promise<void> {
  await apiPost(`/admin/subscriptions/${id}/extend`, { days, reason });
  refresh();
}

/** Subscriptions are linked to the backend user id, so renaming or re-numbering needs no relink. */
export function relinkSubscriber(..._args: unknown[]): void {}

/** Admin writes are audited by the backend (audit_logs); nothing is recorded locally. */
export function auditUserAction(..._args: unknown[]): void {}
