"use client";

import React, { useState } from "react";
import { ShieldCheck, XCircle, X, FileText, ExternalLink, Download } from "lucide-react";
import { User } from "@/types/user";

interface UserKycModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (userId: string, notes?: string) => void;
  onReject: (userId: string, reason: string) => void;
}

const rejectionReasons = [
  "Document scan is blurry, dark, or illegible",
  "Name on Aadhaar/PAN does not match registered account name",
  "Document is expired or invalid",
  "Missing back side of Aadhaar card / address proof",
  "RERA Agent Certificate registration number could not be verified",
  "Other compliance mismatch",
];

export function UserKycModal({
  user,
  isOpen,
  onClose,
  onVerify,
  onReject,
}: UserKycModalProps) {
  const [mode, setMode] = useState<"review" | "reject">("review");
  const [rejectReason, setRejectReason] = useState(rejectionReasons[0]);
  const [customNotes, setCustomNotes] = useState("");

  if (!isOpen || !user) return null;

  const handleVerify = () => {
    onVerify(user.id, customNotes || "All submitted KYC documents verified.");
    onClose();
  };

  const handleConfirmReject = () => {
    const finalReason = customNotes.trim()
      ? `${rejectReason}: ${customNotes.trim()}`
      : rejectReason;
    onReject(user.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#e2e8f2] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#f0f3f8] pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#10b981]">
              <ShieldCheck size={22} />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-[#17253d]">
                KYC Document Verification
              </h2>
              <p className="text-xs text-[#808fa5]">
                Reviewing compliance documents for{" "}
                <span className="font-semibold text-[#17253d]">{user.name}</span> ({user.id})
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

        {/* User Summary */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#edf1f8] bg-[#f8fbfe] p-3 text-xs text-[#4c5c76]">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-[#2854cb]"
            style={{ background: user.tint }}
          >
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[#1f2e48]">{user.name}</div>
            <div className="text-[11px] text-[#8090a6]">
              {user.role === "owner" ? user.ownerType || "Owner" : "Registered Buyer"} ·{" "}
              {user.phone} · {user.email}
            </div>
          </div>
        </div>

        {mode === "review" ? (
          <>
            {/* Documents List */}
            <div className="mt-4 space-y-3">
              <span className="text-xs font-bold text-[#344560]">
                Submitted Documents ({user.kycDocuments?.length || 0})
              </span>
              {user.kycDocuments && user.kycDocuments.length > 0 ? (
                user.kycDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-xl border border-[#e8ecf4] p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={18} className="text-[#2854cb]" />
                      <div>
                        <div className="font-bold text-[#1f2e48]">{doc.type}</div>
                        <div className="text-[11px] text-[#8090a6]">
                          Number: {doc.documentNumber} · {doc.fileSize}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        doc.status === "Verified"
                          ? "bg-[#ecfdf5] text-[#059669]"
                          : doc.status === "Rejected"
                          ? "bg-[#fef2f2] text-[#dc2626]"
                          : "bg-[#fffbeb] text-[#d97706]"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-[#f0f3f8] bg-[#fafbfc] p-4 text-center text-xs text-[#8c9cb2]">
                  No KYC documents uploaded yet by this user.
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#344560] mb-1">
                  Verification Audit Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. UIDAI instant verification matched name and date of birth..."
                  className="w-full rounded-xl border border-[#dce3ee] bg-[#fafbfd] p-2.5 text-xs text-[#20314b] outline-none focus:border-[#2854cb] focus:bg-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between border-t border-[#f0f3f8] pt-4">
              <button
                type="button"
                onClick={() => setMode("reject")}
                className="rounded-xl border border-[#fee2e2] bg-[#fef2f2] px-3.5 py-2 text-xs font-bold text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
              >
                Reject KYC
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#dbe2ee] px-4 py-2 text-xs font-semibold text-[#576882] hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#10b981] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_12px_#10b98135] hover:bg-[#059669] transition-all"
                >
                  <ShieldCheck size={15} />
                  <span>Approve & Verify KYC</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Rejection Mode */
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#344560] mb-1">
                Rejection Reason Category
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-xl border border-[#dce3ee] bg-[#fafbfd] px-3 py-2 text-xs font-semibold text-[#20314b] outline-none"
              >
                {rejectionReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#344560] mb-1">
                Feedback for User (What they need to resubmit)
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Please upload clear original scan of your Aadhaar card with all four corners visible."
                className="w-full rounded-xl border border-[#dce3ee] bg-[#fafbfd] p-2.5 text-xs text-[#20314b] outline-none focus:border-[#ef4444]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#f0f3f8] pt-4">
              <button
                type="button"
                onClick={() => setMode("review")}
                className="text-xs font-bold text-[#2854cb] hover:underline"
              >
                ← Back to Review
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#dbe2ee] px-4 py-2 text-xs font-semibold text-[#576882] hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#ef4444] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#dc2626]"
                >
                  <XCircle size={15} />
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
