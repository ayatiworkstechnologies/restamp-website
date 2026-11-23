"use client";

import { useSyncExternalStore } from "react";

/**
 * Admin-editable invoice template. Persisted in localStorage like the rest of
 * the subscription data, and read by the invoice page, the PDF generator and
 * the admin preview so all three always match.
 */
export interface InvoiceTemplate {
  title: string;
  brandName: string;
  legalName: string;
  address: string;
  email: string;
  phone: string;
  gstin: string;
  cgstRate: number;
  sgstRate: number;
  accentColor: string;
  showLogo: boolean;
  showTransactionId: boolean;
  showPaymentDetails: boolean;
  notes: string;
  footerText: string;
}

export const DEFAULT_TEMPLATE: InvoiceTemplate = {
  title: "Invoice",
  brandName: "RESTAMP",
  legalName: "RESTAMP Real Estate Marketplace",
  address: "Chennai, Tamil Nadu, India",
  email: "support@restamp.in",
  phone: "",
  gstin: "",
  cgstRate: 9,
  sgstRate: 9,
  accentColor: "#111111",
  showLogo: true,
  showTransactionId: true,
  showPaymentDetails: true,
  notes: "",
  footerText: "",
};

const KEY = "restamp_invoice_template";
const EVENT = "restamp-invoice-template";

let cache: InvoiceTemplate | null = null;

export function loadInvoiceTemplate(): InvoiceTemplate {
  if (typeof window === "undefined") return DEFAULT_TEMPLATE;
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...DEFAULT_TEMPLATE, ...JSON.parse(raw) } : DEFAULT_TEMPLATE;
  } catch {
    cache = DEFAULT_TEMPLATE;
  }
  return cache!;
}

export function saveInvoiceTemplate(t: InvoiceTemplate) {
  cache = { ...t };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage unavailable: keep in-memory copy */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function resetInvoiceTemplate() {
  saveInvoiceTemplate(DEFAULT_TEMPLATE);
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useInvoiceTemplate(): InvoiceTemplate {
  return useSyncExternalStore(subscribe, loadInvoiceTemplate, () => DEFAULT_TEMPLATE);
}

export function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return [17, 17, 17];
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
