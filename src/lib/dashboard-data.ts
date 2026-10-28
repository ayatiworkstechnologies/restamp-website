/**
 * PHASE 1 DEMO DATA ONLY
 * These are placeholder records; they are NOT read from the RESTAMP app.
 * Replace this file with authenticated API requests in a later phase.
 */
export type PropertyStatus = "Active" | "Pending" | "Rejected";

export type Property = {
  id: string;
  title: string;
  location: string;
  type: string;
  owner: string;
  price: number;
  status: PropertyStatus;
  submitted: string;
  initials: string;
  tint: string;
};

export const properties: Property[] = [
  { id: "RST-1024", title: "Lakeside Premium Apartment", location: "Adyar, Chennai", type: "Apartment · 3 BHK", owner: "Arun Kumar", price: 12500000, status: "Pending", submitted: "28 Oct 2026", initials: "LA", tint: "#E6EBFF" },
  { id: "RST-1023", title: "Urban Heights Residence", location: "Anna Nagar, Chennai", type: "Apartment · 2 BHK", owner: "Priya S", price: 8600000, status: "Active", submitted: "27 Oct 2026", initials: "UH", tint: "#E7F3EC" },
  { id: "RST-1022", title: "Greenview Independent Villa", location: "Velachery, Chennai", type: "Villa · 4 BHK", owner: "Dinesh R", price: 23000000, status: "Pending", submitted: "27 Oct 2026", initials: "GV", tint: "#FDF0DB" },
  { id: "RST-1021", title: "Metro Edge Homes", location: "OMR, Chennai", type: "Apartment · 2 BHK", owner: "Meera N", price: 7300000, status: "Active", submitted: "26 Oct 2026", initials: "ME", tint: "#E2F1F5" },
  { id: "RST-1020", title: "Parkside Family Home", location: "Tambaram, Chennai", type: "House · 3 BHK", owner: "Karthik P", price: 9800000, status: "Rejected", submitted: "25 Oct 2026", initials: "PF", tint: "#F8E8E8" },
  { id: "RST-1019", title: "Sunrise City Apartment", location: "Sholinganallur, Chennai", type: "Apartment · 2 BHK", owner: "Lakshmi V", price: 6900000, status: "Active", submitted: "24 Oct 2026", initials: "SC", tint: "#F3EAF7" },
];

export const monthlyListings = [
  { month: "May", count: 28 },
  { month: "Jun", count: 39 },
  { month: "Jul", count: 35 },
  { month: "Aug", count: 54 },
  { month: "Sep", count: 46 },
  { month: "Oct", count: 66 },
];

export const activities = [
  { id: 1, title: "New property submitted", description: "Lakeside Premium Apartment", time: "10 min ago", kind: "property" },
  { id: 2, title: "New owner registered", description: "A new account is awaiting verification", time: "35 min ago", kind: "user" },
  { id: 3, title: "Buyer enquiry received", description: "Enquiry for Urban Heights Residence", time: "1 hour ago", kind: "enquiry" },
  { id: 4, title: "Property listing approved", description: "Metro Edge Homes", time: "3 hours ago", kind: "approval" },
] as const;

export const approvalQueue = [
  { id: "RST-1024", title: "Lakeside Premium Apartment", type: "Property approval", detail: "Submitted today", initials: "LA" },
  { id: "USR-0088", title: "Owner profile verification", type: "Account verification", detail: "Submitted today", initials: "OV" },
  { id: "RST-1022", title: "Greenview Independent Villa", type: "Property approval", detail: "Submitted yesterday", initials: "GV" },
];
