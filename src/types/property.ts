export type PropertyStatus = "Pending" | "Active" | "Rejected" | "Draft";

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Independent House"
  | "Penthouse"
  | "Plot"
  | "Commercial";

export type FurnishingStatus = "Unfurnished" | "Semi-Furnished" | "Fully Furnished";

export interface PropertyOwner {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isKycVerified: boolean;
  accountType: "Individual Owner" | "Agent / Broker" | "Builder / Developer";
  joinedDate: string;
  totalListings: number;
}

export interface PropertyDocument {
  id: string;
  title: string;
  type:
    | "Title Deed"
    | "Encumbrance Certificate"
    | "Property Tax Receipt"
    | "Building Approval"
    | "RERA Certificate"
    | "Layout Approval";
  fileUrl: string;
  fileSize: string;
  status: "Verified" | "Pending" | "Rejected";
  uploadedAt: string;
}

export interface AdminChecklist {
  legalDocumentsVerified: boolean;
  pricingValidated: boolean;
  physicalInspectionDone: boolean;
  highResolutionPhotos: boolean;
  ownerIdentityConfirmed: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  role: string;
  timestamp: string;
  notes?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  bhk: number;
  bathrooms: number;
  balconies: number;
  carpetAreaSqFt: number;
  superBuiltUpAreaSqFt: number;
  price: number;
  maintenanceFeeMonthly?: number;
  bookingAmount?: number;
  status: PropertyStatus;
  locality: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  furnishing: FurnishingStatus;
  floor: string;
  totalFloors: number;
  facing: "East" | "North" | "South" | "West" | "North-East" | "North-West";
  parking: string;
  ageOfProperty: string;
  possessionStatus: "Ready to Move" | "Under Construction" | "Immediate";
  possessionDate?: string;
  reraId?: string;
  reraVerified: boolean;
  featured: boolean;
  verifiedBadge: boolean;
  images: string[];
  amenities: string[];
  owner: PropertyOwner;
  documents: PropertyDocument[];
  adminChecklist: AdminChecklist;
  auditLog: AuditLogEntry[];
  submittedAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  rejectionCategory?: string;
  approvalNotes?: string;
  initials?: string;
  tint?: string;
}

export interface PropertyFilters {
  search: string;
  status: "All" | PropertyStatus;
  type: "All" | PropertyType;
  bhk: "All" | "1" | "2" | "3" | "4+";
  minPrice?: number;
  maxPrice?: number;
  sortBy: "newest" | "price_asc" | "price_desc" | "title_asc";
  verifiedOnly: boolean;
  featuredOnly: boolean;
}
