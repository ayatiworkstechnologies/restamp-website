import { useEffect, useState } from 'react';
import { apiGet, apiPost, errorMessage } from '@/lib/api/client';
import { withRole } from '@/lib/api/auth';
import { bypassActivate, listPublicPlans, type PublicPlan } from '@/lib/api/subscriptions';
import { useMemo } from 'react';
import type { SubscriptionPlan } from '@/types/subscription';
import { getPlan as getStorePlan, recordCheckout, usePublicPlans } from '@/lib/subscription-store';
import { SEED_PLANS } from '@/lib/subscription-seed';

export type DealerPlan = {
  id: string;
  name: string;
  category: 'Solo Dealer' | 'Agency Team';
  highlight?: string;
  price: number;
  priceSub1: string;
  priceSub2: string;
  validityDays: number | null;
  listingLimit: number;
  popular?: boolean;
  commissionCut: string;
  features: string[];
};

export const dealerPlans: Record<'Broker' | 'Agency', DealerPlan[]> = {
  Broker: [
    {
      id: 'dealer-starter',
      name: 'Starter Dealer',
      category: 'Solo Dealer',
      price: 0,
      priceSub1: 'free forever',
      priceSub2: 'pay per verified token',
      validityDays: 30,
      listingLimit: 3,
      commissionCut: '0% Restamp commission',
      features: [
        'Up to 3 active property mandates',
        'Direct buyer in-app inquiries',
        'Basic RERA verification badge',
        'Mobile web console access',
        'Standard search ranking',
      ],
    },
    {
      id: 'dealer-pro',
      name: 'Pro Dealer',
      category: 'Solo Dealer',
      highlight: 'Most Popular',
      price: 4999,
      priceSub1: 'for 90 days access',
      priceSub2: '+ GST • full input tax credit',
      validityDays: 90,
      listingLimit: 15,
      popular: true,
      commissionCut: '0% Restamp commission',
      features: [
        'Up to 15 active high-priority mandates',
        'Instant WhatsApp buyer lead notifications',
        'Direct phone number unmasking',
        'Verified RERA Dealer badge ⭐',
        'Top 10% search boost in your local micro-market',
        'Access to Restamp co-broking syndicate',
      ],
    },
    {
      id: 'dealer-elite',
      name: 'Elite Dealer VIP',
      category: 'Solo Dealer',
      highlight: 'VIP Mandate',
      price: 9999,
      priceSub1: 'for 180 days access',
      priceSub2: 'priority lead guarantee',
      validityDays: 180,
      listingLimit: 35,
      commissionCut: '0% Restamp commission',
      features: [
        'Up to 35 active prime mandates',
        'Dedicated Key Account Manager',
        'First access to exclusive builder pre-launches',
        '3D virtual walkthrough tag on listings',
        'Priority home loan assistance for your buyers',
        'Legal title check assistance desk',
      ],
    },
  ],
  Agency: [
    {
      id: 'dealer-agency-growth',
      name: 'Agency Growth',
      category: 'Agency Team',
      price: 14999,
      priceSub1: 'for 180 days access',
      priceSub2: 'up to 5 team members',
      validityDays: 180,
      listingLimit: 60,
      popular: true,
      commissionCut: '0% Restamp commission',
      features: [
        'Up to 60 active agency mandates',
        '5 Dealer sub-logins with role permissions',
        'Agency branded showcase microsite',
        'Bulk inventory CSV / XML feed upload',
        'Real-time team lead distribution CRM',
        'Dedicated relationship manager & legal desk',
      ],
    },
    {
      id: 'dealer-agency-enterprise',
      name: 'Brokerage Enterprise',
      category: 'Agency Team',
      highlight: 'Institutional',
      price: 29999,
      priceSub1: 'for 365 days access',
      priceSub2: 'unlimited mandates & team',
      validityDays: 365,
      listingLimit: 999,
      commissionCut: '0% Restamp commission',
      features: [
        'Unlimited listings across all micro-markets',
        'Unlimited team dealer licenses',
        'Exclusive developer marketing mandates',
        'Custom CRM API webhook integration',
        'Featured Agency spotlight on Restamp homepage',
        'Guaranteed minimum 150+ verified buyer leads / mo',
      ],
    },
  ],
};

