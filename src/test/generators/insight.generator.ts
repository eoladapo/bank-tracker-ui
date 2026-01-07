import * as fc from 'fast-check';
import type { CategoryBreakdown, MonthlyInsight, MonthComparison, AIInsight, SpendingPrediction, Anomaly, FinancialAdvice } from '../../types';
import { anomalyTransactionArb } from './transaction.generator';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Utilities', 'Other'] as const;

export const categoryBreakdownArb: fc.Arbitrary<CategoryBreakdown> = fc.record({
  category: fc.constantFrom(...CATEGORIES),
  amount: fc.float({ min: 0, max: 1000000, noNaN: true }),
  percentage: fc.float({ min: 0, max: 100, noNaN: true }),
  transactionCount: fc.integer({ min: 0, max: 1000 }),
});

export const normalizedCategoryBreakdownListArb: fc.Arbitrary<CategoryBreakdown[]> = fc
  .array(fc.float({ min: 0.01, max: 100, noNaN: true }), { minLength: 1, maxLength: 9 })
  .map(raw => {
    const total = raw.reduce((s, p) => s + p, 0);
    return raw.map((p, i) => ({
      category: CATEGORIES[i % CATEGORIES.length],
      amount: Math.random() * 100000,
      percentage: (p / total) * 100,
      transactionCount: Math.floor(Math.random() * 100),
    }));
  });

const monthStringArb = fc.tuple(fc.integer({ min: 2020, max: 2026 }), fc.integer({ min: 1, max: 12 }))
  .map(([y, m]) => `${y}-${m.toString().padStart(2, '0')}`);

export const monthlyInsightArb: fc.Arbitrary<MonthlyInsight> = fc.record({
  id: fc.uuid(),
  month: monthStringArb,
  totalSpending: fc.float({ min: 0, max: 10000000, noNaN: true }),
  totalIncome: fc.float({ min: 0, max: 10000000, noNaN: true }),
  topCategory: fc.constantFrom(...CATEGORIES),
  categoryData: fc.array(categoryBreakdownArb, { minLength: 1, maxLength: 9 }),
  aiInsights: fc.option(fc.string({ minLength: 10, maxLength: 500 }), { nil: null }),
});

export const monthComparisonArb: fc.Arbitrary<MonthComparison> = fc
  .tuple(monthlyInsightArb, monthlyInsightArb)
  .map(([curr, prev]) => {
    const spendingChange = prev.totalSpending === 0 ? 0 : ((curr.totalSpending - prev.totalSpending) / prev.totalSpending) * 100;
    const incomeChange = prev.totalIncome === 0 ? 0 : ((curr.totalIncome - prev.totalIncome) / prev.totalIncome) * 100;
    return {
      currentMonth: curr,
      previousMonth: prev,
      percentageChange: spendingChange,
      spendingChange,
      incomeChange,
    };
  });

export const aiInsightArb: fc.Arbitrary<AIInsight> = fc.record({
  summary: fc.string({ minLength: 10, maxLength: 500 }),
  highlights: fc.array(fc.string({ minLength: 5, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
  recommendations: fc.array(fc.string({ minLength: 5, maxLength: 200 }), { minLength: 1, maxLength: 5 }),
});

export const spendingPredictionArb: fc.Arbitrary<SpendingPrediction> = fc.record({
  predictedSpending: fc.float({ min: 0, max: 10000000, noNaN: true }),
  confidence: fc.float({ min: 0, max: 1, noNaN: true }),
  breakdown: fc.array(categoryBreakdownArb, { minLength: 1, maxLength: 9 }),
});

export const anomalyArb: fc.Arbitrary<Anomaly> = fc.tuple(fc.uuid(), anomalyTransactionArb)
  .map(([id, tx]) => ({
    transactionId: id,
    transaction: { ...tx, id },
    reason: tx.anomalyReason || 'Unusual spending pattern',
    severity: tx.anomalySeverity || 'medium',
  }));

export const anomalyListArb: fc.Arbitrary<Anomaly[]> = fc.array(anomalyArb, { minLength: 0, maxLength: 20 });

export const financialAdviceArb: fc.Arbitrary<FinancialAdvice> = fc.record({
  title: fc.string({ minLength: 5, maxLength: 100 }),
  description: fc.string({ minLength: 10, maxLength: 500 }),
  priority: fc.constantFrom('low', 'medium', 'high'),
  category: fc.constantFrom(...CATEGORIES),
});

export const financialAdviceListArb: fc.Arbitrary<FinancialAdvice[]> = fc.array(financialAdviceArb, { minLength: 1, maxLength: 10 });
