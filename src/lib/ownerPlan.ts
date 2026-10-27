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

// Plans from the Restamp owner app
export const ownerPlans: Record<'Residential' | 'Commercial', OwnerPlan[]> = {
  Residential: [
    {
      id: 'owner-basic',
      name: 'Basic',
      price: 0,
      priceSub1: 'free forever',
      priceSub2: 'zero brokerage assurance',
      validityDays: 30,
      listingLimit: 1,
      features: ['30 Days listing visibility', 'Direct buyer in-app inquiries', 'Zero brokerage assurance'],
    },
    {
      id: 'owner-gold',
      name: 'Gold Assist',
      highlight: 'Gold',
      price: 1999,
      priceSub1: 'for 90 days validity',
      priceSub2: '+ GST • verified owner tag',
      validityDays: 90,
      listingLimit: 3,
      popular: true,
      features: ['90 Days top search placement', 'Verified Owner badge ⭐', 'Direct WhatsApp & instant phone leads'],
    },
    {
      id: 'owner-titanium',
      name: 'Titanium VIP',
      highlight: 'Titanium',
      price: 4999,
      priceSub1: 'until deal closed',
      priceSub2: 'full managed advisory',
      validityDays: null,
      listingLimit: 5,
      features: ['Listing live until sold or rented', 'Dedicated relationship manager', 'Professional photoshoot & legal drafting'],
    },
  ],
  Commercial: [
    {
      id: 'owner-comm-basic',
      name: 'Commercial Free',
      price: 0,
      priceSub1: 'free forever',
      priceSub2: 'office & retail category',
      validityDays: 30,
      listingLimit: 1,
      features: ['30 Days commercial visibility', 'Direct in-app corporate leads', 'Zero brokerage assurance'],
    },
    {
      id: 'owner-comm-pro',
      name: 'Corporate Boost',
      highlight: 'Corporate',
      price: 3499,
      priceSub1: 'for 90 days validity',
      priceSub2: '+ GST • full tax credit',
      validityDays: 90,
      listingLimit: 3,
      popular: true,
      features: ['90 Days prime corporate visibility', 'Verified Commercial Unit badge', 'Targeted outreach to GCCs & startups'],
    },
    {
      id: 'owner-comm-vip',
      name: 'Enterprise Managed',
      highlight: 'Enterprise',
      price: 8999,
      priceSub1: 'until leased / sold',
      priceSub2: 'corporate advisory mandate',
      validityDays: null,
      listingLimit: 5,
      features: ['Dedicated commercial account manager', 'Tenant KYC & due diligence', 'Commercial lease drafting & drone tour'],
    },
  ],
};

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

export const findPlan = (id: string) =>
  [...ownerPlans.Residential, ...ownerPlans.Commercial].find((p) => p.id === id);

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
    return { sub, paymentId };
  } catch {
    return null;
  }
}
