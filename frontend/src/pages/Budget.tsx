import { useEffect, useState } from 'react';
import { budgetApi, goalsApi } from '../api/client';
import type { Budget as BudgetType, Goal } from '../types';
import BudgetView from '../components/BudgetView';

export default function Budget() {
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsData, goalsData] = await Promise.all([
        budgetApi.getAll(),
        goalsApi.getAll(),
      ]);
      setBudgets(budgetsData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Failed to load budget data:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Budget & Goals</h1>
      <BudgetView budgets={budgets} goals={goals} />
    </div>
  );
}
