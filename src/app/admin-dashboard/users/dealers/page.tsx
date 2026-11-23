"use client";

import { AdminShell } from "@/components/dashboard/admin-shell";
import { RoleDirectory } from "@/components/users/role-directory";

export default function DealersPage() {
  return (
    <AdminShell section="User Management" title="Dealers">
      <RoleDirectory role="dealer" />
    </AdminShell>
  );
}
