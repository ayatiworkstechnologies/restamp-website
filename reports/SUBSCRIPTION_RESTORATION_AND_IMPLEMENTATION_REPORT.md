# Subscription Restoration and Implementation Report

All testing used local development data only (`restamp_dev`). Nothing was deployed, committed or pushed, and no `.env` files were changed.

## 1. Why the subscription pages were empty

- **They were never backed by the server.** The original admin subscription pages (commit `308adaf`) read plans, subscriptions and payments that `src/lib/subscription-store.ts` seeded into each browser's localStorage from `subscription-seed.ts`. That seed is what the deployed screenshots show.
- **Why they went empty:** the admin-integration phase pointed the pages at the backend, which then had no owner or agent plans and no records, so the pages showed nothing.
- **Nothing was deleted.** Only imports changed; the pages, cards, editor and dialogs stayed intact.

## 2. Backend (Restamp-backend)

- **Migration `q7r8s9t0u1v2`** (adds only). Applied to local `restamp_dev` only; current head is `q7r8s9t0u1v2`.
  - `plans`: role, billing_cycle, listing/lead/location limits, features, visible, recommended, sort_order, version, archived_at, updated_at, updated_by_user_id. Existing buyer and agent rows were backfilled with the limits the code already enforced.
  - New `plan_versions` table: pricing history, one immutable snapshot per version.
  - `subscriptions`: suspended_at, source (`ADMIN` / `BYPASS` / …), assigned_by_user_id, ended_reason, updated_at.
- **Database backup** taken before migrating: `scratchpad/restamp_dev_before_subscriptions.sql` (149,884 bytes; it still existed at the start of this session).
- **`app/services/subscriptions.py`** (new):
  - plans: list, create, edit (version and history), pause, resume, archive;
  - admin: assign/change (upgrade or downgrade), extend, suspend, reactivate, cancel;
  - the temporary payment bypass;
  - `my_subscriptions`;
  - the owner listing-limit check.
- **Rules it enforces:**
  - one current subscription per user per role; earlier ones are kept as EXPIRED with a reason;
  - every admin write is audited;
  - `ADMIN` and `BYPASS` payments are always `INITIATED` with no paid date, so they are never paid and never revenue.
- **Endpoints:**
  - admin: `GET/POST /admin/plans`, `PATCH /admin/plans/{id}`, `POST /admin/plans/{id}/status`, `GET /admin/plan-history`, `POST /admin/users/{id}/subscription`, `POST /admin/subscriptions/{id}/extend|suspend|reactivate|cancel`;
  - user: `GET /subscriptions/plans`, `GET /subscriptions/me`, `POST /subscriptions/bypass`;
  - `GET /admin/subscriptions` gained role, plan, search and SUSPENDED filters, plus live usage.
- **Bypass rules:**
  - the plan must be ACTIVE and visible;
  - the plan's role must equal the caller's current role, read from the database;
  - repeat calls return the existing subscription (no duplicates);
  - concurrent calls are serialised by a row lock;
  - `RESTAMP_PAYMENT_BYPASS=0` turns it off (403), and this is tested.
- **Limits read from the plan row**, so admin edits apply:
  - `buyer_plans`: active plan lookup and lead limit; suspended subscriptions are ignored;
  - `agent_plans`: active plan lookup and locality limit;
  - `_plan_row` no longer overwrites admin edits.
- **Owner listing limit:** `POST /owner/listings` returns 402 `OWNER_PLAN_LIMIT` when an owner on a plan has used its limit. Only listing creation is affected; owners without a plan are unaffected, and verification code was not touched.
- **Fixed this session:** simulated subscribe recorded the hard-coded catalogue price and duration instead of the admin-managed plan row (`buyer_plans`, `agent_plans`).
- **`scripts/seed_plans.py`:** local only, idempotent, inserts missing plans only and never overwrites existing ones. Run locally: the first run added 13 plans, the second added 0. It creates no subscriptions or payments.

## 3. Website (restamp-website-clean)

- **Admin pages** (original layouts) on the backend via `src/lib/admin-billing.ts`:
  - Plans (Buyer, Owner, Agent; create, edit, pause, resume, archive);
  - Active Subscriptions (suspend, cancel, restore);
  - Payments & Invoices (bypass and admin rows labelled "not paid"; revenue counts verified payments only, of which there are none; invoices only for verified payments);
  - Pricing History (from `plan_versions`).
