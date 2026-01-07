import * as fc from 'fast-check';
import type { Transaction, TransactionFilters } from '../../types';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Income', 'Healthcare', 'Education', 'Utilities', 'Other'] as const;

export const transactionArb: fc.Arbitrary<Transaction> = fc.record({
  id: fc.uuid(),
  accountId: fc.uuid(),
  amount: fc.float({ min: 0.01, max: 1000000, noNaN: true }),
  type: fc.constantFrom('debit', 'credit'),
  narration: fc.string({ minLength: 1, maxLength: 200 }),
  date: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
  balance: fc.float({ min: 0, max: 10000000, noNaN: true }),
  category: fc.constantFrom(...CATEGORIES),
  categorizationMethod: fc.constantFrom('ai', 'rule', 'default'),
  aiConfidence: fc.option(fc.float({ min: 0, max: 1, noNaN: true }), { nil: null }),
  isAnomaly: fc.boolean(),
  anomalyReason: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
  anomalySeverity: fc.option(fc.constantFrom('low', 'medium', 'high'), { nil: null }),
});

export const anomalyTransactionArb: fc.Arbitrary<Transaction> = fc.record({
  id: fc.uuid(),
  accountId: fc.uuid(),
  amount: fc.float({ min: 0.01, max: 1000000, noNaN: true }),
  type: fc.constantFrom('debit', 'credit'),
  narration: fc.string({ minLength: 1, maxLength: 200 }),
  date: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
  balance: fc.float({ min: 0, max: 10000000, noNaN: true }),
  category: fc.constantFrom(...CATEGORIES),
  categorizationMethod: fc.constantFrom('ai', 'rule', 'default'),
  aiConfidence: fc.option(fc.float({ min: 0, max: 1, noNaN: true }), { nil: null }),
  isAnomaly: fc.constant(true),
  anomalyReason: fc.string({ minLength: 1, maxLength: 100 }),
  anomalySeverity: fc.constantFrom('low', 'medium', 'high'),
});

export const transactionListArb: fc.Arbitrary<Transaction[]> = fc.array(transactionArb, { minLength: 0, maxLength: 100 });

export const transactionFiltersArb: fc.Arbitrary<TransactionFilters> = fc.record({
  startDate: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString().split('T')[0]), { nil: undefined }),
  endDate: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString().split('T')[0]), { nil: undefined }),
  category: fc.option(fc.constantFrom(...CATEGORIES), { nil: undefined }),
  type: fc.option(fc.constantFrom('debit', 'credit'), { nil: undefined }),
  page: fc.integer({ min: 1, max: 100 }),
  limit: fc.constantFrom(10, 20, 50),
});

export const debitTransactionArb: fc.Arbitrary<Transaction> = transactionArb.map(t => ({ ...t, type: 'debit' as const }));

export const creditTransactionArb: fc.Arbitrary<Transaction> = transactionArb.map(t => ({ ...t, type: 'credit' as const }));
