"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Circle,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Phone,
  StickyNote,
  XCircle,
} from 'lucide-react';
import { toast } from '@/lib/notify';
import { confirmDialog } from '@/components/common/confirm-dialog';
import {
  LEAD_STATUSES,
  activeVisitFor,
  formatVisit,
  proposeVisit,
  timeAgo,
  updateOwnerLead,
  updateVisitStatus,
  useOwnerLeads,
  type LeadStatus,
  type VisitStatus,
} from '@/lib/ownerLeads';
import { card } from '@/app/owner/dashboard/ui';

const BACK = '/dealer/dashboard/leads?space=space';

const tone: Record<LeadStatus, string> = {
  New: 'bg-sky-50 text-[#087ed9]',
  Contacted: 'bg-violet-50 text-violet-700',
  Visit: 'bg-amber-50 text-amber-700',
  Closed: 'bg-emerald-50 text-emerald-700',
};

const visitTone: Record<VisitStatus, string> = {
  REQUESTED: 'bg-sky-50 text-[#087ed9]',
  PROPOSED: 'bg-violet-50 text-violet-700',
  CONFIRMED: 'bg-amber-50 text-amber-800',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  DECLINED: 'bg-slate-100 text-slate-500',
  CANCELLED: 'bg-slate-100 text-slate-500',
};

const visitLabel: Record<VisitStatus, string> = {
  REQUESTED: 'Requested by buyer',
  PROPOSED: 'Proposed · awaiting buyer',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  DECLINED: 'Declined',
  CANCELLED: 'Cancelled',
};

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

const toLocalInput = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
};