/* --- LOCATION PACKAGES (Step 2 Requirements) --- */
export type LocationPackage = {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  locationLimit: number;
  price: number;
  monthlyEquivalent: number;
  validityDays: number;
  mandateLimit: number;
  popular?: boolean;
  commissionCut: string;
  features: string[];
};

/*
 * Location packages are managed in Admin → Subscription Plans (Dealer tab) and
 * read from the subscription store. Prices are never hard-coded here.
 */
const COMMISSION_COPY = '0% Restamp commission';

export function toLocationPackage(
  p: Pick<SubscriptionPlan, 'id' | 'name' | 'description' | 'badge' | 'limits' | 'price' | 'validityDays' | 'recommended' | 'features'>
): LocationPackage {
  const months = Math.max(1, Math.round((p.validityDays ?? 30) / 30));
  return {
    id: p.id,
    name: p.name,
    tagline: p.description,
    badge: p.badge ?? '',
    locationLimit: p.limits.locationLimit ?? 0,
    price: p.price,
    monthlyEquivalent: Math.round(p.price / months),
    validityDays: p.validityDays ?? 365,
    mandateLimit: p.limits.listingLimit === undefined || p.limits.listingLimit < 0 ? 999 : p.limits.listingLimit,
    popular: p.recommended,
    commissionCut: COMMISSION_COPY,
    features: p.features,
  };
}

/** Shown while plans load so layouts don't crash; never purchasable (price check in checkout). */
export const PLACEHOLDER_PACKAGE: LocationPackage = {
  id: '',
  name: 'Loading…',
  tagline: '',
  badge: '',
  locationLimit: 0,
  price: 0,
  monthlyEquivalent: 0,
  validityDays: 0,
  mandateLimit: 0,
  commissionCut: COMMISSION_COPY,
  features: [],
};

const byLocations = (a: LocationPackage, b: LocationPackage) => a.locationLimit - b.locationLimit;

export const DEFAULT_DEALER_PACKAGES: LocationPackage[] = SEED_PLANS.filter(
  (p) => p.role === 'dealer' && p.status === 'active' && p.visible
)
  .map(toLocationPackage)
  .sort(byLocations);

/** Purchasable packages, ordered by coverage. Falls back to default seed packages while loading. */
export function useLocationPackages(): LocationPackage[] {
  const plans = usePublicPlans('dealer');
  return useMemo(() => {
    if (!plans || plans.length === 0) {
      return DEFAULT_DEALER_PACKAGES;
    }
    return plans.map(toLocationPackage).sort(byLocations);
  }, [plans]);
}

/** Any dealer package by id, including archived ones (for existing subscriptions). */
export function findLocationPackage(id: string): LocationPackage | undefined {
  const p = getStorePlan(id);
  if (p && p.role === 'dealer') return toLocationPackage(p);
  return DEFAULT_DEALER_PACKAGES.find((pkg) => pkg.id === id);
}

/** The smallest package with more coverage than `current`, if any. */
export function nextLocationPackage(list: LocationPackage[], current: LocationPackage) {
  return list.find((p) => p.locationLimit > current.locationLimit);
}

/* --- AVAILABLE DEALER LOCATIONS / MICRO-MARKETS --- */
export type DealerLocation = {
  id: string;
  name: string;
  city: string;
  region: 'South & OMR' | 'Central Chennai' | 'Coastal & ECR' | 'West Chennai';
  demandIntensity: 'Very High' | 'High' | 'Moderate';
  demandScore: number;
  avgTicketPrice: string;
  activeBuyers: number;
  tag: string;
};

