
// Category icons mapping
export const getCategoryIcon = (category: string): string => {
  const categoryIcons: Record<string, string> = {
    'Food': '🍔',
    'Food & Dining': '🍔',
    'Groceries': '🛒',
    'Transport': '🚗',
    'Transportation': '🚗',
    'Entertainment': '🎬',
    'Bills': '📄',
    'Bills & Utilities': '📄',
    'Shopping': '🛍️',
    'Income': '💰',
    'Salary': '💼',
    'Transfer': '↔️',
    'Health': '🏥',
    'Healthcare': '🏥',
    'Education': '📚',
    'Travel': '✈️',
    'Subscription': '📱',
    'Investment': '📈',
    'Savings': '🏦',
    'Other': '📋',
  };
  return categoryIcons[category] || '📋';
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
