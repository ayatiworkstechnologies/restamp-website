"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSession, AdminAuthContextType } from '@/types/admin-auth';
import { apiGet, apiPost, errorMessage, isApiError } from '@/lib/api/client';
import { clearSession, getSession, saveSession } from '@/lib/api/session';
import { getAdminMe, type AdminMe } from '@/lib/api/admin';

/**
 * Admin sign-in on the real backend:
 *   POST /auth/otp/request -> POST /auth/otp/verify (JWT, per-tab session) -> GET /admin/me.
 * Admin rights exist only if GET /admin/me succeeds (admin_accounts row checked
 * server-side). A 403 means "not an admin": the session is cleared and access
 * refused. On load the stored session is re-confirmed with GET /admin/me, so an
 * expired, revoked or suspended account is signed out. No preset admins, no demo OTP.
 */

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

type TokenOut = { access_token: string; user_id: number; role: string | null; expires_in: number };

function toAdminSession(me: AdminMe): AdminSession {
  return {
    id: String(me.user_id),
    name: me.display_name,
    email: '',
    mobile: '',
    role: me.role_label,
    adminRole: me.admin_role,
    permissions: me.permissions,
    department: me.role_label,
    lastLogin: new Date().toISOString(),
  };
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const confirm = useCallback(async () => {
    if (!getSession()) {
      setAdmin(null);
      setIsLoading(false);
      return;
    }
    try {
      setAdmin(toAdminSession(await getAdminMe()));
    } catch (e) {
      // 401 already cleared the session in the API client; 403 = not (or no longer) an admin.
      if (isApiError(e, 'denied')) clearSession();
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void confirm();
    const onSession = () => {
      if (!getSession()) setAdmin(null);
    };
    window.addEventListener('restamp-session-change', onSession);
    return () => window.removeEventListener('restamp-session-change', onSession);
  }, [confirm]);

  const requestOtp = useCallback(async (mobile: string) => {
    try {
      const res = await apiPost<{ debug_code?: string | null }>('/auth/otp/request', { phone: `+91${mobile}` });
      return { error: null, debugCode: res.debug_code || null };
    } catch (e) {
      return { error: errorMessage(e, 'Could not send the OTP. Please try again.'), debugCode: null };
    }
  }, []);

  const loginWithMobile = useCallback(async (mobile: string, otp: string): Promise<string | null> => {
    try {
      const tok = await apiPost<TokenOut>('/auth/otp/verify', { phone: `+91${mobile}`, code: otp });
      saveSession({
        token: tok.access_token,
        userId: tok.user_id,
        role: null,
        displayName: '',
        isAdmin: false,
        expiresAt: Date.now() + tok.expires_in * 1000,
      });
    } catch (e) {
      clearSession();
      return isApiError(e, 'login') ? 'Incorrect OTP. Please try again.' : errorMessage(e, 'Could not verify the OTP.');
    }
    try {
      const me = await getAdminMe();
      const meUser = await apiGet<{ display_name: string; role: string | null }>('/auth/me').catch(() => null);
      const s = getSession();
      if (s) saveSession({ ...s, isAdmin: true, displayName: meUser?.display_name || me.display_name, role: (meUser?.role as 'BUYER' | 'OWNER' | 'BROKER' | null) ?? null });
      setAdmin(toAdminSession(me));
      return null;
    } catch (e) {
      clearSession();
      setAdmin(null);
      return isApiError(e, 'denied')
        ? 'This account does not have admin access.'
        : errorMessage(e, 'Could not confirm admin access. Please try again.');
    }
  }, []);

  const hasPermission = useCallback((permission: string) => !!admin?.permissions?.includes(permission), [admin]);

  const logout = useCallback(() => {
    clearSession();
    setAdmin(null);
    router.push('/admin-login');
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, isLoading, loginWithMobile, requestOtp, hasPermission, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
