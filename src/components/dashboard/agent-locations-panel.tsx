"use client";

/**
 * Admin: Agent Location Master (backend workbook). View/search the
 * individual locality records and add ONE locality at a time. There is no
 * bulk (Excel/CSV) import here by design.
 *
 *   GET  /admin/location-master?q=&zone=&pincode=&page=   [users.view]
 *   GET  /admin/location-master/status                    [users.view]
 *   POST /admin/location-master  (Idempotency-Key)        [settings.configure_platform]
 *
 * The server appends the record, updates or creates its PIN-code group,
 * republishes the workbook, and only then reports success.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Plus, Search, X } from "lucide-react";
import { Card, EmptyState, Modal, btnPrimary, btnSecondary, inputCls, selectCls } from "@/components/subscriptions/ui";
import { apiGet, apiRequest, isApiError } from "@/lib/api/client";
import { toast } from "@/lib/notify";
import { AGENT_ZONES } from "@/lib/agentLocations";

type RecordRow = {
  record_id: number;
  locality_name: string;
  pincode: string;
  zone: string;
  source: "SEED" | "ADMIN";
  published: boolean;
};
type Page = { items: RecordRow[]; total: number; page: number; page_size: number; published_version: number };
type Status = {
  committed_version: number;
  published_version: number;
  blocked_reason: string | null;
  pending_publications: number;
  records: number;
  groups: number;
  storage_problem: string | null;
};
type AddResult = { record: RecordRow; group: { display_name: string } | null; created_group: boolean; replayed: boolean };

const PAGE_SIZE = 25;
const blank = { locality_name: "", pincode: "", zone: "" };

function validate(f: typeof blank) {
  const errors: Partial<Record<keyof typeof blank, string>> = {};
  const name = f.locality_name.trim().replace(/\s+/g, " ");
  if (!name) errors.locality_name = "Locality name is required.";
  else if (name.length > 120) errors.locality_name = "Locality name must be at most 120 characters.";
  else if (!/[A-Za-z]/.test(name)) errors.locality_name = "Locality name must contain letters.";
  if (!/^\d{6}$/.test(f.pincode.trim())) errors.pincode = "PIN code must be exactly six digits.";
  if (!(AGENT_ZONES as readonly string[]).includes(f.zone)) errors.zone = "Choose North, Central or South Chennai.";
  return errors;
}

export function AgentLocationsPanel({ canManage }: { canManage: boolean }) {
  const [q, setQ] = useState("");
  const [zone, setZone] = useState("");
  const [pincode, setPincode] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(blank);
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // One key per form session: a double click or network retry of the same
  // submission is recognised by the server and never creates a second record.
  const idemKey = useRef<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [rows, st] = await Promise.all([
        apiGet<Page>("/admin/location-master", { q: q.trim() || undefined, zone: zone || undefined, pincode: pincode || undefined, page, page_size: PAGE_SIZE }),
        apiGet<Status>("/admin/location-master/status"),
      ]);
      setData(rows);
      setStatus(st);
    } catch (e) {
      setLoadError(isApiError(e) && e.detail ? e.detail : "Couldn't load agent locations.");
    } finally {
      setLoading(false);
    }
  }, [q, zone, pincode, page]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const errors = useMemo(() => validate(form), [form]);
  const openAdd = () => {
    setForm(blank);
    setTouched(false);
    setSaveError(null);
    idemKey.current = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    setAdding(true);
  };

  const submit = async () => {
    setTouched(true);
    if (Object.keys(errors).length || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await apiRequest<AddResult>("/admin/location-master", {
        method: "POST",
        body: { locality_name: form.locality_name.trim(), pincode: form.pincode.trim(), zone: form.zone },
        headers: { "Idempotency-Key": idemKey.current },
      });
      toast.success(
        res.created_group
          ? `${res.record.locality_name} added as a new location (PIN ${res.record.pincode}).`
          : `${res.record.locality_name} added to PIN ${res.record.pincode}.`,
      );
      setAdding(false);
      setPage(1);
      load();
    } catch (e) {
      // Never report success unless the server confirmed the addition.
      setSaveError(isApiError(e) && e.detail ? e.detail : "The location could not be added. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;
  const showErr = (k: keyof typeof blank) => touched && errors[k];

  return (
    <Card className="mt-5">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#eef2f7] px-5 py-4">
        <div>
          <h3 className="text-sm font-extrabold text-[#16233d]">Agent Locations</h3>
          <p className="mt-1 max-w-2xl text-xs text-[#6b7b93]">
            The location master agents choose from: one option per PIN code, grouping every locality that shares it. Add
            localities one at a time. Bulk import is disabled.
          </p>
          {status && (
            <p className="mt-1 text-[11px] font-semibold text-[#8896aa]">
              {status.records} localities · {status.groups} PIN codes · published v{status.published_version}
              {status.pending_publications > 0 && <span className="ml-2 text-amber-600">· {status.pending_publications} pending</span>}
            </p>
          )}
        </div>
        {canManage && (
          <button type="button" className={btnPrimary} onClick={openAdd} disabled={!!status?.blocked_reason || !!status?.storage_problem}>
            <Plus size={14} /> Add location
          </button>
        )}
      </div>

      {(status?.blocked_reason || status?.storage_problem) && (
        <div className="mx-5 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          {status.blocked_reason
            ? `Additions are paused: ${status.blocked_reason} An operator must review the quarantined workbook.`
            : "Location management is not configured on this server."}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a1adc0]" />
          <input
            className={`${inputCls} pl-8`}
            placeholder="Search locality name"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            aria-label="Search locality name"
          />
        </div>
        <input
          className={`${inputCls} w-32`}
          placeholder="PIN code"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setPage(1);
          }}
          aria-label="Filter by PIN code"
        />
        <select
          className={selectCls}
          value={zone}
          onChange={(e) => {
            setZone(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by zone"
        >
          <option value="">All zones</option>
          {AGENT_ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {loadError && (
        <div className="px-5 pb-4 text-xs font-semibold text-red-600">
          {loadError}{" "}
          <button type="button" className="underline" onClick={load}>
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="bg-[#f8fafd] text-[10px] font-extrabold uppercase tracking-wide text-[#8896aa]">
            <tr>
              <th className="px-5 py-3">Record</th>
              <th className="px-4 py-3">Locality</th>
              <th className="px-4 py-3">PIN code</th>
              <th className="px-4 py-3">Zone</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {loading && !data && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[#8896aa]">
                  Loading…
                </td>
              </tr>
            )}
            {data?.items.map((r) => (
              <tr key={r.record_id} className="border-t border-[#f0f3f8]">
                <td className="px-5 py-2.5 font-semibold text-[#8896aa]">{r.record_id}</td>
                <td className="px-4 py-2.5 font-bold text-[#22324d] break-words">
                  <MapPin size={12} className="mr-1 inline text-[#087ed9]" />
                  {r.locality_name}
                  {!r.published && <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">Publishing</span>}
                </td>
                <td className="px-4 py-2.5 font-mono">{r.pincode}</td>
                <td className="px-4 py-2.5">{r.zone}</td>
                <td className="px-4 py-2.5 text-[#8896aa]">{r.source === "SEED" ? "Original" : "Added"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data && data.items.length === 0 && <EmptyState title="No locations match" hint="Try another name, PIN code or zone." />}
      </div>

      {data && data.total > data.page_size && (
        <div className="flex items-center justify-between px-5 py-3 text-xs text-[#6b7b93]">
          <span>
            {data.total} records · page {data.page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button type="button" className={btnSecondary} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </button>
            <button type="button" className={btnSecondary} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        open={adding}
        onClose={() => !saving && setAdding(false)}
        title="Add agent location"
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setAdding(false)} disabled={saving}>
              <X size={14} /> Cancel
            </button>
            <button type="button" className={btnPrimary} onClick={submit} disabled={saving}>
              {saving ? "Saving…" : "Add location"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block">
            <span className="text-[11px] font-bold text-[#34445f]">Locality name *</span>
            <input
              className={inputCls}
              value={form.locality_name}
              maxLength={120}
              onChange={(e) => setForm({ ...form, locality_name: e.target.value })}
              aria-invalid={!!showErr("locality_name")}
              autoFocus
            />
            {showErr("locality_name") && <span className="mt-1 block text-[11px] text-red-600">{errors.locality_name}</span>}
          </label>
          <label className="block">
            <span className="text-[11px] font-bold text-[#34445f]">PIN code *</span>
            <input
              className={inputCls}
              value={form.pincode}
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
              aria-invalid={!!showErr("pincode")}
            />
            {showErr("pincode") && <span className="mt-1 block text-[11px] text-red-600">{errors.pincode}</span>}
          </label>
          <label className="block">
            <span className="text-[11px] font-bold text-[#34445f]">Chennai zone *</span>
            <select
              className={`${selectCls} w-full`}
              value={form.zone}
              onChange={(e) => setForm({ ...form, zone: e.target.value })}
              aria-invalid={!!showErr("zone")}
            >
              <option value="">Select zone</option>
              {AGENT_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            {showErr("zone") && <span className="mt-1 block text-[11px] text-red-600">{errors.zone}</span>}
          </label>
          <p className="text-[11px] text-[#8896aa]">
            If the PIN code already exists, this locality joins that location (agents who chose it keep their selection).
            Otherwise a new location is created.
          </p>
          {saveError && <div className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{saveError}</div>}
        </div>
      </Modal>
    </Card>
  );
}
