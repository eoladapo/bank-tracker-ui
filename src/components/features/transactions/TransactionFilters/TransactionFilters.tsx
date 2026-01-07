import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../common/Button';

export interface TransactionFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

export interface FilterValues {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: 'debit' | 'credit';
}

// Available categories
const CATEGORIES = [
  'All Categories',
  'Food & Dining',
  'Groceries',
  'Transport',
  'Entertainment',
  'Bills & Utilities',
  'Shopping',
  'Income',
  'Salary',
  'Transfer',
  'Healthcare',
  'Education',
  'Travel',
  'Subscription',
  'Investment',
  'Savings',
  'Other',
];

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [startDate, setStartDate] = useState(initialFilters.startDate || '');
  const [endDate, setEndDate] = useState(initialFilters.endDate || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [type, setType] = useState<'debit' | 'credit' | ''>(initialFilters.type || '');

  const hasActiveFilters = startDate || endDate || category || type;

  const handleApplyFilters = useCallback(() => {
    const filters: FilterValues = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (category && category !== 'All Categories') filters.category = category;
    if (type) filters.type = type;
    onFilterChange(filters);
    setIsExpanded(false);
  }, [startDate, endDate, category, type, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setCategory('');
    setType('');
    onFilterChange({});
    setIsExpanded(false);
  }, [onFilterChange]);

  const handleTypeToggle = (selectedType: 'debit' | 'credit') => {
    setType((prev) => (prev === selectedType ? '' : selectedType));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="filter-panel"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium text-gray-700">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
              Active
            </span>
          )}
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
              {/* Date Range */}
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      aria-label="Start date"
                    />
                  </div>
                  <span className="flex items-center text-gray-400">to</span>
                  <div className="flex-1">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      aria-label="End date"
                    />
                  </div>
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label
                  htmlFor="category-filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeToggle('debit')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      type === 'debit'
                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                    aria-pressed={type === 'debit'}
                  >
                    💸 Debit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeToggle('credit')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      type === 'credit'
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                    aria-pressed={type === 'credit'}
                  >
                    💰 Credit
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="flex-1"
                  disabled={!hasActiveFilters}
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApplyFilters}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionFilters;
