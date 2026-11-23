"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FileDown, Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "@/lib/notify";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { Card, Notice, btnPdf, btnPrimary, btnSecondary, inputCls, selectCls, useActor } from "@/components/subscriptions/ui";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";
import { buildInvoice, downloadInvoicePdf } from "@/lib/invoice";
import { DEFAULT_TEMPLATE, saveInvoiceTemplate, useInvoiceTemplate, type InvoiceTemplate } from "@/lib/invoice-template";
import { useSubscriptionData } from "@/lib/subscription-store";
import type { PaymentRecord } from "@/types/subscription";

const SAMPLE_PAYMENT: PaymentRecord = {
  id: "sample-preview",
  transactionRef: "pay_SAMPLE123456",
  role: "owner",
  subscriberName: "Sample Customer",
  subscriberPhone: "+91 98765 43210",
  planId: "sample",
  planName: "Premium Owner",
  baseAmount: 2999,
  discount: 0,
  gst: 540,
  total: 3539,
  currency: "INR",
  method: "UPI",
  provider: "Razorpay",
  verification: "verified",
  createdAt: new Date().toISOString(),
  source: "seed",
};

const ACCENTS = ["#111111", "#1b459b", "#087ed9", "#0f766e", "#b91c1c", "#7c3aed"];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold text-[#4a5a75]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10px] text-[#8896aa]">{hint}</span>}
    </label>
  );
}

