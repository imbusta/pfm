import type { CategoryBreakdown } from '../types';

interface CategoryBreakdownProps {
  breakdown: CategoryBreakdown[];
}

export default function CategoryBreakdownComponent({ breakdown }: CategoryBreakdownProps) {
  // Color palette for different categories
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-danger',
    'bg-warning',
    'bg-success',
  ];

  if (breakdown.length === 0) {
    return (
      <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Category Breakdown</h2>
        <p className="text-text-secondary">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Top Spending Categories</h2>
      <div className="space-y-4">
        {breakdown.slice(0, 5).map((cat, index) => (
          <div key={cat.category} className="p-3 bg-background rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-text-primary">{cat.category}</span>
              <span className="text-sm text-text-secondary font-semibold">
                ${cat.amount.toFixed(2)} ({cat.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <div
                className={`${colors[index % colors.length]} h-3 rounded-full transition-all duration-500 shadow-sm`}
                style={{ width: `${Math.min(cat.percentage, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-text-secondary mt-1">
              {cat.transactionCount} transaction{cat.transactionCount !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
