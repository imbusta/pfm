import type { SpendingSummary } from '../types';

interface MonthlySummaryProps {
  summary: SpendingSummary | null;
}

export default function MonthlySummary({ summary }: MonthlySummaryProps) {
  if (!summary) {
    return (
      <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Monthly Summary</h2>
        <p className="text-text-secondary">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-text-primary mb-4">Monthly Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
          <span className="text-text-secondary">Total Income</span>
          <span className="text-success font-semibold text-lg">
            +${summary.totalIncome.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-danger/5 rounded-lg">
          <span className="text-text-secondary">Total Expenses</span>
          <span className="text-danger font-semibold text-lg">
            -${summary.totalExpenses.toFixed(2)}
          </span>
        </div>
        <div className="border-t-2 border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-text-primary font-medium">Net Amount</span>
            <span
              className={`font-bold text-xl ${
                summary.netAmount >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {summary.netAmount >= 0 ? '+' : ''}${summary.netAmount.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="text-sm text-text-secondary text-center bg-background px-3 py-2 rounded-lg">
          {summary.transactionCount} transactions
        </div>
      </div>
    </div>
  );
}
