import React from 'react';
import { motion } from 'framer-motion';
import type { FinancialAdvice } from '../../../../types';

export interface AIAdvicePanelProps {
  advice: FinancialAdvice[];
  summary?: string;
  isLoading?: boolean;
  className?: string;
}

const priorityStyles = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    icon: '🔴',
  },
  medium: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    icon: '🟡',
  },
  low: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: '🟢',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const AIAdvicePanel: React.FC<AIAdvicePanelProps> = ({
  advice,
  summary,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!advice || advice.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 text-center ${className}`}>
        <div className="text-4xl mb-2">💡</div>
        <p className="text-gray-500">No financial advice available yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Keep tracking your spending to get personalized recommendations.
        </p>
      </div>
    );
  }

  // Sort advice by priority (high first)
  const sortedAdvice = [...advice].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h3 className="font-semibold text-gray-900">AI Financial Advice</h3>
        </div>
        {summary && (
          <p className="text-sm text-gray-600 mt-1">{summary}</p>
        )}
      </div>

      <motion.div
        className="p-4 space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedAdvice.map((item, index) => {
          const styles = priorityStyles[item.priority];
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`
                rounded-lg border p-4
                ${styles.bg} ${styles.border}
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{styles.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.title}
                    </h4>
                    <span className={`
                      text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0
                      ${styles.badge}
                    `}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {item.category && (
                    <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AIAdvicePanel;
