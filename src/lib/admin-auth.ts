/**
 * Retired. Admin sign-in no longer uses preset admin accounts or a demo OTP:
 * it uses the real backend OTP login followed by GET /admin/me, which checks the
 * caller's admin_accounts row server-side (see src/context/admin-auth-context.tsx).
 * Admins are provisioned on the backend (scripts/bootstrap_admin.py for the first
 * local admin, then POST /admin/staff).
 */
export {};
