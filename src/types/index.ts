// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  createdAt: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Toast Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// UI Types
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  toasts: Toast[];
  isOffline: boolean;
  activeModal: string | null;
}

// Bank Account Types
export interface BankAccount {
  id: string;
  monoAccountId: string;
  institutionName: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  currency: string;
  lastSyncedAt: string | null;
  isActive: boolean;
}

// Transaction Types
export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: 'debit' | 'credit';
  narration: string;
  date: string;
  balance: number;
  category: string;
  categorizationMethod: 'ai' | 'rule' | 'default';
  aiConfidence: number | null;
  isAnomaly: boolean;
  anomalyReason: string | null;
  anomalySeverity: 'low' | 'medium' | 'high' | null;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: 'debit' | 'credit';
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Insight Types
export interface MonthlyInsight {
  id: string;
  month: string;
  totalSpending: number;
  totalIncome: number;
  topCategory: string;
  categoryData: CategoryBreakdown[];
  aiInsights: string | null;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthComparison {
  currentMonth: MonthlyInsight;
  previousMonth: MonthlyInsight;
  spendingChange: number;
  incomeChange: number;
}

// AI Types
export interface AIInsight {
  summary: string;
  highlights: string[];
  recommendations: string[];
}

export interface SpendingPrediction {
  predictedSpending: number;
  confidence: number;
  breakdown: CategoryBreakdown[];
}

export interface Anomaly {
  transactionId: string;
  transaction: Transaction;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface FinancialAdvice {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}
