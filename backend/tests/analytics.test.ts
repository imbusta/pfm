import analyticsService from '../src/services/analytics';
import { Transaction } from '../src/types';

describe('Analytics Service', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: '1',
      date: new Date('2024-01-15'),
      description: 'Grocery',
      amount: -100,
      type: 'expense',
      category: 'Food',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      date: new Date('2024-01-20'),
      description: 'Salary',
      amount: 3000,
      type: 'income',
      category: 'Income',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      date: new Date('2024-01-25'),
      description: 'Restaurant',
      amount: -50,
      type: 'expense',
      category: 'Food',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  describe('calculateSummary', () => {
    it('should calculate correct totals', () => {
      const summary = analyticsService.calculateSummary(
        sampleTransactions,
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );

      expect(summary.totalIncome).toBe(3000);
      expect(summary.totalExpenses).toBe(150);
      expect(summary.netAmount).toBe(2850);
      expect(summary.transactionCount).toBe(3);
    });
  });

  describe('calculateCategoryBreakdown', () => {
    it('should group expenses by category', () => {
      const breakdown = analyticsService.calculateCategoryBreakdown(sampleTransactions);

      expect(breakdown).toHaveLength(1);
      expect(breakdown[0].category).toBe('Food');
      expect(breakdown[0].amount).toBe(150);
      expect(breakdown[0].transactionCount).toBe(2);
    });
  });

  describe('calculateAverageSpending', () => {
    it('should calculate average expense amount', () => {
      const avg = analyticsService.calculateAverageSpending(sampleTransactions);
      expect(avg).toBe(75);
    });

    it('should calculate average for specific category', () => {
      const avg = analyticsService.calculateAverageSpending(sampleTransactions, 'Food');
      expect(avg).toBe(75);
    });
  });
});
