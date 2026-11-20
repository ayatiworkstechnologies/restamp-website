"use client";

import { toast as notify } from "@/lib/notify";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Property, PropertyStatus, PropertyType, AdminChecklist, AuditLogEntry } from "@/types/property";
import { errorMessage } from "@/lib/api/client";
import { getSession } from "@/lib/api/session";
import {
  fetchAll,
  getAdminListing,
  listAdminListings,
  rejectAdminListing,
  verifyAdminListing,
  type AdminListingDetail,
  type AdminListingRow,
} from "@/lib/api/admin";

/**
 * Admin property store backed by the real backend:
 *   GET  /admin/listings            (all listings, every owner)
 *   GET  /admin/listings/{id}       (photos, owner, verification history)
 *   POST /admin/listings/{id}/verify  PENDING -> VERIFIED   [properties.approve]
 *   POST /admin/listings/{id}/reject  PENDING -> REJECTED   [properties.reject, reason required]
 * State changes only after the backend confirms. Actions the backend has no admin
 * endpoint for (create, edit, delete, unpublish, featured/badge, checklist) are
 * refused with a message and change nothing. Nothing is stored in localStorage
 * and there is no client-side auto-verification.
 */

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  loadError: string;
  stats: {
    total: number;
    active: number;
    pending: number;
    rejected: number;
    draft: number;
    totalValue: number;
  };
  toast: ToastMessage | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addProperty: (newProp: Omit<Property, "id" | "submittedAt" | "updatedAt" | "auditLog">) => string;
  toggleFeatured: (id: string) => void;
  toggleVerified: (id: string) => void;
  updateChecklist: (id: string, key: keyof AdminChecklist, value: boolean) => void;
  /** Load photos, owner and verification history for one listing (GET /admin/listings/{id}). */
  refreshProperty: (id: string) => Promise<void>;
  /** Re-read all listings from the backend. */
  reload: () => Promise<void>;
  resetToDefault: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const TYPE_LABEL: Record<string, PropertyType> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  HOUSE: "Independent House",
  PLOT: "Plot",
  AGRICULTURAL_LAND: "Plot",
  COMMERCIAL: "Commercial",
};

const fmt = (iso: string | null | undefined) =>
  iso
    ? new Date(iso.endsWith("Z") || iso.includes("+") ? iso : `${iso}Z`).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "";

/** Verification status is the admin review state; "Active" = verified (live only if also AVAILABLE). */
function statusOf(v: string): PropertyStatus {
  if (v === "VERIFIED") return "Active";
  if (v === "REJECTED") return "Rejected";
  return "Pending";
}

