"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Calendar,
  CreditCard,
  Phone,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Crown,
  ShieldCheck,
  Lock,
  Filter,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { getProfile } from '@/lib/profile';
import {
  getAgentSubscription,
  canAgentAccessLocation,
  seedExistingPartnerSubscription,
  type AgentSubscription,
} from '@/lib/agentPlan';
import { getAgentCatalogProperties, type AgentPropertyItem } from '@/lib/agent-data';

export default function AgentDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [sub, setSub] = useState<AgentSubscription | null>(null);
  const [properties, setProperties] = useState<AgentPropertyItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<'mandates' | 'leads'>('mandates');

  // Active micro-market filter (defaults to 'All' of the subscribed locations)
  const [activeLocFilter, setActiveLocFilter] = useState<string>('All');

  useEffect(() => {
    const p = getProfile();
    setProfile(p);

    let activeSub = getAgentSubscription();
    if (!activeSub && p?.mobile === '9840123456') {
      activeSub = seedExistingPartnerSubscription(p.mobile);
    }
    setSub(activeSub);

    setProperties(getAgentCatalogProperties().slice(0, 10));
  }, []);

  // Demo buyer leads with rich locality tagging
  const rawBuyerLeads = [
    {
      id: 'LD-801',
      buyerName: 'Ananya Krishnan',
      property: 'Lakeside Premium Apartment',
      locality: 'Adyar & Besant Nagar',
      city: 'Chennai',
      bhk: '3 BHK',
      budget: '₹1.25 Cr',
      readiness: 'Bank Pre-Approved (HDFC)',
      status: 'Site Visit Scheduled',
      time: '15 mins ago',
      phone: '+91 98414 55667',
    },
    {
      id: 'LD-802',
      buyerName: 'Rajesh Kannan',
      property: 'Greenwood Independent Villa',
      locality: 'OMR IT Corridor',
      city: 'Chennai',
      bhk: '4 BHK',
      budget: '₹2.40 Cr',
      readiness: 'Immediate Cash Down',
      status: 'Token Offer Made',
      time: '2 hours ago',
      phone: '+91 98400 11223',
    },
    {
      id: 'LD-803',
      buyerName: 'Venkatesh Prasad',
      property: 'Urban Heights Residence',
      locality: 'Anna Nagar',
      city: 'Chennai',
      bhk: '2 BHK',
      budget: '₹86.0 L',
      readiness: 'Sanction in Progress (SBI)',
      status: 'Callback Requested',
      time: '4 hours ago',
      phone: '+91 97910 22334',
    },
    {
      id: 'LD-804',
      buyerName: 'Meenakshi Sundaram',
      property: 'Skyline Sea View Residency',
      locality: 'ECR Beachside',
      city: 'Chennai',
      bhk: '4 BHK Villa',
      budget: '₹4.10 Cr',
      readiness: 'High Net Worth Liquid',
      status: 'New Inquiry',
      time: 'Yesterday',
      phone: '+91 98411 99887',
    },
    {
      id: 'LD-805',
      buyerName: 'Karthik Ramanathan',
      property: 'TechPark Signature Condos',
      locality: 'Sholinganallur',
      city: 'Chennai',
      bhk: '3 BHK',
      budget: '₹95.0 L',
      readiness: 'Pre-Approved (ICICI)',
      status: 'Site Visit Requested',
      time: 'Yesterday',
      phone: '+91 98402 33445',
    },
    {
      id: 'LD-806',
      buyerName: 'Deepa Narayanan',
      property: 'Grandeur Lake View',
      locality: 'Velachery',
      city: 'Chennai',
      bhk: '2.5 BHK',
      budget: '₹1.15 Cr',
      readiness: 'Self-Employed Loan Sanctioned',
      status: 'Document Negotiation',
      time: '2 days ago',
      phone: '+91 98405 66778',
    },
    {
      id: 'LD-807',
      buyerName: 'Suresh Babu',
      property: 'Silicon Valley Towers',
      locality: 'Whitefield',
      city: 'Bangalore',
      bhk: '3 BHK',
      budget: '₹1.85 Cr',
      readiness: 'Pre-Approved (HDFC)',
      status: 'Site Visit Scheduled',
      time: '2 days ago',
      phone: '+91 98800 12345',
    },
    {
      id: 'LD-808',
      buyerName: 'Pooja Reddy',
      property: 'Cyber Residency',
      locality: 'HITEC City',
      city: 'Hyderabad',
      bhk: '3 BHK',
      budget: '₹2.10 Cr',
      readiness: 'Cash Ready',
      status: 'Offer in Progress',
      time: '3 days ago',
      phone: '+91 97000 54321',
    },
  ];

  // Calculate validity
  const daysRemaining = sub?.expiresAt
    ? Math.max(0, Math.ceil((new Date(sub.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 76;

  // Subscribed locations list
  const subscribedLocations = sub?.selectedLocations || [];

  // Filter properties based on subscription location coverage
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Check if location is covered in active subscription
      const isSubscribedLoc = canAgentAccessLocation(prop.locality);
      if (activeLocFilter === 'All') return true;
      return prop.locality.toLowerCase().includes(activeLocFilter.toLowerCase());
    });
  }, [properties, activeLocFilter]);

  // Filter buyer leads based on subscription location coverage
  const filteredBuyerLeads = useMemo(() => {
    return rawBuyerLeads.filter((lead) => {
      if (activeLocFilter === 'All') return true;
      return lead.locality.toLowerCase().includes(activeLocFilter.toLowerCase());
    });
  }, [rawBuyerLeads, activeLocFilter]);

  return (
    <div className="space-y-8 animate-fade-in text-slate-900">
      {/* --- TOP PARTNER PROFILE & SUBSCRIPTION HERO BANNER --- */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Glow pill */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#087ed9]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <CheckCircle2 size={13} /> Payment Verified &amp; Active
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-200 text-xs font-bold">
                <Crown size={13} className="text-[#38bdf8]" />
                {sub?.badge || 'Growth Partner'} ({sub?.locationLimit || 10} Locations)
              </span>

              <span className="text-xs font-mono text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                RERA: {sub?.reraNumber || 'TN/AGENT/0491/2023'}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {sub?.firmName || profile?.name || 'Royal Realty Associates'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Partner: <strong className="text-white">{profile?.name || 'Arun Kumar'}</strong></span>
                <span>•</span>
                <span>Contact: <strong className="text-white">+91 {profile?.mobile || '98401 23456'}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">0% Commission Channel Partner</span>
              </p>
            </div>
          </div>

          {/* Quick Subscription Actions & Countdown */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="text-left lg:text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Subscription Validity
              </span>
              <p className="text-lg sm:text-xl font-black text-[#38bdf8]">
                {daysRemaining} Days Remaining
              </p>
              <p className="text-[11px] text-slate-400">
                Valid till {sub?.expiresAt ? new Date(sub.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '14 Jan 2027'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Link
                href="/agent/packages"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#087ed9] hover:bg-sky-500 text-white text-xs font-bold transition shadow-md"
              >
                <Sparkles size={14} /> Upgrade Locations
              </Link>

              <Link
                href="/agent/packages"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition"
              >
                <RefreshCw size={13} /> Renew Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- SUBSCRIBED LOCATIONS COVERAGE BAR --- */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="text-[#087ed9]" size={18} />
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Active Subscribed Micro-Markets ({subscribedLocations.length} Covered)
            </h3>
          </div>

          <Link
            href="/agent/packages"
            className="text-xs font-bold text-[#087ed9] hover:underline flex items-center gap-1"
          >
            <span>Expand Coverage / Add Locations</span> &rarr;
          </Link>
        </div>

        <p className="text-xs text-slate-500">
          Showing exclusive mandates and buyer inquiries for your active subscribed locations. Click any location to filter:
        </p>

        {/* Locality Chips Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveLocFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeLocFilter === 'All'
                ? 'bg-[#087ed9] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>All Covered ({subscribedLocations.length})</span>
          </button>

          {subscribedLocations.map((locName) => {
            const isSelected = activeLocFilter.toLowerCase() === locName.toLowerCase();
            return (
              <button
                key={locName}
                type="button"
                onClick={() => setActiveLocFilter(isSelected ? 'All' : locName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#087ed9] text-white shadow-2xs'
                    : 'bg-sky-50 text-[#087ed9] border border-sky-200/70 hover:bg-sky-100'
                }`}
              >
                <Check size={12} className={isSelected ? 'text-white' : 'text-[#087ed9]'} />
                <span>{locName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- 4 STAT METRIC CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Mandates</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#087ed9]">
              <Building2 size={18} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {properties.length} / {sub?.listingLimit || 25}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {(sub?.listingLimit || 25) - properties.length} slots available in tier
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Buyer Inquiries</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users size={18} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {filteredBuyerLeads.length} Hot Leads
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Direct WhatsApp verified</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Micro-Markets</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <MapPin size={18} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {subscribedLocations.length} Zones
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Tier limit: {sub?.locationLimit || 10} locations
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Cut</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard size={18} />
            </span>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">0% Cut</p>
          <p className="text-xs text-slate-400 mt-1">Retain 100% of your brokerage</p>
        </div>
      </div>

      {/* --- MAIN MANDATES & LEADS TABS --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              id="mandates"
              onClick={() => setSelectedTab('mandates')}
              className={`pb-3 -mb-3 text-sm font-bold border-b-2 transition cursor-pointer ${
                selectedTab === 'mandates'
                  ? 'border-[#087ed9] text-[#087ed9]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Mandate Listings ({filteredProperties.length})
            </button>

            <button
              type="button"
              id="leads"
              onClick={() => setSelectedTab('leads')}
              className={`pb-3 -mb-3 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'leads'
                  ? 'border-[#087ed9] text-[#087ed9]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Incoming Buyer Leads</span>
              <span className="bg-[#087ed9] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {filteredBuyerLeads.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeLocFilter !== 'All' && (
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                Filtered to: <strong className="text-slate-800">{activeLocFilter}</strong>
              </span>
            )}
            <Link
              href="/agent/packages"
              className="text-xs font-bold text-[#087ed9] hover:underline"
            >
              + Upgrade location slots
            </Link>
          </div>
        </div>

        {/* TAB 1: MANDATES */}
        {selectedTab === 'mandates' && (
          <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredProperties.map((prop) => {
                const isCovered = canAgentAccessLocation(prop.locality);
                return (
                  <div
                    key={prop.id}
                    className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                      isCovered ? 'hover:bg-slate-50/60' : 'bg-slate-50/40 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="h-16 w-20 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#087ed9] bg-sky-50 px-2 py-0.5 rounded-md uppercase">
                            {prop.purpose}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900">{prop.price}</span>
                          {isCovered ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Subscribed Zone
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Lock size={10} /> Upgrade Required
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 truncate mt-1">{prop.title}</h4>
                        <p className="text-xs text-slate-400 truncate">
                          {prop.bhk} • {prop.sqft} • {prop.locality}, {prop.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center shrink-0 text-xs">
                      <div className="text-right hidden md:block">
                        <span className="font-bold text-emerald-600 block">{prop.leadCount} Inquiries</span>
                        <span className="text-[11px] text-slate-400">RERA Locked</span>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        Active
                      </span>
                      <Link
                        href={`/buy/${prop.id}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BUYER LEADS */}
        {selectedTab === 'leads' && (
          <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Buyer Details</th>
                    <th className="px-5 py-3.5">Property / Locality</th>
                    <th className="px-5 py-3.5">Coverage Status</th>
                    <th className="px-5 py-3.5">Budget</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBuyerLeads.map((lead) => {
                    const isCovered = canAgentAccessLocation(lead.locality);
                    return (
                      <tr
                        key={lead.id}
                        className={`transition ${isCovered ? 'hover:bg-slate-50/50' : 'bg-slate-50/40 opacity-70'}`}
                      >
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">{lead.buyerName}</p>
                          <p className="text-[11px] text-slate-400">{lead.time}</p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">{lead.property}</p>
                          <p className="text-[11px] text-[#087ed9] font-medium flex items-center gap-1">
                            <MapPin size={11} /> {lead.locality}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {isCovered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 size={12} /> Active Zone
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold text-[11px]">
                              <Lock size={12} /> Outside Subscribed Zones
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 font-bold text-slate-900">
                          {lead.budget}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-sky-50 text-[#087ed9] text-[11px] font-bold">
                            {lead.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          {isCovered ? (
                            <div className="inline-flex items-center gap-2">
                              <a
                                href={`tel:${lead.phone.replace(/\s/g, '')}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 text-[#087ed9] hover:bg-[#087ed9] hover:text-white font-bold transition"
                              >
                                <Phone size={12} /> Call
                              </a>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold transition"
                              >
                                <MessageSquare size={12} /> WhatsApp
                              </a>
                            </div>
                          ) : (
                            <Link
                              href="/agent/packages"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold transition text-[11px]"
                            >
                              <Lock size={12} /> Unlock Lead
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
