import { createElement } from 'react';
import type { FC } from 'react';

// SVG icon paths for each category
const categoryIconPaths: Record<string, string> = {
  'food': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'food & dining': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'groceries': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
  'transport': 'M8 7h8m-8 5h8m-4-9a9 9 0 110 18 9 9 0 010-18zm-5 9h.01M19 12h.01M7 16.5l1.5-1.5m8 0l1.5 1.5M9 19v1m6-1v1',
  'transportation': 'M8 7h8m-8 5h8m-4-9a9 9 0 110 18 9 9 0 010-18zm-5 9h.01M19 12h.01M7 16.5l1.5-1.5m8 0l1.5 1.5M9 19v1m6-1v1',
  'entertainment': 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
  'bills': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'bills & utilities': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'shopping': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  'income': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'salary': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'transfer': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
  'health': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  'healthcare': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  'education': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'travel': 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'subscription': 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  'investment': 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  'savings': 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
  'default': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
};

// Get the SVG path for a category
export const getCategoryIconPath = (category: string): string => {
  const key = category.toLowerCase();
  return categoryIconPaths[key] || categoryIconPaths['default'];
};

// Legacy function - returns a bullet point (deprecated, use CategoryIcon component)
export const getCategoryIcon = (_category: string): string => {
  return '•';
};

// Category icon component props
interface CategoryIconProps {
  category: string;
  className?: string;
}

// Category icon component - renders an SVG icon for the category
export const CategoryIcon: FC<CategoryIconProps> = ({ category, className = 'w-6 h-6' }) => {
  const path = getCategoryIconPath(category);

  return createElement('svg', {
    className,
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    children: createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 2,
      d: path,
    }),
  });
};

// Severity colors for anomaly badges
export const getSeverityColor = (severity: 'low' | 'medium' | 'high' | null): string => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Severity styles for detailed views
export const getSeverityStyles = (
  severity: 'low' | 'medium' | 'high' | null
): { bg: string; text: string; border: string } => {
  switch (severity) {
    case 'high':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    case 'medium':
      return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    case 'low':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  }
};

// Format currency with sign
export const formatCurrency = (amount: number, type: 'debit' | 'credit'): string => {
  const prefix = type === 'debit' ? '-' : '+';
  return `${prefix}₦${Math.abs(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Format currency without sign
export const formatCurrencyValue = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Format time only
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Format full date
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
