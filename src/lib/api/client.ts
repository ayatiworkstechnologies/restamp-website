/**
 * RESTAMP backend API client for the website.
 *
 * - Base URL comes from NEXT_PUBLIC_API_URL. The URL is fixed per page load;
 *   requests never switch hosts after a failure.
 * - Every failure is an ApiError with a `kind` the UI branches on:
 *   login (401) | denied (403) | missing (404) | validation (400/422) |
 *   retry (5xx/other) | timeout | offline. `detail` carries the backend's
 *   static detail string when it sent one (never credentials).
 * - Requests time out after 25 s (the Render free plan cold-starts slowly).
 * - The bearer token is read from the session module; this file never
 *   stores or logs it.
 */
import { getSessionToken, handleUnauthorized } from './session';

const DEFAULT_PROD_API_URL = 'https://api.restamp.in';

function resolveApiBaseUrl(): string {
  const configured = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/+$/, '');
  if (configured) return configured;
  return DEFAULT_PROD_API_URL;
}

/** Real backend URL (used by the dev proxy in next.config.ts). */
export const BACKEND_URL = resolveApiBaseUrl();

/**
 * In development the browser calls the backend through the Next dev server
 * (/backend-api → BACKEND_URL, see next.config.ts). The backend's CORS list only
 * allows http://localhost:3000, so without this, opening the site on the
 * network address (e.g. http://192.168.x.x:3000 on a phone) silently fails
 * every API call. Production builds call the backend directly.
 */
export const API_BASE_URL =
  process.env.NODE_ENV === 'development' && typeof window !== 'undefined' ? '/backend-api' : BACKEND_URL;
export const REQUEST_TIMEOUT_MS = 25000;

export type ApiErrorKind =
  | 'login'
  | 'denied'
  | 'missing'
  | 'validation'
  | 'retry'
  | 'timeout'
  | 'offline';

export class ApiError extends Error {
  kind: ApiErrorKind;
  status: number;
  detail?: string;

  constructor(kind: ApiErrorKind, status: number, message: string, detail?: string) {
    super(message);
    this.kind = kind;
    this.status = status;
    this.detail = detail;
  }
}

export function isApiError(e: unknown, kind?: ApiErrorKind): e is ApiError {
  return e instanceof ApiError && (kind === undefined || e.kind === kind);
}

function kindForStatus(status: number): ApiErrorKind {
  if (status === 401) return 'login';
  if (status === 403) return 'denied';
  if (status === 404) return 'missing';
  if (status === 400 || status === 422) return 'validation';
  return 'retry';
}

/** Plain-language message for an API failure, safe to show to users. */
export function errorMessage(e: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (!isApiError(e)) return fallback;
  switch (e.kind) {
    case 'offline':
      return 'Could not reach the RESTAMP server. Check your connection and try again.';
    case 'timeout':
      return 'The server took too long to respond. Please try again.';
    case 'login':
      return 'Your session has ended. Please log in again.';
    case 'denied':
      return "You don't have permission to do that.";
    case 'missing':
      // FastAPI's own "Not Found" means the route itself does not exist on this server.
      if (!e.detail || e.detail === 'Not Found') return 'This service is not available right now. Please try again later or contact support.';
      return e.detail;
    case 'validation':
      return e.detail && e.detail !== 'Invalid request' ? e.detail : 'Invalid request. Please check the details and try again.';
    default:
      break;
  }
  if (e.status === 402 && e.detail) return e.detail;
  if (e.status === 503) return 'The service is temporarily unavailable. Please try again in a few minutes.';
  if (e.status >= 500) return 'Something went wrong on our side. Please try again.';
  return fallback;
}

type Query = Record<string, string | number | boolean | null | undefined>;

function buildUrl(path: string, query?: Query): string {
  const qs = Object.entries(query || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Query;
  body?: unknown;
  /** Send the session token. Public endpoints pass false. */
  auth?: boolean;
  signal?: AbortSignal;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, auth = true, signal } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getSessionToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const onCallerAbort = () => controller.abort();
  signal?.addEventListener('abort', onCallerAbort, { once: true });

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e) {
    if (timedOut) throw new ApiError('timeout', 0, 'The request timed out.');
    // A caller-initiated abort is rethrown untouched so it is never shown as an error.
    if (signal?.aborted) throw e;
    throw new ApiError('offline', 0, 'Could not reach the server.');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }

  if (response.ok) {
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  let detail: string | undefined;
  try {
    const data = await response.json();
    if (data && typeof data.detail === 'string') detail = data.detail;
    // Structured 402s (plan limits) carry a user-facing message.
    else if (data && data.detail && typeof data.detail.message === 'string') detail = data.detail.message;
  } catch {
    // Non-JSON error body: keep the generic message.
  }
  // An authenticated request that comes back 401 means the token is no
  // longer accepted (expired or revoked): end the local session.
  if (response.status === 401 && auth && getSessionToken()) handleUnauthorized();
  throw new ApiError(kindForStatus(response.status), response.status, `Request failed (${response.status}).`, detail);
}

export const apiGet = <T>(path: string, query?: Query, auth = true) => apiRequest<T>(path, { query, auth });
export const apiPost = <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'POST', body });
export const apiPatch = <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'PATCH', body });
export const apiDelete = <T = void>(path: string) => apiRequest<T>(path, { method: 'DELETE' });

