"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldCheck, X } from "lucide-react";
import { User } from "@/types/user";

interface UserSuspendModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuspend: (userId: string, reason: string) => void;
  onActivate: (userId: string) => void;
}

const suspensionReasons = [
  "Fake / fraudulent property listings submitted",
  "Repeated spam inquiries sent to sellers",
  "Unresponsive or abusive communication with prospective buyers",
  "Forged legal documents or municipal approvals",
  "Unlicensed commercial brokerage activity",
  "Other terms of service violation",
];

export function UserSuspendModal({
  user,
  isOpen,
  onClose,
  onSuspend,
  onActivate,
}: UserSuspendModalProps) {
  const [reasonCategory, setReasonCategory] = useState(suspensionReasons[0]);
  const [customDetails, setCustomDetails] = useState("");

  if (!isOpen || !user) return null;

  const isCurrentlySuspended = user.status === "Suspended";

  const handleAction = () => {
    if (isCurrentlySuspended) {
      onActivate(user.id);
    } else {
      const finalReason = customDetails.trim()
        ? `${reasonCategory}: ${customDetails.trim()}`
        : reasonCategory;
      onSuspend(user.id, finalReason);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-[#fee2e2] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#fef2f2] pb-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                isCurrentlySuspended
                  ? "bg-[#ecfdf5] text-[#10b981]"
                  : "bg-[#fee2e2] text-[#ef4444]"
              }`}
            >
              {isCurrentlySuspended ? <ShieldCheck size={22} /> : <AlertTriangle size={22} />}
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#17253d]">
                {isCurrentlySuspended ? "Restore User Account" : "Suspend User Account"}
              </h2>
              <p className="text-xs text-[#808fa5]">
                Account: <span className="font-semibold text-[#17253d]">{user.name}</span> ({user.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {isCurrentlySuspended ? (
          <div className="mt-4 space-y-3 text-xs text-[#4c5c76]">
            <p>
              This account was suspended with the reason:
            </p>
            <div className="rounded-xl border border-[#fecaca] bg-[#fff5f5] p-3 font-medium text-[#991b1b]">
              {user.suspensionReason || "Administrative suspension."}
            </div>
            <p>
              Restoring will allow this user to log in, submit property inquiries, and list properties.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffaf5] p-3 text-xs text-[#9a3412]">
              <span className="font-bold">Action Notice:</span> Suspending this user will immediately
              deactivate their access and pause all active listings and inquiries.
            </div>

            <div>
              <label className="block text-xs font-bold text-[#344560] mb-1">
                Suspension Reason Category
              </label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full rounded-xl border border-[#dce3ee] bg-[#fafbfd] px-3 py-2 text-xs font-semibold text-[#20314b] outline-none"
              >
                {suspensionReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#344560] mb-1">
                Additional Notes / Case Details (Optional)
              </label>
              <textarea
                rows={2}
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Incident details, reporter ticket number..."
                className="w-full rounded-xl border border-[#dce3ee] bg-[#fafbfd] p-2.5 text-xs text-[#20314b] outline-none"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-[#f0f3f8] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#dbe2ee] px-4 py-2 text-xs font-semibold text-[#576882] hover:bg-[#f8fafc]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAction}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all ${
              isCurrentlySuspended
                ? "bg-[#10b981] hover:bg-[#059669]"
                : "bg-[#ef4444] hover:bg-[#dc2626]"
            }`}
          >
            {isCurrentlySuspended ? <span>Restore Account</span> : <span>Confirm Suspension</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
