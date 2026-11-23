import { useEffect, useMemo, useState } from 'react';
import { bypassActivate, getMySubscriptions, listPublicPlans, type PublicPlan } from '@/lib/api/subscriptions';
import { getSession } from '@/lib/api/session';
import type { SubscriptionPlan } from '@/types/subscription';
import { BILLING_LABEL } from '@/types/subscription';
import { getPlan as getStorePlan, recordCheckout, usePublicPlans } from '@/lib/subscription-store';
import { getProfile } from '@/lib/profile';
import { getOwnerListings } from '@/lib/ownerListings';

export type OwnerPlan = {
  id: string;
  name: string;
  highlight?: string;
  price: number;
  priceSub1: string;
  priceSub2: string;
  validityDays: number | null; // null = until deal closed
  listingLimit: number;
  popular?: boolean;
  features: string[];
};

// Owner plans are managed in Admin → Subscription Plans and read from the
// subscription store. Prices are never hard-coded here.

/** Legacy screens treat 999 as "unlimited". */
const legacyLimit = (n: number | undefined) => (n === undefined || n < 0 ? 999 : n);

export function toOwnerPlan(p: SubscriptionPlan): OwnerPlan {
  const limit = legacyLimit(p.limits.listingLimit);
  return {
    id: p.id,
    name: p.name,
    highlight: p.badge,
    price: p.price,
    priceSub1: `${BILLING_LABEL[p.billingCycle]} payment · ${p.validityDays ? `${p.validityDays} Days` : 'Until deal closed'}`,
    priceSub2: limit >= 999 ? 'Unlimited property posts' : `${limit} property post${limit === 1 ? '' : 's'}`,
    validityDays: p.validityDays,
    listingLimit: limit,
    popular: p.recommended,
    features: p.features,
  };
}

const EMPTY_CATALOG: Record<'Residential' | 'Commercial', OwnerPlan[]> = { Residential: [], Commercial: [] };

/** Backend owner plan -> the OwnerPlan shape the existing screens render. */
function fromBackend(p: PublicPlan): OwnerPlan {
  const limit = p.listing_limit === null || p.listing_limit < 0 ? 999 : p.listing_limit;
  return {
    id: p.code,
    name: p.name,
    price: Math.round(p.price_paise / 100),
    priceSub1: `${BILLING_LABEL[(p.billing_cycle as keyof typeof BILLING_LABEL)] ?? 'One-time'} payment · ${p.duration_days ? `${p.duration_days} Days` : 'Until deal closed'}`,
    priceSub2: limit >= 999 ? 'Unlimited property posts' : `${limit} property post${limit === 1 ? '' : 's'}`,
    validityDays: p.duration_days,
    listingLimit: limit,
    popular: p.recommended,
    features: p.features || [],
  };
}

let ownerPlanCache: OwnerPlan[] = [];

/**
 * Owner plans. Prefers the backend (GET /subscriptions/plans?role=OWNER); if that
 * endpoint fails or returns nothing (it is not deployed on every backend yet),
 * falls back to the plans managed in Admin → Subscription Plans so the plan
 * sections never get stuck on loading placeholders. Empty while loading.
 */
export function useOwnerPlans(): Record<'Residential' | 'Commercial', OwnerPlan[]> {
  const [backendPlans, setBackendPlans] = useState<OwnerPlan[] | null | 'failed'>(null);
  const localPlans = usePublicPlans('owner');
  useEffect(() => {
    let cancelled = false;
    listPublicPlans('OWNER')
      .then((items) => {
        if (cancelled) return;
        if (items.length === 0) return setBackendPlans('failed');
        ownerPlanCache = items.map(fromBackend);
        setBackendPlans(ownerPlanCache);
      })
      .catch(() => !cancelled && setBackendPlans('failed'));
    return () => {
      cancelled = true;
    };
  }, []);
  return useMemo(() => {
    let list: OwnerPlan[] | null = null;
    if (Array.isArray(backendPlans)) list = backendPlans;
    else if (backendPlans === 'failed' && localPlans) {
      list = localPlans.map(toOwnerPlan);
      ownerPlanCache = list;
    }
    return list ? { Residential: list, Commercial: list } : EMPTY_CATALOG;
  }, [backendPlans, localPlans]);
}

/**
 * Re-read the owner's current plan from the backend (GET /subscriptions/me) and keep
 * the existing local copy in step with it (the backend is the source of truth; the
 * copy only lets existing synchronous screens read it). Resolves to the plan or null.
 */