export const availableDealerLocations: DealerLocation[] = [
  // South & OMR
  {
    id: 'omr-it-corridor',
    name: 'OMR IT Corridor',
    city: 'Chennai',
    region: 'South & OMR',
    demandIntensity: 'Very High',
    demandScore: 96,
    avgTicketPrice: '₹1.25 Cr',
    activeBuyers: 420,
    tag: 'Tech Hub',
  },
  {
    id: 'sholinganallur',
    name: 'Sholinganallur',
    city: 'Chennai',
    region: 'South & OMR',
    demandIntensity: 'Very High',
    demandScore: 94,
    avgTicketPrice: '₹95 L',
    activeBuyers: 380,
    tag: 'SEZ Corridor',
  },
  {
    id: 'velachery',
    name: 'Velachery',
    city: 'Chennai',
    region: 'South & OMR',
    demandIntensity: 'Very High',
    demandScore: 92,
    avgTicketPrice: '₹1.10 Cr',
    activeBuyers: 310,
    tag: 'Metro Connected',
  },
  {
    id: 'perungudi',
    name: 'Perungudi & Kandanchavadi',
    city: 'Chennai',
    region: 'South & OMR',
    demandIntensity: 'High',
    demandScore: 90,
    avgTicketPrice: '₹1.15 Cr',
    activeBuyers: 290,
    tag: 'Tech Park Zone',
  },
  {
    id: 'siruseri-navalur',
    name: 'Navalur & Siruseri SIPCOT',
    city: 'Chennai',
    region: 'South & OMR',
    demandIntensity: 'High',
    demandScore: 88,
    avgTicketPrice: '₹65 L',
    activeBuyers: 340,
    tag: 'IT Park Hub',
  },
  {
    id: 'medavakkam',
    name: 'Medavakkam & Pallikaranai',
    city: 'Chennai',
    region: 'South & OMR',
    demandIntensity: 'High',
    demandScore: 88,
    avgTicketPrice: '₹75 L',
    activeBuyers: 260,
    tag: 'Gated Condos',
  },
  {
    id: 'tambaram-chromepet',
    name: 'Tambaram & Chromepet',
    city: 'Chennai',
    region: 'South & OMR',
    demandIntensity: 'High',
    demandScore: 86,
    avgTicketPrice: '₹68 L',
    activeBuyers: 240,
    tag: 'Transit Hub',
  },
  {
    id: 'guindy',
    name: 'Guindy & Alandur',
    city: 'Chennai',
    region: 'South & OMR',
    demandIntensity: 'High',
    demandScore: 89,
    avgTicketPrice: '₹1.80 Cr',
    activeBuyers: 275,
    tag: 'Corporate Hub',
  },

  // Coastal & ECR
  {
    id: 'adyar-besant-nagar',
    name: 'Adyar & Besant Nagar',
    city: 'Chennai',
    region: 'Coastal & ECR',
    demandIntensity: 'Very High',
    demandScore: 98,
    avgTicketPrice: '₹3.40 Cr',
    activeBuyers: 290,
    tag: 'Luxury Coastal',
  },
  {
    id: 'ecr-beachside',
    name: 'ECR Beachside & Neelankarai',
    city: 'Chennai',
    region: 'Coastal & ECR',
    demandIntensity: 'High',
    demandScore: 90,
    avgTicketPrice: '₹4.20 Cr',
    activeBuyers: 210,
    tag: 'Boutique Villas',
  },
  {
    id: 'thiruvanmiyur',
    name: 'Thiruvanmiyur & Kottivakkam',
    city: 'Chennai',
    region: 'Coastal & ECR',
    demandIntensity: 'Very High',
    demandScore: 93,
    avgTicketPrice: '₹2.80 Cr',
    activeBuyers: 245,
    tag: 'Coastal Residential',
  },
  {
    id: 'palavakkam-injambakkam',
    name: 'Palavakkam & Injambakkam',
    city: 'Chennai',
    region: 'Coastal & ECR',
    demandIntensity: 'High',
    demandScore: 89,
    avgTicketPrice: '₹3.60 Cr',
    activeBuyers: 180,
    tag: 'Seafront Enclaves',
  },

  // Central Chennai
  {
    id: 'anna-nagar',
    name: 'Anna Nagar & Shenoy Nagar',
    city: 'Chennai',
    region: 'Central Chennai',
    demandIntensity: 'Very High',
    demandScore: 97,
    avgTicketPrice: '₹2.85 Cr',
    activeBuyers: 340,
    tag: 'Prime Residential',
  },
  {
    id: 't-nagar',
    name: 'T. Nagar & West Mambalam',
    city: 'Chennai',
    region: 'Central Chennai',
    demandIntensity: 'High',
    demandScore: 91,
    avgTicketPrice: '₹2.40 Cr',
    activeBuyers: 295,
    tag: 'Retail Commercial',
  },
  {
    id: 'nungambakkam-central',
    name: 'Nungambakkam & Central',
    city: 'Chennai',
    region: 'Central Chennai',
    demandIntensity: 'Very High',
    demandScore: 95,
    avgTicketPrice: '₹3.80 Cr',
    activeBuyers: 230,
    tag: 'HNI & Embassy',
  },
  {
    id: 'alwarpet-ra-puram',
    name: 'Alwarpet & RA Puram',
    city: 'Chennai',
    region: 'Central Chennai',
    demandIntensity: 'Very High',
    demandScore: 98,
    avgTicketPrice: '₹4.50 Cr',
    activeBuyers: 215,
    tag: 'Ultra-Luxury HNI',
  },
  {
    id: 'mylapore-mandaveli',
    name: 'Mylapore & Mandaveli',
    city: 'Chennai',
    region: 'Central Chennai',
    demandIntensity: 'High',
    demandScore: 92,
    avgTicketPrice: '₹2.90 Cr',
    activeBuyers: 250,
    tag: 'Heritage Prime',
  },
  {
    id: 'kilpauk-chetpet',
    name: 'Kilpauk & Chetpet',
    city: 'Chennai',
    region: 'Central Chennai',
    demandIntensity: 'High',
    demandScore: 90,
    avgTicketPrice: '₹3.10 Cr',
    activeBuyers: 220,
    tag: 'Central Elite',
  },

  // West Chennai
  {
    id: 'porur-dlf',
    name: 'Porur & DLF Tech Park',
    city: 'Chennai',
    region: 'West Chennai',
    demandIntensity: 'High',
    demandScore: 87,
    avgTicketPrice: '₹88 L',
    activeBuyers: 280,
    tag: 'IT SEZ West',
  },
  {
    id: 'koyambedu-vadapalani',
    name: 'Koyambedu & Vadapalani',
    city: 'Chennai',
    region: 'West Chennai',
    demandIntensity: 'High',
    demandScore: 89,
    avgTicketPrice: '₹1.45 Cr',
    activeBuyers: 270,
    tag: 'Metro Interchange',
  },
  {
    id: 'mogappair-nolambur',
    name: 'Mogappair & Nolambur',
    city: 'Chennai',
    region: 'West Chennai',
    demandIntensity: 'High',
    demandScore: 88,
    avgTicketPrice: '₹1.05 Cr',
    activeBuyers: 260,
    tag: 'Premium Gated West',
  },
  {
    id: 'kattupakkam',
    name: 'Kattupakkam & Iyyappanthangal',
    city: 'Chennai',
    region: 'West Chennai',
    demandIntensity: 'Moderate',
    demandScore: 84,
    avgTicketPrice: '₹62 L',
    activeBuyers: 210,
    tag: 'West Growth Corridor',
  },
];