- **Assign/change plan dialog** on the Buyers/Owners/Agents pages calls the backend.
- **Subscriptions are linked to users by backend user id.** The previous phone matching would have matched every record, because admin data has no phone numbers.
- **Buyer `/plans`:** Continue → bypass → plan re-read from the backend.
- **Owner:**
  - plans come from the backend;
  - Continue on the payment step → bypass;
  - the dashboard gate and Add Property limit use `/subscriptions/me`;
  - the success screen shows "Plan Activated" with no amount paid.
- **Agent** (completed this session):
  - packages come from the backend's agent plans;
  - Continue → `POST /subscriptions/bypass` → `POST /broker/plan/localities` with the chosen localities;
  - localities the backend can't match are reported on the success screen;
  - the success badge reads "Plan Active · Payment Not Taken", and no transaction ID is shown;
  - the dashboard gate reads `GET /broker/plan`;
  - a hard-coded demo subscription seeded for one phone number was removed.
- **402 plan-limit messages** from the backend are now shown to the user (`client.ts`).

## 4. Mobile (Restamp-latest)

- **Fixed:** `src/shared/api/ownerPlans.js` read owner and dealer plans from `/users/me/owner-plan` and `/users/me/dealer-plan`, which don't exist on the backend, so the app always showed no plan. `fetchOwnerPlan` and `fetchDealerPlan` now read `GET /subscriptions/me` (OWNER / BROKER) in the shape `OwnerContext` already uses.
- **Checked:** `node scripts/syntax-check.mjs` passes (169 files).
- **Not changed** (needs a separate mobile change): mobile purchase still calls `subscribeOwnerPlan` / `subscribeDealerPlan` with local plan ids against endpoints that don't exist. It should switch to backend plan codes and `POST /subscriptions/bypass`.
- **Not tested on a device.**

## 5. Backend tests

- **Subscription and admin suites:** `test_subscription_management.py` 7/7 (including the bypass kill switch). Together with `test_admin_billing`, `test_admin`, `test_agent_plan_localities` and `test_buyer_plans`, all pass except the one data-related buyer-plans test listed below.
- **Full suite (clean run):** 1190 passed, 33 failed, 21 skipped. The previous run had 38 failures; this session's first run had 39.
- **Fixed by this session's changes:**
  - **Outdated schema counts** (6 assertions: `test_phase4`, `test_phase5_integration` ×2, `test_visits`, `test_buyer_schema` ×3). The new `plan_versions` table makes it 48 tables and 72 foreign keys. These tests are updated with each migration, annotated with its revision; I followed that convention.
  - **`test_admin_billing`:** a real defect (the price mismatch in section 2), fixed in the code.

### Remaining 33 failures (none caused by a subscription code defect)

| Tests | Error | Root cause | From this work? | Fix |
|---|---|---|---|---|
| `test_owner_update` (15), `test_media_url_security` (7), `test_owner_listings::test_chennai_pincode_range_boundaries` (1), `test_verification_policy` (4) | 422 "This pincode belongs to a different locality" | The tests create listings with fixed pincodes (600040, 600001…) that local `restamp_dev` already maps to other localities: Anna Nagar (created 14 Nov) and Parry's Corner (8 Oct), both before this work. The check is committed code. | No (shared dev data). They fail the same way with the owner-limit check switched off. | Run tests on a disposable database (`RESTAMP_TEST_REQUIRE_DISPOSABLE=1`). Don't edit the tests. |
| `test_buyer_plans::test_simulated_purchase_lifts_quota` | expects 149900, gets 1400 | An admin (user 11562) edited RESTAMP_BUYER_PLUS to ₹14 in `restamp_dev` at 12:46 today, and the payment now correctly records the admin-managed price. | Data in the local database | Passes on a clean database. |
| `test_google_production` (2) | duplicate phone (1062) | A fixed test phone number already exists in `restamp_dev` | No (env) | Disposable database |
| `test_fixture_isolation` (2) | "test_01 must run first in the same process" | Order-dependent tests that are sensitive to the test environment | No | Run as documented |
| `test_bootstrap_admin` (1) | default URL check | the shell loaded `.env` (local URL) | No (env) | Run without `.env` exported |

## 6. Browser tests (site copy on :3100 + your local backend on :8000, `restamp_dev`)

