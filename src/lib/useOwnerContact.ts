import { useState, useEffect } from 'react';
import { isBuyerPlanRequired, recordCall, revealContact } from '@/lib/api/buyer';
import { errorMessage, isApiError, apiGetContactCredits, apiGetContactUnlocks } from '@/lib/api/client';
import { getSession, loginHref } from '@/lib/api/session';
import { isBackendProperty } from '@/lib/api/mappers';
import { snackbar, toast } from '@/lib/notify';
import type { Property } from '@/data/properties';

/** "+919876543210" -> "+91 98765 43210" for display. */
export function formatIndianPhone(phone: string): string {
  const m = phone.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : phone;
}

/**
 * Existing "View Number" buttons: reveal the owner's real phone through the
 * audited backend endpoint POST /buyer/listings/{id}/contact. Guests are sent
 * to log in; failures (including the 402 buyer-plan quota) use the existing
 * toast, and the button keeps saying "View Number" — no number is ever
 * shown unless the backend returned it.
 *
 * Additionally fetches and displays the caller's contact credit summary
 * (free unlocks remaining, credit balance, permanently unlocked properties)
 * from the backend, so the UI can show entitlement information.
 */
export function useOwnerContact(property: Property) {
  const [phone, setPhone] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [creditSummary, setCreditSummary] = useState<any | null>(null);

  // Fetch contact credit summary from backend on mount
  useEffect(() => {
    if (!getSession()) return;
    apiGetContactCredits()
      .then((res) => setCreditSummary(res))
      .catch((e) => {
        if (!isApiError(e, 'missing')) toast.error(errorMessage(e, 'Could not load contact entitlement.'));
      });
  }, [getSession()]);

  const reveal = async () => {
    if (phone || loading) return;
    if (!isBackendProperty(property)) {
      toast.error('Contact details are not available for this property.');
      return;
    }
    if (!getSession()) {
      window.location.assign(loginHref(window.location.pathname + window.location.search));
      return;
    }
    setLoading(true);
    try {
      const revealed = await revealContact(property.id);
      setPhone(formatIndianPhone(revealed.phone));
      setOwnerName(revealed.ownerName);
      // "View Number" is this site's call button: record the backend "call button tapped"
      // event for Activity > Calls (not on the owner's own listing; failures are ignored).
      if (!revealed.ownListing) recordCall(property.id).catch(() => undefined);
    } catch (e) {
      if (isBuyerPlanRequired(e)) {
        snackbar("You've used all the free owner-number reveals on your current plan.", {
          actionLabel: 'View plans',
          onAction: () => window.location.assign('/plans'),
        });
      } else {
        toast.error(
          isApiError(e, 'missing')
            ? 'The owner has not shared a contact number for this listing.'
            : errorMessage(e, 'Could not load the number. Please try again.'),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { phone, ownerName, loading, reveal, creditSummary };
}