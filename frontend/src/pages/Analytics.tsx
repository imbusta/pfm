import { useEffect, useState } from 'react';
import { analyticsApi } from '../api/client';
import type { MonthlyTrend, CategoryBreakdown } from '../types';

export default function Analytics() {
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [trendsData, breakdownData] = await Promise.all([
        analyticsApi.getTrends(),
        analyticsApi.getBreakdown(),
      ]);
      setTrends(trendsData);
      setBreakdown(breakdownData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
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
      <h1 className="text-3xl font-bold text-text-primary mb-6">📈 Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Monthly Trends</h2>
          <div className="space-y-3">
            {trends.map((trend) => (
              <div key={trend.month} className="border-b border-gray-200 pb-3 last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-text-primary">{trend.month}</span>
                  <span
                    className={`font-semibold ${
                      trend.net >= 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {trend.net >= 0 ? '+' : ''}${trend.net.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary mt-1">
                  <span className="text-success">↑ ${trend.income.toFixed(2)}</span>
                  <span className="text-danger">↓ ${trend.expenses.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Category Breakdown</h2>
          <div className="space-y-4">
            {breakdown.map((cat, index) => {
              const colors = ['bg-primary', 'bg-secondary', 'bg-danger', 'bg-warning', 'bg-success'];
              return (
                <div key={cat.category} className="p-3 bg-background rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-text-primary">{cat.category}</span>
                    <span className="text-sm text-text-secondary font-semibold">
                      ${cat.amount.toFixed(2)} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
