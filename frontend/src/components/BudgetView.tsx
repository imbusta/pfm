import type { Budget, Goal } from '../types';

interface BudgetViewProps {
  budgets: Budget[];
  goals: Goal[];
}

export default function BudgetView({ budgets, goals }: BudgetViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Budgets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Budgets</h2>
        {budgets.length === 0 ? (
          <p className="text-gray-500">No budgets created yet</p>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{budget.category}</span>
                  <span className="text-sm text-gray-600">
                    ${budget.amount}/{budget.period}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Started: {new Date(budget.startDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Goals</h2>
        {goals.length === 0 ? (
          <p className="text-gray-500">No goals set yet</p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-gray-600">
                      ${goal.currentAmount} / ${goal.targetAmount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span className={`px-2 py-0.5 rounded ${
                      goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                      goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
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