export default function DealerListingLeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const leadId = decodeURIComponent(id);
  const { leads, visits } = useOwnerLeads();
  const [ready, setReady] = useState(false);
  const [notes, setNotes] = useState('');
  const [when, setWhen] = useState('');
  const [visitNote, setVisitNote] = useState('');
  const [visitError, setVisitError] = useState('');

  const lead = useMemo(() => leads.find((l) => l.id === leadId), [leads, leadId]);
  const active = lead ? activeVisitFor(lead.id, visits) : undefined;
  const history = useMemo(
    () => visits.filter((v) => v.leadId === leadId).sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt)),
    [visits, leadId],
  );

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!lead) return;
    setNotes(lead.notes ?? '');
  }, [lead?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setWhen(toLocalInput(active?.scheduledAt));
    setVisitNote(active?.note ?? '');
  }, [active?.id, active?.scheduledAt]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!lead) {
    if (!ready || leads.length === 0) return <div className="py-20 text-center text-sm text-slate-500">Loading lead…</div>;
    return (
      <div className={`${card} mx-auto max-w-lg py-16 text-center`}>
        <p className="font-semibold text-slate-900">Lead not found</p>
        <p className="mt-1 text-sm text-slate-500">It may have been removed or the link is wrong.</p>
        <Link href={BACK} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#087ed9] px-5 text-sm font-semibold text-white hover:bg-sky-600">
          <ArrowLeft size={16} /> Back to leads
        </Link>
      </div>
    );
  }

  const digits = lead.phone.replace(/[^0-9]/g, '');

  const setStatus = (status: LeadStatus) => {
    if (status === lead.status) return;
    updateOwnerLead(lead.id, { status });
    toast.success(`Lead marked as ${status}`);
  };

  const saveNotes = () => {
    if ((lead.notes ?? '') === notes.trim()) return;
    updateOwnerLead(lead.id, { notes: notes.trim() });
    toast.success('Notes saved');
  };

  const sendProposal = () => {
    const d = new Date(when);
    if (!when || isNaN(d.getTime()) || d.getTime() <= Date.now()) {
      setVisitError('Please choose a future date and time.');
      return;
    }
    setVisitError('');
    proposeVisit(lead, d.toISOString(), visitNote.trim() || undefined);
    toast.success(active ? 'New time proposed' : 'Visit proposed', { description: `${fmtDateTime(d.toISOString())} · the buyer can confirm or decline.` });
  };

  const acceptRequest = () => {
    if (!active) return;
    updateVisitStatus(active.id, 'CONFIRMED');
    if (lead.status !== 'Visit') updateOwnerLead(lead.id, { status: 'Visit' });
    toast.success('Visit confirmed', { description: formatVisit(active.scheduledAt) });
  };

  const markCompleted = () => {
    if (!active) return;
    updateVisitStatus(active.id, 'COMPLETED');
    toast.success('Visit marked as completed');
  };

  const cancelVisit = async () => {
    if (!active) return;
    const declining = active.status === 'REQUESTED';
    const ok = await confirmDialog({
      title: declining ? 'Decline visit' : 'Cancel visit',
      body: declining
        ? `Decline ${lead.customerName}'s visit request? They can request another time.`
        : `Cancel the site visit with ${lead.customerName} on ${formatVisit(active.scheduledAt)}?`,
      confirmLabel: declining ? 'Decline' : 'Cancel visit',
    });
    if (!ok) return;
    updateVisitStatus(active.id, declining ? 'DECLINED' : 'CANCELLED');
    toast.info(declining ? 'Visit request declined' : 'Site visit cancelled');
  };

  const closeLead = async () => {
    if (!(await confirmDialog({ title: 'Close lead', body: `Mark ${lead.customerName}'s enquiry as closed?`, confirmLabel: 'Close lead', tone: 'default' }))) return;
    setStatus('Closed');
  };

  const completed = history.some((v) => v.status === 'COMPLETED');
  const timeline = [
    { label: 'Enquiry received', at: lead.createdAt, done: true },
    { label: 'Contacted', at: lead.status !== 'New' && lead.status !== 'Closed' ? lead.statusUpdatedAt : undefined, done: lead.status !== 'New' },
    { label: active ? `Visit ${visitLabel[active.status].toLowerCase()}` : 'Site visit arranged', at: active?.scheduledAt, done: !!active || completed },
    { label: 'Visit completed', done: completed },
    { label: 'Closed', at: lead.status === 'Closed' ? lead.statusUpdatedAt : undefined, done: lead.status === 'Closed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={BACK} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#087ed9]">
            <ArrowLeft size={16} /> My Property Leads
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Lead Details</h1>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-semibold text-slate-500">{lead.id}</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          {/* Customer */}
          <section className={`${card} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xl font-bold text-[#087ed9]">{lead.customerName.charAt(0)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-slate-900">{lead.customerName}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone size={14} className="shrink-0" /> {lead.phone || 'Phone not provided'}
                </p>
                {lead.email && (
                  <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm text-slate-500">
                    <Mail size={14} className="shrink-0" /> <span className="truncate">{lead.email}</span>
                  </p>
                )}
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
              {lead.email ? (
                <a href={`mailto:${lead.email}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-sky-50 text-sm font-semibold text-[#087ed9] hover:bg-sky-100">
                  <Mail size={16} /> Email
                </a>
              ) : (
                <span className="inline-flex h-11 items-center justify-center rounded-full bg-slate-50 text-xs text-slate-400">No email</span>
              )}
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

          {/* Enquiry */}
          <section className={`${card} p-5 sm:p-6`}>
            <h2 className="text-base font-bold text-slate-900">Enquiry</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-[14px] bg-slate-50 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#087ed9] shadow-sm">
                  <Building2 size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Property</p>
                  <p className="text-sm font-semibold text-slate-800">{lead.propertyTitle}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[14px] bg-slate-50 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#087ed9] shadow-sm">
                  <MapPin size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="text-sm font-semibold text-slate-800">{lead.locality}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-[16px] border border-slate-100 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <MessageSquareText size={14} /> Message · {lead.messageCount} {lead.messageCount === 1 ? 'message' : 'messages'}
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{lead.message || 'No message provided.'}</p>
            </div>
          </section>

          {/* Visit history */}
          <section className={`${card} p-5 sm:p-6`}>
            <h2 className="text-base font-bold text-slate-900">Visit History</h2>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No site visits yet. Propose a time from the panel on the right.</p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {history.map((v) => (
                  <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{fmtDateTime(v.scheduledAt)}</p>
                      {v.note && <p className="text-xs text-slate-500">{v.note}</p>}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${visitTone[v.status]}`}>{visitLabel[v.status]}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes */}
          <section className={`${card} p-5 sm:p-6`}>
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <StickyNote size={17} className="text-slate-400" /> Notes
            </h2>
            <p className="text-xs text-slate-400">Only you can see these.</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
              onBlur={saveNotes}
              rows={4}
              placeholder="e.g. Asked about parking, wants to close by month end…"
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

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          {/* Status */}
          <section className={`${card} p-5`}>
            <h2 className="text-base font-bold text-slate-900">Status</h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {LEAD_STATUSES.map((s) => (
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
          <section className={`${card} p-5`}>
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <CalendarClock size={17} className="text-slate-400" /> Site Visit
            </h2>

            {active && (
              <div className={`mt-3 rounded-[14px] px-3.5 py-3 ${visitTone[active.status]}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{visitLabel[active.status]}</p>
                    <p className="text-sm font-bold">{fmtDateTime(active.scheduledAt)}</p>
                    {active.note && <p className="mt-0.5 text-xs opacity-80">{active.note}</p>}
                  </div>
                  <button type="button" onClick={cancelVisit} aria-label={active.status === 'REQUESTED' ? 'Decline visit' : 'Cancel visit'} className="cursor-pointer opacity-70 hover:text-red-600 hover:opacity-100">
                    <XCircle size={18} />
                  </button>
                </div>
                {(active.status === 'REQUESTED' || active.status === 'CONFIRMED') && (
                  <button
                    type="button"
                    onClick={active.status === 'REQUESTED' ? acceptRequest : markCompleted}
                    className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                  >
                    <CalendarCheck size={16} /> {active.status === 'REQUESTED' ? 'Accept request' : 'Mark as completed'}
                  </button>
                )}
              </div>
            )}

            <label className="mt-3 block text-xs font-semibold text-slate-600">{active ? 'Propose a different time' : 'Date & time'}</label>
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-[14px] border border-slate-200 px-3 text-sm outline-none focus:border-[#087ed9]"
            />
            <label className="mt-3 block text-xs font-semibold text-slate-600">Note (optional)</label>
            <input
              value={visitNote}
              onChange={(e) => setVisitNote(e.target.value.slice(0, 200))}
              placeholder="e.g. Meet at the main gate"
              className="mt-1.5 h-11 w-full rounded-[14px] border border-slate-200 px-3 text-sm outline-none focus:border-[#087ed9]"
            />
            {visitError && <p className="mt-1.5 text-xs font-semibold text-red-500">{visitError}</p>}
            <button type="button" onClick={sendProposal} className="mt-3 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#087ed9] text-sm font-semibold text-white hover:bg-sky-600">
              <CalendarClock size={16} /> {active ? 'Send new time' : 'Propose a Visit'}
            </button>
            <p className="mt-2 text-center text-xs text-slate-400">The buyer can confirm or decline the proposed time.</p>
          </section>

          {/* Timeline */}
          <section className={`${card} p-5`}>
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
    </div>
  );
}
