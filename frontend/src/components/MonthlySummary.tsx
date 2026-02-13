import type { SpendingSummary } from '../types';

interface MonthlySummaryProps {
  summary: SpendingSummary | null;
}

export default function MonthlySummary({ summary }: MonthlySummaryProps) {
  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Income</span>
          <span className="text-green-600 font-semibold text-lg">
            +${summary.totalIncome.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Expenses</span>
          <span className="text-red-600 font-semibold text-lg">
            -${summary.totalExpenses.toFixed(2)}
          </span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-medium">Net Amount</span>
            <span
              className={`font-bold text-xl ${
                summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {summary.netAmount >= 0 ? '+' : ''}${summary.netAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-500 text-center">
          {summary.transactionCount} transactions
        </div>
      </div>
    </div>
  );
}
