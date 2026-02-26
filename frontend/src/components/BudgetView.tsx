import { useState } from 'react';
import type { Budget, Goal, MonthlyTrend } from '../types';

interface BudgetViewProps {
  budgets: Budget[];
  goals: Goal[];
  trends: MonthlyTrend[];
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

function formatTrendMonth(yyyyMM: string): string {
  const [year, month] = yyyyMM.split('-');
  return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`;
}

interface SliderHeaderProps {
  title: string;
  subtitle?: string;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

function SliderHeader({ title, subtitle, index, total, onPrev, onNext }: SliderHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-text-secondary hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <span className="text-sm text-text-secondary tabular-nums">{index + 1} / {total}</span>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-text-secondary hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default function BudgetView({ budgets, goals, trends }: BudgetViewProps) {
  // Trends sorted oldest first so right arrow → newer month
  const sortedTrends = [...trends].sort((a, b) => a.month.localeCompare(b.month));

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Budgets sorted oldest first so right arrow → newer month (API returns newest-first)
  const sortedBudgets = [...budgets].sort(
    (a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month
  );

  // Start budget slider on current month if it exists, otherwise the last (newest) entry
  const initialBudgetIndex = (() => {
    const idx = sortedBudgets.findIndex((b) => b.year === currentYear && b.month === currentMonth);
    return idx >= 0 ? idx : Math.max(0, sortedBudgets.length - 1);
  })();

  const [trendIndex, setTrendIndex] = useState(Math.max(0, sortedTrends.length - 1));
  const [budgetIndex, setBudgetIndex] = useState(initialBudgetIndex);

  const activeTrend = sortedTrends[trendIndex];
  const activeBudget = sortedBudgets[budgetIndex];

  return (
    <div className="space-y-6">
      {/* Monthly Summary Slider */}
      {sortedTrends.length > 0 && (
        <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
          <SliderHeader
            title="Monthly Summary"
            subtitle={formatTrendMonth(activeTrend.month)}
            index={trendIndex}
            total={sortedTrends.length}
            onPrev={() => setTrendIndex((i) => i - 1)}
            onNext={() => setTrendIndex((i) => i + 1)}
          />
          <div className="grid grid-cols-3 gap-6 mb-5">
            <div>
              <p className="text-sm text-text-secondary mb-1">Income</p>
              <p className="text-2xl font-bold text-green-600">${activeTrend.income.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Spending</p>
              <p className="text-2xl font-bold text-red-500">${activeTrend.expenses.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Net</p>
              <p className={`text-2xl font-bold ${activeTrend.net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {activeTrend.net >= 0 ? '+' : ''}${activeTrend.net.toFixed(2)}
              </p>
            </div>
          </div>
          {activeTrend.income > 0 && (
            <div>
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Spending vs Income</span>
                <span>{((activeTrend.expenses / activeTrend.income) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getProgressColor((activeTrend.expenses / activeTrend.income) * 100)}`}
                  style={{ width: `${Math.min((activeTrend.expenses / activeTrend.income) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Budgets Slider + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budgets Slider */}
        <div className="bg-surface rounded-lg shadow-md p-6 border border-gray-200">
          {sortedBudgets.length === 0 ? (
            <>
              <h2 className="text-xl font-semibold text-text-primary mb-4">📊 Budgets</h2>
              <p className="text-text-secondary">No budgets created yet</p>
            </>
          ) : (
            <>
              <SliderHeader
                title="📊 Budgets"
                subtitle={(() => {
                  const isCurrent = activeBudget.year === currentYear && activeBudget.month === currentMonth;
                  return `${MONTH_NAMES[activeBudget.month - 1]} ${activeBudget.year}${isCurrent ? ' · Current' : ''}`;
                })()}
                index={budgetIndex}
                total={sortedBudgets.length}
                onPrev={() => setBudgetIndex((i) => i - 1)}
                onNext={() => setBudgetIndex((i) => i + 1)}
              />
              {activeBudget.categories.length === 0 ? (
                <p className="text-sm text-text-secondary">No categories added yet</p>
              ) : (
                <div className="space-y-3">
                  {activeBudget.categories.map((bc) => {
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
                            className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(pct)}`}
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
            </>
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
    </div>
  );
}
