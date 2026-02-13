import { Transaction, Budget, Goal } from '../types';
import analyticsService from './analytics';

interface BudgetSuggestion {
  category: string;
  suggestedAmount: number;
  currentSpending: number;
  reasoning: string;
}

interface GoalPlan {
  goal: Goal;
  monthlyContribution: number;
  estimatedMonths: number;
  feasibility: 'easy' | 'moderate' | 'challenging' | 'difficult';
}

export class PlannerService {
  suggestBudget(transactions: Transaction[], months: number = 3): BudgetSuggestion[] {
    const recentTransactions = this.getRecentTransactions(transactions, months);
    const breakdown = analyticsService.calculateCategoryBreakdown(recentTransactions);

    return breakdown.map(cat => {
      const avgMonthly = cat.amount / months;
      const suggestedAmount = Math.ceil(avgMonthly * 1.1); // 10% buffer

      return {
        category: cat.category,
        suggestedAmount,
        currentSpending: avgMonthly,
        reasoning: `Based on ${months}-month average of $${avgMonthly.toFixed(2)}/month with 10% buffer`,
      };
    });
  }

  planGoal(goal: Goal, transactions: Transaction[]): GoalPlan {
    const recentMonths = 3;
    const recentTransactions = this.getRecentTransactions(transactions, recentMonths);
    const summary = analyticsService.calculateSummary(
      recentTransactions,
      new Date(Date.now() - recentMonths * 30 * 24 * 60 * 60 * 1000),
      new Date()
    );

    const avgMonthlySurplus = summary.netAmount / recentMonths;
    const remainingAmount = goal.targetAmount - goal.currentAmount;

    // Calculate feasibility
    let monthlyContribution: number;
    let feasibility: 'easy' | 'moderate' | 'challenging' | 'difficult';

    if (avgMonthlySurplus <= 0) {
      monthlyContribution = remainingAmount / 12; // Default 1 year
      feasibility = 'difficult';
    } else {
      const recommendedContribution = Math.min(avgMonthlySurplus * 0.5, remainingAmount / 12);
      monthlyContribution = recommendedContribution;

      const percentageOfSurplus = (monthlyContribution / avgMonthlySurplus) * 100;
      if (percentageOfSurplus < 25) feasibility = 'easy';
      else if (percentageOfSurplus < 50) feasibility = 'moderate';
      else if (percentageOfSurplus < 75) feasibility = 'challenging';
      else feasibility = 'difficult';
    }

    const estimatedMonths = Math.ceil(remainingAmount / monthlyContribution);

    return {
      goal,
      monthlyContribution,
      estimatedMonths,
      feasibility,
    };
  }

  optimizeBudget(budgets: Budget[], transactions: Transaction[]): Array<{ budget: Budget; recommendation: string }> {
    const lastMonth = this.getRecentTransactions(transactions, 1);
    const breakdown = analyticsService.calculateCategoryBreakdown(lastMonth);

    return budgets.map(budget => {
      const actual = breakdown.find(b => b.category === budget.category);
      const actualAmount = actual ? actual.amount : 0;

      let recommendation: string;
      if (actualAmount === 0) {
        recommendation = 'No spending in this category last month';
      } else if (actualAmount > budget.amount * 1.2) {
        recommendation = `Consider increasing budget to $${Math.ceil(actualAmount)}`;
      } else if (actualAmount < budget.amount * 0.5) {
        recommendation = `Consider decreasing budget to $${Math.ceil(actualAmount * 1.2)}`;
      } else {
        recommendation = 'Budget is appropriately set';
      }

      return { budget, recommendation };
    });
  }

  private getRecentTransactions(transactions: Transaction[], months: number): Transaction[] {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    return transactions.filter(t => t.date >= cutoffDate);
  }
}

export default new PlannerService();
