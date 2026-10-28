"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Property, PropertyStatus, AdminChecklist } from "@/types/property";
import { initialProperties } from "@/lib/properties-data";

interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface PropertyContextType {
  properties: Property[];
  stats: {
    total: number;
    active: number;
    pending: number;
    rejected: number;
    draft: number;
    totalValue: number;
    pendingApprovalProperties: Property[];
  };
  toast: ToastMessage | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
  approveProperty: (
    id: string,
    notes?: string,
    makeFeatured?: boolean,
    makeVerified?: boolean
  ) => void;
  rejectProperty: (id: string, reason: string, category?: string) => void;
  batchApprove: (ids: string[]) => void;
  batchReject: (ids: string[], reason: string, category?: string) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addProperty: (newProp: Omit<Property, "id" | "submittedAt" | "updatedAt" | "auditLog">) => string;
  toggleFeatured: (id: string) => void;
  toggleVerified: (id: string) => void;
  updateChecklist: (id: string, key: keyof AdminChecklist, value: boolean) => void;
  resetToDefault: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const STORAGE_KEY = "restamp_admin_properties_v1";

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [isHydrated, setIsHydrated] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProperties(parsed);
        }
      }
    } catch {
      // fallback to initial
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when properties change (only after initial hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (e) {
      console.error("Failed to save properties to localStorage", e);
    }
  }, [properties, isHydrated]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const hideToast = () => setToast(null);

  const stats = useMemo(() => {
    const total = properties.length;
    const active = properties.filter((p) => p.status === "Active").length;
    const pending = properties.filter((p) => p.status === "Pending").length;
    const rejected = properties.filter((p) => p.status === "Rejected").length;
    const draft = properties.filter((p) => p.status === "Draft").length;
    const totalValue = properties.reduce((acc, curr) => acc + curr.price, 0);
    const pendingApprovalProperties = properties.filter((p) => p.status === "Pending");
    return { total, active, pending, rejected, draft, totalValue, pendingApprovalProperties };
  }, [properties]);

  const approveProperty = (
    id: string,
    notes?: string,
    makeFeatured?: boolean,
    makeVerified: boolean = true
  ) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const timestamp = `${formattedDate}, ${formattedTime}`;

    setProperties((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedChecklist = {
          ...item.adminChecklist,
          legalDocumentsVerified: true,
          pricingValidated: true,
          ownerIdentityConfirmed: true,
        };

        const updatedAuditLog = [
          {
            id: `LOG-${Date.now().toString().slice(-4)}`,
            action: "Listing Approved",
            actor: "Admin (Current Session)",
            role: "Administrator",
            timestamp,
            notes: notes || "Property approved and published to RESTAMP marketplace.",
          },
          ...(item.auditLog || []),
        ];

        return {
          ...item,
          status: "Active" as PropertyStatus,
          reviewedAt: timestamp,
          reviewedBy: "RESTAMP Admin",
          approvalNotes: notes || "Approved for marketplace listing.",
          rejectionReason: undefined,
          rejectionCategory: undefined,
          featured: makeFeatured !== undefined ? makeFeatured : item.featured,
          verifiedBadge: makeVerified,
          adminChecklist: updatedChecklist,
          auditLog: updatedAuditLog,
          updatedAt: timestamp,
        };
      })
    );

    showToast(`Property ${id} approved successfully! Listing is now Active.`);
  };

  const rejectProperty = (
    id: string,
    reason: string,
    category: string = "Compliance & Verification"
  ) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const timestamp = `${formattedDate}, ${formattedTime}`;

    setProperties((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedAuditLog = [
          {
            id: `LOG-${Date.now().toString().slice(-4)}`,
            action: "Listing Rejected",
            actor: "Admin (Current Session)",
            role: "Administrator",
            timestamp,
            notes: `Rejected with reason: ${reason} (${category})`,
          },
          ...(item.auditLog || []),
        ];

        return {
          ...item,
          status: "Rejected" as PropertyStatus,
          reviewedAt: timestamp,
          reviewedBy: "RESTAMP Admin",
          rejectionReason: reason,
          rejectionCategory: category,
          approvalNotes: undefined,
          auditLog: updatedAuditLog,
          updatedAt: timestamp,
        };
      })
    );

    showToast(`Property ${id} was rejected. Owner notification generated.`, "error");
  };

  const batchApprove = (ids: string[]) => {
    if (ids.length === 0) return;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timestamp = `${formattedDate}, Batch Action`;

    setProperties((prev) =>
      prev.map((item) => {
        if (!ids.includes(item.id)) return item;
        return {
          ...item,
          status: "Active" as PropertyStatus,
          reviewedAt: timestamp,
          reviewedBy: "RESTAMP Admin",
          approvalNotes: "Batch approved by administrator.",
          verifiedBadge: true,
          auditLog: [
            {
              id: `LOG-${Date.now().toString().slice(-4)}`,
              action: "Batch Approval",
              actor: "Admin",
              role: "Administrator",
              timestamp,
              notes: "Approved via bulk action toolbar.",
            },
            ...(item.auditLog || []),
          ],
          updatedAt: timestamp,
        };
      })
    );

    showToast(`${ids.length} properties approved in batch!`, "success");
  };

  const batchReject = (ids: string[], reason: string, category: string = "Administrative") => {
    if (ids.length === 0) return;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timestamp = `${formattedDate}, Batch Action`;

    setProperties((prev) =>
      prev.map((item) => {
        if (!ids.includes(item.id)) return item;
        return {
          ...item,
          status: "Rejected" as PropertyStatus,
          reviewedAt: timestamp,
          reviewedBy: "RESTAMP Admin",
          rejectionReason: reason,
          rejectionCategory: category,
          auditLog: [
            {
              id: `LOG-${Date.now().toString().slice(-4)}`,
              action: "Batch Rejection",
              actor: "Admin",
              role: "Administrator",
              timestamp,
              notes: `Batch rejected: ${reason}`,
            },
            ...(item.auditLog || []),
          ],
          updatedAt: timestamp,
        };
      })
    );

    showToast(`${ids.length} properties marked as Rejected.`, "error");
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    const now = new Date();
    const timestamp = `${now.toLocaleDateString("en-GB")}, ${now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    setProperties((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          ...updates,
          updatedAt: timestamp,
          auditLog: [
            {
              id: `LOG-${Date.now().toString().slice(-4)}`,
              action: "Listing Updated",
              actor: "Admin",
              role: "Administrator",
              timestamp,
              notes: "Property details modified by admin.",
            },
            ...(item.auditLog || []),
          ],
        };
      })
    );

    showToast(`Property ${id} updated successfully.`);
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showToast(`Property ${id} was deleted from database.`, "info");
  };

  const addProperty = (newProp: Omit<Property, "id" | "submittedAt" | "updatedAt" | "auditLog">) => {
    const randomNum = Math.floor(1030 + Math.random() * 900);
    const newId = `RST-${randomNum}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const timestamp = `${formattedDate}, ${formattedTime}`;

    const createdProperty: Property = {
      ...newProp,
      id: newId,
      submittedAt: timestamp,
      updatedAt: timestamp,
      initials: newProp.title.slice(0, 2).toUpperCase(),
      tint: "#EBF3FE",
      auditLog: [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          action: "Listing Created",
          actor: "Admin",
          role: "Administrator",
          timestamp,
          notes: "Property created directly from admin console.",
        },
      ],
    };

    setProperties((prev) => [createdProperty, ...prev]);
    showToast(`Property ${newId} created successfully!`, "success");
    return newId;
  };

  const toggleFeatured = (id: string) => {
    setProperties((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextState = !item.featured;
        return { ...item, featured: nextState };
      })
    );
    showToast("Featured status updated.");
  };

  const toggleVerified = (id: string) => {
    setProperties((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextState = !item.verifiedBadge;
        return { ...item, verifiedBadge: nextState };
      })
    );
    showToast("Verified badge updated.");
  };

  const updateChecklist = (id: string, key: keyof AdminChecklist, value: boolean) => {
    setProperties((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          adminChecklist: {
            ...item.adminChecklist,
            [key]: value,
          },
        };
      })
    );
  };

  const resetToDefault = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setProperties(initialProperties);
    showToast("Reset demo data to initial state.", "info");
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        stats,
        toast,
        showToast,
        hideToast,
        approveProperty,
        rejectProperty,
        batchApprove,
        batchReject,
        updateProperty,
        deleteProperty,
        addProperty,
        toggleFeatured,
        toggleVerified,
        updateChecklist,
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
