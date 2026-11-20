"use client";

import { toast as notify } from "@/lib/notify";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { User, UserRole, UserStatus } from "@/types/user";
import { errorMessage } from "@/lib/api/client";
import { getSession } from "@/lib/api/session";
import {
  fetchAll,
  getAdminUser,
  listAdminUsers,
  reactivateAdminUser,
  suspendAdminUser,
  type AdminUserDetail,
  type AdminUserRow,
} from "@/lib/api/admin";

/**
 * Admin user store backed by the real backend:
 *   GET  /admin/users, GET /admin/users/{id}            [users.view]
 *   POST /admin/users/{id}/suspend (reason required)    [users.suspend]
 *   POST /admin/users/{id}/reactivate                   [users.suspend]
 * The backend refuses suspending yourself or another admin's protected
 * account; its message is shown. There is no admin endpoint to create, edit,
 * delete users, change their role or keep admin notes, so those actions are
 * refused with a message. Changes appear only after the backend confirms.
 */

interface UserContextType {
  users: User[];
  loading: boolean;
  loadError: string;
  stats: {
    total: number;
    buyers: number;
    owners: number;
    agents: number;
    suspended: number;
    active: number;
  };
  suspendUser: (userId: string, reason: string) => void;
  activateUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (
    newUser: Omit<User, "id" | "joinedDate" | "lastActive" | "auditLog" | "adminNotes" | "initials" | "tint">
  ) => string;
  deleteUser: (userId: string) => void;
  addAdminNote: (userId: string, content: string, adminName?: string) => void;
  batchSuspend: (userIds: string[], reason: string) => void;
  /** Phone, providers and activity counts for one user (GET /admin/users/{id}). */
  refreshUser: (userId: string) => Promise<void>;
  reload: () => Promise<void>;
  resetToDefaultUsers: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const tints = ["#E6EBFF", "#E7F3EC", "#FDF0DB", "#EDE9FE", "#FCE7F3", "#DCFCE7", "#FEF3C7"];

const ROLE: Record<string, UserRole> = { BUYER: "buyer", OWNER: "owner", BROKER: "agent" };
const STATUS: Record<string, UserStatus> = { active: "Active", suspended: "Suspended", closed: "Inactive" };

const fmtDate = (iso: string | null | undefined) =>
  iso ? new Date(iso.endsWith("Z") || iso.includes("+") ? iso : `${iso}Z`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

function fromRow(r: AdminUserRow): User {
  const name = r.display_name || `User #${r.user_id}`;
  return {
    id: String(r.user_id),
    name,
    email: "",
    phone: "",
    initials: name.replace(/[^A-Za-z0-9 ]/g, "").slice(0, 2).toUpperCase() || "U",
    tint: tints[r.user_id % tints.length],
    // Users without a current role yet are listed as buyers (the default mode).
    role: ROLE[r.current_role || ""] || "buyer",
    status: STATUS[r.status] || "Inactive",
    city: "",
    state: "",
    joinedDate: fmtDate(r.joined_at),
    lastActive: "",
    emailVerified: false,
    phoneVerified: true, // every account signs in with a verified phone OTP or a provider
    adminNotes: [],
    auditLog: [],
  };
}

function withDetail(base: User, d: AdminUserDetail): User {
  return {
    ...base,
    name: d.display_name || base.name,
    phone: d.phone || "",
    status: STATUS[d.status] || base.status,
    role: ROLE[d.current_role || ""] || base.role,
    totalListingsCount: d.activity.listings_owned,
  };
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pending, setPending] = useState<Set<string>>(new Set());

  const reload = useCallback(async () => {
    if (!getSession()) {
      setUsers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setUsers((await fetchAll(listAdminUsers)).map(fromRow));
      setLoadError("");
    } catch (e) {
      setLoadError(errorMessage(e, "Could not load users."));
      notify.error(errorMessage(e, "Could not load users."), { id: "admin-users-error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const refreshUser = useCallback(async (userId: string) => {
    try {
      const d = await getAdminUser(Number(userId));
      setUsers((prev) => prev.map((u) => (u.id === userId ? withDetail(u, d) : u)));
    } catch (e) {
      notify.error(errorMessage(e, "Could not load this user."));
    }
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const buyers = users.filter((u) => u.role === "buyer").length;
    const owners = users.filter((u) => u.role === "owner").length;
    const agents = users.filter((u) => u.role === "agent").length;
    const suspended = users.filter((u) => u.status === "Suspended").length;
    const active = users.filter((u) => u.status === "Active").length;
    return { total, buyers, owners, agents, suspended, active };
  }, [users]);

  const run = async (userId: string, call: () => Promise<AdminUserDetail>, okMsg: string) => {
    if (pending.has(userId)) return false;
    setPending((s) => new Set(s).add(userId));
    try {
      const d = await call();
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...withDetail(u, d), suspensionReason: undefined } : u)));
      notify.success(okMsg);
      return true;
    } catch (e) {
      notify.error(errorMessage(e, "The backend did not accept this change."));
      return false;
    } finally {
      setPending((s) => {
        const n = new Set(s);
        n.delete(userId);
        return n;
      });
    }
  };

  const suspendUser = (userId: string, reason: string) => {
    const r = reason.trim();
    if (!r) {
      notify.error("A suspension reason is required.");
      return;
    }
    void run(userId, () => suspendAdminUser(Number(userId), r.slice(0, 500)), "Account suspended.").then((ok) => {
      if (ok) setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, suspensionReason: r } : u)));
    });
  };

  const activateUser = (userId: string) => void run(userId, () => reactivateAdminUser(Number(userId)), "Account reactivated.");

  const unsupported = (what: string) =>
    notify.error(`${what} is not available: the backend has no admin endpoint for it. Nothing was changed.`);

  const updateUser = (userId: string, updates: Partial<User>) => {
    // Only a status change maps to a real backend action.
    const keys = Object.keys(updates);
    if (keys.length === 1 && updates.status === "Active") return activateUser(userId);
    if (keys.every((k) => k === "status" || k === "suspensionReason") && updates.status === "Suspended")
      return suspendUser(userId, updates.suspensionReason || "");
    unsupported("Editing user details or roles");
  };
  const addUser = () => {
    unsupported("Creating users from the admin console");
    return "";
  };
  const deleteUser = () => unsupported("Deleting users");
  const addAdminNote = () => unsupported("Admin notes");
  const batchSuspend = (userIds: string[], reason: string) => userIds.forEach((id) => suspendUser(id, reason));
  const resetToDefaultUsers = () => void reload();

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        loadError,
        stats,
        suspendUser,
        activateUser,
        updateUser,
        addUser,
        deleteUser,
        addAdminNote,
        batchSuspend,
        refreshUser,
        reload,
        resetToDefaultUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserStore() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserStore must be used within a UserProvider");
  }
  return context;
}
