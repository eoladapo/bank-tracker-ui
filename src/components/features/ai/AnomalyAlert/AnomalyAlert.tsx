import React from 'react';
import { motion } from 'framer-motion';
import type { Anomaly } from '../../../../types';

export interface AnomalyAlertProps {
  anomaly: Anomaly;
  onClick?: (transactionId: string) => void;
  className?: string;
}

// SVG Icons for severity levels
const AlertHighIcon = () => (
  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const AlertMediumIcon = () => (
  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const AlertLowIcon = () => (
  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const severityStyles = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    Icon: AlertHighIcon,
    iconBg: 'bg-red-100',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
  },
  medium: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    Icon: AlertMediumIcon,
    iconBg: 'bg-amber-100',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
  },
  low: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    Icon: AlertLowIcon,
    iconBg: 'bg-blue-100',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
};

export const AnomalyAlert: React.FC<AnomalyAlertProps> = ({
  anomaly,
  onClick,
  className = '',
}) => {
  const { transaction, reason, severity } = anomaly;
  const styles = severityStyles[severity];
  const IconComponent = styles.Icon;

  const handleClick = () => {
    if (onClick) {
      onClick(anomaly.transactionId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(anomaly.transactionId);
    }
  };

  const formatAmount = (amount: number, type: 'debit' | 'credit') => {
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
    return type === 'debit' ? `-${formatted}` : `+${formatted}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      className={`
        rounded-lg border-l-4 p-4
        ${styles.bg} ${styles.border}
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : 'alert'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${severity} severity anomaly: ${reason}`}
    >
      <div className="flex items-start gap-3">
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          ${styles.iconBg}
        `}>
          <IconComponent />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`
              text-xs font-semibold uppercase px-2 py-0.5 rounded
              ${styles.badge}
            `}>
              {severity} severity
            </span>
          </div>

          <p className={`text-sm font-medium ${styles.text} mb-2`}>
            {reason}
          </p>

          {transaction && (
            <div className="bg-white/50 rounded p-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium truncate">
                  {transaction.narration}
                </span>
                <span className={`
                  text-sm font-semibold ml-2 flex-shrink-0
                  ${transaction.type === 'debit' ? 'text-red-600' : 'text-emerald-600'}
                `}>
                  {formatAmount(transaction.amount, transaction.type)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{transaction.category}</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
          )}

          {onClick && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span>Tap to view transaction details</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnomalyAlert;
