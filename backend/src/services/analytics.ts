import { Transaction, SpendingSummary, CategoryBreakdown, MonthlyTrend } from '../types';
import { mean, standardDeviation, sum } from 'simple-statistics';

export class AnalyticsService {
  calculateSummary(transactions: Transaction[], startDate: Date, endDate: Date): SpendingSummary {
    const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate);

    const totalIncome = sum(filtered.filter(t => t.type === 'income').map(t => t.amount));
    const totalExpenses = sum(filtered.filter(t => t.type === 'expense').map(t => Math.abs(t.amount)));

    return {
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      transactionCount: filtered.length,
    };
  }

  calculateCategoryBreakdown(transactions: Transaction[]): CategoryBreakdown[] {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = sum(expenses.map(t => Math.abs(t.amount)));

    const categoryMap = new Map<string, { amount: number; count: number }>();

    expenses.forEach(t => {
      const category = t.category_name || 'Uncategorized';
      const existing = categoryMap.get(category) || { amount: 0, count: 0 };
      categoryMap.set(category, {
        amount: existing.amount + Math.abs(t.amount),
        count: existing.count + 1,
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  calculateMonthlyTrends(transactions: Transaction[]): MonthlyTrend[] {
    const monthMap = new Map<string, { income: number; expenses: number }>();

    transactions.forEach(t => {
      const month = `${t.date.getFullYear()}-${t.date.getMonth() + 1}`.padStart(2, '0'); // YYYY-MM
      const existing = monthMap.get(month) || { income: 0, expenses: 0 };

      if (t.type === 'income') {
        existing.income += t.amount;
      } else {
        existing.expenses += Math.abs(t.amount);
      }

      monthMap.set(month, existing);
    });

    return Array.from(monthMap.entries())
      .map(([month, data]) => ({
        month,
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  calculateAverageSpending(transactions: Transaction[], category?: string): number {
    let filtered = transactions.filter(t => t.type === 'expense');
    if (category) {
      filtered = filtered.filter(t => t.category_name === category);
    }

    if (filtered.length === 0) return 0;
    return mean(filtered.map(t => Math.abs(t.amount)));
  }

  detectAnomalies(transactions: Transaction[], category?: string): Transaction[] {
    let filtered = transactions.filter(t => t.type === 'expense');
    if (category) {
      filtered = filtered.filter(t => t.category_name === category);
    }

    if (filtered.length < 3) return [];

    const amounts = filtered.map(t => Math.abs(t.amount));
    const avg = mean(amounts);
    const stdDev = standardDeviation(amounts);
    const threshold = avg + 2 * stdDev;

    return filtered.filter(t => Math.abs(t.amount) > threshold);
  }
}

export default new AnalyticsService();
