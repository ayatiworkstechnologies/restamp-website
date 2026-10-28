"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { usePropertyStore } from "@/context/property-context";

export function ToastNotification() {
  const { toast, hideToast } = usePropertyStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-[#10b981]" />,
    error: <AlertCircle size={18} className="text-[#ef4444]" />,
    info: <Info size={18} className="text-[#3b82f6]" />,
  };

  const borders = {
    success: "border-[#10b981]/30 bg-[#f0fdf4] text-[#14532d]",
    error: "border-[#ef4444]/30 bg-[#fef2f2] text-[#7f1d1d]",
    info: "border-[#3b82f6]/30 bg-[#eff6ff] text-[#1e3a8a]",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex max-w-md items-center gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all">
      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${borders[toast.type]}`}>
        {icons[toast.type]}
        <div className="text-xs font-semibold leading-relaxed">{toast.message}</div>
        <button
          onClick={hideToast}
          className="ml-2 rounded-lg p-1 text-slate-400 hover:bg-black/5 hover:text-slate-700"
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
