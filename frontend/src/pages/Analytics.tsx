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
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
          <div className="space-y-3">
            {trends.map((trend) => (
              <div key={trend.month} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{trend.month}</span>
                  <span
                    className={`font-semibold ${
                      trend.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ${trend.net.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Income: ${trend.income.toFixed(2)}</span>
                  <span>Expenses: ${trend.expenses.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {breakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-sm text-gray-600">
                    ${cat.amount.toFixed(2)} ({cat.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
