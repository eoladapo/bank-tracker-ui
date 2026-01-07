import { api } from '../api/baseApi';
import type {
  Anomaly,
  FinancialAdvice,
  SpendingPrediction,
  AIInsight,
  Transaction,
  CategoryBreakdown,
} from '../../types';

// Response types matching backend
export interface AnomalyResponse {
  transactionId: string;
  transaction: Transaction;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AdviceResponse {
  recommendations: FinancialAdvice[];
  summary: string;
}

export interface PredictionResponse {
  totalPredicted: number;
  byCategory: Array<{
    category: string;
    predictedAmount: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  confidence: number;
}

export interface InsightsResponse {
  summary: string;
  highlights: string[];
  warnings: string[];
  suggestions: string[];
}

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnomalies: builder.query<Anomaly[], void>({
      query: () => '/ai/anomalies',
      providesTags: ['AI'],
    }),

    getAdvice: builder.query<AdviceResponse, void>({
      query: () => '/ai/advice',
      providesTags: ['AI'],
    }),

    getPredictions: builder.query<PredictionResponse, void>({
      query: () => '/ai/predictions',
      providesTags: ['AI'],
    }),

    getInsights: builder.query<InsightsResponse, void>({
      query: () => '/ai/insights',
      providesTags: ['AI'],
    }),
  }),
});

export const {
  useGetAnomaliesQuery,
  useGetAdviceQuery,
  useGetPredictionsQuery,
  useGetInsightsQuery,
} = aiApi;
