"use client";

import { toast as notify } from "@/lib/notify";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Enquiry, EnquiryStatus } from "@/types/enquiry";
import { errorMessage } from "@/lib/api/client";
import { getSession } from "@/lib/api/session";
import { fetchAll, getAdminEnquiry, listAdminEnquiries, type AdminEnquiryRow } from "@/lib/api/admin";

/**
 * Admin enquiry store, READ-ONLY on the real backend:
 *   GET /admin/enquiries, GET /admin/enquiries/{id}   [enquiries.view]
 * The backend gives admins no write access to buyer-owner conversations, so
 * status changes, notes, creation and deletion are refused with a message.
 * Buyer and owner phone numbers are not part of the admin enquiry response.
 * Status mapping: NEW -> Active, CONTACTED -> Addressed, CLOSED -> Archived.
 */

interface EnquiryContextType {
  enquiries: Enquiry[];
  loading: boolean;
  loadError: string;
  stats: {
    total: number;
    active: number;
    addressed: number;
    archived: number;
    activeItems: Enquiry[];
  };
  updateEnquiryStatus: (id: string, newStatus: EnquiryStatus) => void;
  updateAdminNotes: (id: string, notes: string) => void;
  addEnquiry: (newEnquiry: Omit<Enquiry, "id" | "createdAt" | "updatedAt">) => string;
  deleteEnquiry: (id: string) => void;
  batchUpdateStatus: (ids: string[], status: EnquiryStatus) => void;
  /** Full message thread for one enquiry (GET /admin/enquiries/{id}). */
  refreshEnquiry: (id: string) => Promise<void>;
  reload: () => Promise<void>;
  resetToDefaultEnquiries: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

const STATUS: Record<string, EnquiryStatus> = { NEW: "Active", CONTACTED: "Addressed", CLOSED: "Archived" };

const fmt = (iso: string | null | undefined) =>
  iso
    ? new Date(iso.endsWith("Z") || iso.includes("+") ? iso : `${iso}Z`).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "";

function fromRow(r: AdminEnquiryRow): Enquiry {
  return {
    id: String(r.id),
    buyer: { name: r.buyer_name || `User #${r.buyer_user_id}`, phone: "", email: "", city: "" },
    property: {
      id: String(r.property_listing_id),
      title: r.listing_title || `Listing #${r.property_listing_id}`,
      location: "",
      type: "",
      price: 0,
      ownerName: r.owner_name || `User #${r.owner_user_id}`,
      ownerPhone: "",
    },
    type: "General Enquiry",
    status: STATUS[r.status] || "Active",
    channel: "Web Portal",
    message: r.last_message || "",
    adminNotes: r.closing_reason ? `Closed: ${r.closing_reason}` : undefined,
    createdAt: fmt(r.created_at),
    updatedAt: fmt(r.last_message_at || r.created_at),
  };
}

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const reload = useCallback(async () => {
    if (!getSession()) {
      setEnquiries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setEnquiries((await fetchAll(listAdminEnquiries)).map(fromRow));
      setLoadError("");
    } catch (e) {
      setLoadError(errorMessage(e, "Could not load enquiries."));
      notify.error(errorMessage(e, "Could not load enquiries."), { id: "admin-enquiries-error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const refreshEnquiry = useCallback(async (id: string) => {
    try {
      const d = await getAdminEnquiry(Number(id));
      const thread = d.messages
        .map((m) => [fmt(m.created_at ?? null), m.sender, m.body].filter(Boolean).join(" · "))
        .join("\n");
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...fromRow(d), message: thread || e.message } : e)));
    } catch (e) {
      notify.error(errorMessage(e, "Could not load this enquiry."));
    }
  }, []);

  const stats = useMemo(() => {
    const total = enquiries.length;
    const activeItems = enquiries.filter((e) => e.status === "Active");
    const addressed = enquiries.filter((e) => e.status === "Addressed").length;
    const archived = enquiries.filter((e) => e.status === "Archived").length;
    return { total, active: activeItems.length, addressed, archived, activeItems };
  }, [enquiries]);

  const readOnly = () =>
    notify.error("Enquiries are read-only for admins: buyer-owner conversations can't be changed here. Nothing was changed.");

  const updateEnquiryStatus = () => readOnly();
  const updateAdminNotes = () => readOnly();
  const addEnquiry = () => {
    readOnly();
    return "";
  };
  const deleteEnquiry = () => readOnly();
  const batchUpdateStatus = () => readOnly();
  const resetToDefaultEnquiries = () => void reload();

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        loading,
        loadError,
        stats,
        updateEnquiryStatus,
        updateAdminNotes,
        addEnquiry,
        deleteEnquiry,
        batchUpdateStatus,
        refreshEnquiry,
        reload,
        resetToDefaultEnquiries,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiryStore() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("useEnquiryStore must be used within an EnquiryProvider");
  }
  return context;
}
