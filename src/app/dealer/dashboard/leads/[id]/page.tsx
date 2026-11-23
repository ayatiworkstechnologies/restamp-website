"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock3,
  IndianRupee,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  StickyNote,
  Target,
  XCircle,
} from 'lucide-react';
import { toast } from '@/lib/notify';
import { confirmDialog } from '@/components/common/confirm-dialog';
import MatchModal from '@/components/dealer/MatchModal';
import { getDealerCatalogProperties, type DealerPropertyItem } from '@/lib/dealer-data';
import { DEALER_LEAD_STATUSES, timeAgo, updateDealerLead, useDealerLeads, type DealerLeadStatus } from '@/lib/dealerLeads';
import { dealerCard } from '@/app/dealer/dashboard/ui';

const tone: Record<DealerLeadStatus, string> = {
  New: 'bg-sky-50 text-[#087ed9]',
  Contacted: 'bg-violet-50 text-violet-700',
  'Visit Scheduled': 'bg-amber-50 text-amber-700',
  Closed: 'bg-emerald-50 text-emerald-700',
};

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

/** Value for <input type="datetime-local"> in the viewer's local time. */
const toLocalInput = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
};

export default function DealerLeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const leadId = decodeURIComponent(id);
  const { leads } = useDealerLeads();
  const [ready, setReady] = useState(false);
  const [properties, setProperties] = useState<DealerPropertyItem[]>([]);
  const [matching, setMatching] = useState(false);
  const [notes, setNotes] = useState('');
  const [visitWhen, setVisitWhen] = useState('');
  const [visitError, setVisitError] = useState('');

  const lead = useMemo(() => leads.find((l) => l.id === leadId), [leads, leadId]);

  useEffect(() => {
    setProperties(getDealerCatalogProperties());
  }, []);

  // useDealerLeads fills on mount; wait one tick before showing "not found".
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!lead) return;
    setNotes(lead.notes ?? '');
    setVisitWhen(toLocalInput(lead.visitAt));
  }, [lead?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const matched = useMemo(
    () => (lead?.matchedPropertyId ? properties.find((p) => p.id === lead.matchedPropertyId) : undefined),
    [lead?.matchedPropertyId, properties],
  );

  // Other properties in the same locality, as quick suggestions.
  const suggestions = useMemo(() => {
    if (!lead) return [];
    const words = lead.preferredLocality.toLowerCase().split(/[\s,]+/).filter((w) => w.length > 2);
    return properties
      .filter((p) => p.id !== lead.matchedPropertyId && words.some((w) => `${p.locality} ${p.city}`.toLowerCase().includes(w)))
      .slice(0, 3);
  }, [lead, properties]);

  if (!lead) {
    if (!ready || leads.length === 0) return <div className="py-20 text-center text-sm text-slate-500">Loading lead…</div>;
    return (
      <div className={`${dealerCard} mx-auto max-w-lg py-16 text-center`}>
        <p className="font-semibold text-slate-900">Lead not found</p>
        <p className="mt-1 text-sm text-slate-500">It may have been removed or the link is wrong.</p>
        <Link href="/dealer/dashboard/leads?tab=leads" className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#087ed9] px-5 text-sm font-semibold text-white hover:bg-sky-600">
          <ArrowLeft size={16} /> Back to leads
        </Link>
      </div>
    );
  }

  const digits = lead.phone.replace(/[^0-9]/g, '');

  const setStatus = (status: DealerLeadStatus) => {
    if (status === lead.status) return;
    updateDealerLead(lead.id, { status });
    toast.success(`Lead marked as ${status}`);
  };

  const saveNotes = () => {
    if ((lead.notes ?? '') === notes.trim()) return;
    updateDealerLead(lead.id, { notes: notes.trim() });
    toast.success('Notes saved');
  };

  const scheduleVisit = () => {
    const d = new Date(visitWhen);
    if (!visitWhen || isNaN(d.getTime()) || d.getTime() <= Date.now()) {
      setVisitError('Please choose a future date and time.');
      return;
    }
    setVisitError('');
    updateDealerLead(lead.id, { visitAt: d.toISOString(), status: 'Visit Scheduled' });
    toast.success('Site visit scheduled', { description: fmtDateTime(d.toISOString()) });
  };

  const cancelVisit = async () => {
    if (!(await confirmDialog({ title: 'Cancel visit', body: `Cancel the site visit with ${lead.customerName}? The lead goes back to Contacted.`, confirmLabel: 'Cancel visit' }))) return;
    updateDealerLead(lead.id, { visitAt: undefined, status: 'Contacted' });
    setVisitWhen('');
    toast.info('Site visit cancelled');
  };

  const closeLead = async () => {
    if (!(await confirmDialog({ title: 'Close lead', body: `Mark ${lead.customerName}'s enquiry as closed?`, confirmLabel: 'Close lead', tone: 'default' }))) return;
    setStatus('Closed');
  };

  const timeline = [
    { label: 'Lead received', at: lead.createdAt, done: true },
    { label: 'Contacted', at: lead.status !== 'New' ? lead.statusUpdatedAt : undefined, done: lead.status !== 'New' },
    { label: lead.matchedPropertyTitle ? `Matched: ${lead.matchedPropertyTitle}` : 'Property matched', done: !!lead.matchedPropertyTitle },
    { label: lead.visitAt ? `Visit · ${fmtDateTime(lead.visitAt)}` : 'Site visit scheduled', done: !!lead.visitAt },
    { label: 'Closed', at: lead.status === 'Closed' ? lead.statusUpdatedAt : undefined, done: lead.status === 'Closed' },
  ];

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dealer/dashboard/leads?tab=leads" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#087ed9]">
            <ArrowLeft size={16} /> Leads
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Lead Details</h1>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-500">{lead.id}</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* Customer */}
          <section className={`${dealerCard} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xl font-bold text-[#087ed9]">{lead.customerName.charAt(0)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-slate-900">{lead.customerName}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone size={14} className="shrink-0" /> {lead.phone || 'No phone on file'}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock3 size={13} className="shrink-0" /> Enquired {timeAgo(lead.createdAt)} · {fmtDateTime(lead.createdAt)}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone[lead.status]}`}>{lead.status}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {digits ? (
                <>
                  <a href={`tel:${digits}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-100 text-sm font-semibold text-slate-900 hover:bg-slate-200">
                    <Phone size={16} /> Call
                  </a>
                  <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </>
              ) : (
                <span className="col-span-2 inline-flex h-11 items-center justify-center rounded-full bg-slate-50 text-xs text-slate-400">Phone unavailable</span>
              )}
              <button type="button" onClick={() => setMatching(true)} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#087ed9] text-sm font-semibold text-white hover:bg-sky-600">
                <Target size={16} /> {lead.matchedPropertyTitle ? 'Change Match' : 'Match Property'}
              </button>
              <button
                type="button"
                onClick={closeLead}
                disabled={lead.status === 'Closed'}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-default disabled:opacity-50"
              >
                <CheckCircle2 size={16} /> {lead.status === 'Closed' ? 'Closed' : 'Close Lead'}
              </button>
            </div>
          </section>

          {/* Requirement */}
          <section className={`${dealerCard} p-5 sm:p-6`}>
            <h2 className="text-base font-bold text-slate-900">Requirement</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Search, label: 'Looking for', value: lead.requirement },
                { icon: Building2, label: 'Purpose', value: lead.purpose },
                { icon: MapPin, label: 'Preferred location', value: lead.preferredLocality },
                { icon: IndianRupee, label: 'Budget', value: lead.budget },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 rounded-[14px] bg-slate-50 p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#087ed9] shadow-sm">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-slate-400">{label}</dt>
                    <dd className="text-sm font-semibold text-slate-800">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* Matched property */}
          <section className={`${dealerCard} p-5 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Matched Property</h2>
              {lead.matchedPropertyTitle && (
                <button type="button" onClick={() => setMatching(true)} className="cursor-pointer text-sm font-semibold text-[#087ed9] hover:underline">
                  Change
                </button>
              )}
            </div>
            {lead.matchedPropertyTitle ? (
              <div className="mt-4 flex gap-4 rounded-[16px] border border-slate-100 p-3">
                {matched?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={matched.image} alt="" className="h-20 w-28 shrink-0 rounded-xl bg-slate-100 object-cover" />
                ) : (
                  <span className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <Building2 size={22} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{lead.matchedPropertyTitle}</p>
                  {matched && (
                    <>
                      <p className="truncate text-xs text-slate-500">{[matched.bhk, matched.type, `${matched.locality}, ${matched.city}`].filter(Boolean).join(' · ')}</p>
                      <p className="mt-1 text-sm font-bold text-[#087ed9]">{matched.price}</p>
                    </>
                  )}
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={13} /> Shared with customer
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[16px] border border-dashed border-slate-200 p-6 text-center">
                <p className="text-sm text-slate-500">No property matched yet.</p>
                <button type="button" onClick={() => setMatching(true)} className="mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#087ed9] px-4 text-sm font-semibold text-white hover:bg-sky-600">
                  <Target size={15} /> Match Property
                </button>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">More in {lead.preferredLocality}</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {suggestions.map((p) => (
                    <div key={p.id} className="overflow-hidden rounded-[14px] border border-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" className="h-24 w-full bg-slate-100 object-cover" loading="lazy" />
                      <div className="p-2.5">
                        <p className="truncate text-sm font-semibold text-slate-900">{p.title}</p>
                        <p className="truncate text-xs text-slate-500">{p.locality}</p>
                        <p className="text-sm font-bold text-[#087ed9]">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Notes */}
          <section className={`${dealerCard} p-5 sm:p-6`}>
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <StickyNote size={17} className="text-slate-400" /> Notes
            </h2>
            <p className="text-xs text-slate-400">Only you can see these.</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
              onBlur={saveNotes}
              rows={4}
              placeholder="e.g. Prefers east-facing, wants to visit on weekends…"
              className="mt-3 w-full rounded-[16px] border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#087ed9]"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">{notes.length}/1000</span>
              <button type="button" onClick={saveNotes} className="inline-flex h-9 cursor-pointer items-center rounded-full bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-700">
                Save notes
              </button>
            </div>
          </section>
        </div>

        {/* Side column */}
        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          {/* Status */}
          <section className={`${dealerCard} p-5`}>
            <h2 className="text-base font-bold text-slate-900">Status</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {DEALER_LEAD_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  aria-pressed={lead.status === s}
                  className={`cursor-pointer rounded-full px-3 py-2.5 text-xs font-semibold transition ${
                    lead.status === s ? 'bg-[#087ed9] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Site visit */}
          <section className={`${dealerCard} p-5`}>
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <CalendarClock size={17} className="text-slate-400" /> Site Visit
            </h2>
            {lead.visitAt && lead.status === 'Visit Scheduled' && (
              <div className="mt-3 flex items-start justify-between gap-2 rounded-[14px] bg-amber-50 px-3.5 py-3 text-sm font-semibold text-amber-800">
                <span>{fmtDateTime(lead.visitAt)}</span>
                <button type="button" onClick={cancelVisit} aria-label="Cancel visit" className="cursor-pointer text-amber-700 hover:text-red-600">
                  <XCircle size={17} />
                </button>
              </div>
            )}
            <label className="mt-3 block text-xs font-semibold text-slate-600">{lead.visitAt ? 'Reschedule to' : 'Date & time'}</label>
            <input
              type="datetime-local"
              value={visitWhen}
              onChange={(e) => setVisitWhen(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-[14px] border border-slate-200 px-3 text-sm outline-none focus:border-[#087ed9]"
            />
            {visitError && <p className="mt-1.5 text-xs font-semibold text-red-500">{visitError}</p>}
            <button type="button" onClick={scheduleVisit} className="mt-3 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#087ed9] text-sm font-semibold text-white hover:bg-sky-600">
              <CalendarClock size={16} /> {lead.visitAt ? 'Update Visit' : 'Schedule Visit'}
            </button>
          </section>

          {/* Timeline */}
          <section className={`${dealerCard} p-5`}>
            <h2 className="text-base font-bold text-slate-900">Progress</h2>
            <ol className="mt-4 space-y-4">
              {timeline.map((s, i) => (
                <li key={i} className="flex gap-3">
                  {s.done ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" /> : <Circle size={18} className="mt-0.5 shrink-0 text-slate-300" />}
                  <div className="min-w-0">
                    <p className={`text-sm ${s.done ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>{s.label}</p>
                    {s.at && <p className="text-xs text-slate-400">{fmtDateTime(s.at)}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>

      {matching && (
        <MatchModal
          mode="lead-to-property"
          lead={lead}
          properties={properties}
          onClose={() => setMatching(false)}
          onDone={(msg) => {
            setMatching(false);
            toast.success('Property matched', { description: msg });
          }}
        />
      )}
    </div>
  );
}
