// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Transaction types
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  currency_id: number;
  category_id: number | null;
  subcategory_id: number | null;
  type: 'income' | 'expense';
  is_variable: boolean;
  date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;

  // Populated by JOINs for API responses
  category_name?: string;
  subcategory_name?: string;
  currency_code?: string;
}

export interface TransactionCreate {
  description: string;
  amount: number;
  currency_id?: number;
  category_id?: number | null;
  subcategory_id?: number | null;
  type: 'income' | 'expense';
  is_variable?: boolean;
  date: Date;

  // Alternative: allow string-based creation
  category?: string;
  subcategory?: string;
  currency?: string;
}

// Budget types
export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Goal types
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// User Preference types
export interface UserPreference {
  id: string;
  userId: string;
  currency: string;
  timezone: string;
  budgetPeriod: 'weekly' | 'monthly' | 'yearly';
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Analytics types
export interface SpendingSummary {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

// Agent types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AgentRequest {
  message: string;
  context?: {
    transactions?: Transaction[];
    budgets?: Budget[];
    goals?: Goal[];
  };
}

export interface AgentResponse {
  message: string;
  suggestions?: string[];
  data?: any;
}
