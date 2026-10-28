export type EnquiryStatus = "Active" | "Addressed" | "Archived";

export type EnquiryType =
  | "Contact Owner Request"
  | "Price & Payment Query"
  | "Floor Plan & Brochure"
  | "Availability Check"
  | "General Enquiry";

export type EnquiryChannel = "Web Portal" | "Mobile App" | "WhatsApp Direct" | "Phone Call";

export interface EnquiryBuyerInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
  isKycVerified?: boolean;
}

export interface EnquiryPropertyInfo {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  thumbnail?: string;
}

export interface Enquiry {
  id: string; // e.g. "ENQ-1001"
  buyer: EnquiryBuyerInfo;
  property: EnquiryPropertyInfo;
  type: EnquiryType;
  status: EnquiryStatus;
  channel: EnquiryChannel;
  message: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryFilters {
  search: string;
  status: "all" | EnquiryStatus;
  type: "all" | EnquiryType;
  sortBy: "recent" | "price_desc" | "status";
}
