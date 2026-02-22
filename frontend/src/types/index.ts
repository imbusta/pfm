export interface Transaction {
  id: string;
  date: Date | string;
  description: string;
  amount: number;
  category_name?: string;
  subcategory_name?: string;
  type: 'income' | 'expense';
  source?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TransactionCreate {
  date: Date | string;
  description: string;
  amount: number;
  category_name?: string;
  subcategory_name?: string;
  type: 'income' | 'expense';
  source?: string;
  notes?: string;
  tags?: string[];
}

export interface BudgetCategory {
  id: number;
  budget_id: number;
  category_id: number;
  amount: number;
  total_spent: number;
  category_name?: string;
}

export interface Budget {
  id: number;
  year: number;
  month: number;
  categories: BudgetCategory[];
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date | string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date | string;
  updatedAt: Date | string;
}

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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AgentResponse {
  message: string;
  suggestions?: string[];
  data?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TransactionFilters {
  searchText: string;
  category: string;
  startDate: string;
  endDate: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
