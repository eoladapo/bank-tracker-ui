import React, { useCallback, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { addToast } from '../../features/ui/uiSlice';
import { useGetAccountsQuery } from '../../features/accounts/accountsApi';
import { useGetTransactionsQuery } from '../../features/transactions/transactionsApi';
import { useGetMonthlyInsightsQuery, useGetComparisonQuery } from '../../features/insights/insightsApi';
import { CategoryChart } from '../../components/charts';
import { InsightCard } from '../../components/features/insights';
import { TransactionItem } from '../../components/features/transactions';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { MainLayout } from '../../components/layout';
import { getCurrentMonth, getPreviousMonth } from '../../utils/insights.utils';

const RECENT_TRANSACTIONS_LIMIT = 5;

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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const user = useAppSelector((state) => state.auth.user);
  const currentMonth = useMemo(() => getCurrentMonth(), []);
  const previousMonth = useMemo(() => getPreviousMonth(currentMonth), [currentMonth]);

  // Navigation handler
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Pull-to-refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  // Fetch accounts data
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isAccountsError,
    refetch: refetchAccounts,
  } = useGetAccountsQuery();

  // Fetch recent transactions (last 5)
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useGetTransactionsQuery({
    page: 1,
    limit: RECENT_TRANSACTIONS_LIMIT,
  });

  // Fetch monthly insights
  const {
    data: monthlyInsight,
    isLoading: isLoadingInsights,
    refetch: refetchInsights,
  } = useGetMonthlyInsightsQuery({ month: currentMonth });

  // Fetch month comparison
  const {
    data: comparison,
    isLoading: isLoadingComparison,
    refetch: refetchComparison,
  } = useGetComparisonQuery({
    currentMonth,
    previousMonth,
  });

  const isLoading = isLoadingAccounts || isLoadingTransactions || isLoadingInsights || isLoadingComparison;


  // Calculate total balance across all accounts
  const totalBalance = useMemo(() => {
    if (!accounts || accounts.length === 0) return 0;
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  }, [accounts]);

  // Get recent transactions (limited to 5)
  const recentTransactions = useMemo(() => {
    if (!transactionsData?.data) return [];
    return transactionsData.data.slice(0, RECENT_TRANSACTIONS_LIMIT);
  }, [transactionsData]);

  // Handle transaction click
  const handleTransactionClick = useCallback((id: string) => {
    navigate(`/transactions/${id}`);
  }, [navigate]);

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

  // Handle "View All" transactions click
  const handleViewAllTransactions = useCallback(() => {
    navigate('/transactions');
  }, [navigate]);

  // Handle link account click
  const handleLinkAccount = useCallback(() => {
    navigate('/accounts');
  }, [navigate]);

  // Refetch all data
  const refetchAll = useCallback(async () => {
    await Promise.all([
      refetchAccounts(),
      refetchTransactions(),
      refetchInsights(),
      refetchComparison(),
    ]);
  }, [refetchAccounts, refetchTransactions, refetchInsights, refetchComparison]);

  // Pull-to-refresh handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (pullStartY > 0 && containerRef.current?.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, Math.min(100, currentY - pullStartY));
      setPullDistance(distance);
    }
  }, [pullStartY]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 60) {
      setIsRefreshing(true);
      try {
        await refetchAll();
        dispatch(
          addToast({
            type: 'success',
            message: 'Dashboard refreshed',
            duration: 2000,
          })
        );
      } catch {
        dispatch(
          addToast({
            type: 'error',
            message: 'Failed to refresh dashboard',
          })
        );
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullStartY(0);
    setPullDistance(0);
  }, [pullDistance, refetchAll, dispatch]);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout
        userName={user?.name}
        activeNavItem={location.pathname}
        onNavigate={handleNavigate}
        showHeader={false}
        pageKey="dashboard"
      >
        <div className="p-4 space-y-4">
          {/* Balance Card Skeleton */}
          <LoadingSkeleton variant="card" height={140} />
          
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <LoadingSkeleton variant="card" height={100} />
            <LoadingSkeleton variant="card" height={100} />
          </div>
          
          {/* Chart Skeleton */}
          <LoadingSkeleton variant="card" height={300} />
          
          {/* Recent Transactions Skeleton */}
          <LoadingSkeleton variant="text" width={180} height={24} />
          {[1, 2, 3, 4, 5].map((i) => (
            <LoadingSkeleton key={i} variant="card" height={80} />
          ))}
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (isAccountsError) {
    return (
      <MainLayout
        userName={user?.name}
        activeNavItem={location.pathname}
        onNavigate={handleNavigate}
        showHeader={false}
        pageKey="dashboard"
      >
        <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h3>
            <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
            <Button variant="primary" onClick={() => refetchAll()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const hasAccounts = accounts && accounts.length > 0;


  // Empty state - no accounts linked
  if (!hasAccounts) {
    return (
      <MainLayout
        userName={user?.name}
        activeNavItem={location.pathname}
        onNavigate={handleNavigate}
        showHeader={false}
        pageKey="dashboard"
      >
        <div className="p-4">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'there'}</h1>
          </div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No accounts linked</h2>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              Link your bank accounts to start tracking your finances and get personalized insights.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleLinkAccount}
            >
              Link Your First Account
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      userName={user?.name}
      activeNavItem={location.pathname}
      onNavigate={handleNavigate}
      showHeader={false}
      pageKey="dashboard"
    >
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull-to-refresh indicator */}
        <AnimatePresence>
          {(pullDistance > 0 || isRefreshing) && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: pullDistance > 0 ? pullDistance : 60 }}
              exit={{ height: 0 }}
              className="flex items-center justify-center bg-primary-50 overflow-hidden"
            >
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
                className="w-6 h-6"
              >
                <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
              <span className="ml-2 text-sm text-primary-600">
                {isRefreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-gray-500">Welcome back,</p>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'there'}</h1>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Total Balance Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-primary-600 to-primary-700">
                <Card.Body className="py-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-primary-100 mb-1">Total Balance</p>
                    <p className="text-4xl font-bold text-white">
                      ₦{totalBalance.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-primary-200 mt-2">
                      Across {accounts?.length || 0} account{accounts?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>


            {/* Monthly Summary Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <InsightCard
                label="Monthly Spending"
                value={monthlyInsight?.totalSpending || 0}
                prefix="₦"
                comparison={comparison ? {
                  value: comparison.spendingChange,
                  label: 'vs last month',
                } : undefined}
                variant="default"
              />
              <InsightCard
                label="Monthly Income"
                value={monthlyInsight?.totalIncome || 0}
                prefix="₦"
                comparison={comparison ? {
                  value: comparison.incomeChange,
                  label: 'vs last month',
                } : undefined}
                variant="success"
              />
            </motion.div>

            {/* Spending by Category Chart */}
            {monthlyInsight?.categoryData && monthlyInsight.categoryData.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card>
                  <Card.Header>
                    <h2 className="text-lg font-semibold text-gray-900">Spending by Category</h2>
                    <p className="text-sm text-gray-500 mt-1">Tap a category to see transactions</p>
                  </Card.Header>
                  <Card.Body>
                    <CategoryChart
                      data={monthlyInsight.categoryData}
                      onCategoryClick={handleCategoryClick}
                      variant="donut"
                      height={280}
                    />
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Recent Transactions */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                {recentTransactions.length > 0 && (
                  <button
                    onClick={handleViewAllTransactions}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    View All
                  </button>
                )}
              </div>

              {recentTransactions.length === 0 ? (
                <Card>
                  <Card.Body>
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No transactions yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Sync your accounts to see transactions
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      onClick={handleTransactionClick}
                      showAnomalyBadge={true}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
