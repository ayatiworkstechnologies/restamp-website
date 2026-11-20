export interface AdminSession {
  id: string;
  name: string;
  email: string;
  mobile: string;
  /** Backend role label (GET /admin/me role_label). */
  role: string;
  /** Backend admin_role code and permissions (UX only; the backend re-checks every request). */
  adminRole?: string;
  permissions?: string[];
  department: string;
  avatar?: string;
  token?: string;
  lastLogin: string;
}

export interface AdminAuthContextType {
  admin: AdminSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Real OTP verify + server-side admin check. Resolves to an error message, or null on success. */
  loginWithMobile: (mobile: string, otp: string) => Promise<string | null>;
  /** Asks the backend to issue an OTP; resolves to the local-only debug code when the backend returns one. */
  requestOtp: (mobile: string) => Promise<{ error: string | null; debugCode: string | null }>;
  hasPermission: (permission: string) => boolean;
  logout: () => void;
}
