import { api } from '../api/baseApi';
import type {
  MonthlyInsight,
  CategoryBreakdown,
  MonthComparison,
  AIInsight,
} from '../../types';

export interface GetMonthlyInsightsParams {
  month?: string; // Format: YYYY-MM
}

export interface GetCategoryBreakdownParams {
  month?: string; // Format: YYYY-MM
  startDate?: string;
  endDate?: string;
}

export interface GetComparisonParams {
  currentMonth: string; // Format: YYYY-MM
  previousMonth?: string; // Format: YYYY-MM (defaults to previous month)
}

// API Response types
interface MonthlyInsightsResponse {
  insights: MonthlyInsight;
  message: string;
}

interface ComparisonResponse {
  comparison: MonthComparison;
  message: string;
}

interface CategoryBreakdownResponse {
  month: string;
  breakdown: { categories: CategoryBreakdown[] };
  totalSpending: number;
}

export const insightsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyInsights: builder.query<MonthlyInsight, GetMonthlyInsightsParams>({
      query: (params) => ({
        url: '/insights/monthly',
        params,
      }),
      transformResponse: (response: MonthlyInsightsResponse) => response.insights,
      providesTags: ['Insights'],
    }),

    getCategoryBreakdown: builder.query<CategoryBreakdown[], GetCategoryBreakdownParams>({
      query: (params) => ({
        url: '/insights/categories',
        params,
      }),
      transformResponse: (response: CategoryBreakdownResponse) => response.breakdown?.categories || [],
      providesTags: ['Insights'],
    }),

    getComparison: builder.query<MonthComparison, GetComparisonParams>({
      query: (params) => ({
        url: '/insights/comparison',
        params,
      }),
      transformResponse: (response: ComparisonResponse) => response.comparison,
      providesTags: ['Insights'],
    }),

    recalculateInsights: builder.mutation<MonthlyInsight, { month: string }>({
      query: (body) => ({
        url: '/insights/recalculate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Insights'],
    }),

    getAIInsights: builder.query<AIInsight, GetMonthlyInsightsParams>({
      query: (params) => ({
        url: '/insights/ai',
        params,
      }),
      providesTags: ['Insights'],
    }),
  }),
});

export const {
  useGetMonthlyInsightsQuery,
  useGetCategoryBreakdownQuery,
  useGetComparisonQuery,
  useRecalculateInsightsMutation,
  useGetAIInsightsQuery,
} = insightsApi;
