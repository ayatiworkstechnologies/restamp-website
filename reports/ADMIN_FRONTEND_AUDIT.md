# Admin Frontend Audit (restamp-website-clean)

Audit of the Admin console **as found before this phase**. Nothing here was connected to the backend: every page read seeded local data and persisted edits to `localStorage`.

## Architecture found

- Route group `src/app/admin-dashboard/*`, wrapped by `providers.tsx`: `AdminAuthProvider → PropertyProvider → UserProvider → EnquiryProvider → SettingsProvider → AdminAuthGuard`.
- Pages read only from those four context stores, plus `lib/subscription-store.ts` (local billing), `lib/dashboard-data.ts` (static activity) and `lib/notifications.ts` (local).
- Login: `/admin-login` (re-exports `/admin/login`). `/admin` forwards to the dashboard.

## Pages

| Page | UI / actions | Data source found | Mock / static data | API calls | Missing backend | Loading / error / empty |
|---|---|---|---|---|---|---|
| `/admin-login` (`admin/login/page.tsx`) | Mobile → OTP → enter console | `lib/admin-auth.ts` | Preset admins (`PRESET_ADMINS`), hard-coded `DEMO_ADMIN_OTP = "123456"` shown on screen; any number accepted | none | Real OTP plus server-side admin check | Inline error only |
| Auth guard (`components/dashboard/admin-auth-guard.tsx`) | Redirects guests to login | `localStorage` key `restamp_admin_session` | Forgeable local session | none | Server-confirmed admin session | Loading and redirect screens |
| Dashboard (`admin-dashboard/page.tsx`) | Stat cards, status chart, pending list with auto-verify countdown, "Recent Activity", subscription overview | property, user and enquiry stores; `dashboard-data.activities`; `auto-verify` countdown | Seeded listings, users, enquiries; activity feed labelled "Sample data"; client-side 5-minute countdown | none | Real counts and recent records | No explicit loading or error |
| Properties (`properties/page.tsx` + `components/properties/*`) | Table/grid, filters, detail modal (photos, owner, documents, checklist, audit), edit, add, delete, featured / verified badge, Publish / Unpublish | `property-context` (seed + localStorage), plus client-side "auto-verify" timer | Seed `properties-data`; Unsplash stock-photo fallback | none | List, detail, verify, reject | None |
| Users (`users/page.tsx`, `users/{buyers,owners,agents}` via `role-directory.tsx`) | Table, filters, detail, suspend / restore, edit, add, delete, notes, bulk suspend, grant / extend subscriptions | `user-context` (seed + localStorage), `subscription-store` | Seed `users-data` | none | List, detail, suspend, reactivate | None |
| Enquiries (`enquiries/page.tsx`) | Table, filters, detail, status change, notes, add, delete, bulk status | `enquiry-context` (seed + localStorage) | Seed `enquiries-data` | none | List and detail (read-only) | None |
| Subscriptions: plans / active / payments / pricing history | Plan editor (create, edit, archive, delete), subscriber list (cancel, suspend), payments with invoice PDF, price history | `lib/subscription-store.ts` | Seeded plans, subscriptions, payments, history | none | Subscriptions and payments reads; no plan administration backend | Skeletons in places |
| Settings (`settings/page.tsx` + `components/settings/*`) | Admin team table (add, edit, delete), roles/permissions editor, platform config, security audit log | `settings-context` (seed + localStorage) | Seeded admins (Ramesh Sundaram etc.), roles, audit log; header hard-codes "Ramesh Sundaram / Super Admin" | none | Staff, roles, audit log | None |
| Analytics (`analytics/page.tsx`) | Charts from stores | property, user and enquiry stores | Derived from seed data | none | Real store data | — |
| Notifications (`notifications/page.tsx`) | Send/broadcast in-app notifications, automatic rules | `lib/notifications.ts` (local) | Local only | none | No admin broadcast endpoint was connected (not in scope) | — |
