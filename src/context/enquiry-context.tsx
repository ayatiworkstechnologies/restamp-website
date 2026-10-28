"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Enquiry, EnquiryStatus } from "@/types/enquiry";
import { initialEnquiries } from "@/lib/enquiries-data";
import { usePropertyStore } from "@/context/property-context";

interface EnquiryContextType {
  enquiries: Enquiry[];
  stats: {
    total: number;
    active: number;
    addressed: number;
    archived: number;
    activeItems: Enquiry[];
  };
  updateEnquiryStatus: (id: string, newStatus: EnquiryStatus) => void;
  updateAdminNotes: (id: string, notes: string) => void;
  addEnquiry: (
    newEnquiry: Omit<Enquiry, "id" | "createdAt" | "updatedAt">
  ) => string;
  deleteEnquiry: (id: string) => void;
  batchUpdateStatus: (ids: string[], status: EnquiryStatus) => void;
  resetToDefaultEnquiries: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

const ENQUIRY_STORAGE_KEY = "restamp_admin_enquiries_v2";

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showToast } = usePropertyStore();

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ENQUIRY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEnquiries(parsed);
        }
      }
    } catch {
      // fallback
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(ENQUIRY_STORAGE_KEY, JSON.stringify(enquiries));
    } catch (e) {
      console.error("Failed to save enquiries to localStorage", e);
    }
  }, [enquiries, isHydrated]);

  const stats = useMemo(() => {
    const total = enquiries.length;
    const active = enquiries.filter((e) => e.status === "Active").length;
    const addressed = enquiries.filter((e) => e.status === "Addressed").length;
    const archived = enquiries.filter((e) => e.status === "Archived").length;
    const activeItems = enquiries.filter((e) => e.status === "Active");

    return {
      total,
      active,
      addressed,
      archived,
      activeItems,
    };
  }, [enquiries]);

  const updateEnquiryStatus = (id: string, newStatus: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return e;
      })
    );

    showToast(
      `Enquiry ${id} status changed to "${newStatus}".`,
      "success"
    );
  };

  const updateAdminNotes = (id: string, notes: string) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          return {
            ...e,
            adminNotes: notes,
            updatedAt: new Date().toISOString(),
          };
        }
        return e;
      })
    );

    showToast(`Remarks saved for enquiry ${id}.`, "success");
  };

  const addEnquiry = (
    newEnquiry: Omit<Enquiry, "id" | "createdAt" | "updatedAt">
  ): string => {
    const nextNum = enquiries.length + 1001;
    const id = `ENQ-${nextNum}`;
    const now = new Date().toISOString();

    const created: Enquiry = {
      ...newEnquiry,
      id,
      createdAt: now,
      updatedAt: now,
    };

    setEnquiries((prev) => [created, ...prev]);

    showToast(
      `Created enquiry ${id} for buyer ${created.buyer.name}.`,
      "success"
    );

    return id;
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    showToast(`Enquiry ${id} removed from log.`, "info");
  };

  const batchUpdateStatus = (ids: string[], status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => {
        if (ids.includes(e.id)) {
          return {
            ...e,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return e;
      })
    );

    showToast(
      `${ids.length} inquiries marked as "${status}".`,
      "success"
    );
  };

  const resetToDefaultEnquiries = () => {
    setEnquiries(initialEnquiries);
    localStorage.removeItem(ENQUIRY_STORAGE_KEY);
    showToast("Enquiries restored to default seed.", "info");
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        stats,
        updateEnquiryStatus,
        updateAdminNotes,
        addEnquiry,
        deleteEnquiry,
        batchUpdateStatus,
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
