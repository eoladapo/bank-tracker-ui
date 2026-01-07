import React from 'react';
import { motion } from 'framer-motion';
import type { InsightCardProps } from '../../../../types';
import {
  formatInsightValue,
  getComparisonColor,
  getComparisonIcon,
} from '../../../../utils/insights.utils';

const variantStyles = {
  default: 'bg-white border-gray-200',
  primary: 'bg-primary-50 border-primary-200',
  success: 'bg-emerald-50 border-emerald-200',
  warning: 'bg-amber-50 border-amber-200',
  error: 'bg-red-50 border-red-200',
};

export const InsightCard: React.FC<InsightCardProps> = ({
  label,
  value,
  prefix,
  suffix,
  comparison,
  icon,
  variant = 'default',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`
        rounded-lg border p-4 shadow-sm
        ${variantStyles[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatInsightValue(value, prefix, suffix)}
          </p>
          {comparison && (
            <div className="mt-2 flex items-center gap-1">
              <span className={`text-sm font-medium ${getComparisonColor(comparison.value)}`}>
                {getComparisonIcon(comparison.value)}
                {Math.abs(comparison.value).toFixed(1)}%
              </span>
              {comparison.label && (
                <span className="text-sm text-gray-500">{comparison.label}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InsightCard;
