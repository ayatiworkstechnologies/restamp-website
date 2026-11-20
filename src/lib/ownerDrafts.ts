import { createOwnerDraft, deleteOwnerDraft, listOwnerDrafts, updateOwnerDraft, type DraftOut } from '@/lib/api/owner';
import { clearDraft, emptyListing, getDraft, saveDraft, type ListingPhoto, type OwnerListing } from '@/lib/ownerListings';

/**
 * Add Property drafts on the backend (/owner/drafts), owner-scoped by the token.
 *
 * - The COMPLETE wizard state is sent on every save: PUT replaces form_data
 *   entirely, so a partial snapshot would erase fields.
 * - Wizard steps are 0-based (6 steps: 0..5); the backend's current_step is
 *   1-based and accepts 1..7, so current_step = step + 1 and step = current_step - 1.
 * - Photos: the image data (base64 data URLs) is NOT sent to the backend,
 *   because production request-size/database limits are unverified. Each
 *   photo's id and category ARE sent, and the image data stays in this
 *   browser's existing local draft. On resume, images are re-attached by id;
 *   any that are not on this device are reported, never silently dropped.
 * - Fields the publish API cannot accept (booking amount, sale-side
 *   maintenance/negotiable, multiple overlooking or tenant preferences,
 *   "Other Rooms" photos) are kept in the draft exactly as entered.
 */

const TX: Record<string, string> = { Sell: 'BUY', Resale: 'RESALE', Rent: 'RENT', Lease: 'LEASE' };
const LAST_STEP = 5;

type StoredPhoto = Pick<ListingPhoto, 'id' | 'category'>;

function title(l: OwnerListing): string | null {
  const t = [l.bhk, l.propertyType, l.locality ? `in ${l.locality}` : ''].filter(Boolean).join(' ').trim();
  return t ? t.slice(0, 255) : null;
}

function toFormData(l: OwnerListing): Record<string, unknown> {
  const photos: StoredPhoto[] = l.photos.map(({ id, category }) => ({ id, category }));
  return { ...l, photos };
}

export type ResumableDraft = {
  draftId: number;
  listing: OwnerListing;
  step: number;
  /** Photos saved with the draft whose image data is not stored on this device. */
  missingPhotos: number;
};

function fromDraft(d: DraftOut): ResumableDraft {
  const saved = (d.form_data || {}) as Partial<OwnerListing> & { photos?: StoredPhoto[] };
  const localPhotos = getDraft()?.listing.photos || [];
  const photos: ListingPhoto[] = [];
  let missingPhotos = 0;
  for (const p of saved.photos || []) {
    const local = localPhotos.find((x) => x.id === p.id);
    if (local) photos.push({ ...local, category: p.category });
    else missingPhotos += 1;
  }
  const step = Math.min(LAST_STEP, Math.max(0, (d.current_step || 1) - 1));
  return { draftId: d.id, listing: { ...emptyListing(), ...saved, photos } as OwnerListing, step, missingPhotos };
}

/** The owner's most recently updated backend draft, or null when there is none. */
export async function loadLatestDraft(): Promise<ResumableDraft | null> {
  const res = await listOwnerDrafts();
  return res.items.length ? fromDraft(res.items[0]) : null;
}

/**
 * Save the complete wizard state. Creates the draft the first time and
 * replaces it afterwards. Resolves to the draft id and whether this browser
 * could also keep the photo images.
 */
export async function saveWizardDraft(
  listing: OwnerListing,
  step: number,
  draftId: number | null,
): Promise<{ draftId: number; photosKeptLocally: boolean }> {
  const body = {
    transaction_type: TX[listing.purpose] || 'BUY',
    title: title(listing),
    current_step: Math.min(LAST_STEP, Math.max(0, step)) + 1,
    form_data: toFormData(listing),
  };
  const out = draftId ? await updateOwnerDraft(draftId, body) : await createOwnerDraft(body);
  // Image data stays on this device (existing local draft storage).
  const photosKeptLocally = saveDraft(listing, step);
  return { draftId: out.id, photosKeptLocally };
}

/** Delete the backend draft and this browser's local copy. */
export async function discardWizardDraft(draftId: number | null): Promise<void> {
  if (draftId) await deleteOwnerDraft(draftId);
  clearDraft();
}

/** Delete the owner's latest backend draft (used where only the local draft is known, e.g. My Properties). */
export async function discardLatestDraft(): Promise<void> {
  const res = await listOwnerDrafts();
  if (res.items.length) await deleteOwnerDraft(res.items[0].id);
  clearDraft();
}

/** Wizard values publishing cannot keep (see ownerPublish.publishBlockers). */
export { publishBlockers as unpublishableFields } from '@/lib/ownerPublish';
