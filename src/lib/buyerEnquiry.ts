import { sendEnquiry } from '@/lib/api/buyer';
import { errorMessage } from '@/lib/api/client';
import { getSession, loginHref } from '@/lib/api/session';
import { isBackendProperty } from '@/lib/api/mappers';
import { toast } from '@/lib/notify';
import type { Property } from '@/data/properties';

/**
 * Direct buyer -> owner enquiry for the existing enquiry forms:
 * POST /buyer/enquiries {property_listing_id, message}. The backend takes
 * only the listing and the message; the sender is the signed-in account
 * (its name and number come from the backend, not from the form fields).
 *
 * Resolves true only when the backend accepted it (201 new lead, or 200 when
 * the message was added to the buyer's open enquiry). Guests are sent to log
 * in; every failure is shown with the existing toast and resolves false, so
 * callers never show "Enquiry Received!" for a rejected request.
 */
export async function submitEnquiry(property: Property, message: string): Promise<boolean> {
  if (!isBackendProperty(property)) {
    toast.error('Enquiries are not available for this property.');
    return false;
  }
  if (!getSession()) {
    window.location.assign(loginHref(window.location.pathname + window.location.search));
    return false;
  }
  try {
    await sendEnquiry(property.id, message);
    return true;
  } catch (e) {
    toast.error(errorMessage(e, 'Could not send your enquiry. Please try again.'));
    return false;
  }
}
