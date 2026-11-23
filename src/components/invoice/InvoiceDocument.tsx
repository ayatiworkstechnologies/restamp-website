"use client";

import Image from "next/image";
import { VERIFICATION_TEXT, invoiceHeadline, invoicePeriod, type InvoiceData } from "@/lib/invoice";
import type { InvoiceTemplate } from "@/lib/invoice-template";
import { ROLE_LABEL } from "@/types/subscription";

export const invoiceMoney = (n: number) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function InvoiceDocument({ inv, template: t, className = "" }: { inv: InvoiceData; template: InvoiceTemplate; className?: string }) {
  const money = invoiceMoney;
  const p = inv.payment;
  const period = invoicePeriod(inv.subscription);
  const taxable = inv.taxable;
  const accent = t.accentColor || "#111111";
  const totals: [string, string, boolean][] = [
    ["Subtotal", money(p.baseAmount), false],
    ...(p.discount ? ([["Discount", `− ${money(p.discount)}`, false]] as [string, string, boolean][]) : []),
    ["Total excluding tax", money(taxable), false],
    [`CGST (${inv.cgstRate}% on ${money(taxable)})`, money(inv.cgst), false],
    [`SGST (${inv.sgstRate}% on ${money(taxable)})`, money(inv.sgst), false],
    ["Total", money(inv.total), false],
    [p.verification === "verified" ? "Amount paid" : "Amount due", money(inv.total), true],
  ];

  return (
    <article className={`mx-auto flex min-h-[1123px] max-w-[794px] flex-col bg-white p-8 text-[13px] leading-relaxed text-neutral-900 shadow-sm sm:p-14 print:min-h-0 print:max-w-none print:p-0 print:shadow-none ${className}`}>
      <header className="flex items-start justify-between gap-6">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: accent }}>{t.title || "Invoice"}</h1>
        {t.showLogo ? (
          <Image src="/restamp-logo.svg" alt={t.brandName || "Restamp"} width={168} height={45} className="h-11 w-auto" />
        ) : (
          <span className="text-2xl font-extrabold" style={{ color: accent }}>{t.brandName}</span>
        )}
      </header>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-0.5">
        <dt className="font-semibold">Invoice number</dt><dd>{inv.number}</dd>
        <dt className="font-semibold">Date of issue</dt><dd>{inv.date}</dd>
        {t.showTransactionId && (<><dt className="font-semibold">Transaction ID</dt><dd className="break-all">{p.transactionRef || "—"}</dd></>)}
        <dt className="font-semibold">GSTIN</dt><dd>{t.gstin || "Not configured"}</dd>
      </dl>

      <section className="mt-8 grid gap-6 sm:grid-cols-[2fr_3fr]">
        <div>
          <div className="mb-1.5 font-semibold">{t.legalName}</div>
          {t.address.split("\n").map((l, i) => <div key={i}>{l}</div>)}
          {t.email && <div>{t.email}</div>}
          {t.phone && <div>{t.phone}</div>}
        </div>
        <div>
          <div className="mb-1.5 font-semibold">Bill to</div>
          <div>{p.subscriberName}</div>
          {p.subscriberPhone && <div>{p.subscriberPhone}</div>}
          <div>{ROLE_LABEL[p.role]} account</div>
        </div>
      </section>

      <section className="mt-9">
        <h2 className="text-xl font-bold">{invoiceHeadline(inv, money)}</h2>
        <div className={p.verification === "verified" ? "mt-1 text-emerald-700" : "mt-1 text-amber-700"}>{VERIFICATION_TEXT[p.verification]}</div>
      </section>

      <div className="mt-9 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left">
          <thead>
            <tr className="border-b text-xs" style={{ borderColor: accent }}>
              <th className="pb-2 font-normal">Description</th>
              <th className="pb-2 text-right font-normal">Qty</th>
              <th className="pb-2 text-right font-normal">Unit price</th>
              <th className="pb-2 text-right font-normal">Tax</th>
              <th className="pb-2 text-right font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.lines.map((l, i) => (
              <tr key={l.label} className="align-top">
                <td className="pt-3">
                  {l.label}
                  {i === 0 && period && <div>{period}</div>}
                </td>
                <td className="pt-3 text-right">{i === 0 ? 1 : ""}</td>
                <td className="pt-3 text-right">{i === 0 ? money(l.amount) : ""}</td>
                <td className="pt-3 text-right">{i === 0 ? `${inv.cgstRate + inv.sgstRate}%` : ""}</td>
                <td className="pt-3 text-right">{l.amount < 0 ? `− ${money(-l.amount)}` : money(l.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ml-auto mt-8 w-full sm:w-1/2">
        {totals.map(([k, v, bold]) => (
          <div key={k} className={`flex justify-between gap-4 border-t border-neutral-200 py-1 ${bold ? "font-bold" : ""}`}>
            <dt>{k}</dt><dd>{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        {t.showPaymentDetails && (
          <>
            <div>Payment method: {p.method || "—"}</div>
            <div>Provider: {p.provider || "—"}</div>
          </>
        )}
        <div>{t.gstin ? "Tax Invoice" : "Not a valid GST tax invoice (seller GSTIN not configured)"}</div>
      </section>

      {t.notes.trim() && (
        <section className="mt-6 whitespace-pre-line text-neutral-600">
          <div className="mb-1 font-semibold text-neutral-900">Notes</div>
          {t.notes}
        </section>
      )}

      <footer className="mt-auto flex justify-between gap-4 border-t border-neutral-200 pt-5 text-[11px] print:fixed print:inset-x-0 print:bottom-0">
        <span>{t.footerText.trim() || `${inv.number} · ${invoiceHeadline(inv, money)}`}</span>
        <span className="shrink-0">Page 1 of 1</span>
      </footer>
    </article>
  );
}
