"use client";

import React, { useState } from "react";
import { Plus, X, MessageSquare } from "lucide-react";
import {
  Enquiry,
  EnquiryType,
  EnquiryChannel,
  EnquiryStatus,
} from "@/types/enquiry";
import { usePropertyStore } from "@/context/property-context";

interface EnquiryAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    newEnquiry: Omit<Enquiry, "id" | "createdAt" | "updatedAt">
  ) => void;
}

export function EnquiryAddModal({ isOpen, onClose, onAdd }: EnquiryAddModalProps) {
  const { properties } = usePropertyStore();

  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("+91 ");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerCity, setBuyerCity] = useState("Chennai");
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    properties[0]?.id || "RST-1024"
  );
  const [type, setType] = useState<EnquiryType>("Contact Owner Request");
  const [channel, setChannel] = useState<EnquiryChannel>("Phone Call");
  const [status, setStatus] = useState<EnquiryStatus>("Active");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProp =
      properties.find((p) => p.id === selectedPropertyId) || properties[0];

    const newLead: Omit<Enquiry, "id" | "createdAt" | "updatedAt"> = {
      buyer: {
        name: buyerName,
        phone: buyerPhone,
        email: buyerEmail,
        city: buyerCity,
        isKycVerified: false,
      },
      property: {
        id: selectedProp?.id || "RST-1024",
        title: selectedProp?.title || "Residential Property",
        location: `${selectedProp?.locality || "Chennai"}, ${selectedProp?.city || "Tamil Nadu"}`,
        type: `${selectedProp?.type || "Apartment"} · ${selectedProp?.bhk || 3} BHK`,
        price: selectedProp?.price || 12500000,
        ownerName: selectedProp?.owner?.name || "Verified Owner",
        ownerPhone: selectedProp?.owner?.phone || "+91 98400 12345",
        ownerEmail: selectedProp?.owner?.email || "owner@restamp.com",
        thumbnail: selectedProp?.images?.[0] || "",
      },
      type,
      status,
      channel,
      message: message || "Buyer enquired via direct lead desk.",
      adminNotes: "Logged manually by platform administrator.",
    };

    onAdd(newLead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#e8ecf4] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f4f9] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f4ff] text-[#162d66]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101828]">
                Log Inbound Buyer Lead
              </h2>
              <p className="text-xs text-[#64748b]">
                Record an inquiry received via phone, WhatsApp, or walk-in.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#101828]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Buyer Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Buyer Full Name *
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Arun Prakash"
                className="w-full rounded-xl border border-[#e8ecf4] p-2 text-xs text-[#101828] focus:border-[#162d66] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full rounded-xl border border-[#e8ecf4] p-2 text-xs text-[#101828] focus:border-[#162d66] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="buyer@gmail.com"
                className="w-full rounded-xl border border-[#e8ecf4] p-2 text-xs text-[#101828] focus:border-[#162d66] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={buyerCity}
                onChange={(e) => setBuyerCity(e.target.value)}
                placeholder="e.g. Chennai"
                className="w-full rounded-xl border border-[#e8ecf4] p-2 text-xs text-[#101828] focus:border-[#162d66] focus:outline-none"
              />
            </div>
          </div>

          {/* Property Selector */}
          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Target Property *
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full rounded-xl border border-[#e8ecf4] p-2 text-xs text-[#101828] focus:border-[#162d66] focus:outline-none"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.locality}) — ₹
                  {(p.price / 100000).toFixed(1)}L · Owner: {p.owner.name}
                </option>
              ))}
            </select>
          </div>

          {/* Inquiry Type & Channel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Inquiry Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EnquiryType)}
                className="w-full rounded-xl border border-[#e8ecf4] p-2 text-xs text-[#101828] focus:border-[#162d66] focus:outline-none"
              >
                <option value="Contact Owner Request">Contact Owner Request</option>
                <option value="Price & Payment Query">Price & Payment Query</option>
                <option value="Floor Plan & Brochure">Floor Plan & Brochure</option>
                <option value="Availability Check">Availability Check</option>
                <option value="General Enquiry">General Enquiry</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#334155] mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as EnquiryChannel)}
                className="w-full rounded-xl border border-[#e8ecf4] p-2 text-xs text-[#101828] focus:border-[#162d66] focus:outline-none"
              >
                <option value="Phone Call">Direct Phone Call</option>
                <option value="WhatsApp Direct">WhatsApp Direct</option>
                <option value="Web Portal">Web Portal</option>
                <option value="Mobile App">Mobile App</option>
              </select>
            </div>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Initial Lead Status
            </label>
            <div className="flex gap-2">
              {(["Active", "Addressed", "Archived"] as EnquiryStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`flex-1 rounded-xl py-1.5 text-xs font-semibold border ${
                      status === st
                        ? "bg-[#162d66] text-white border-[#162d66]"
                        : "bg-white text-[#475467] border-[#e8ecf4] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Message / Remarks */}
          <div>
            <label className="block font-medium text-[#334155] mb-1">
              Buyer Message / Query
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did the buyer enquire about?"
              className="w-full rounded-xl border border-[#e8ecf4] p-2 text-xs text-[#101828] focus:border-[#162d66] focus:outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#f1f4f9] pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#e8ecf4] px-4 py-2 text-xs font-semibold text-[#475467] hover:bg-[#f8fafc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#162d66] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0f1f47]"
            >
              <Plus className="h-4 w-4" />
              <span>Save Inbound Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