const http = (u: string | null | undefined) => (u && /^https?:\/\//i.test(u) ? u : "");

function fromRow(r: AdminListingRow): Property {
  const cover = http(r.cover_image_url);
  return {
    id: String(r.listing_id),
    title: r.title,
    description: "",
    type: TYPE_LABEL[r.property_type] || ("Apartment" as PropertyType),
    bhk: 0,
    bathrooms: 0,
    balconies: 0,
    carpetAreaSqFt: 0,
    superBuiltUpAreaSqFt: 0,
    price: Math.round(r.price_paise / 100),
    status: statusOf(r.verification_status),
    locality: r.locality,
    address: [r.locality, r.city, r.pincode].filter(Boolean).join(", "),
    city: r.city,
    state: "Tamil Nadu",
    pincode: r.pincode,
    furnishing: "" as Property["furnishing"],
    floor: "",
    totalFloors: 0,
    facing: "" as Property["facing"],
    parking: "",
    ageOfProperty: "",
    possessionStatus: "" as Property["possessionStatus"],
    reraVerified: false,
    featured: false,
    verifiedBadge: r.verification_status === "VERIFIED",
    images: cover ? [cover] : [],
    amenities: [],
    owner: {
      id: String(r.owner_user_id),
      name: r.owner_name || `User #${r.owner_user_id}`,
      phone: "",
      email: "",
      isKycVerified: false,
      accountType: "Individual Owner",
      joinedDate: "",
      totalListings: 0,
    },
    documents: [],
    adminChecklist: {
      legalDocumentsVerified: false,
      pricingValidated: false,
      physicalInspectionDone: false,
      highResolutionPhotos: false,
      ownerIdentityConfirmed: false,
    },
    auditLog: [],
    submittedAt: fmt(r.submitted_at),
    updatedAt: fmt(r.submitted_at),
    initials: r.title.slice(0, 2).toUpperCase(),
    tint: "#EBF3FE",
  };
}

function withDetail(base: Property, d: AdminListingDetail): Property {
  const l = d.listing;
  const gallery = (l.gallery || []).map(http).filter(Boolean);
  const history: AuditLogEntry[] = [...d.verification_history]
    .sort((a, b) => b.attempt_no - a.attempt_no)
    .map((h) => ({
      id: `VER-${l.listing_id}-${h.attempt_no}`,
      action: h.action || h.result,
      actor: h.actor || (h.triggered_by_user_id ? `User #${h.triggered_by_user_id}` : "System"),
      role: h.actor === "SYSTEM" ? "Automatic" : "Recorded",
      timestamp: fmt(h.triggered_at),
      notes: [h.result, h.reason].filter(Boolean).join(" · ") || undefined,
    }));
  const lastReject = d.verification_history.filter((h) => h.result === "REJECTED").sort((a, b) => b.attempt_no - a.attempt_no)[0];
  return {
    ...base,
    title: l.title,
    description: l.description || "",
    status: statusOf(l.verification_status),
    bhk: l.bedrooms ?? 0,
    bathrooms: l.bathrooms ?? 0,
    balconies: l.balconies ?? 0,
    carpetAreaSqFt: l.area_value ?? 0,
    superBuiltUpAreaSqFt: l.super_built_up_area ?? 0,
    furnishing: (l.furnishing || "") as Property["furnishing"],
    facing: (l.facing || "") as Property["facing"],
    images: gallery.length ? gallery : base.images,
    amenities: l.amenities || [],
    address: [l.address_line, l.locality, l.city, l.pincode].filter(Boolean).join(", "),
    owner: { ...base.owner, name: d.owner.display_name || base.owner.name },
    auditLog: history,
    rejectionReason: lastReject?.reason || undefined,
    rejectionCategory: lastReject?.category || undefined,
  };
}

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const toast: ToastMessage | null = null;

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    notify[type](message);
  };
  const hideToast = () => notify.dismiss();

  const reload = useCallback(async () => {
    if (!getSession()) {
      setProperties([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchAll(listAdminListings);
      setProperties(rows.map(fromRow));
      setLoadError("");
    } catch (e) {
      setLoadError(errorMessage(e, "Could not load listings."));
      notify.error(errorMessage(e, "Could not load listings."), { id: "admin-listings-error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const replace = (p: Property) => setProperties((prev) => prev.map((x) => (x.id === p.id ? p : x)));

  const refreshProperty = useCallback(async (id: string) => {
    try {
      const d = await getAdminListing(Number(id));
      setProperties((prev) => prev.map((x) => (x.id === id ? withDetail(x, d) : x)));
    } catch (e) {
      notify.error(errorMessage(e, "Could not load this listing."));
    }
  }, []);

  const stats = useMemo(() => {
    const total = properties.length;
    const active = properties.filter((p) => p.status === "Active").length;
    const pending = properties.filter((p) => p.status === "Pending").length;
    const rejected = properties.filter((p) => p.status === "Rejected").length;
    const draft = properties.filter((p) => p.status === "Draft").length;
    const totalValue = properties.reduce((acc, curr) => acc + curr.price, 0);
    return { total, active, pending, rejected, draft, totalValue };
  }, [properties]);

  const unsupported = (what: string) =>
    notify.error(`${what} is not available: the backend has no admin endpoint for it. Nothing was changed.`);

  const updateProperty = (id: string, updates: Partial<Property>) => {
    const current = properties.find((p) => p.id === id);
    if (!current) return;
    const nextStatus = updates.status;
    const otherKeys = Object.keys(updates).filter((k) => k !== "status" && k !== "rejectionReason" && k !== "rejectionCategory");
    // Empty / zero / unset count as the same value (the edit form fills unset numbers with 0).
    const norm = (v: unknown) => (v === undefined || v === null || v === "" || v === 0 ? null : JSON.stringify(v));
    const changedOther = otherKeys.some((k) => norm((updates as Record<string, unknown>)[k]) !== norm((current as unknown as Record<string, unknown>)[k]));
    if (changedOther) {
      unsupported("Editing listing details");
      return;
    }
    if (!nextStatus || nextStatus === current.status) return;
    if (busy.has(id)) return;

    if (current.status !== "Pending" || (nextStatus !== "Active" && nextStatus !== "Rejected")) {
      notify.error(
        current.status !== "Pending"
          ? "Only listings pending verification can be approved or rejected. Nothing was changed."
          : `Changing a listing to "${nextStatus}" is not available from the admin console.`,
      );
      return;
    }

    let reason = updates.rejectionReason?.trim() || "";
    if (nextStatus === "Rejected" && !reason) {
      reason = (window.prompt("Reason for rejecting this listing (shown to the owner):") || "").trim();
      if (!reason) {
        notify.info("Rejection cancelled: a reason is required.");
        return;
      }
    }

    setBusy((s) => new Set(s).add(id));
    const call = nextStatus === "Active" ? verifyAdminListing(Number(id)) : rejectAdminListing(Number(id), reason.slice(0, 500), updates.rejectionCategory);
    call
      .then((d) => {
        replace(withDetail(current, d));
        showToast(nextStatus === "Active" ? `Listing ${id} verified.` : `Listing ${id} rejected.`);
      })
      .catch((e) => notify.error(errorMessage(e, "The backend did not accept this change.")))
      .finally(() =>
        setBusy((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        }),
      );
  };

  const deleteProperty = () => unsupported("Deleting listings");
  const addProperty = () => {
    unsupported("Creating listings from the admin console");
    return "";
  };
  const toggleFeatured = () => unsupported("Featured status");
  const toggleVerified = () => unsupported("The verified badge (it follows verification status)");
  const updateChecklist = () => unsupported("The review checklist");
  const resetToDefault = () => void reload();

  return (
    <PropertyContext.Provider
      value={{
        properties,
        loading,
        loadError,
        stats,
        toast,
        showToast,
        hideToast,
        updateProperty,
        deleteProperty,
        addProperty,
        toggleFeatured,
        toggleVerified,
        updateChecklist,
        refreshProperty,
        reload,
        resetToDefault,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyStore() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("usePropertyStore must be used within a PropertyProvider");
  }
  return context;
}
