export type UserRole = "buyer" | "owner" | "dealer";

/** Owners and dealers both list properties. */
export const isLister = (u: { role: UserRole }) => u.role !== "buyer";

/** Migrates legacy records where dealers were stored as owners with ownerType "Dealer / Broker". */
export function normalizeUserRole<T extends { role: UserRole; ownerType?: OwnerType }>(u: T): T {
  let out = u;
  // Legacy "agent" role and "Agent / Broker" type were renamed to dealer.
  if ((out.role as string) === "agent") out = { ...out, role: "dealer" };
  if ((out.ownerType as string) === "Agent / Broker") out = { ...out, ownerType: "Dealer / Broker" };
  if (out.role === "owner" && out.ownerType === "Dealer / Broker") out = { ...out, role: "dealer" };
  // KYC removed: accounts previously parked in "Pending KYC" are active.
  if ((out as { status?: string }).status === "Pending KYC") out = { ...out, status: "Active" };
  return out;
}

export type UserStatus = "Active" | "Suspended" | "Inactive";

export type KycStatus = "Verified" | "Pending" | "Rejected" | "Not Submitted";

export type OwnerType = "Individual Owner" | "Dealer / Broker" | "Builder / Developer";

export interface KycDocument {
  id: string;
  type: "Aadhaar Card" | "PAN Card" | "RERA Dealer Certificate" | "Company Incorporation";
  documentNumber: string;
  fileUrl: string;
  fileSize: string;
  status: KycStatus;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface BuyerPreferences {
  budgetMin: number; // in INR
  budgetMax: number; // in INR
  preferredTypes: string[]; // e.g. ["Apartment", "Villa"]
  preferredLocalities: string[]; // e.g. ["Adyar", "Anna Nagar", "OMR"]
  preferredBhk: string[]; // e.g. ["2 BHK", "3 BHK"]
  purpose: "Self Use" | "Investment" | "Rental Income";
  timeline: "Immediate (0-1 Month)" | "1-3 Months" | "3-6 Months" | "Exploring";
}

export interface BuyerEnquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  locality: string;
  price: number;
  type: "Site Visit Request" | "Price Negotiation" | "Floor Plan Request" | "General Enquiry";
  message: string;
  status: "New" | "Contacted" | "Visit Scheduled" | "Closed";
  date: string;
}

export interface UserAuditEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export interface UserAdminNote {
  id: string;
  adminName: string;
  content: string;
  timestamp: string;
}

export interface User {
  id: string; // e.g. "USR-0941"
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  initials: string;
  tint: string;
  role: UserRole;
  status: UserStatus;
  /** Legacy seed data only. The KYC process has been removed from the product. */
  kycStatus?: KycStatus;
  city: string;
  state: string;
  joinedDate: string;
  lastActive: string;
  emailVerified: boolean;
  phoneVerified: boolean;

  // Specific to Owners / Sellers
  ownerType?: OwnerType;
  companyName?: string; // for brokers/builders
  reraRegistrationNumber?: string;
  totalListingsCount?: number;
  activeListingsCount?: number;
  listedPropertyIds?: string[]; // IDs of properties in the marketplace

  // Specific to Buyers
  buyerPreferences?: BuyerPreferences;
  enquiries?: BuyerEnquiry[];
  savedPropertyIds?: string[];

  // Verification & Compliance
  /** Legacy seed data only. Not shown or used. */
  kycDocuments?: KycDocument[];
  adminNotes: UserAdminNote[];
  auditLog: UserAuditEntry[];
  suspensionReason?: string;
}

export interface UserFilters {
  search: string;
  role: "all" | UserRole;
  status: "all" | UserStatus;
  ownerType?: "all" | OwnerType;
  city?: string;
  sortBy: "recent" | "name_asc" | "listings_desc" | "enquiries_desc";
}
