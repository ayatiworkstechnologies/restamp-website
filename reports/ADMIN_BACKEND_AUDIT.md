# Admin Backend Audit (Restamp-backend)

## Existing architecture (reused, not duplicated)

- **`app/routers/admin.py`** already provides about 29 admin endpoints; 24 of them are committed at HEAD `312f7fc`. The router file also had uncommitted work before this phase (agent-locality endpoints).
- **Authentication:** the normal JWT from OTP or Google login.
- **Authorization:** `deps.require_admin` / `require_admin_permission(p)`.
  - Every request checks for an active account, an `admin_accounts` row (read from the database, never from the token), and one permission of that admin's role (`services/admin_rbac.py`).
  - Roles: SUPER_ADMIN, OPERATIONS_MANAGER, LISTING_REVIEWER, SUPPORT_SPECIALIST, and legacy ADMIN. An unknown role gets nothing.
  - A fixed-OTP session (`amr=fixed_otp`, the production opt-in) gets 403 on every admin endpoint.
  - Non-admins get a static 403 "Forbidden"; unauthenticated callers get 401.
- **Role switching can never grant admin.** There is no public admin registration.
- **Provisioning:**
  - First admin: `scripts/bootstrap_admin.py --user-id <id>` (local `restamp_dev` only, refuses production).
  - Later admins: `POST /admin/staff` (settings.manage_team).
- **Audit:** every admin write records an `audit_logs` row in `services/admin.py`, readable via `GET /admin/audit-logs` and not editable through any API.
- **Tests:** `tests/test_admin.py` (22 tests), `tests/test_bootstrap_admin.py`.

## Operation classification

| Operation | Status | Endpoint |
|---|---|---|
| Admin identity and permissions | Implemented, usable | `GET /admin/me` |
| Role matrix | Implemented, usable | `GET /admin/roles` |
| Dashboard counts | Implemented, usable | `GET /admin/dashboard` (`pending_kyc` reported as unavailable) |
| Analytics | Implemented, usable | `GET /admin/analytics` |
| List / search / filter listings | Implemented, usable | `GET /admin/listings` (verification and listing status, type, owner, q, sort, pagination) |
| Listing detail (photos, owner, verification history) | Implemented, usable | `GET /admin/listings/{id}` |
| Admin verify | Implemented, usable | `POST /admin/listings/{id}/verify`: PENDING only, audited and recorded in `verifications` |
| Admin reject (reason required) | Implemented, usable | `POST /admin/listings/{id}/reject` |
| List / search / filter users | Implemented, usable | `GET /admin/users` (role, status, is_admin, q) |
| User detail and activity | Implemented, usable | `GET /admin/users/{id}` (no OTPs, tokens or hashes) |
| Suspend / reactivate | Implemented, usable | `POST /admin/users/{id}/suspend` (reason) and `/reactivate`; self-suspension and admin protection enforced (422) |
| Enquiry list / detail | Implemented, usable (read-only) | `GET /admin/enquiries`, `GET /admin/enquiries/{id}` (thread, never owner lead notes) |
| Audit logs | Implemented, usable | `GET /admin/audit-logs` |
| Admin team | Implemented, usable | `GET/POST /admin/staff`, `PATCH/DELETE /admin/staff/{user_id}` (self-lockout and last-Super-Admin protection) |
| **Subscription listing** | **Missing, implemented this phase** | `GET /admin/subscriptions` |
| **Payment records** | **Missing, implemented this phase** | `GET /admin/payments` |
| Change user role, delete users, edit or delete listings, create listings as admin | Unsupported by business rules or schema | none (not added) |
| Enquiry status changes or notes by admin | Unsupported (enquiries are buyer-owner records; `enquiries.update_status` permission exists but no endpoint) | none |
| Plan administration (create, edit, archive, price history) | Unsupported: plans are code-defined catalogues (`services/buyer_plans.py`, `agent_plans.py`); no pricing history table | none |
| Real payments / refunds | Unsupported: no gateway in committed code; untracked `app/routers/payments.py` is not deployed (production `/payments/config` returns 404) | none |
| Admin login audit event | Not recorded (OTP verify is shared with all users) | gap documented |

## Existing issue (not changed, as instructed)

- **Owner self-verification:** `POST /owner/listings/{id}/verify` lets an owner verify their own listing.
- **Auto-verify worker:** the background worker (`app/worker.py`) auto-verifies PENDING listings 2 minutes after submission.

Admin verification therefore runs alongside these, not instead of them. Neither the endpoint nor the worker was modified.
