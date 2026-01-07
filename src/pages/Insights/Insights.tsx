import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../app/hooks';
import { addToast } from '../../features/ui/uiSlice';
import {
  useGetMonthlyInsightsQuery,
  useGetCategoryBreakdownQuery,
  useGetComparisonQuery,
} from '../../features/insights/insightsApi';
import { CategoryChart } from '../../components/charts';
import { InsightCard } from '../../components/features/insights';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Card } from '../../components/common/Card';
import {
  generateMonthOptions,
  getCurrentMonth,
  getPreviousMonth,
} from '../../utils/insights.utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Insights: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  
  const monthOptions = useMemo(() => generateMonthOptions(), []);
  const previousMonth = useMemo(() => getPreviousMonth(selectedMonth), [selectedMonth]);

  // Fetch insights data
  const {
    data: monthlyInsight,
    isLoading: isLoadingMonthly,
    isError: isMonthlyError,
    refetch: refetchMonthly,
  } = useGetMonthlyInsightsQuery({ month: selectedMonth });

  const {
    data: categoryBreakdown,
    isLoading: isLoadingCategories,
  } = useGetCategoryBreakdownQuery({ month: selectedMonth });

  const {
    data: comparison,
    isLoading: isLoadingComparison,
  } = useGetComparisonQuery({
    currentMonth: selectedMonth,
    previousMonth,
  });

  const isLoading = isLoadingMonthly || isLoadingCategories || isLoadingComparison;

  // Handle month change
  const handleMonthChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  }, []);

  // Handle category click - navigate to transactions filtered by category
  const handleCategoryClick = useCallback((category: string) => {
    navigate(`/transactions?category=${encodeURIComponent(category)}`);
    dispatch(
      addToast({
        type: 'info',
        message: `Showing ${category} transactions`,
        duration: 2000,
      })
    );
  }, [navigate, dispatch]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <LoadingSkeleton variant="text" width={150} height={28} />
          <LoadingSkeleton variant="rectangular" width={150} height={40} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <LoadingSkeleton variant="card" height={100} />
          <LoadingSkeleton variant="card" height={100} />
        </div>
        <LoadingSkeleton variant="card" height={300} />
        <LoadingSkeleton variant="card" height={120} />
      </div>
    );
  }

  // Error state
  if (isMonthlyError) {
    return (
      <div className="min-h-screen bg-bg-secondary p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load insights</h3>
          <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
          <button
            onClick={() => refetchMonthly()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasData = monthlyInsight || categoryBreakdown;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="p-4">
        {/* Header with Month Selector */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            aria-label="Select month"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Empty State */}
        {!hasData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No insights available</h2>
            <p className="text-gray-600 text-center max-w-sm">
              Link a bank account and sync your transactions to see spending insights.
            </p>
          </motion.div>
        )}

        {/* Insights Content */}
        {hasData && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Monthly Summary Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <InsightCard
                label="Total Spending"
                value={monthlyInsight?.totalSpending || 0}
                prefix="₦"
                comparison={comparison ? {
                  value: comparison.spendingChange,
                  label: 'vs last month',
                } : undefined}
                variant="default"
              />
              <InsightCard
                label="Total Income"
                value={monthlyInsight?.totalIncome || 0}
                prefix="₦"
                comparison={comparison ? {
                  value: comparison.incomeChange,
                  label: 'vs last month',
                } : undefined}
                variant="success"
              />
            </motion.div>

            {/* Category Breakdown Chart */}
            <motion.div variants={itemVariants}>
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
                  <p className="text-sm text-gray-500 mt-1">Tap a category to see transactions</p>
                </Card.Header>
                <Card.Body>
                  <CategoryChart
                    data={categoryBreakdown || monthlyInsight?.categoryData || []}
                    onCategoryClick={handleCategoryClick}
                    variant="donut"
                    height={280}
                  />
                </Card.Body>
              </Card>
            </motion.div>

            {/* Top Spending Category */}
            {monthlyInsight?.topCategory && (
              <motion.div variants={itemVariants}>
                <Card hoverable onClick={() => handleCategoryClick(monthlyInsight.topCategory)}>
                  <Card.Body>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Top Spending Category</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">
                          {monthlyInsight.topCategory}
                        </p>
                        {monthlyInsight.categoryData && (
                          <p className="text-sm text-gray-600 mt-1">
                            ₦{monthlyInsight.categoryData
                              .find(c => c.category === monthlyInsight.topCategory)
                              ?.amount.toLocaleString('en-NG') || '0'}
                          </p>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Month-over-Month Comparison */}
            {comparison && (
              <motion.div variants={itemVariants}>
                <Card>
                  <Card.Header>
                    <h2 className="text-lg font-semibold text-gray-900">Month Comparison</h2>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Spending Change</span>
                        <span className={`font-semibold ${
                          comparison.spendingChange > 0 ? 'text-red-600' : 
                          comparison.spendingChange < 0 ? 'text-emerald-600' : 'text-gray-600'
                        }`}>
                          {comparison.spendingChange > 0 ? '+' : ''}
                          {comparison.spendingChange.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Income Change</span>
                        <span className={`font-semibold ${
                          comparison.incomeChange > 0 ? 'text-emerald-600' : 
                          comparison.incomeChange < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {comparison.incomeChange > 0 ? '+' : ''}
                          {comparison.incomeChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* AI Insights */}
            {monthlyInsight?.aiInsights && (
              <motion.div variants={itemVariants}>
                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-gray-700 leading-relaxed">{monthlyInsight.aiInsights}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Insights;