export async function syncOwnerSubscription(): Promise<OwnerSubscription | null> {
  if (!getSession()) return getSubscription();
  const me = await getMySubscriptions();
  const entry = me.subscriptions.OWNER;
  const s = entry?.subscription;
  try {
    if (!s) {
      localStorage.removeItem(SUB_KEY);
      return null;
    }
    const limit = s.plan.listing_limit === null || s.plan.listing_limit < 0 ? 999 : s.plan.listing_limit;
    const sub: OwnerSubscription = {
      planId: s.plan.code,
      planName: s.plan.name,
      listingLimit: limit,
      startedAt: s.start_date ? `${s.start_date}Z`.replace(/ZZ$/, 'Z') : new Date().toISOString(),
      expiresAt: s.end_date ? `${s.end_date}Z`.replace(/ZZ$/, 'Z') : null,
      paymentId: String(s.id),
    };
    localStorage.setItem(SUB_KEY, JSON.stringify(sub));
    return sub;
  } catch {
    return null;
  }
}

/**
 * Continue on the payment page (TEMPORARY payment bypass): the backend activates the
 * plan without payment (POST /subscriptions/bypass, recorded as BYPASS, never as paid),
 * then the current plan is re-read from the backend.
 */
export async function activateOwnerPlan(plan: OwnerPlan): Promise<{ sub: OwnerSubscription }> {
  await bypassActivate('OWNER', plan.id);
  const sub = await syncOwnerSubscription();
  if (!sub || sub.planId !== plan.id) throw new Error('The plan could not be confirmed. Please try again.');
  return { sub };
}

export const GST_RATE = 0.18;
export const PROMO_CODES: Record<string, number> = { RESTAMP: 300, OWNER10: 300, PROMO: 300 };

export type Payment = {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  discount: number;
  gst: number;
  total: number;
  promoCode?: string;
  method: string; // e.g. "UPI · name@okhdfc" or "Card · •••• 4242"
  paidAt: string;
};

export type OwnerSubscription = {
  planId: string;
  planName: string;
  listingLimit: number;
  startedAt: string;
  expiresAt: string | null;
  paymentId?: string;
};

const SUB_KEY = 'restamp_owner_subscription';
const PAYMENTS_KEY = 'restamp_owner_payments';

export const findPlan = (id: string) => ownerPlanCache.find((p) => p.id === id) ?? (() => {
  const p = getStorePlan(id);
  return p ? toOwnerPlan(p) : undefined;
})();

export function priceBreakdown(plan: OwnerPlan, discount: number) {
  const afterDiscount = Math.max(0, plan.price - discount);
  const gst = Math.round(afterDiscount * GST_RATE);
  return { amount: plan.price, discount: plan.price - afterDiscount, gst, total: afterDiscount + gst };
}

export function getSubscription(): OwnerSubscription | null {
  try {
    const raw = localStorage.getItem(SUB_KEY);
    return raw ? (JSON.parse(raw) as OwnerSubscription) : null;
  } catch {
    return null;
  }
}

export function getPayments(): Payment[] {
  try {
    const raw = localStorage.getItem(PAYMENTS_KEY);
    return raw ? (JSON.parse(raw) as Payment[]) : [];
  } catch {
    return [];
  }
}

export function activatePlan(plan: OwnerPlan, payment?: Omit<Payment, 'id' | 'paidAt' | 'planId' | 'planName'>) {
  const now = new Date();
  let paymentId: string | undefined;
  try {
    if (payment) {
      paymentId = `PAY${now.getTime()}`;
      const record: Payment = { ...payment, id: paymentId, planId: plan.id, planName: plan.name, paidAt: now.toISOString() };
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify([record, ...getPayments()]));
    }
    const sub: OwnerSubscription = {
      planId: plan.id,
      planName: plan.name,
      listingLimit: plan.listingLimit,
      startedAt: now.toISOString(),
      expiresAt: plan.validityDays ? new Date(now.getTime() + plan.validityDays * 864e5).toISOString() : null,
      paymentId,
    };
    localStorage.setItem(SUB_KEY, JSON.stringify(sub));
    const me = getProfile();
    recordCheckout({
      role: 'owner',
      planId: plan.id,
      subscriberName: me?.name || 'Owner',
      subscriberPhone: me?.mobile || '',
      baseAmount: payment?.amount ?? plan.price,
      discount: payment?.discount ?? 0,
      gst: payment?.gst ?? 0,
      total: payment?.total ?? 0,
      method: payment?.method ?? 'Free plan',
      transactionRef: paymentId ?? `FREE-${now.getTime()}`,
      usage: { listingsUsed: getOwnerListings().length },
    });
    return { sub, paymentId };
  } catch {
    return null;
  }
}
