export type Profile = {
  mobile: string;
  role: 'buyer' | 'owner' | 'agent';
  name: string;
  email: string;
  city: string;
  joinedAt: string;
};

const KEY = 'restamp_profile';

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('profile-change'));
  } catch {}
}

export function clearProfile() {
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
