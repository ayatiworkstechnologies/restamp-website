# Admin Dashboard Implementation Report

## Summary

- **Backend:** it already had a complete, committed, RBAC-protected admin API. I reused it as-is and added only two read-only endpoints (subscriptions and payments).
- **Frontend:** the existing admin console was entirely local mock data behind a demo login. It now runs on the real backend.
  - **Pages untouched:** the existing pages and their markup were kept, apart from the few small page changes listed under Design preservation.
  - **Data stores:** the four stores they read from were reimplemented over the API.
  - **Sign-in:** the demo login was replaced by the real OTP login plus the server-side admin check.

## Authentication and authorization

- **Login:** `/admin-login` → `POST /auth/otp/request` → `POST /auth/otp/verify` (the site's existing per-tab JWT session) → `GET /admin/me`.
  - A 403 there clears the session: "This account does not have admin access".
  - The demo OTP is shown only when the backend returns `debug_code`, which happens in local development and staging only.
- **Server-side checks:** every page load re-confirms admin status with `GET /admin/me`. Expired, suspended or revoked admins are signed out.
- **Removed:** the old `localStorage` admin session, preset admins and `DEMO_ADMIN_OTP`. `src/lib/admin-auth.ts` is now an empty, documented stub.
- **Logout:** clears the backend session.
- **Server-side authority:** the backend decides on every request. Frontend permissions are UX only.
- **Provisioning (no auto-promotion was done):**
  - First local admin: `cd Restamp-backend && python3 scripts/bootstrap_admin.py --user-id <id>`. It refuses non-local databases.
  - Further admins: Settings → Admin team, via the backend's `POST /admin/staff`. Note that the existing "Add admin" form doesn't collect an account id, so it reports that it can't add one. Use the API until that form is extended.
- **Login audit gap:** admin logins are not audit-logged. OTP verify is shared with all users.

## Modules

| Module | Status | Backend |
|---|---|---|
| Admin login, route guard, logout, session expiry | **Complete** | `/auth/otp/*`, `GET /admin/me` |
| Dashboard | **Complete.** Counts come from real listings, users and enquiries. "Recent Activity" is built from real submissions, enquiries and registrations (the sample feed was removed). The client-side "Auto-verifies in m:ss" countdown was replaced by the real submission time. | `/admin/listings`, `/admin/users`, `/admin/enquiries` |
| Properties: list, search, filters, detail (photos, owner, verification history, rejection reason) | **Complete** | `GET /admin/listings`, `GET /admin/listings/{id}` |
| Properties: verify ("Publish now") and reject (edit → status Rejected, reason via the browser's native prompt) | **Complete.** PENDING only; the UI changes only after the backend confirms; duplicate requests are blocked; actions are audited. | `POST /admin/listings/{id}/verify`, `/reject` |
| Properties: edit details, add, delete, unpublish, featured, badge, checklist | **Unavailable.** A clear "not available" message; nothing changes. | no endpoint |
| Users: list, filters, detail (phone, activity counts), suspend (reason), restore | **Complete.** The backend refuses self-suspension and suspending protected admins (422 shown). | `/admin/users*` |
| Users: add, edit, delete, role change, admin notes, subscription grant/extend | **Unavailable** (message shown) | no endpoint / not permitted |
| Enquiries: list, filters, detail with full message thread | **Complete (read-only).** Buyer and owner phone numbers are not exposed. | `/admin/enquiries*` |
| Enquiries: status change, notes, add, delete | **Unavailable** (read-only message) | no endpoint |
| Subscriptions: active list, plans list | **Partial.** Real subscription records are shown. Plans = the public buyer catalogue plus plans found on subscriptions. Every simulated activation is labelled. | `GET /admin/subscriptions`, `GET /buyer/plans` |
| Plan editor, archive or delete plan, cancel/suspend subscription, pricing history | **Unavailable.** Writes are refused with a message; history is empty (no backend storage). | none |
| Payments | **Partial.** Real records only. `SIMULATED` payments show as "unverified" / "Simulated (no charge)" and never count as verified revenue. Invoice PDFs are allowed only for verified payments, of which there are none. | `GET /admin/payments` |
| Settings: admin team (role change, revoke), role matrix (from the backend), security audit log | **Complete.** The hard-coded "Ramesh Sundaram" header now shows the signed-in admin. | `/admin/staff*`, `/admin/roles`, `/admin/audit-logs` |
| Settings: add admin via form, edit role permissions, platform config | **Unavailable** (message shown; platform config shows site defaults) | none |
| Analytics | Uses the real store data | — |
| Notifications page | **Unchanged** (still local); out of scope this phase | — |

## Database changes

- No migrations and no schema changes.

## Payments: what's needed for real integration

- **Code:** commit the untracked `payments` router and service (or a reviewed version), with server-side order creation (amount taken from the plan in the database), gateway signature verification on the webhook, and idempotent activation.
- **Deploy and configure:** deploy it, and set the gateway keys server-side only.
- **Admin views:** the new admin endpoints will then show real provider rows with `simulated: false`.

## Security

- **Owner self-verification:** an owner can still verify their own listing (`POST /owner/listings/{id}/verify`), and the worker still auto-verifies PENDING listings after 2 minutes. This is a known existing issue and was **not modified**, as instructed. Admin verification is independent of it.
- **Tested as non-admin:**
  - A buyer, owner or broker gets 403 on admin APIs (backend tests) and is refused at login with the session cleared (browser test).
  - A forged `localStorage` admin session doesn't open the console.
  - A tampered token gets 401.
  - An admin role without `reports.view` gets 403 on the billing reads.

## Test results

- **Backend:** run against local `restamp_dev`, with every test inside a rolled-back transaction (`restamp_test` isn't accessible).
  - `tests/test_admin_billing.py` (new): 5/5 passed.
  - `tests/test_admin.py`: all passed.
  - `tests/test_buyer_plans.py`: all passed.
  - `tests/test_bootstrap_admin.py`: all but one passed. The failure is `test_default_url_comes_from_settings_and_is_checked`. That test and the script are unchanged from HEAD; it fails because my shell had loaded the local dev database URL from `.env`.
  - Total: 73 passed, 1 failed.
- **Frontend browser test (local only):** 33/33 passed. It ran against an isolated copy of the site on port 3100 with the local backend. Covered:
  - guest redirect and no demo OTP;
  - a non-admin refused with 403 and the session cleared;
  - a forged local session doesn't grant access;
  - admin login, and the dashboard loading real data with no sample feed;
  - the properties list matching the backend;
  - verify (and no duplicate request), and reject with the reason recorded, both audited;
  - suspend and restore;
  - the backend refusing self-suspension;
  - real enquiries;
  - payments and subscriptions from the backend, with simulated rows labelled;
  - settings from the backend with no preset admins;
  - expired session and logout;
  - no owner-verify call and no subscribe call.
- **Buyer/owner regression scripts:** not re-run. The earlier scripts were cleared from the scratch folder. No non-admin file uses the rewritten stores (checked with grep).
- **TypeScript (`npx tsc --noEmit`):** no errors in `src`. Errors appear only in `.next/types`, which the user's running dev server was regenerating at the time.
- **Production build:** passed (`next build`, compiled successfully). It was run on a byte-identical copy of `src`, because the user's dev server was running in the repo folder.

## Design preservation

- **No new class names:** I added no class names.
- **Page changes:** apart from the store logic, changes were limited to:
  - text: the activity subtitle, the submission time, the Settings header showing the signed-in admin, and removing the demo-OTP hint unless the backend sends a code;
  - a "No photo" neutral state replacing the Unsplash stock photo;
  - `noValidate` on the property edit form, so a status-only change can be saved for listings with no area recorded;
  - lazy detail loading when a modal opens.

## Files changed this phase

- **Backend (`Restamp-backend`):**
  - `app/routers/admin.py`, `app/services/admin.py`, `app/schemas.py`: two read-only billing endpoints. These files already had uncommitted changes, which were preserved.
  - New: `tests/test_admin_billing.py`.
- **Frontend (`restamp-website-clean`):**
  - New: `src/lib/api/admin.ts`, `src/lib/admin-billing.ts`, `reports/*.md`.
  - Modified:
    - stores: `src/context/{admin-auth,property,user,enquiry,settings}-context.tsx`;
    - `src/types/admin-auth.ts`, `src/lib/admin-auth.ts` (stub);
    - pages: `src/app/admin/login/page.tsx`, `src/app/admin-dashboard/{page,properties/page,users/page,enquiries/page,settings/page}.tsx`, `subscriptions/{active,payments,plans,pricing-history}/page.tsx`;
    - components: `src/components/dashboard/{sidebar,subscription-overview}.tsx`, `src/components/properties/{property-detail-modal,property-edit-modal}.tsx`, `src/components/subscriptions/plan-editor.tsx`, `src/components/users/role-directory.tsx`.

## Git

- **Website:** detached HEAD at `25b6efa`; `stash@{0}` intact.
- **Backend:** `main` at `312f7fc`; 2 stashes intact.
- No commits, pushes, pulls, resets, cleans, branch switches or stash operations. No `.env` files, databases or backups were touched.

## Run locally

```bash
# Backend (terminal 1)
cd ~/Downloads/Restamp/Restamp-backend
set -a; source .env; set +a
.venv/bin/uvicorn app.main:app --reload --port 8000

# First local admin (only if none exists): find your user id after one normal OTP login, then
python3 scripts/bootstrap_admin.py --user-id <your user id>

# Website (terminal 2). .env/.env.local point at the production backend, so override for local testing:
cd ~/Downloads/Restamp/restamp-website-clean
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 npm run dev
# open http://localhost:3000/admin-login
```

No CORS setting is needed locally: `RESTAMP_CORS_ORIGINS` is unset in `.env`, so the local backend accepts `localhost` origins.
