import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetTransactionQuery } from '../../features/transactions/transactionsApi';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  getCategoryIcon,
  getSeverityStyles,
  formatCurrency,
  formatCurrencyValue,
  formatTime,
  formatFullDate,
} from '../../utils/transaction.utils';

export const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: transaction,
    isLoading,
    isError,
    refetch,
  } = useGetTransactionQuery(id!, {
    skip: !id,
  });

  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary p-4">
        <div className="mb-6">
          <LoadingSkeleton variant="text" width={100} height={24} />
        </div>
        <div className="flex flex-col items-center mb-6">
          <LoadingSkeleton variant="circular" width={80} height={80} />
          <LoadingSkeleton variant="text" width={200} height={40} className="mt-4" />
          <LoadingSkeleton variant="text" width={150} height={20} className="mt-2" />
        </div>
        <LoadingSkeleton variant="card" height={300} />
      </div>
    );
  }

  // Error state
  if (isError || !transaction) {
    return (
      <div className="min-h-screen bg-bg-secondary p-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction not found</h3>
            <p className="text-gray-600 mb-4">The transaction you're looking for doesn't exist or has been removed.</p>
            <Button variant="primary" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryIcon = getCategoryIcon(transaction.category);
  const formattedAmount = formatCurrency(transaction.amount, transaction.type);
  const formattedDate = formatFullDate(transaction.date);
  const formattedTime = formatTime(transaction.date);
  const amountColor = transaction.type === 'debit' ? 'text-red-600' : 'text-green-600';
  const severityStyles = getSeverityStyles(transaction.anomalySeverity);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-secondary"
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <div className="p-4">
        {/* Transaction Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-6"
        >
          {/* Category Icon */}
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl mb-4">
            {categoryIcon}
          </div>

          {/* Amount */}
          <h1 className={`text-4xl font-bold ${amountColor}`}>{formattedAmount}</h1>

          {/* Narration */}
          <p className="text-lg text-gray-700 mt-2 text-center">{transaction.narration}</p>

          {/* Date & Time */}
          <p className="text-sm text-gray-500 mt-1">
            {formattedDate} at {formattedTime}
          </p>
        </motion.div>

        {/* Anomaly Alert */}
        {transaction.isAnomaly && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mb-4 p-4 rounded-lg border ${severityStyles.bg} ${severityStyles.border}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className={`font-semibold ${severityStyles.text}`}>
                  Unusual Transaction Detected
                </h3>
                <p className={`text-sm mt-1 ${severityStyles.text}`}>
                  Severity: <span className="font-medium capitalize">{transaction.anomalySeverity}</span>
                </p>
                {transaction.anomalyReason && (
                  <p className="text-sm text-gray-600 mt-2">{transaction.anomalyReason}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Transaction Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <Card.Header>
              <h2 className="font-semibold text-gray-900">Transaction Details</h2>
            </Card.Header>
            <Card.Body className="space-y-4">
              {/* Category */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-900">{transaction.category}</span>
              </div>

              {/* Type */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Type</span>
                <span className={`font-medium capitalize ${transaction.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.type}
                </span>
              </div>

              {/* Balance After */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Balance After</span>
                <span className="font-medium text-gray-900">
                  {formatCurrencyValue(transaction.balance)}
                </span>
              </div>

              {/* Categorization Method */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Categorized By</span>
                <span className="font-medium text-gray-900 capitalize">
                  {transaction.categorizationMethod === 'ai' ? 'AI' : transaction.categorizationMethod}
                  {transaction.aiConfidence !== null && transaction.categorizationMethod === 'ai' && (
                    <span className="text-gray-400 text-sm ml-1">
                      ({Math.round(transaction.aiConfidence * 100)}% confidence)
                    </span>
                  )}
                </span>
              </div>

              {/* Transaction ID */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-sm text-gray-600">{transaction.id.slice(0, 8)}...</span>
              </div>

              {/* Account ID */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Account ID</span>
                <span className="font-mono text-sm text-gray-600">{transaction.accountId.slice(0, 8)}...</span>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TransactionDetail;
