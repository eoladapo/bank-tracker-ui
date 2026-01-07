import React from 'react';
import { motion } from 'framer-motion';
import type { Transaction } from '../../../../types';
import {
  CategoryIcon,
  getSeverityColor,
  formatCurrency,
  formatTime,
} from '../../../../utils/transaction.utils';

export interface TransactionItemProps {
  transaction: Transaction;
  onClick: (id: string) => void;
  showAnomalyBadge?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onClick,
  showAnomalyBadge = true,
}) => {
  const formattedAmount = formatCurrency(transaction.amount, transaction.type);
  const formattedTime = formatTime(transaction.date);
  const amountColor = transaction.type === 'debit' ? 'text-red-600' : 'text-green-600';

  const handleClick = () => {
    onClick(transaction.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(transaction.id);
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md hover:border-primary-200 transition-all duration-200"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${transaction.narration}, ${formattedAmount}`}
    >
      <div className="flex items-center gap-3">
        {/* Category Icon */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
          aria-hidden="true"
        >
          <CategoryIcon category={transaction.category} className="w-6 h-6" />
        </div>

        {/* Transaction Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 truncate">
              {transaction.narration}
            </h3>
            {/* Anomaly Badge */}
            {showAnomalyBadge && transaction.isAnomaly && (
              <span
                className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1 ${getSeverityColor(
                  transaction.anomalySeverity
                )}`}
                title={transaction.anomalyReason || 'Unusual transaction'}
                aria-label={`Anomaly: ${transaction.anomalySeverity || 'unknown'} severity`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {transaction.anomalySeverity || 'Anomaly'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">{transaction.category}</span>
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-400">{formattedTime}</span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex-shrink-0 text-right">
          <p className={`font-semibold ${amountColor}`}>{formattedAmount}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionItem;