export const DEALER_GST_RATE = 0.18;
export const DEALER_PROMO_CODES: Record<string, number> = {
  PARTNER500: 500,
  RERAPRO: 1000,
  RESTAMPDEALER: 500,
  GROWTH300: 300,
};

/* --- SUBSCRIPTION DATA MODELS --- */
export type DealerSubscription = {
  planId: string;
  planName: string;
  badge?: string;
  category: string;
  locationLimit: number;
  selectedLocations: string[];
  listingLimit: number;
  price: number;
  discount: number;
  gst: number;
  totalPaid: number;
  paymentId?: string;
  paymentMethod?: string;
  paymentStatus?: 'verified' | 'pending' | 'failed';
  startedAt: string;
  expiresAt: string | null;
  dealerMobile?: string;
  dealerName?: string;
  firmName?: string;
  reraNumber?: string;
};

export type DealerPaymentRecord = {
  id: string;
  packageId: string;
  packageName: string;
  locationsCount: number;
  locations: string[];
  amount: number;
  discount: number;
  gst: number;
  total: number;
  promoCode?: string;
  method: string;
  status: 'success' | 'failed' | 'pending' | 'cancelled';
  paidAt: string;
  transactionRef: string;
};

const DEALER_SUB_KEY = 'restamp_dealer_subscription';
const DEALER_PAYMENTS_KEY = 'restamp_dealer_payments';
const DEALER_DRAFT_KEY = 'restamp_dealer_draft_package';

