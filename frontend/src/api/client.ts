import axios from 'axios';
import type {
  Transaction,
  TransactionCreate,
  Budget,
  Goal,
  SpendingSummary,
  CategoryBreakdown,
  MonthlyTrend,
  AgentResponse,
  ApiResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await client.get<ApiResponse<Transaction[]>>('/transactions');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await client.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data.data!;
  },

  create: async (data: TransactionCreate): Promise<Transaction> => {
    const response = await client.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<TransactionCreate>): Promise<Transaction> => {
    const response = await client.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/transactions/${id}`);
  },

  batchCreate: async (transactions: TransactionCreate[]): Promise<Transaction[]> => {
    const response = await client.post<ApiResponse<Transaction[]>>('/transactions/batch', {
      transactions,
    });
    return response.data.data || [];
  },
};

// Analytics API
export const analyticsApi = {
  getSummary: async (startDate: string, endDate: string): Promise<SpendingSummary> => {
    const response = await client.get<ApiResponse<SpendingSummary>>('/analytics/summary', {
      params: { startDate, endDate },
    });
    return response.data.data!;
  },

  getBreakdown: async (startDate?: string, endDate?: string): Promise<CategoryBreakdown[]> => {
    const response = await client.get<ApiResponse<CategoryBreakdown[]>>('/analytics/breakdown', {
      params: { startDate, endDate },
    });
    return response.data.data || [];
  },

  getTrends: async (): Promise<MonthlyTrend[]> => {
    const response = await client.get<ApiResponse<MonthlyTrend[]>>('/analytics/trends');
    return response.data.data || [];
  },

  getRecurring: async () => {
    const response = await client.get('/analytics/recurring');
    return response.data.data || [];
  },

  getAnomalies: async (category?: string) => {
    const response = await client.get('/analytics/anomalies', {
      params: { category },
    });
    return response.data.data || [];
  },
};

// Budget API
export const budgetApi = {
  getAll: async (): Promise<Budget[]> => {
    const response = await client.get<ApiResponse<Budget[]>>('/budget');
    return response.data.data || [];
  },

  create: async (data: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
    const response = await client.post<ApiResponse<Budget>>('/budget', data);
    return response.data.data!;
  },

  getSuggestions: async (months: number = 3) => {
    const response = await client.get('/budget/suggestions', {
      params: { months },
    });
    return response.data.data || [];
  },

  optimize: async () => {
    const response = await client.get('/budget/optimize');
    return response.data.data || [];
  },
};

// Goals API
export const goalsApi = {
  getAll: async (): Promise<Goal[]> => {
    const response = await client.get<ApiResponse<Goal[]>>('/budget/goals');
    return response.data.data || [];
  },

  create: async (data: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> => {
    const response = await client.post<ApiResponse<Goal>>('/budget/goals', data);
    return response.data.data!;
  },

  getPlan: async (id: string) => {
    const response = await client.get(`/budget/goals/${id}/plan`);
    return response.data.data;
  },
};

// Agent API
export const agentApi = {
  chat: async (message: string, includeContext: boolean = true): Promise<AgentResponse> => {
    const response = await client.post<ApiResponse<AgentResponse>>('/agent/chat', {
      message,
      includeContext,
    });
    return response.data.data!;
  },

  analyze: async (params: {
    category?: string;
    startDate?: string;
    endDate?: string;
    question?: string;
  }): Promise<AgentResponse> => {
    const response = await client.post<ApiResponse<AgentResponse>>('/agent/analyze', params);
    return response.data.data!;
  },
};

export default client;
