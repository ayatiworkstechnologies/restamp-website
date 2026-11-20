"use client";

import { toast as notify } from "@/lib/notify";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AdminUser, RoleDefinition, RolePermissions, PlatformSettings, SecurityAuditLog, AdminRoleType } from "@/types/settings";
import { initialPlatformSettings } from "@/lib/settings-data";
import { apiDelete, apiGet, apiPatch, errorMessage, isApiError } from "@/lib/api/client";
import { getSession } from "@/lib/api/session";
import { fetchAll, listAdminAuditLogs } from "@/lib/api/admin";

/**
 * Admin settings backed by the real backend:
 *   GET    /admin/staff                    [settings.manage_team]   admin team
 *   PATCH  /admin/staff/{user_id}          [settings.manage_team]   change admin role
 *   DELETE /admin/staff/{user_id}          [settings.manage_team]   revoke admin access
 *   GET    /admin/roles                    [admin]                  the role -> permission matrix (fixed in code)
 *   GET    /admin/audit-logs               [settings.view_audit_logs]
 * The backend protects against self-lockout and removing the last Super Admin; its
 * message is shown. Adding an admin needs an existing account's user id, which the
 * existing form does not collect, so it is refused (see the admin provisioning notes).
 * Role permissions and platform settings have no backend storage: editing them is
 * refused, and platform settings show the site defaults.
 */

interface SettingsContextType {
  adminUsers: AdminUser[];
  roles: RoleDefinition[];
  platformSettings: PlatformSettings;
  auditLogs: SecurityAuditLog[];
  addAdminUser: (user: Omit<AdminUser, "id" | "createdAt" | "lastActive">) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  updateRolePermissions: (roleId: string, permissions: RoleDefinition["permissions"]) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  resetToDefaultSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

type StaffRow = { user_id: number; display_name: string | null; admin_role: string; role_label: string; status: string };
type RoleOut = { code: string; label: string; assignable: boolean; permissions: string[] };

const fmt = (iso: string | null | undefined) =>
  iso
    ? new Date(iso.endsWith("Z") || iso.includes("+") ? iso : `${iso}Z`).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "";

function toPermissions(perms: string[]): RolePermissions {
  const has = (p: string) => perms.includes(p);
  return {
    properties: { view: has("properties.view"), approve: has("properties.approve"), reject: has("properties.reject"), edit: has("properties.edit"), delete: has("properties.delete") },
    users: { view: has("users.view"), suspend: has("users.suspend"), export: has("users.export") },
    enquiries: { view: has("enquiries.view"), update_status: has("enquiries.update_status"), delete: has("enquiries.delete"), export: has("enquiries.export") },
    reports: { view: has("reports.view"), export: has("reports.export") },
    settings: { manage_team: has("settings.manage_team"), configure_platform: has("settings.configure_platform"), view_audit_logs: has("settings.view_audit_logs") },
  };
}

function category(action: string): SecurityAuditLog["category"] {
  if (/listing/i.test(action)) return "Listing";
  if (/user|suspend|reactivat/i.test(action)) return "User";
  if (/staff|admin|grant|role/i.test(action)) return "Access";
  if (/login|auth/i.test(action)) return "Auth";
  return "Setting";
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [roleCodes, setRoleCodes] = useState<Record<string, string>>({});
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>([]);
  const platformSettings = initialPlatformSettings;

  const load = useCallback(async () => {
    if (!getSession()) return;
    // Each part is loaded independently: an admin role without a permission simply sees that part empty.
    apiGet<{ items: RoleOut[] }>("/admin/roles")
      .then((r) => {
        setRoleCodes(Object.fromEntries(r.items.map((x) => [x.label, x.code])));
        setRoles(
          r.items
            .filter((x) => x.assignable || x.code === "SUPER_ADMIN")
            .map((x) => ({ id: x.code, name: x.label as AdminRoleType, description: x.assignable ? "" : "Not assignable", permissions: toPermissions(x.permissions) })),
        );
      })
      .catch(() => setRoles([]));
    apiGet<{ items: StaffRow[] }>("/admin/staff")
      .then((r) =>
        setAdminUsers(
          r.items.map((s) => ({
            id: String(s.user_id),
            name: s.display_name || `User #${s.user_id}`,
            email: "",
            phone: "",
            role: s.role_label as AdminRoleType,
            status: s.status === "active" ? "Active" : "Suspended",
            twoFactorEnabled: false,
            department: s.role_label,
            lastActive: "",
            createdAt: "",
          })),
        ),
      )
      .catch((e) => {
        setAdminUsers([]);
        if (!isApiError(e, "denied")) notify.error(errorMessage(e, "Could not load the admin team."), { id: "admin-staff-error" });
      });
    fetchAll(listAdminAuditLogs, {}, 2)
      .then((rows) =>
        setAuditLogs(
          rows.map((a) => ({
            id: String(a.id),
            actor: a.actor_name || `User #${a.actor_user_id}`,
            actorEmail: "",
            role: "Admin",
            action: a.action,
            category: category(a.action),
            ipAddress: "",
            timestamp: fmt(a.created_at),
            status: "Success",
            details: [a.entity, a.after ? JSON.stringify(a.after) : ""].filter(Boolean).join(" · "),
          })),
        ),
      )
      .catch((e) => {
        setAuditLogs([]);
        if (!isApiError(e, "denied")) notify.error(errorMessage(e, "Could not load the audit log."), { id: "admin-audit-error" });
      });
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const unsupported = (what: string) =>
    notify.error(`${what} is not available: the backend has no admin endpoint for it. Nothing was changed.`);

  const addAdminUser = () =>
    notify.error("Adding an admin needs the person's existing Restamp account id, which this form does not collect. Nothing was changed.");

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    const keys = Object.keys(updates).filter((k) => (updates as Record<string, unknown>)[k] !== (adminUsers.find((u) => u.id === id) as unknown as Record<string, unknown> | undefined)?.[k]);
    if (keys.length === 1 && keys[0] === "role" && updates.role) {
      const code = roleCodes[updates.role];
      if (!code) return unsupported("That admin role");
      apiPatch<StaffRow>(`/admin/staff/${id}`, { admin_role: code })
        .then((s) => {
          setAdminUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: s.role_label as AdminRoleType, department: s.role_label } : u)));
          notify.success("Admin role updated.");
          void load();
        })
        .catch((e) => notify.error(errorMessage(e, "The backend did not accept this change.")));
      return;
    }
    if (keys.length === 0) return;
    unsupported("Editing admin profile details or status");
  };

  const deleteAdminUser = (id: string) => {
    apiDelete(`/admin/staff/${id}`)
      .then(() => {
        setAdminUsers((prev) => prev.filter((u) => u.id !== id));
        notify.success("Admin access revoked.");
        void load();
      })
      .catch((e) => notify.error(errorMessage(e, "The backend did not accept this change.")));
  };

  const updateRolePermissions = () => unsupported("Editing role permissions (they are fixed in the backend)");
  const updatePlatformSettings = () => unsupported("Saving platform settings");
  const resetToDefaultSettings = () => void load();

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
