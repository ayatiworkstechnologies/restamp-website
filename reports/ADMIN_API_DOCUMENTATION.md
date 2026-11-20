# Admin API Documentation

Base: the backend URL. Every endpoint below needs `Authorization: Bearer <JWT>` from the normal OTP or Google login.

Common rules:

- **401:** missing, invalid or expired token.
- **403 `{"detail":"Forbidden"}`:**
  - the caller is not an admin;
  - the admin's role lacks the permission;
  - the account is suspended;
  - or the session is a fixed-OTP session.
- **422:** invalid input (static `{"detail":"Invalid request"}`) or a business-rule refusal (specific `detail`).
- **Pagination:** lists take `page` (≥1) and `page_size` (1–100, default 20), and return `{items, page, page_size, total}`.
- **Writes:** commit only on success and write an `audit_logs` row (`actor_user_id`, action, entity, before/after; no secrets or PII beyond ids and names).

## Identity

| Method / URL | Permission | Response |
|---|---|---|
| `GET /admin/me` | any admin | `{user_id, display_name, admin_role, role_label, permissions[]}` |
| `GET /admin/roles` | any admin | `{items:[{code,label,assignable,permissions[]}]}` |

## Dashboard and analytics

| Method / URL | Permission | Response |
|---|---|---|
| `GET /admin/dashboard` | properties.view | `{listings_total, listings_live, listings_pending, listings_rejected, enquiries_total, enquiries_open, users_total, users_suspended, buyers, owners, brokers, admins, unavailable[]}` |
| `GET /admin/analytics?months=6` | reports.view | monthly series (see `schemas.AdminAnalyticsOut`) |

## Listings

| Method / URL | Permission | Query / body | Response | Database |
|---|---|---|---|---|
| `GET /admin/listings` | properties.view | `verification_status` (PENDING/VERIFIED/REJECTED), `listing_status`, `property_type`, `owner_user_id`, `q`, `include_removed`, `sort` (newest/submitted_oldest), pagination | `{items: AdminListingRow[]}`: listing_id, title, type, price_display, verification_status, listing_status, removed, submitted_at, owner_user_id, owner_name, locality, city, pincode, cover_image_url | read |
| `GET /admin/listings/{id}` | properties.view | — | `{listing: OwnerListingOut, owner:{user_id,display_name,status}, verification_history[]}` (404 if missing) | read |
| `POST /admin/listings/{id}/verify` | properties.approve | — | AdminListingDetailOut. 422 if not PENDING | update `property_listings.verification_status`, insert `verifications` and `audit_logs` |
| `POST /admin/listings/{id}/reject` | properties.reject | `{reason (1–500, required), category?}` | AdminListingDetailOut. 422 if not PENDING or no reason | same, with reason and category |

## Users

| Method / URL | Permission | Query / body | Response | Notes |
|---|---|---|---|---|
| `GET /admin/users` | users.view | `role` (BUYER/OWNER/BROKER), `status` (active/suspended/closed), `is_admin`, `q`, pagination | `{items:[{user_id, display_name, status, current_role, admin_role, joined_at}]}` | no OTPs, tokens or hashes |
| `GET /admin/users/{id}` | users.view | — | row + `phone, providers[], activity{listings_owned, enquiries_sent, enquiries_received, visits_requested, broker_covered_locations}` | |
| `POST /admin/users/{id}/suspend` | users.suspend | `{reason}` | AdminUserDetailOut | 422: suspending yourself or a protected admin; the user's tokens are refused at once |
| `POST /admin/users/{id}/reactivate` | users.suspend | — | AdminUserDetailOut | |

## Enquiries (read-only)

| Method / URL | Permission | Query | Response |
|---|---|---|---|
| `GET /admin/enquiries` | enquiries.view | `status` (NEW/CONTACTED/CLOSED), `property_listing_id`, `buyer_user_id`, `owner_user_id`, pagination | `{items:[{id, status, closing_reason, created_at, property_listing_id, listing_title, buyer_user_id, buyer_name, owner_user_id, owner_name, message_count, last_message, last_message_at}]}` |
| `GET /admin/enquiries/{id}` | enquiries.view | — | row + `messages[{id, body, sender (BUYER/OWNER), created_at}]` (never owner lead notes) |

## Billing (read-only, new in this phase)

No payment gateway exists. Payments created by the simulated subscribe endpoints have `provider = "SIMULATED"` and **`simulated: true`**: no money was charged.

| Method / URL | Permission | Query | Response | Database |
|---|---|---|---|---|
| `GET /admin/subscriptions` | reports.view | `status` (ACTIVE/EXPIRED/CANCELLED; EXPIRED includes ACTIVE rows past `end_date`), `user_id`, pagination (newest first) | `{items:[{id, user_id, user_name, user_current_role, plan_code, plan_name, price_paise, status, start_date, end_date, payment_id, payment_provider, simulated}]}` | read only (join subscriptions, plans, payments, users) |
| `GET /admin/payments` | reports.view | `status` (INITIATED/SUCCESS/FAILED), `user_id`, pagination | `{items:[{id, user_id, user_name, plan_code, plan_name, provider, simulated, provider_payment_id (null for simulated), amount_paise, currency, status, created_at, paid_at}]}` | read only; never exposes idempotency keys, order ids or secrets |

## Admin team and audit

| Method / URL | Permission | Body | Notes |
|---|---|---|---|
| `GET /admin/staff` | settings.manage_team | — | `{items:[{user_id, display_name, admin_role, role_label, status}], total}` |
| `POST /admin/staff` | settings.manage_team | `{user_id, admin_role}` | grants admin to an existing account |
| `PATCH /admin/staff/{user_id}` | settings.manage_team | `{admin_role}` | self-lockout and last-Super-Admin protection |
| `DELETE /admin/staff/{user_id}` | settings.manage_team | — | 204 |
| `GET /admin/audit-logs` | settings.view_audit_logs | pagination | `{items:[{id, actor_user_id, actor_name, action, entity, before, after, created_at}]}`, read-only |
