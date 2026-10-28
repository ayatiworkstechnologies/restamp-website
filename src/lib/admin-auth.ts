import { AdminSession } from '@/types/admin-auth';
import { initialAdminUsers } from '@/lib/settings-data';

export const ADMIN_AUTH_KEY = 'restamp_admin_session';
export const DEMO_ADMIN_OTP = '123456';

export const PRESET_ADMINS: AdminSession[] = [
  {
    id: 'ADM-101',
    name: 'Ramesh Sundaram',
    email: 'ramesh.sundaram@restamp.in',
    mobile: '9840155667',
    role: 'Super Admin',
    department: 'Executive & Platform Ops',
    lastLogin: 'Just now',
  },
  {
    id: 'ADM-102',
    name: 'Deepak Manoharan',
    email: 'deepak.m@restamp.in',
    mobile: '9841288990',
    role: 'Operations Manager',
    department: 'Listing Verification & Compliance',
    lastLogin: 'Just now',
  },
  {
    id: 'ADM-103',
    name: 'Anita Krishnan',
    email: 'anita.k@restamp.in',
    mobile: '9790833445',
    role: 'Listing Reviewer',
    department: 'Quality Assurance',
    lastLogin: 'Just now',
  },
];

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('admin-auth-change'));
  } catch (e) {
    console.error('Failed to save admin session', e);
  }
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    window.dispatchEvent(new Event('admin-auth-change'));
  } catch (e) {
    console.error('Failed to clear admin session', e);
  }
}

export function findAdminByMobile(mobile: string): AdminSession | null {
  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
  
  // Check preset admins
  const preset = PRESET_ADMINS.find((a) => a.mobile.replace(/\D/g, '').slice(-10) === cleanMobile);
  if (preset) return preset;

  // Check initialAdminUsers in settings data
  const user = initialAdminUsers.find(
    (u) => u.phone.replace(/\D/g, '').slice(-10) === cleanMobile
  );
  if (user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: cleanMobile,
      role: user.role as AdminSession['role'],
      department: user.department,
      lastLogin: 'Just now',
    };
  }

  return null;
}

export function authenticateAdminMobile(mobile: string, otp: string): AdminSession | null {
  if (otp !== DEMO_ADMIN_OTP) return null;

  const found = findAdminByMobile(mobile);
  if (found) {
    const session = { ...found, lastLogin: new Date().toISOString() };
    saveAdminSession(session);
    return session;
  }

  // Allow any valid 10-digit mobile with demo OTP as Administrator
  const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
  if (/^[6-9]\d{9}$/.test(cleanMobile)) {
    const fallback: AdminSession = {
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      name: 'Admin User',
      email: `admin.${cleanMobile.slice(-4)}@restamp.in`,
      mobile: cleanMobile,
      role: 'Administrator',
      department: 'Platform Administration',
      lastLogin: new Date().toISOString(),
    };
    saveAdminSession(fallback);
    return fallback;
  }

  return null;
}
