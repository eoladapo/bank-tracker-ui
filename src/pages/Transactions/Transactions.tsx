import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToast } from '../../features/ui/uiSlice';
import { useGetTransactionsQuery } from '../../features/transactions/transactionsApi';
import { TransactionItem, TransactionFilters } from '../../components/features/transactions';
import type { FilterValues } from '../../components/features/transactions';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { MainLayout } from '../../components/layout';
import type { Transaction } from '../../types';

const ITEMS_PER_PAGE = 20;

// Group transactions by date
const groupTransactionsByDate = (transactions: Transaction[]): Map<string, Transaction[]> => {
  const groups = new Map<string, Transaction[]>();
  
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString('en-NG', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    }
    
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(transaction);
  });
  
  return groups;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const user = useAppSelector((state) => state.auth.user);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  // Navigation handler
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Profile click handler
  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const {
    data: transactionsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTransactionsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    ...filters,
  });

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  // Handle transaction click
  const handleTransactionClick = useCallback((id: string) => {
    navigate(`/transactions/${id}`);
  }, [navigate]);

  // Infinite scroll - load more when reaching bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && transactionsData?.hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [transactionsData?.hasMore, isFetching]);

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
        setPage(1);
        await refetch();
        dispatch(
          addToast({
            type: 'success',
            message: 'Transactions refreshed',
            duration: 2000,
          })
        );
      } catch {
        dispatch(
          addToast({
            type: 'error',
            message: 'Failed to refresh transactions',
          })
        );
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullStartY(0);
    setPullDistance(0);
  }, [pullDistance, refetch, dispatch]);

  // Group transactions by date
  const groupedTransactions = transactionsData?.data
    ? groupTransactionsByDate(transactionsData.data)
    : new Map();

  // Loading state
  if (isLoading) {
    return (
      <MainLayout
        userName={user?.name}
        activeNavItem={location.pathname}
        onNavigate={handleNavigate}
        onProfileClick={handleProfileClick}
        showHeader={false}
        pageKey="transactions"
      >
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <LoadingSkeleton variant="text" width={150} height={28} />
          </div>
          <LoadingSkeleton variant="rectangular" height={56} />
          {[1, 2, 3, 4, 5].map((i) => (
            <LoadingSkeleton key={i} variant="card" height={80} />
          ))}
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (isError) {
    return (
      <MainLayout
        userName={user?.name}
        activeNavItem={location.pathname}
        onNavigate={handleNavigate}
        onProfileClick={handleProfileClick}
        showHeader={false}
        pageKey="transactions"
      >
        <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load transactions</h3>
            <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const hasTransactions = transactionsData && transactionsData.data.length > 0;

  return (
    <MainLayout
      userName={user?.name}
      activeNavItem={location.pathname}
      onNavigate={handleNavigate}
      onProfileClick={handleProfileClick}
      showHeader={false}
      pageKey="transactions"
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
              {transactionsData && (
                <p className="text-sm text-gray-500 mt-1">
                  {transactionsData.total} transaction{transactionsData.total !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button
              onClick={handleProfileClick}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Profile"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="mb-4">
            <TransactionFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Empty State */}
          {!hasTransactions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 px-4"
            >
              <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h2>
              <p className="text-gray-600 text-center max-w-sm">
                {Object.keys(filters).length > 0
                  ? 'Try adjusting your filters to see more transactions.'
                  : 'Link a bank account to start seeing your transactions here.'}
              </p>
            </motion.div>
          )}

          {/* Transactions List grouped by date */}
          {hasTransactions && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {Array.from(groupedTransactions.entries()).map(([dateGroup, transactions]: [string, Transaction[]]) => (
                <div key={dateGroup}>
                  {/* Date Header */}
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {dateGroup}
                  </h2>
                  
                  {/* Transactions for this date */}
                  <div className="space-y-3">
                    {transactions.map((transaction: Transaction) => (
                      <motion.div key={transaction.id} variants={itemVariants}>
                        <TransactionItem
                          transaction={transaction}
                          onClick={handleTransactionClick}
                          showAnomalyBadge={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Load More Trigger / Loading Indicator */}
          {hasTransactions && (
            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {isFetching && page > 1 ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </motion.div>
                  <span className="text-sm">Loading more...</span>
                </div>
              ) : transactionsData?.hasMore ? (
                <span className="text-sm text-gray-400">Scroll for more</span>
              ) : (
                <span className="text-sm text-gray-400">No more transactions</span>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Transactions;
