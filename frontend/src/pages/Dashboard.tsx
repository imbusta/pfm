import { useEffect, useState } from 'react';
import { analyticsApi } from '../api/client';
import type { SpendingSummary, CategoryBreakdown } from '../types';
import MonthlySummary from '../components/MonthlySummary';
import CategoryBreakdownComponent from '../components/CategoryBreakdown';

export default function Dashboard() {
  const [summary, setSummary] = useState<SpendingSummary | null>(null);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get current calendar month
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const [summaryData, breakdownData] = await Promise.all([
        analyticsApi.getSummary(startDate.toISOString(), endDate.toISOString()),
        analyticsApi.getBreakdown(startDate.toISOString(), endDate.toISOString()),
      ]);

      setSummary(summaryData);
      setBreakdown(breakdownData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <MonthlySummary summary={summary} />
        </div>
        <div>
          <CategoryBreakdownComponent breakdown={breakdown} />
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/transactions"
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all text-center group"
            >
              <div className="text-3xl mb-2">💰</div>
              <div className="font-medium text-text-primary group-hover:text-primary transition-colors">Add Transaction</div>
            </a>
            <a
              href="/budget"
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-secondary hover:shadow-md transition-all text-center group"
            >
              <div className="text-3xl mb-2">📊</div>
              <div className="font-medium text-text-primary group-hover:text-secondary transition-colors">Create Budget</div>
            </a>
            <a
              href="/chat"
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all text-center group"
            >
              <div className="text-3xl mb-2">💬</div>
              <div className="font-medium text-text-primary group-hover:text-primary transition-colors">Ask Copilot</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
