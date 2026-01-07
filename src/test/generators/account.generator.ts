import * as fc from 'fast-check';
import type { BankAccount } from '../../types';

const INSTITUTIONS = ['GTBank', 'Access Bank', 'First Bank', 'UBA', 'Zenith Bank', 'Stanbic IBTC', 'Fidelity Bank'] as const;
const ACCOUNT_TYPES = ['savings', 'current', 'domiciliary'] as const;

const last4DigitsArb = fc.array(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 4, maxLength: 4 }).map(d => d.join(''));

export const bankAccountArb: fc.Arbitrary<BankAccount> = fc.record({
  id: fc.uuid(),
  monoAccountId: fc.uuid(),
  institutionName: fc.constantFrom(...INSTITUTIONS),
  accountType: fc.constantFrom(...ACCOUNT_TYPES),
  accountNumber: last4DigitsArb,
  balance: fc.float({ min: 0, max: 100000000, noNaN: true }),
  currency: fc.constantFrom('NGN', 'USD', 'GBP', 'EUR'),
  lastSyncedAt: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()), { nil: null }),
  isActive: fc.boolean(),
});

export const activeBankAccountArb: fc.Arbitrary<BankAccount> = bankAccountArb.map(a => ({ ...a, isActive: true }));

export const accountListArb: fc.Arbitrary<BankAccount[]> = fc.array(bankAccountArb, { minLength: 0, maxLength: 10 });

export const activeAccountListArb: fc.Arbitrary<BankAccount[]> = fc.array(activeBankAccountArb, { minLength: 1, maxLength: 10 });
