import { clearSession, getSession } from '@/lib/api/session';

export type Profile = {
  mobile: string;
  role: 'buyer' | 'owner' | 'agent';
  name: string;
  email: string;
  city: string;
  joinedAt: string;
};

const KEY = 'restamp_profile';

/**
 * The signed-in user's local profile (UI details only; never authorization).
 * It counts only while this tab holds a valid backend session: once the JWT
 * expires, a request is refused with 401, or the user logs out, the site
 * shows the user as signed out. The stored profile itself is not deleted
 * here, because other tabs may still hold their own valid session
 * (sessions are per tab; the profile is shared).
 */
export function getProfile(): Profile | null {
  try {
    if (!getSession()) return null;
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

// Keep every profile listener (header, dashboards) in step with the backend
// session: re-check when the session changes and periodically for expiry.
if (typeof window !== 'undefined') {
  let signedIn = !!getSession();
  const check = () => {
    const now = !!getSession();
    if (now !== signedIn) {
      signedIn = now;
      window.dispatchEvent(new Event('profile-change'));
    }
  };
  window.addEventListener('restamp-session-change', check);
  window.setInterval(check, 30_000);
}

export function saveProfile(profile: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('profile-change'));
  } catch {}
}

// Every logout path calls this, so it also ends the backend session.
export function clearProfile() {
  clearSession();
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event('profile-change'));
  } catch {}
}

// Logging in again with the same number keeps the saved details
export function loginWithMobile(mobile: string, role: string): Profile {
  const existing = getProfile();
  const validRole = role === 'owner' || role === 'agent' ? role : 'buyer';
  const profile: Profile =
    existing && existing.mobile === mobile
      ? { ...existing, role: role ? validRole : existing.role }
      : { mobile, role: validRole, name: '', email: '', city: 'Chennai', joinedAt: new Date().toISOString() };
  saveProfile(profile);
  return profile;
}
