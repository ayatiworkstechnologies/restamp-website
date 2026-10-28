"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  Settings,
  Users,
  ShieldCheck,
  Sliders,
  FileText,
  Lock,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AdminUsersTable } from "@/components/settings/admin-users-table";
import { RolesPermissionsView } from "@/components/settings/roles-permissions-view";
import { PlatformConfigView } from "@/components/settings/platform-config-view";
import { SecurityAuditView } from "@/components/settings/security-audit-view";
import { AdminUserModal } from "@/components/settings/admin-user-modal";
import { useSettingsStore } from "@/context/settings-context";
import { AdminUser } from "@/types/settings";

type SettingsTab = "staff" | "roles" | "config" | "audit";

function SettingsManagementContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SettingsTab) || "staff";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // Modals state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const { adminUsers, roles, auditLogs, addAdminUser, updateAdminUser } =
    useSettingsStore();

  useEffect(() => {
    if (searchParams.get("tab")) {
      setActiveTab(searchParams.get("tab") as SettingsTab);
    }
  }, [searchParams]);

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setIsInviteOpen(true);
  };

  const handleSaveUser = (
    userData: Omit<AdminUser, "id" | "createdAt" | "lastActive">
  ) => {
    if (editingUser) {
      updateAdminUser(editingUser.id, userData);
    } else {
      addAdminUser(userData);
    }
    setEditingUser(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar Navigation */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e8ecf4] bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-[#475467] hover:bg-[#f1f4f9] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f4ff] text-[#162d66]">
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-[#101828]">
                Settings & Admin Access
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#ede9fe] px-2 py-0.5 text-[11px] font-medium text-[#7c3aed]">
                <ShieldCheck className="h-3 w-3" />
                RBAC & Security
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin Profile */}
            <div className="flex items-center gap-2 border-l border-[#e8ecf4] pl-3">
              <div className="h-8 w-8 rounded-full bg-[#162d66] text-white flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#101828]">
                  Ramesh Sundaram
                </p>
                <p className="text-[10px] text-[#64748b]">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Title & Summary */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#101828] sm:text-3xl">
                Settings & Access Control
              </h1>
              <p className="mt-1 text-sm text-[#475467]">
                Configure administrative roles, granular RBAC permissions, marketplace compliance, and platform security.
              </p>
            </div>

            {activeTab === "staff" && (
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setIsInviteOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#162d66] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0f1f47] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Invite Team Member</span>
              </button>
            )}
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-[#e8ecf4] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b]">
                  Admin Staff
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0f4ff] text-[#162d66]">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#101828]">
                {adminUsers.length}
              </div>
              <p className="mt-0.5 text-[11px] text-[#059669]">
                {adminUsers.filter((u) => u.status === "Active").length} active
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8ecf4] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b]">
                  Defined Roles
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ede9fe] text-[#7c3aed]">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#101828]">
                {roles.length}
              </div>
              <p className="mt-0.5 text-[11px] text-[#64748b]">
                Customizable RBAC
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8ecf4] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b]">
                  2FA Compliance
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#059669]">
                  <Lock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#059669]">
                100%
              </div>
              <p className="mt-0.5 text-[11px] text-[#64748b]">
                Mandatory for staff
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8ecf4] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b]">
                  Security Logs
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff4e6] text-[#ea580c]">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-[#101828]">
                {auditLogs.length}
              </div>
              <p className="mt-0.5 text-[11px] text-[#64748b]">
                Audit events logged
              </p>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1.5 border-b border-[#e8ecf4] bg-white p-1 rounded-2xl shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "staff"
                  ? "bg-[#162d66] text-white shadow-sm"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#101828]"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Admin Staff & Team</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                {adminUsers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("roles")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "roles"
                  ? "bg-[#162d66] text-white shadow-sm"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#101828]"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Roles & Permissions (RBAC)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("config")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "config"
                  ? "bg-[#162d66] text-white shadow-sm"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#101828]"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Platform Configuration</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === "audit"
                  ? "bg-[#162d66] text-white shadow-sm"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#101828]"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Security Audit Trail</span>
            </button>
          </div>

          {/* Tab Content Panels */}
          {activeTab === "staff" && (
            <AdminUsersTable
              onOpenInvite={() => {
                setEditingUser(null);
                setIsInviteOpen(true);
              }}
              onEditUser={handleEditUser}
            />
          )}

          {activeTab === "roles" && <RolesPermissionsView />}

          {activeTab === "config" && <PlatformConfigView />}

          {activeTab === "audit" && <SecurityAuditView />}
        </main>
      </div>

      {/* Invite / Edit User Modal */}
      <AdminUserModal
        isOpen={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        initialUser={editingUser}
      />
    </div>
  );
}

export default function SettingsManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#f8fafc] text-sm text-[#64748b]">
          Loading Settings & Admin Access...
        </div>
      }
    >
      <SettingsManagementContent />
    </Suspense>
  );
}
