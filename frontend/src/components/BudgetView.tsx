import type { Budget, Goal } from '../types';

interface BudgetViewProps {
  budgets: Budget[];
  goals: Goal[];
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
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-text-primary">{budget.category}</span>
                  <span className="text-sm text-primary font-semibold">
                    ${budget.amount}/{budget.period}
                  </span>
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Started: {new Date(budget.startDate).toLocaleDateString()}
                </div>
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