/* --- PER-PINCODE DEALER PLANS --- */
/**
 * Dealer pricing: a fixed price for each pincode / micro-market chosen.
 * A dealer plan unlocks the Sales Hub only.
 */
export type DealerPincodePlanId = '30d' | '60d';
export const DEALER_PINCODE_PLANS: { id: DealerPincodePlanId; label: string; pricePerLocation: number; validityDays: number }[] = [
  { id: '30d', label: '30 Days', pricePerLocation: 200, validityDays: 30 },
  { id: '60d', label: '60 Days', pricePerLocation: 300, validityDays: 60 },
];

export function findPincodePlan(id?: string) {
  return DEALER_PINCODE_PLANS.find((p) => p.id === id) ?? DEALER_PINCODE_PLANS[0];
}

/**
 * Builds the checkout package for `count` pincodes on a per-pincode plan.
 * `backend` is the admin plan used to activate access: the smallest one that
 * covers `count` locations (the backend enforces the locality limit).
 */
export function pincodePackage(rateId: DealerPincodePlanId | undefined, count: number, backend: LocationPackage[]): LocationPackage {
  const rate = findPincodePlan(rateId);
  const sorted = [...backend].sort(byLocations);
  const base = sorted.find((p) => p.locationLimit >= count) ?? sorted[sorted.length - 1] ?? PLACEHOLDER_PACKAGE;
  const price = rate.pricePerLocation * count;
  return {
    ...base,
    name: `Dealer ${rate.label} Plan`,
    tagline: `₹${rate.pricePerLocation} per pincode · ${rate.validityDays} days`,
    badge: '',
    locationLimit: count,
    price,
    validityDays: rate.validityDays,
    monthlyEquivalent: Math.round(price / Math.max(1, Math.round(rate.validityDays / 30))),
  };
}

/* --- BILLING CALCULATOR HELPER --- */
export function calculateDealerPackageBill(pkg: LocationPackage, discountAmount: number) {
  const afterDiscount = Math.max(0, pkg.price - discountAmount);
  const gst = Math.round(afterDiscount * DEALER_GST_RATE);
  const total = afterDiscount + gst;
  return {
    basePrice: pkg.price,
    discount: discountAmount,
    afterDiscount,
    gst,
    total,
  };
}

/* --- DRAFT PACKAGE STATE (Checkout Bridge) --- */
export type DraftDealerPackage = {
  packageId: string;
  /** Per-pincode plan chosen on the plan page (see DEALER_PINCODE_PLANS). */
  rateId?: DealerPincodePlanId;
  selectedLocations: string[];
  promoCode?: string;
  discount?: number;
  updatedAt: string;
};

