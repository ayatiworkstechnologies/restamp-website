"use client";

import React, { useMemo, useState } from "react";
import { Eye, EyeOff, MapPin, Pencil, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/dashboard/admin-shell";
import { Card, EmptyState, Modal, btnPrimary, btnSecondary, inputCls, selectCls, useActor } from "@/components/subscriptions/ui";
import { confirmDialog } from "@/components/common/confirm-dialog";
import { toast } from "@/lib/notify";
import { properties } from "@/data/properties";
import { getDealerSubscription } from "@/lib/dealerPlan";
import {
  LOCATION_REGIONS,
  OPERATING_CITY,
  addLocation,
  deleteLocation,
  matchesLocation,
  resetLocations,
  updateLocation,
  useLocations,
  type Location,
  type LocationInput,
} from "@/lib/locations";

const DEMAND: Location["demandIntensity"][] = ["Very High", "High", "Moderate"];
const blank: LocationInput = { name: "", region: "South & OMR", tag: "", demandIntensity: "High", demandScore: 80, avgTicketPrice: "", activeBuyers: 0, active: true };

export default function LocationsPage() {
  const locations = useLocations();
  const { canManage } = useActor();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<"all" | Location["region"]>("all");
  const [show, setShow] = useState<"all" | "active" | "hidden">("all");
  const [editing, setEditing] = useState<Location | null>(null);
  const [adding, setAdding] = useState(false);

  const listingCount = useMemo(() => {
    const m = new Map<string, number>();
    locations.forEach((l) => m.set(l.id, properties.filter((p) => matchesLocation(l.name, p.locality, p.area, p.address)).length));
    return m;
  }, [locations]);

  const dealerAreas = useMemo(() => {
    try {
      return (getDealerSubscription()?.selectedLocations ?? []).map((s) => s.toLowerCase());
    } catch {
      return [];
    }
  }, []);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return locations.filter(
      (l) =>
        (region === "all" || l.region === region) &&
        (show === "all" || (show === "active" ? l.active : !l.active)) &&
        (!s || `${l.name} ${l.tag} ${l.region}`.toLowerCase().includes(s)),
    );
  }, [locations, q, region, show]);

  const toggle = (l: Location) => {
    updateLocation(l.id, { active: !l.active });
    toast.success(l.active ? `${l.name} hidden from the website` : `${l.name} is live on the website`);
  };

  const remove = async (l: Location) => {
    const ok = await confirmDialog({
      title: "Delete location",
      body: `Delete "${l.name}"? It disappears from website filters and new dealer packages. Dealers who already bought it keep it until their package ends. To pause it instead, hide it.`,
    });
    if (!ok) return;
    deleteLocation(l.id);
    toast.success(`${l.name} deleted`);
  };

  const reset = async () => {
    const ok = await confirmDialog({
      title: "Reset locations",
      body: "Replace the list with the original 22 Chennai locations? Locations you added or edited will be lost.",
      confirmLabel: "Reset",
    });
    if (!ok) return;
    resetLocations();
    toast.info("Locations reset to the default Chennai list");
  };

  const active = locations.filter((l) => l.active).length;

  return (
    <AdminShell section="Management" title="Locations">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#16233d]">Chennai Locations</h2>
          <p className="mt-1 max-w-2xl text-xs text-[#6b7b93]">
            Restamp operates in {OPERATING_CITY} only. These locations appear in the website search filters, dealer locality packages and the dealer Sales Hub.
            Hide a location to pause it without deleting it.
          </p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <button type="button" className={btnSecondary} onClick={reset}>
              <RotateCcw size={14} /> Reset
            </button>
            <button type="button" className={btnPrimary} onClick={() => setAdding(true)}>
              <Plus size={14} /> Add location
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Total locations", locations.length],
          ["Live on website", active],
          ["Hidden", locations.length - active],
          ["Regions", new Set(locations.map((l) => l.region)).size],
        ].map(([k, v]) => (
          <Card key={k as string} className="p-4">
            <div className="text-[12px] font-semibold text-[#8896aa]">{k}</div>
            <div className="mt-1 text-[26px] font-extrabold tracking-[-0.04em] text-[#16233d]">{v}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-[#f1f4f9] p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9da9bc]" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search locations"
              className="w-full rounded-xl border border-[#e2e8f2] bg-[#fbfcfe] h-9 py-2 pl-9 pr-3 text-xs font-medium text-[#22324d] outline-none placeholder:text-[#a1adc0] focus:border-[#087ed9] focus:bg-white"
            />
          </div>
          <select aria-label="Region" value={region} onChange={(e) => setRegion(e.target.value as typeof region)} className={selectCls}>
            <option value="all">All regions</option>
            {LOCATION_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select aria-label="Visibility" value={show} onChange={(e) => setShow(e.target.value as typeof show)} className={selectCls}>
            <option value="all">Live & hidden</option>
            <option value="active">Live only</option>
            <option value="hidden">Hidden only</option>
          </select>
          {(q || region !== "all" || show !== "all") && (
            <button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-[#087ed9]" onClick={() => { setQ(""); setRegion("all"); setShow("all"); }}>
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {shown.length === 0 ? (
          <EmptyState title="No locations match" hint="Try another search or region, or add a new location." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-xs">
              <thead>
                <tr className="bg-[#fafbfd] text-[10px] font-bold uppercase tracking-wider text-[#8896aa]">
                  <th className="px-4 py-3">Location</th>
                  <th className="px-3 py-3">Region</th>
                  <th className="px-3 py-3">Demand</th>
                  <th className="px-3 py-3">Avg ticket</th>
                  <th className="px-3 py-3">Listings</th>
                  <th className="px-3 py-3">Status</th>
                  {canManage && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f9]">
                {shown.map((l) => (
                  <tr key={l.id} className={l.active ? "hover:bg-[#fafcff]" : "bg-[#fbfbfc] text-[#9aa7bb]"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className={l.active ? "text-[#1B459B]" : "text-[#b6c0cf]"} />
                        <span className="font-bold text-[#1f2e48]">{l.name}</span>
                        {dealerAreas.includes(l.name.toLowerCase()) && (
                          <span className="rounded-full bg-[#eef3fc] px-2 py-0.5 text-[10px] font-bold text-[#1B459B]">Dealer area</span>
                        )}
                      </div>
                      {l.tag && <div className="ml-[22px] text-[11px] text-[#8090a6]">{l.tag}</div>}
                    </td>
                    <td className="px-3 py-3 text-[#4b5b74]">{l.region}</td>
                    <td className="px-3 py-3">
                      <span className="font-semibold text-[#24324b]">{l.demandIntensity}</span>
                      <span className="ml-1 text-[#8090a6]">· {l.demandScore}</span>
                    </td>
                    <td className="px-3 py-3 text-[#4b5b74]">{l.avgTicketPrice || "—"}</td>
                    <td className="px-3 py-3 text-[#4b5b74]">{listingCount.get(l.id) ?? 0}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${l.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {l.active ? "Live" : "Hidden"}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <IconBtn label={l.active ? "Hide" : "Show"} onClick={() => toggle(l)}>
                            {l.active ? <EyeOff size={14} /> : <Eye size={14} />}
                          </IconBtn>
                          <IconBtn label="Edit" onClick={() => setEditing(l)}>
                            <Pencil size={14} />
                          </IconBtn>
                          <IconBtn label="Delete" danger onClick={() => remove(l)}>
                            <Trash2 size={14} />
                          </IconBtn>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {(adding || editing) && (
        <LocationForm
          key={editing?.id ?? "new"}
          initial={editing ?? blank}
          editing={!!editing}
          onClose={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSave={(input) => {
            if (editing) {
              updateLocation(editing.id, input);
              toast.success(`${input.name} updated`);
            } else {
              addLocation(input);
              toast.success(`${input.name} added`, { description: input.active ? "It is now live on the website." : "It is hidden until you show it." });
            }
            setAdding(false);
            setEditing(null);
          }}
        />
      )}
    </AdminShell>
  );
}

function IconBtn({ label, danger, onClick, children }: { label: string; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
        danger ? "border-[#fecaca] bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2]" : "border-[#e2e8f2] bg-white text-[#4b5b74] hover:border-[#1B459B] hover:text-[#1B459B]"
      }`}
    >
      {children}
    </button>
  );
}

function LocationForm({ initial, editing, onClose, onSave }: { initial: LocationInput; editing: boolean; onClose: () => void; onSave: (v: LocationInput) => void }) {
  const [v, setV] = useState<LocationInput>({
    name: initial.name,
    region: initial.region,
    tag: initial.tag,
    demandIntensity: initial.demandIntensity,
    demandScore: initial.demandScore,
    avgTicketPrice: initial.avgTicketPrice,
    activeBuyers: initial.activeBuyers,
    active: initial.active ?? true,
  });
  const [error, setError] = useState("");
  const set = <K extends keyof LocationInput>(k: K, val: LocationInput[K]) => setV((p) => ({ ...p, [k]: val }));

  const submit = () => {
    try {
      onSave({ ...v, demandScore: Math.max(0, Math.min(100, Number(v.demandScore) || 0)), activeBuyers: Math.max(0, Number(v.activeBuyers) || 0) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    }
  };

  const label = "mb-1 block text-[11px] font-bold text-[#344560]";
  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? "Edit location" : "Add location"}
      footer={
        <>
          <button type="button" className={btnSecondary} onClick={onClose}>Cancel</button>
          <button type="button" className={btnPrimary} onClick={submit}>{editing ? "Save changes" : "Add location"}</button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className={label}>Location name *</span>
          <input autoFocus value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Ambattur & Padi" className={inputCls} />
          <span className="mt-1 block text-[11px] text-[#8090a6]">Join nearby areas with &ldquo;&amp;&rdquo; so listings from either area match.</span>
        </label>
        <label>
          <span className={label}>City</span>
          <input value={OPERATING_CITY} disabled className={`${inputCls} opacity-70`} />
        </label>
        <label>
          <span className={label}>Region</span>
          <select value={v.region} onChange={(e) => set("region", e.target.value as LocationInput["region"])} className={`${selectCls} w-full`}>
            {LOCATION_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className={label}>Short tag</span>
          <input value={v.tag} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. Industrial hub" className={inputCls} />
        </label>
        <label>
          <span className={label}>Demand</span>
          <select value={v.demandIntensity} onChange={(e) => set("demandIntensity", e.target.value as LocationInput["demandIntensity"])} className={`${selectCls} w-full`}>
            {DEMAND.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label>
          <span className={label}>Demand score (0–100)</span>
          <input type="number" min={0} max={100} value={v.demandScore} onChange={(e) => set("demandScore", Number(e.target.value))} className={inputCls} />
        </label>
        <label>
          <span className={label}>Average ticket price</span>
          <input value={v.avgTicketPrice} onChange={(e) => set("avgTicketPrice", e.target.value)} placeholder="e.g. ₹85 L" className={inputCls} />
        </label>
        <label>
          <span className={label}>Active buyers</span>
          <input type="number" min={0} value={v.activeBuyers} onChange={(e) => set("activeBuyers", Number(e.target.value))} className={inputCls} />
        </label>
        <label className="flex items-center gap-2 sm:col-span-2">
          <input type="checkbox" checked={!!v.active} onChange={(e) => set("active", e.target.checked)} />
          <span className="text-xs font-semibold text-[#344560]">Live on the website</span>
        </label>
      </div>
      {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
    </Modal>
  );
}
