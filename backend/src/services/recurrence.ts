import { Transaction } from '../types';

interface RecurringPattern {
  description: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  transactions: Transaction[];
  confidence: number;
}

export class RecurrenceService {
  detectRecurring(transactions: Transaction[]): RecurringPattern[] {
    // Group transactions by similar description
    const groups = this.groupSimilarTransactions(transactions);
    const patterns: RecurringPattern[] = [];

    for (const [description, txs] of groups.entries()) {
      if (txs.length < 2) continue;

      const pattern = this.analyzePattern(description, txs);
      if (pattern && pattern.confidence > 0.7) {
        patterns.push(pattern);
      }
    }

    return patterns.sort((a, b) => b.confidence - a.confidence);
  }

  private groupSimilarTransactions(transactions: Transaction[]): Map<string, Transaction[]> {
    const groups = new Map<string, Transaction[]>();

    transactions.forEach(t => {
      const normalized = this.normalizeDescription(t.description);
      const existing = groups.get(normalized) || [];
      groups.set(normalized, [...existing, t]);
    });

    return groups;
  }

  private normalizeDescription(description: string): string {
    return description
      .toLowerCase()
      .replace(/\d+/g, '') // Remove numbers
      .replace(/[^a-z\s]/g, '') // Remove special chars
      .trim();
  }

  private analyzePattern(description: string, transactions: Transaction[]): RecurringPattern | null {
    if (transactions.length < 2) return null;

    // Sort by date
    const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate intervals between transactions
    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const daysDiff = Math.floor(
        (sorted[i].date.getTime() - sorted[i - 1].date.getTime()) / (1000 * 60 * 60 * 24)
      );
      intervals.push(daysDiff);
    }

    // Determine frequency and confidence
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);

    const frequency = this.determineFrequency(avgInterval);
    const confidence = this.calculateConfidence(intervals, avgInterval, stdDev);

    // Calculate average amount
    const avgAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length;

    return {
      description,
      amount: avgAmount,
      frequency,
      transactions: sorted,
      confidence,
    };
  }

  private determineFrequency(avgDays: number): 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' {
    if (avgDays <= 10) return 'weekly';
    if (avgDays <= 18) return 'biweekly';
    if (avgDays <= 40) return 'monthly';
    if (avgDays <= 120) return 'quarterly';
    return 'yearly';
  }

  private calculateConfidence(intervals: number[], avg: number, stdDev: number): number {
    if (intervals.length === 0) return 0;

    // Coefficient of variation (lower is better)
    const cv = stdDev / avg;

    // Convert to confidence score (0-1)
    // cv < 0.1 is excellent, cv > 0.5 is poor
    return Math.max(0, Math.min(1, 1 - cv));
  }
}

export default new RecurrenceService();