function Toggle({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1 text-xs font-semibold text-[#22324d]">
      {label}
      <input type="checkbox" className="h-4 w-4 accent-[#087ed9]" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export default function InvoiceTemplatePage() {
  const saved = useInvoiceTemplate();
  const { canManage } = useActor();
  const { payments, subscriptions } = useSubscriptionData();
  const [draft, setDraft] = useState<InvoiceTemplate>({ ...DEFAULT_TEMPLATE, ...saved });
  const [previewId, setPreviewId] = useState("sample-preview");
  const [busy, setBusy] = useState(false);

  // Pick up the stored template once it loads on the client.
  useEffect(() => setDraft({ ...DEFAULT_TEMPLATE, ...saved }), [saved]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const set = <K extends keyof InvoiceTemplate>(k: K, v: InvoiceTemplate[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const inv = useMemo(() => {
    const p = payments.find((x) => x.id === previewId) ?? SAMPLE_PAYMENT;
    return buildInvoice(p, subscriptions.find((s) => s.id === p.subscriptionId), draft);
  }, [payments, subscriptions, previewId, draft]);

  const save = () => {
    if (draft.gstin && !/^[0-9]{2}[A-Z0-9]{13}$/.test(draft.gstin.trim().toUpperCase())) {
      toast.error("GSTIN must be 15 characters, e.g. 33ABCDE1234F1Z5");
      return;
    }
    saveInvoiceTemplate({ ...draft, gstin: draft.gstin.trim().toUpperCase() });
    toast.success("Invoice settings saved");
  };

  const testPdf = async () => {
    setBusy(true);
    try {
      await downloadInvoicePdf(inv, draft);
    } catch {
      toast.error("Could not generate the preview PDF.");
    } finally {
      setBusy(false);
    }
  };

  const ro = !canManage;

  return (
    <AdminShell section="Subscription Management" title="Invoice Settings">
      {ro && <Notice tone="warn">You can view these settings, but only billing admins can change it.</Notice>}

      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Card className="h-fit space-y-5 p-5 xl:sticky xl:top-4">
          <section className="space-y-3">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94a1b5]">Header</h3>
            <Field label="Document title"><input className={inputCls} disabled={ro} value={draft.title} onChange={(e) => set("title", e.target.value)} /></Field>
            <Toggle label="Show logo" checked={draft.showLogo} disabled={ro} onChange={(v) => set("showLogo", v)} />
            {!draft.showLogo && <Field label="Brand name (shown instead of logo)"><input className={inputCls} disabled={ro} value={draft.brandName} onChange={(e) => set("brandName", e.target.value)} /></Field>}
            <Field label="Accent colour">
              <div className="flex items-center gap-2">
                {ACCENTS.map((c) => (
                  <button key={c} type="button" disabled={ro} aria-label={`Accent ${c}`} onClick={() => set("accentColor", c)}
                    className={`h-6 w-6 rounded-full border-2 ${draft.accentColor === c ? "border-[#087ed9] ring-2 ring-[#087ed9]/30" : "border-white shadow"}`} style={{ background: c }} />
                ))}
                <input type="color" disabled={ro} value={draft.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-7 w-9 cursor-pointer rounded border border-[#e2e8f2]" />
              </div>
            </Field>
          </section>

          <section className="space-y-3">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94a1b5]">Seller details</h3>
            <Field label="Legal name"><input className={inputCls} disabled={ro} value={draft.legalName} onChange={(e) => set("legalName", e.target.value)} /></Field>
            <Field label="Address"><textarea rows={3} className={inputCls} disabled={ro} value={draft.address} onChange={(e) => set("address", e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email"><input className={inputCls} disabled={ro} value={draft.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Phone"><input className={inputCls} disabled={ro} value={draft.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            </div>
            <Field label="GSTIN" hint="Leave empty until registered. Invoices are marked as not a valid GST tax invoice without it.">
              <input className={`${inputCls} uppercase`} disabled={ro} maxLength={15} placeholder="33ABCDE1234F1Z5" value={draft.gstin} onChange={(e) => set("gstin", e.target.value)} />
            </Field>
          </section>

          <section className="space-y-3">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94a1b5]">Tax rates</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CGST (%)"><input type="number" min={0} max={50} step={0.5} className={inputCls} disabled={ro} value={draft.cgstRate ?? DEFAULT_TEMPLATE.cgstRate} onChange={(e) => set("cgstRate", Math.max(0, Number(e.target.value)))} /></Field>
              <Field label="SGST (%)"><input type="number" min={0} max={50} step={0.5} className={inputCls} disabled={ro} value={draft.sgstRate ?? DEFAULT_TEMPLATE.sgstRate} onChange={(e) => set("sgstRate", Math.max(0, Number(e.target.value)))} /></Field>
            </div>
            <p className="text-[10px] text-[#8896aa]">Total GST: {(draft.cgstRate ?? 0) + (draft.sgstRate ?? 0)}%. Invoice tax and total are recalculated from these rates.</p>
          </section>

          <section className="space-y-1">
            <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-[#94a1b5]">Sections</h3>
            <Toggle label="Show transaction ID" checked={draft.showTransactionId} disabled={ro} onChange={(v) => set("showTransactionId", v)} />
            <Toggle label="Show payment method & provider" checked={draft.showPaymentDetails} disabled={ro} onChange={(v) => set("showPaymentDetails", v)} />
          </section>

          <section className="space-y-3">
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#94a1b5]">Notes & footer</h3>
            <Field label="Notes / terms"><textarea rows={3} className={inputCls} disabled={ro} placeholder="e.g. Thank you for your business. Subscriptions are non-refundable after 7 days." value={draft.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
            <Field label="Footer text" hint="Empty = invoice number and amount."><input className={inputCls} disabled={ro} value={draft.footerText} onChange={(e) => set("footerText", e.target.value)} /></Field>
          </section>

          <div className="flex flex-wrap gap-2 border-t border-[#f1f4f9] pt-4">
            <button type="button" className={btnPrimary} disabled={ro || !dirty} onClick={save}><Save size={14} /> Save changes</button>
            <button type="button" className={btnSecondary} disabled={ro || !dirty} onClick={() => setDraft(saved)}>Discard</button>
            <button type="button" className={btnSecondary} disabled={ro} onClick={() => setDraft(DEFAULT_TEMPLATE)}><RotateCcw size={13} /> Defaults</button>
          </div>
        </Card>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#4a5a75]">Preview with</span>
            <select aria-label="Preview payment" className={selectCls} value={previewId} onChange={(e) => setPreviewId(e.target.value)}>
              <option value="sample-preview">Sample payment</option>
              {payments.slice(0, 50).map((p) => <option key={p.id} value={p.id}>{p.subscriberName} · {p.planName}</option>)}
            </select>
            {dirty && <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-extrabold text-[#b45309]">Unsaved changes</span>}
            <button type="button" className={`${btnPdf} ml-auto`} disabled={busy} onClick={testPdf}>
              {busy ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} />} Preview PDF
            </button>
          </div>
          <div className="overflow-auto rounded-2xl bg-neutral-200 p-4 sm:p-6">
            <InvoiceDocument inv={inv} template={draft} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