44/44 passed: 43 in the full run, plus the agent success-screen check re-verified separately (the first check didn't account for the badge being styled in uppercase).

- **Admin:**
  - login; Buyer/Owner/Agent plans load; create, edit (v2), pause, resume, archive; invalid data gives 422;
  - Plans page shows the new plan; Pricing History shows the edit;
  - assign/upgrade through the real dialog (Startup → Super), then downgrade;
  - history keeps all 3 subscriptions with exactly 1 active; audit rows recorded;
  - suspend, reactivate, cancel;
  - Payments page labels bypass and admin rows; no bypass/admin payment is SUCCESS.
- **Buyer:** Choose plan → Continue → active (source BYPASS, not verified); still active after reload.
- **Owner:**
  - Get started → Continue → "Plan Activated" with no amount paid;
  - dashboard opens;
  - limit 1 enforced (402); Add Property shows the limit message;
  - after the admin upgrade, the dashboard shows Super Plan and posting works again.
- **Agent:**
  - Continue → plan active;
  - localities allocated: 2 of the 5 defaults; the other 3 names aren't in the local locality catalogue and are reported back;
  - `/subscriptions/me` shows the 5-locality limit;
  - pressing Continue again creates no duplicate; dashboard opens;
  - the success screen says payment not taken.
- **Security:** a buyer can't bypass an owner plan (403) and can't use admin endpoints (403).

Plan create/edit/pause/archive and suspend/cancel were driven through the admin API, and their results checked on the pages; the plan-change dialog itself was clicked in the browser.

## 7. Build

- **TypeScript:** `npx tsc --noEmit` is clean in `src`.
- **Production build:** `next build` compiled successfully, run on a copy byte-identical to `src` because your dev server was running in the repo folder.

## 8. Changed files

- **Backend:**
  - Modified: `app/config.py`, `app/main.py`, `app/models/__init__.py`, `app/models/billing.py`, `app/routers/admin.py`, `app/routers/owner.py` (listing-limit check only), `app/schemas.py`, `app/services/admin.py`, `app/services/agent_plans.py`, `app/services/buyer_plans.py`.
  - Tests updated (schema counts): `tests/test_buyer_schema.py`, `tests/test_phase4.py`, `tests/test_phase5_integration.py`, `tests/test_visits.py`.
  - New: `alembic/versions/q7r8s9t0u1v2_subscription_management.py`, `app/routers/subscriptions.py`, `app/services/subscriptions.py`, `scripts/seed_plans.py`, `tests/test_subscription_management.py` (plus `tests/test_admin_billing.py` from the admin phase).
  - Some of these files already had uncommitted changes before this work; those were preserved.
- **Website:**
  - New: `src/lib/api/subscriptions.ts`, this report.
  - Modified:
    - libraries: `src/lib/admin-billing.ts`, `src/lib/api/admin.ts`, `src/lib/api/client.ts`, `src/lib/agentPlan.ts`, `src/lib/ownerPlan.ts`, `src/lib/subscription-usage.ts`, `src/types/subscription.ts` (buyer limit label);
    - pages: `src/app/plans/page.tsx`, `src/app/owner/plans/page.tsx`, `src/app/owner/dashboard/layout.tsx`, `src/app/owner/dashboard/add-property/page.tsx`, `src/app/agent/payment/page.tsx`, `src/app/agent/dashboard/layout.tsx`, `src/app/admin-dashboard/subscriptions/plans/page.tsx`;
    - components: `src/components/subscriptions/plan-editor.tsx`, `src/components/users/role-directory.tsx`.
- **Mobile:** `src/shared/api/ownerPlans.js`.
- **Untouched:** owner verification, the auto-verify worker, the verification policy, notifications.
- **Git:** no commits, pushes, resets, cleans, branch switches or stash operations. Stashes intact (website 1, backend 2, mobile 6).

## 9. Remaining limitations

- **Plan limit edits apply live** to current subscribers; there is no per-subscription snapshot of limits.
- **Agent plan replacement:** localities from the previous plan stay until their own expiry.
- **Agent locality allocation** depends on the backend locality catalogue; unknown names are reported, not allocated.
- **Other website pages** (`/profile`, owner payments, agent profile/payments) still read the browser's saved copy of the plan. The dashboard keeps that copy in step with the backend, but those pages don't refresh it themselves, and owner/agent "payment history" pages still show old local records.
- **Mobile purchase flow** isn't switched to the bypass (section 4).
- **The bypass is a temporary business decision.** Set `RESTAMP_PAYMENT_BYPASS=0` before going live with real payments.
- **Not done:** no real payment gateway; invoices exist only for verified payments.
