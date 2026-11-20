/**
 * Account and role helpers on top of the session (endpoints verified against
 * Restamp-backend app/routers/auth.py and users.py).
 *
 * - GET /auth/me -> MeOut {id, display_name, role, providers, is_admin}.
 * - POST /users/me/role {role} -> {user_id, role}. The backend is the only
 *   authority on the current role; the session's role is a cache.
 * - withRole: for actions the user asked for that need a role (switches it
 *   when needed and retries once on "<ROLE> role required").
 * - inRole: for background loads; never switches the role.
 */
import { apiGet, apiPost, isApiError } from './client';
import { BackendRole, getSession, Session, updateSession } from './session';

type MeOut = { id: number; display_name: string; role: string | null; providers: string[]; is_admin: boolean };

export function asRole(role: string | null | undefined): BackendRole | null {
  return role === 'BUYER' || role === 'OWNER' || role === 'BROKER' ? role : null;
}

/** Re-read the account from the backend and refresh the cached session fields. */
export async function refreshMe(): Promise<Session> {
  const me = await apiGet<MeOut>('/auth/me');
  updateSession({ userId: me.id, displayName: me.display_name, role: asRole(me.role), isAdmin: !!me.is_admin });
  const session = getSession();
  if (!session) throw new Error('Session ended');
  return session;
}

let switching: { role: BackendRole; promise: Promise<void> } | null = null;

// The backend writes a role-history row on every call, so concurrent
// switches to the same role share one request.
function switchRole(role: BackendRole): Promise<void> {
  if (switching?.role === role) return switching.promise;
  const promise = apiPost<{ user_id: number; role: string }>('/users/me/role', { role })
    .then((out) => updateSession({ role: asRole(out.role) }))
    .finally(() => {
      if (switching?.promise === promise) switching = null;
    });
  switching = { role, promise };
  return promise;
}

export async function ensureRole(role: BackendRole): Promise<void> {
  if (getSession()?.role === role) return;
  await switchRole(role);
}

function isWrongRole(e: unknown, role: BackendRole): boolean {
  return isApiError(e, 'denied') && e.detail === `${role} role required`;
}

export async function withRole<T>(role: BackendRole, request: () => Promise<T>): Promise<T> {
  await ensureRole(role);
  try {
    return await request();
  } catch (e) {
    if (!isWrongRole(e, role)) throw e;
    await switchRole(role);
    return request();
  }
}

export async function inRole<T>(role: BackendRole, request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (e) {
    if (isWrongRole(e, role)) await refreshMe().catch(() => undefined);
    throw e;
  }
}
