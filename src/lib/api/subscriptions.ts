/**
 * User-facing subscriptions (Restamp-backend app/routers/subscriptions.py):
 *   GET  /subscriptions/plans?role=   active, visible, admin-managed plans (public)
 *   GET  /subscriptions/me            the caller's current plan per role + limits/usage
 *   POST /subscriptions/bypass        TEMPORARY payment bypass: activates the chosen plan
 *                                     without payment (recorded as BYPASS, never as paid)
 * The backend checks that the plan's role equals the caller's current role, so the
 * bypass call runs in that role (withRole). It is idempotent per plan.
 */
import { apiGet, apiPost } from './client';
import { withRole } from './auth';
import type { BackendRole } from './session';

export type PublicPlan = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  role: BackendRole;
  price_paise: number;
  duration_days: number | null;
  billing_cycle: string;
  listing_limit: number | null;
  lead_limit: number | null;
  location_limit: number | null;
  features: string[];
  recommended: boolean;
  is_free: boolean;
  version: number;
};

export type MySubscription = {
  id: number;
  plan: PublicPlan;
  status: string;
  start_date: string | null;
  end_date: string | null;
  source: string | null;
  payment_verified: boolean;
};

export type MySubscriptions = {
  current_role: BackendRole | null;
  subscriptions: Record<BackendRole, { subscription: MySubscription | null; usage: Record<string, number | string | null> }>;
};

export const listPublicPlans = async (role: BackendRole) =>
  (await apiGet<{ items: PublicPlan[] }>('/subscriptions/plans', { role }, false)).items;

export const getMySubscriptions = () => apiGet<MySubscriptions>('/subscriptions/me');

/** Continue on the payment page: activate `planCode` for the caller in `role` (no payment). */
export const bypassActivate = (role: BackendRole, planCode: string) =>
  withRole(role, () => apiPost<MySubscription & { already_active: boolean }>('/subscriptions/bypass', { plan_code: planCode }));
