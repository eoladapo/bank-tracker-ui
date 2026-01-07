/**
 * Category colors - consistent color mapping for categories
 */
export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10B981',        // Emerald
  Transport: '#3B82F6',   // Blue
  Entertainment: '#8B5CF6', // Purple
  Bills: '#EF4444',       // Red
  Shopping: '#F59E0B',    // Amber
  Healthcare: '#EC4899',  // Pink
  Education: '#06B6D4',   // Cyan
  Utilities: '#6366F1',   // Indigo
  Income: '#22C55E',      // Green
  Other: '#6B7280',       // Gray
};

/**
 * Fallback colors for unknown categories
 */
export const FALLBACK_COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B',
  '#EC4899', '#06B6D4', '#6366F1', '#22C55E', '#6B7280',
];

/**
 * Get color for a category
 */
export const getCategoryColor = (category: string, index: number): string => {
  return CATEGORY_COLORS[category] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

/**
 * Format currency for Nigerian Naira
 */
export const formatNaira = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
};
