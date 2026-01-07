import React, { useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategoryBreakdown, CategoryChartProps } from '../../../types';
import { getCategoryColor, formatNaira } from '../../../utils/chart.utils';

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: { percentage: number };
  }>;
}

const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  if (!payload) return null;

  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
      {payload.map((entry, index) => (
        <li key={`legend-${index}`} className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700">{entry.value}</span>
          <span className="text-gray-500">
            ({entry.payload.percentage.toFixed(1)}%)
          </span>
        </li>
      ))}
    </ul>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: CategoryBreakdown;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200">
      <p className="font-medium text-gray-900">{data.category}</p>
      <p className="text-sm text-gray-600">{formatNaira(data.amount)}</p>
      <p className="text-sm text-gray-500">
        {data.percentage.toFixed(1)}% • {data.transactionCount} transactions
      </p>
    </div>
  );
};

export const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  onCategoryClick,
  variant = 'donut',
  showLegend = true,
  height = 300,
}) => {
  const handleClick = useCallback(
    (entry: CategoryBreakdown) => {
      if (onCategoryClick) {
        onCategoryClick(entry.category);
      }
    },
    [onCategoryClick]
  );

  if (!data || data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-gray-500"
        style={{ height }}
        role="img"
        aria-label="No category data available"
      >
        <p>No spending data available</p>
      </div>
    );
  }

  const innerRadius = variant === 'donut' ? '60%' : 0;
  const outerRadius = '80%';

  return (
    <div 
      className="w-full" 
      style={{ height }}
      role="img"
      aria-label={`Spending breakdown chart showing ${data.length} categories`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data as unknown as Record<string, unknown>[]}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="amount"
            nameKey="category"
            onClick={(entry) => handleClick(entry as unknown as CategoryBreakdown)}
            style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.category}-${index}`}
                fill={getCategoryColor(entry.category, index)}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              content={<CustomLegend />}
              verticalAlign="bottom"
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
