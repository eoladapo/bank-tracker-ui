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

export const insightsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyInsights: builder.query<MonthlyInsight, GetMonthlyInsightsParams>({
      query: (params) => ({
        url: '/insights/monthly',
        params,
      }),
      providesTags: ['Insights'],
    }),

    getCategoryBreakdown: builder.query<CategoryBreakdown[], GetCategoryBreakdownParams>({
      query: (params) => ({
        url: '/insights/categories',
        params,
      }),
      providesTags: ['Insights'],
    }),

    getComparison: builder.query<MonthComparison, GetComparisonParams>({
      query: (params) => ({
        url: '/insights/comparison',
        params,
      }),
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