// Buyer API endpoints
export const apiGetBuyerListings = <T>(query?: Query, auth = true) => apiRequest<T>('/buyer/listings', { query, auth });
export const apiGetBuyerEnquiries = <T>(query?: Query, auth = true) => apiRequest<T>('/buyer/enquiries', { query, auth });
export const apiPostBuyerEnquiry = <T>(body: unknown) => apiRequest<T>('/buyer/enquiries', { method: 'POST', body });
export const apiGetBuyerEnquiry = <T>(enquiry_id: number, auth = true) => apiRequest<T>(`/buyer/enquiries/${enquiry_id}`, { auth });
export const apiPostBuyerSave = <T>(listing_id: number, auth = true) => apiRequest<T>(`/buyer/saved/${listing_id}`, { method: 'POST', auth });
export const apiGetBuyerSaved = <T>(query?: Query, auth = true) => apiRequest<T>('/buyer/saved', { query, auth });
export const apiDeleteBuyerSave = <T>(listing_id: number, auth = true) => apiRequest<T>(`/buyer/saved/${listing_id}`, { method: 'DELETE', auth });
export const apiPostBuyerVisit = <T>(body: unknown, auth = true) => apiRequest<T>('/buyer/visits', { method: 'POST', body, auth });
export const apiGetBuyerVisits = <T>(query?: Query, auth = true) => apiRequest<T>('/buyer/visits', { query, auth });
export const apiPatchBuyerVisit = <T>(visit_id: number, body: unknown, auth = true) => apiRequest<T>(`/buyer/visits/${visit_id}`, { method: 'PATCH', body, auth });
export const apiPostBuyerViewed = <T>(listing_id: number, auth = true) => apiRequest<T>(`/buyer/viewed/${listing_id}`, { method: 'POST', auth });
export const apiGetBuyerViewed = <T>(query?: Query, auth = true) => apiRequest<T>('/buyer/viewed', { query, auth });
export const apiPostBuyerCallEvent = <T>(listing_id: number, auth = true) => apiRequest<T>(`/buyer/listings/${listing_id}/call-events`, { method: 'POST', auth });
export const apiGetBuyerCallEvents = <T>(query?: Query, auth = true) => apiRequest<T>('/buyer/call-events', { query, auth });
export const apiGetBuyerPlans = <T>(auth = true) => apiRequest<T>('/buyer/plans', { auth });
export const apiGetBuyerPlan = <T>(auth = true) => apiRequest<T>('/buyer/plan', { auth });
export const apiPostBuyerPlanSubscribe = <T>(code: string, body: unknown, auth = true) => apiRequest<T>(`/buyer/plans/${code}/subscribe`, { method: 'POST', body, auth });

// Contact credits API endpoints
export const apiGetContactCredits = <T>() => apiGet<T>('/contact-credits', undefined, true);
export const apiGetContactCreditHistory = <T>(page?: number, pageSize?: number) =>
  apiGet<T>(`/contact-credits/history?page=${page ?? 1}&page_size=${pageSize ?? 20}`, undefined, true);
export const apiGetContactUnlocks = <T>(page?: number, pageSize?: number) =>
  apiGet<T>(`/unlocks?page=${page ?? 1}&page_size=${pageSize ?? 20}`, undefined, true);
export const apiGetContactUnlock = <T>(listing_id: number) => apiGet<T>(`/unlocks/${listing_id}`, undefined, true);

// Conversation API endpoints
export const apiPostConversation = <T>(body: { other_user_id: number; conversation_type: string; property_listing_id?: number }) =>
  apiRequest<T>('/conversations', { method: 'POST', body });
export const apiGetConversations = <T>(page?: number, pageSize?: number) =>
  apiGet<T>(`/conversations?page=${page ?? 1}&page_size=${pageSize ?? 20}`, undefined, true);
export const apiGetConversation = <T>(conversation_id: number) => apiGet<T>(`/conversations/${conversation_id}`, undefined, true);
export const apiGetConversationMessages = <T>(conversation_id: number, page?: number, pageSize?: number, before_message_id?: number) => {
  const params: Record<string, string> = { page: (page ?? 1).toString(), page_size: (pageSize ?? 50).toString() };
  if (before_message_id !== undefined) params['before_message_id'] = String(before_message_id);
  return apiGet<T>(`/conversations/${conversation_id}/messages?${new URLSearchParams(params)}`, undefined, true);
};
export const apiPostConversationRead = <T>(conversation_id: number) =>
  apiRequest<T>('/conversations/' + conversation_id + '/read', { auth: true });
export const apiPostMessageRead = <T>(conversation_id: number, message_id: number) =>
  apiRequest<T>('/conversations/' + conversation_id + '/messages/read', { auth: true });
export const apiPostConversationMessage = <T>(body: { conversation_id: number; body: string; message_type?: string }) =>
  apiRequest<T>('/conversations/' + body.conversation_id + '/messages', { method: 'POST', body });
export const apiGetConversationUnreadCount = <T>() => apiGet<T>('/conversations/unread-count', undefined, true);

/** Paginated list envelope used by every backend list endpoint. */
export type Page<T> = { items: T[]; page: number; page_size: number; total: number };