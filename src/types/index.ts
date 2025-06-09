export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
}

export interface FormData {
  id: string;
  title: string;
  service: string;
  status: 'draft' | 'completed' | 'in-progress';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  data: Record<string, any>;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUserPassword?: (userId: string, newPassword: string) => boolean;
  isAuthenticated: boolean;
}

export interface VisitData {
  timestamp: Date;
  page: string;
  userAgent: string;
  referrer: string;
  ip: string;
  country: string;
}

export interface VisitStats {
  today: number;
  thisMonth: number;
  thisYear: number;
  totalVisits: number;
  lastUpdated: string;
}