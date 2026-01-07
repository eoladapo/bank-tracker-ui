import type { MonthOption } from '../types';

/**
 * Generate month options for the selector (last 12 months)
 */
export const generateMonthOptions = (): MonthOption[] => {
  const options: MonthOption[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });
    options.push({ value, label });
  }

  return options;
};

/**
 * Get current month in YYYY-MM format
 */
export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Get previous month from a given month string
 */
export const getPreviousMonth = (month: string): string => {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Format a number value with optional prefix and suffix
 */
export const formatInsightValue = (
  value: string | number,
  prefix?: string,
  suffix?: string
): string => {
  let formattedValue: string;

  if (typeof value === 'number') {
    formattedValue = value.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } else {
    formattedValue = value;
  }

  return `${prefix || ''}${formattedValue}${suffix || ''}`;
};

/**
 * Get comparison color based on value
 */
export const getComparisonColor = (value: number | undefined | null): string => {
  if (value == null || isNaN(value)) return 'text-gray-500';
  if (value > 0) return 'text-emerald-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-500';
};

/**
 * Get comparison icon based on value
 */
export const getComparisonIcon = (value: number | undefined | null): string => {
  if (value == null || isNaN(value)) return '';
  if (value > 0) return '↑ ';
  if (value < 0) return '↓ ';
  return '';
};
