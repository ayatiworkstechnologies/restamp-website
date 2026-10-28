"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  X,
  Building2,
  CalendarDays,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PropertyHeader } from "@/components/properties/property-header";
import { PropertyFiltersBar } from "@/components/properties/property-filters";
import { PropertyTable } from "@/components/properties/property-table";
import { PropertyGrid } from "@/components/properties/property-grid";
import { PropertyDetailModal } from "@/components/properties/property-detail-modal";
import { PropertyApprovalModal } from "@/components/properties/property-approval-modal";
import { PropertyRejectModal } from "@/components/properties/property-reject-modal";
import { PropertyEditModal } from "@/components/properties/property-edit-modal";
import { PropertyAddModal } from "@/components/properties/property-add-modal";
import { usePropertyStore } from "@/context/property-context";
import { Property, PropertyFilters, PropertyStatus } from "@/types/property";

function PropertyManagementContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const initialId = searchParams.get("id");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const {
    properties,
    stats,
    approveProperty,
    rejectProperty,
    updateProperty,
    addProperty,
  } = usePropertyStore();

  // Filters state
  const [filters, setFilters] = useState<PropertyFilters>({
    search: "",
    status: initialTab === "approvals" ? "Pending" : "All",
    type: "All",
    bhk: "All",
    sortBy: "newest",
    verifiedOnly: false,
    featuredOnly: false,
  });

  // Handle URL params on initial load
  useEffect(() => {
    if (initialTab === "approvals") {
      setFilters((prev) => ({ ...prev, status: "Pending" }));
    }
    if (initialId) {
      const match = properties.find((p) => p.id === initialId);
      if (match) {
        setSelectedProperty(match);
        setIsDetailOpen(true);
      }
    }
  }, [initialTab, initialId, properties]);

  const handleFilterChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Filtered and sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Status filter
        if (filters.status !== "All" && p.status !== filters.status) return false;

        // Type filter
        if (filters.type !== "All" && p.type !== filters.type) return false;

        // BHK filter
        if (filters.bhk !== "All") {
          if (filters.bhk === "4+") {
            if (p.bhk < 4) return false;
          } else {
            if (p.bhk !== parseInt(filters.bhk)) return false;
          }
        }

        // Search query
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const matches =
            p.title.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            p.locality.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.owner.name.toLowerCase().includes(q) ||
            p.owner.phone.toLowerCase().includes(q) ||
            p.type.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price_asc") return a.price - b.price;
        if (filters.sortBy === "price_desc") return b.price - a.price;
        if (filters.sortBy === "title_asc") return a.title.localeCompare(b.title);
        // default: newest
        return b.id.localeCompare(a.id);
      });
  }, [properties, filters]);

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    return {
      all: properties.length,
      pending: properties.filter((p) => p.status === "Pending").length,
      active: properties.filter((p) => p.status === "Active").length,
      rejected: properties.filter((p) => p.status === "Rejected").length,
    };
  }, [properties]);

  // Modal open handlers
  const handleInspect = (prop: Property) => {
    setSelectedProperty(prop);
    setIsDetailOpen(true);
  };

  const handleOpenApprove = (prop: Property) => {
    setSelectedProperty(prop);
    setIsApprovalOpen(true);
  };

  const handleOpenReject = (prop: Property) => {
    setSelectedProperty(prop);
    setIsRejectOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setSelectedProperty(prop);
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0 lg:pl-[272px]">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-[77px] items-center justify-between border-b border-[#e9edf5] bg-white/95 px-4 backdrop-blur-md sm:px-7 xl:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              type="button"
              aria-label="Open navigation"
              className="rounded-xl border border-[#e8edf5] p-2 text-[#60708a] lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="text-[11px] font-semibold text-[#abb5c5]">
                Workspace <span className="px-2 text-[#c4cbd6]">/</span> Properties
              </div>
              <div className="mt-0.5 text-[15px] font-extrabold text-[#24324b] sm:text-[16px]">
                Property Listings & Approvals
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Quick search input in navbar */}
            <div className="hidden items-center gap-2 rounded-xl border border-[#e9edf5] bg-[#fafbfe] px-3.5 py-2.5 md:flex">
              <Search size={16} className="text-[#a5afc0]" />
              <input
                type="search"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-36 bg-transparent text-xs text-[#24324b] outline-none placeholder:text-[#a8b3c4] xl:w-52"
                placeholder="Search listings..."
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                aria-label="View notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-xl p-2 text-[#6c7b91] hover:bg-[#f3f6fd]"
              >
                <Bell size={20} />
                {stats.pending > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]" />
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-30 w-[min(340px,85vw)] rounded-2xl border border-[#e5ebf4] bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-[#22314b]">Pending Approvals</div>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2.5 border-t border-[#eef1f6] pt-3">
                    {stats.pendingApprovalProperties.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setNotificationsOpen(false);
                          handleInspect(item);
                        }}
                        className="cursor-pointer rounded-xl p-2 hover:bg-[#f8fafc] transition-colors"
                      >
                        <div className="text-xs font-bold text-[#1f2e48]">{item.title}</div>
                        <div className="text-[11px] text-[#7f8fa5]">
                          {item.locality} · {item.type} · Submitted by {item.owner.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-7 w-px bg-[#edf0f5]" />

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#dce7ff] text-xs font-extrabold text-[#3c65cc]">
                RA
              </span>
              <div className="hidden sm:block">
                <div className="text-xs font-extrabold text-[#293750]">RESTAMP Admin</div>
                <div className="mt-0.5 text-[10px] text-[#a3aebf]">Property Manager</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-[1650px] space-y-6 px-4 py-7 sm:px-7 xl:px-9 xl:py-9">
          {/* Header & KPI Summary */}
          <PropertyHeader
            onAddNew={() => setIsAddOpen(true)}
            onFilterPending={() => handleFilterChange({ status: "Pending" })}
            filteredCount={filteredProperties.length}
            totalCount={properties.length}
            currentFilterStatus={filters.status}
          />

          {/* Filter Controls Bar */}
          <PropertyFiltersBar
            filters={filters}
            onFilterChange={handleFilterChange}
            statusCounts={statusCounts}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Results Summary & Table / Grid View */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#8090a6]">
              <span>
                Showing <span className="font-bold text-[#23334d]">{filteredProperties.length}</span>{" "}
                of <span className="font-bold text-[#23334d]">{properties.length}</span> listings
                {filters.status !== "All" && ` (${filters.status} status)`}
              </span>
              {filters.status === "Pending" && (
                <span className="font-bold text-[#d97706] flex items-center gap-1">
                  ⚡ Approval Queue View
                </span>
              )}
            </div>

            {viewMode === "table" ? (
              <PropertyTable
                properties={filteredProperties}
                onInspect={handleInspect}
                onApprove={handleOpenApprove}
                onReject={handleOpenReject}
                onEdit={handleOpenEdit}
              />
            ) : (
              <PropertyGrid
                properties={filteredProperties}
                onInspect={handleInspect}
                onApprove={handleOpenApprove}
                onReject={handleOpenReject}
                onEdit={handleOpenEdit}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onApprove={(prop) => {
          setIsDetailOpen(false);
          handleOpenApprove(prop);
        }}
        onReject={(prop) => {
          setIsDetailOpen(false);
          handleOpenReject(prop);
        }}
        onEdit={(prop) => {
          setIsDetailOpen(false);
          handleOpenEdit(prop);
        }}
      />

      <PropertyApprovalModal
        property={selectedProperty}
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        onConfirm={(id, notes, makeFeatured, makeVerified) => {
          approveProperty(id, notes, makeFeatured, makeVerified);
        }}
      />

      <PropertyRejectModal
        property={selectedProperty}
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={(id, reason, category) => {
          rejectProperty(id, reason, category);
        }}
      />

      <PropertyEditModal
        property={selectedProperty}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={(id, updates) => {
          updateProperty(id, updates);
        }}
      />

      <PropertyAddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={(newProp) => {
          addProperty(newProp);
        }}
      />
    </div>
  );
}

export default function PropertyManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Property Management...</div>}>
      <PropertyManagementContent />
    </Suspense>
  );
}
