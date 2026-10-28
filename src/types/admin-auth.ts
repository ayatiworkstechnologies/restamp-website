export interface AdminSession {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'Super Admin' | 'Operations Manager' | 'Listing Reviewer' | 'Support Specialist' | 'Administrator';
  department: string;
  avatar?: string;
  token?: string;
  lastLogin: string;
}

export interface AdminAuthContextType {
  admin: AdminSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithMobile: (mobile: string, otp: string) => boolean;
  loginQuick: (adminId: string) => boolean;
  logout: () => void;
}
