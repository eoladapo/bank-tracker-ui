import React from 'react';
import { motion } from 'framer-motion';
import type { FinancialAdvice } from '../../../../types';

export interface AIAdvicePanelProps {
  advice: FinancialAdvice[];
  summary?: string;
  isLoading?: boolean;
  className?: string;
}

// SVG Icons for priority levels
const PriorityHighIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const PriorityMediumIcon = () => (
  <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const PriorityLowIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const AIBotIcon = () => (
  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const priorityStyles = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    Icon: PriorityHighIcon,
  },
  medium: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    Icon: PriorityMediumIcon,
  },
  low: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    Icon: PriorityLowIcon,
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
        <div className="flex justify-center mb-2">
          <LightbulbIcon />
        </div>
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
          <AIBotIcon />
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
          const IconComponent = styles.Icon;
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
                <span className="flex-shrink-0 mt-0.5"><IconComponent /></span>
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