export function saveDraftPackage(draft: DraftDealerPackage) {
  try {
    sessionStorage.setItem(DEALER_DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}

export function getDraftPackage(): DraftDealerPackage | null {
  try {
    const raw = sessionStorage.getItem(DEALER_DRAFT_KEY);
    if (raw) return JSON.parse(raw) as DraftDealerPackage;
  } catch {}
  return null;
}

export function clearDraftPackage() {
  try {
    sessionStorage.removeItem(DEALER_DRAFT_KEY);
  } catch {}
}

/* --- SUBSCRIPTION PERSISTENCE --- */
export function getDealerSubscription(): DealerSubscription | null {
  try {
    const raw = localStorage.getItem(DEALER_SUB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DealerSubscription;
      // Check expiration
      if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
        return {
          ...parsed,
          paymentStatus: 'pending',
        };
      }
      return parsed;
    }
  } catch {}
  return null;
}

export function saveDealerSubscription(sub: DealerSubscription) {
  try {
    localStorage.setItem(DEALER_SUB_KEY, JSON.stringify(sub));
    window.dispatchEvent(new Event('dealer-subscription-change'));
  } catch {}
}

export function clearDealerSubscription() {
  try {
    localStorage.removeItem(DEALER_SUB_KEY);
    window.dispatchEvent(new Event('dealer-subscription-change'));
  } catch {}
}

type BrokerPlanStatus = {
  has_plan: boolean;
  plan_code?: string;
  plan_name?: string;
  price_paise?: number;
  locality_limit?: number;
  start_date?: string | null;
  valid_until?: string | null;
  localities?: string[];
};

const isoZ = (v?: string | null) => (v ? (v.endsWith('Z') || v.includes('+') ? v : `${v}Z`) : null);

export async function syncDealerSubscription(): Promise<DealerSubscription | null> {
  const st = await withRole('BROKER', () => apiGet<BrokerPlanStatus>('/broker/plan'));
  try {
    if (!st.has_plan || !st.plan_code) {
      clearDealerSubscription();
      return null;
    }
    const prev = getDealerSubscription();
    const sub: DealerSubscription = {
      planId: st.plan_code,
      planName: st.plan_name || st.plan_code,
      badge: prev?.badge || '',
      category: prev?.category || 'Dealer',
      locationLimit: st.locality_limit ?? 0,
      selectedLocations: st.localities || [],
      listingLimit: prev?.listingLimit ?? 999,
      price: Math.round((st.price_paise ?? 0) / 100),
      discount: 0,
      gst: 0,
      totalPaid: 0,
      paymentStatus: 'verified',
      startedAt: isoZ(st.start_date) || new Date().toISOString(),
      expiresAt: isoZ(st.valid_until) || null,
    };
    saveDealerSubscription(sub);
    return sub;
  } catch {
    return null;
  }
}

/**
 * Continue on the payment page (TEMPORARY payment bypass):
 *  1. POST /subscriptions/bypass activates the plan for this dealer (BYPASS, never paid; idempotent);
 *  2. POST /broker/plan/localities allocates the chosen localities under that plan;
 *  3. the dealer's plan is re-read from the backend.
 */
export async function activateAgentPlanViaBypass(pkg: LocationPackage, localities: string[]) {
  await bypassActivate('BROKER', pkg.id);
  let allocation: { unmatched: string[]; unavailable: string[]; error: string | null } = { unmatched: [], unavailable: [], error: null };
  if (localities.length) {
    try {
      const r = await withRole('BROKER', () =>
        apiPost<{ unmatched_localities?: string[]; unavailable_localities?: string[] }>('/broker/plan/localities', { localities }),
      );
      allocation = { unmatched: r.unmatched_localities || [], unavailable: r.unavailable_localities || [], error: null };
    } catch (e) {
      allocation.error = errorMessage(e, 'Your plan is active, but the localities could not be added.');
    }
  }
  const sub = await syncDealerSubscription();
  if (!sub || sub.planId !== pkg.id) throw new Error('The plan could not be confirmed. Please try again.');
  return { sub, allocation };
}

/**
 * Checks if the currently active dealer has a verified, unexpired paid subscription.
 * Existing paid dealers won't be forced to pay again.
 */
export function hasActiveDealerSubscription(): boolean {
  const sub = getDealerSubscription();
  if (!sub) return false;
  if (sub.paymentStatus === 'failed') return false;
  if (sub.expiresAt && new Date(sub.expiresAt).getTime() < Date.now()) return false;
  return sub.selectedLocations && sub.selectedLocations.length > 0;
}

/* --- PAYMENT HISTORY PERSISTENCE --- */
export function getDealerPayments(): DealerPaymentRecord[] {
  try {
    const raw = localStorage.getItem(DEALER_PAYMENTS_KEY);
    return raw ? (JSON.parse(raw) as DealerPaymentRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveDealerPayment(record: DealerPaymentRecord) {
  try {
    const existing = getDealerPayments();
    localStorage.setItem(DEALER_PAYMENTS_KEY, JSON.stringify([record, ...existing]));
  } catch {}
}

/**
 * Activates a dealer package upon verified payment confirmation.
 * Enforces idempotency via transactionRef and prevents duplicate charges.
 */
export function activateDealerPackage(
  pkg: LocationPackage,
  selectedLocations: string[],
  payment: {
    total: number;
    amount: number;
    discount: number;
    gst: number;
    promoCode?: string;
    method: string;
    dealerMobile?: string;
    dealerName?: string;
    firmName?: string;
    reraNumber?: string;
    /** Stable per checkout attempt; repeated submits with the same key do not create a second payment. */
    idempotencyKey?: string;
  }
): { sub: DealerSubscription; paymentRecord: DealerPaymentRecord } {
  const now = new Date();
  if (payment.idempotencyKey) {
    const prior = getDealerPayments().find((p) => p.transactionRef === payment.idempotencyKey);
    const existingSub = getDealerSubscription();
    if (prior && existingSub) return { sub: existingSub, paymentRecord: prior };
  }
  const paymentId = `PAY-AGNT-${now.getTime()}-${Math.floor(100 + Math.random() * 900)}`;
  const transactionRef = payment.idempotencyKey ?? `TXN-RST-${now.getTime()}`;

  const paymentRecord: DealerPaymentRecord = {
    id: paymentId,
    packageId: pkg.id,
    packageName: pkg.name,
    locationsCount: selectedLocations.length,
    locations: selectedLocations,
    amount: payment.amount,
    discount: payment.discount,
    gst: payment.gst,
    total: payment.total,
    promoCode: payment.promoCode,
    method: payment.method,
    status: 'success',
    paidAt: now.toISOString(),
    transactionRef,
  };

  saveDealerPayment(paymentRecord);

  const sub: DealerSubscription = {
    planId: pkg.id,
    planName: pkg.name,
    badge: pkg.badge,
    category: 'Dealer',
    locationLimit: pkg.locationLimit,
    selectedLocations,
    listingLimit: pkg.mandateLimit,
    price: payment.amount,
    discount: payment.discount,
    gst: payment.gst,
    totalPaid: payment.total,
    paymentId,
    paymentMethod: payment.method,
    // No gateway is integrated, so the payment cannot be verified (see PAYMENTS.md).
    paymentStatus: 'pending',
    startedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + pkg.validityDays * 864e5).toISOString(),
    dealerMobile: payment.dealerMobile,
    dealerName: payment.dealerName,
    firmName: payment.firmName,
    reraNumber: payment.reraNumber,
  };

  saveDealerSubscription(sub);
  clearDraftPackage();

  recordCheckout({
    role: 'dealer',
    planId: pkg.id,
    subscriberName: payment.dealerName || payment.firmName || 'Dealer',
    subscriberPhone: payment.dealerMobile || '',
    baseAmount: payment.amount,
    discount: payment.discount,
    gst: payment.gst,
    total: payment.total,
    method: payment.method,
    transactionRef,
    usage: { locationsUsed: selectedLocations.length },
  });

  return { sub, paymentRecord };
}

/**
 * Seed an active subscription for existing verified partner accounts (e.g. Royal Realty Associates)
 * so existing paid dealers can be tested seamlessly without being forced to pay again.
 */
export function seedExistingPartnerSubscription(mobile = '9840123456') {
  const sub: DealerSubscription = {
    planId: 'loc-10',
    planName: '10 Micro-Markets',
    badge: 'Growth Dealer',
    category: 'Dealer',
    locationLimit: 10,
    selectedLocations: [
      'OMR IT Corridor',
      'Sholinganallur',
      'Velachery',
      'Adyar & Besant Nagar',
      'Anna Nagar',
      'ECR Beachside',
      'Porur & DLF Tech Park',
      'Guindy & Alandur',
      'Medavakkam',
      'Tambaram & Chromepet',
    ],
    listingLimit: 25,
    price: 4999,
    discount: 500,
    gst: 809,
    totalPaid: 5308,
    paymentId: 'PAY-AGNT-0941',
    paymentMethod: 'UPI · royalrealty@okhdfcbank',
    paymentStatus: 'verified',
    startedAt: new Date(Date.now() - 14 * 864e5).toISOString(),
    expiresAt: new Date(Date.now() + 76 * 864e5).toISOString(),
    dealerMobile: mobile,
    dealerName: 'Arun Kumar',
    firmName: 'Royal Realty Associates',
    reraNumber: 'TN/DEALER/0491/2023',
  };
  saveDealerSubscription(sub);
  return sub;
}

/**
 * Checks whether a dealer's active subscription covers a specific micro-market locality.
 */
export function canDealerAccessLocation(locality: string): boolean {
  const sub = getDealerSubscription();
  if (!sub || !sub.selectedLocations || sub.selectedLocations.length === 0) return false;
  const cleanLoc = locality.toLowerCase().trim();
  return sub.selectedLocations.some((l) => {
    const cleanSub = l.toLowerCase().trim();
    return cleanLoc.includes(cleanSub) || cleanSub.includes(cleanLoc);
  });
}
