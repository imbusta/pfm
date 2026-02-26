import { useEffect, useState } from 'react';
import { budgetApi, goalsApi, analyticsApi } from '../api/client';
import type { Budget as BudgetType, Goal, MonthlyTrend } from '../types';
import BudgetView from '../components/BudgetView';

export default function Budget() {
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsData, goalsData, trendsData] = await Promise.all([
        budgetApi.getAll(),
        goalsApi.getAll(),
        analyticsApi.getTrends(),
      ]);
      setBudgets(budgetsData);
      setGoals(goalsData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Failed to load budget data:', error);
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
      <h1 className="text-3xl font-bold text-text-primary mb-6">Budget & Goals</h1>
      <BudgetView budgets={budgets} goals={goals} trends={trends} />
    </div>
  );
}
