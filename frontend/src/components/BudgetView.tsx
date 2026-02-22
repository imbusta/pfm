import type { Budget, Goal } from '../types';

interface BudgetViewProps {
  budgets: Budget[];
  goals: Goal[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getProgressColor(pct: number): string {
  if (pct > 100) return 'bg-red-500';
  if (pct >= 80) return 'bg-yellow-400';
  return 'bg-green-500';
}

export default function BudgetView({ budgets, goals }: BudgetViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Budgets */}
      <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-text-primary mb-4">📊 Budgets</h2>
        {budgets.length === 0 ? (
          <p className="text-text-secondary">No budgets created yet</p>
        ) : (
          <div className="space-y-6">
            {budgets.map((budget) => (
              <div key={budget.id}>
                <h3 className="font-semibold text-text-primary mb-3">
                  {MONTH_NAMES[budget.month - 1]} {budget.year}
                </h3>
                {budget.categories.length === 0 ? (
                  <p className="text-sm text-text-secondary">No categories added yet</p>
                ) : (
                  <div className="space-y-3">
                    {budget.categories.map((bc) => {
                      const pct = bc.amount > 0 ? (bc.total_spent / bc.amount) * 100 : 0;
                      return (
                        <div key={bc.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-text-primary">
                              {bc.category_name ?? `Category ${bc.category_id}`}
                            </span>
                            <span className="text-sm text-text-secondary">
                              ${bc.total_spent.toFixed(2)} / ${bc.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(pct)}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-text-secondary mt-0.5 text-right">
                            {pct > 100
                              ? `Over budget by $${(bc.total_spent - bc.amount).toFixed(2)}`
                              : `$${(bc.amount - bc.total_spent).toFixed(2)} remaining`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-text-primary mb-4">🎯 Goals</h2>
        {goals.length === 0 ? (
          <p className="text-text-secondary">No goals set yet</p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-text-primary">{goal.name}</span>
                    <span className="text-sm text-text-secondary font-semibold">
                      ${goal.currentAmount} / ${goal.targetAmount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-success h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-text-secondary">{progress.toFixed(1)}% complete</span>
                    <span className={`px-2 py-0.5 rounded font-medium ${
                      goal.priority === 'high' ? 'bg-danger/10 text-danger' :
                      goal.priority === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
