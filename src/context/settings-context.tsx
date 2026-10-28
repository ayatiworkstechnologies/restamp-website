"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AdminUser,
  RoleDefinition,
  PlatformSettings,
  SecurityAuditLog,
  AdminRoleType,
} from "@/types/settings";
import {
  initialAdminUsers,
  initialRoles,
  initialPlatformSettings,
  initialAuditLogs,
} from "@/lib/settings-data";
import { usePropertyStore } from "@/context/property-context";

interface SettingsContextType {
  adminUsers: AdminUser[];
  roles: RoleDefinition[];
  platformSettings: PlatformSettings;
  auditLogs: SecurityAuditLog[];
  addAdminUser: (
    user: Omit<AdminUser, "id" | "createdAt" | "lastActive">
  ) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  updateRolePermissions: (
    roleId: string,
    permissions: RoleDefinition["permissions"]
  ) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  resetToDefaultSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = "restamp_admin_settings_v1";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [roles, setRoles] = useState<RoleDefinition[]>(initialRoles);
  const [platformSettings, setPlatformSettings] =
    useState<PlatformSettings>(initialPlatformSettings);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(initialAuditLogs);
  const [isHydrated, setIsHydrated] = useState(false);

  const { showToast } = usePropertyStore();

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.adminUsers) setAdminUsers(parsed.adminUsers);
        if (parsed.roles) setRoles(parsed.roles);
        if (parsed.platformSettings) setPlatformSettings(parsed.platformSettings);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
    } catch {
      // fallback to initial
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          adminUsers,
          roles,
          platformSettings,
          auditLogs,
        })
      );
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  }, [adminUsers, roles, platformSettings, auditLogs, isHydrated]);

  const addAdminUser = (
    user: Omit<AdminUser, "id" | "createdAt" | "lastActive">
  ) => {
    const nextNum = adminUsers.length + 101;
    const id = `ADM-${nextNum}`;
    const now = new Date().toISOString();

    const created: AdminUser = {
      ...user,
      id,
      createdAt: now,
      lastActive: "Invited (Pending login)",
    };

    setAdminUsers((prev) => [created, ...prev]);

    // Log action to audit logs
    const newLog: SecurityAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actor: "Ramesh Sundaram",
      actorEmail: "ramesh.sundaram@restamp.in",
      role: "Super Admin",
      action: "Invited Admin Staff",
      category: "Access",
      ipAddress: "103.28.246.12",
      timestamp: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Success",
      details: `Invited ${user.name} (${user.email}) with role ${user.role}.`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Staff member ${user.name} added.`, "success");
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
    showToast(`Staff member updated.`, "success");
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    showToast(`Staff member removed.`, "info");
  };

  const updateRolePermissions = (
    roleId: string,
    permissions: RoleDefinition["permissions"]
  ) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    );
    showToast(`Role permissions updated.`, "success");
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => ({ ...prev, ...settings }));

    const newLog: SecurityAuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actor: "Ramesh Sundaram",
      actorEmail: "ramesh.sundaram@restamp.in",
      role: "Super Admin",
      action: "Saved Platform Settings",
      category: "Setting",
      ipAddress: "103.28.246.12",
      timestamp: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Success",
      details: `Updated platform marketplace configuration & security policies.`,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Platform settings saved successfully.`, "success");
  };

  const resetToDefaultSettings = () => {
    setAdminUsers(initialAdminUsers);
    setRoles(initialRoles);
    setPlatformSettings(initialPlatformSettings);
    setAuditLogs(initialAuditLogs);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    showToast("Settings reset to defaults.", "info");
  };

  return (
    <SettingsContext.Provider
      value={{
        adminUsers,
        roles,
        platformSettings,
        auditLogs,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        updateRolePermissions,
        updatePlatformSettings,
        resetToDefaultSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsStore() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsStore must be used within a SettingsProvider");
  }
  return context;
}
