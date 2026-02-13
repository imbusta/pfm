import type { CategoryBreakdown } from '../types';

interface CategoryBreakdownProps {
  breakdown: CategoryBreakdown[];
}

export default function CategoryBreakdownComponent({ breakdown }: CategoryBreakdownProps) {
  if (breakdown.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
        <p className="text-gray-500">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
      <div className="space-y-4">
        {breakdown.slice(0, 5).map((cat) => (
          <div key={cat.category}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900">{cat.category}</span>
              <span className="text-sm text-gray-600">
                ${cat.amount.toFixed(2)} ({cat.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.min(cat.percentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {cat.transactionCount} transactions
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
