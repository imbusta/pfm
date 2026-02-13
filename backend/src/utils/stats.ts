export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

export function calculateMedian(values: number[]): number {
  return calculatePercentile(values, 50);
}

export function calculateMode(values: number[]): number {
  if (values.length === 0) return 0;

  const frequency = new Map<number, number>();
  values.forEach(val => {
    frequency.set(val, (frequency.get(val) || 0) + 1);
  });

  let maxFreq = 0;
  let mode = values[0];

  frequency.forEach((freq, val) => {
    if (freq > maxFreq) {
      maxFreq = freq;
      mode = val;
    }
  });

  return mode;
}

export function roundToDecimal(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function calculateGrowthRate(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}
