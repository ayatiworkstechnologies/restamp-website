"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { FileDown, Loader2, Printer } from "lucide-react";
import { useSubscriptionData } from "@/lib/subscription-store";
import { toast } from "@/lib/notify";
import { buildInvoice, downloadInvoicePdf } from "@/lib/invoice";
import { useInvoiceTemplate } from "@/lib/invoice-template";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";

function InvoiceView() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const { ready, payments, subscriptions } = useSubscriptionData();
  const template = useInvoiceTemplate();
  const [busy, setBusy] = useState(false);
  const printed = useRef(false);

  const inv = useMemo(() => {
    const ref = decodeURIComponent(id);
    const p = payments.find((x) => x.id === ref || x.transactionRef === ref);
    if (!p) return null;
    return buildInvoice(p, subscriptions.find((s) => s.id === p.subscriptionId), template);
  }, [id, payments, subscriptions, template]);

  useEffect(() => {
    if (inv && search.get("print") === "1" && !printed.current) {
      printed.current = true;
      setTimeout(() => window.print(), 300);
    }
  }, [inv, search]);

  if (!ready) return <div className="p-10 text-center text-sm text-slate-500">Loading invoice…</div>;
  if (!inv) return <div className="p-10 text-center text-sm text-slate-500">Invoice not found.</div>;

  const pdf = async () => {
    setBusy(true);
    try {
      await downloadInvoicePdf(inv, template);
      toast.success(`Invoice ${inv.number} downloaded`);
    } catch {
      toast.error("Could not generate the invoice PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-200 px-4 py-8 print:bg-white print:p-0">
      <style>{`@media print { @page { size: A4; margin: 14mm; } }`}</style>
      <div className="mx-auto mb-4 flex max-w-[794px] flex-wrap justify-end gap-2 print:hidden">
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#334155] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1e293b]">
          <Printer size={14} /> Print
        </button>
        <button type="button" onClick={pdf} disabled={busy} className="inline-flex items-center gap-1.5 rounded-xl bg-[#dc2626] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#b91c1c] disabled:opacity-60">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />} Download PDF
        </button>
      </div>

      <InvoiceDocument inv={inv} template={template} />
    </main>
  );
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-slate-500">Loading invoice…</div>}>
      <InvoiceView />
    </Suspense>
  );
}
