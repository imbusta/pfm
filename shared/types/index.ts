// Core Transaction types
export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category?: string;
  subcategory?: string;
  type: 'income' | 'expense';
  source?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionCreate {
  date: Date;
  description: string;
  amount: number;
  category?: string;
  subcategory?: string;
  type: 'income' | 'expense';
  source?: string;
  notes?: string;
  tags?: string[];
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

export interface BudgetCreate {
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
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

export interface GoalCreate {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'cancelled';
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

// Agent/Chat types
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

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Recurring transaction pattern
export interface RecurringPattern {
  description: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  transactions: Transaction[];
  confidence: number;
}

// Budget suggestion
export interface BudgetSuggestion {
  category: string;
  suggestedAmount: number;
  currentSpending: number;
  reasoning: string;
}

// Goal plan
export interface GoalPlan {
  goal: Goal;
  monthlyContribution: number;
  estimatedMonths: number;
  feasibility: 'easy' | 'moderate' | 'challenging' | 'difficult';
}
