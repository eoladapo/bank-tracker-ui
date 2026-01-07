import { api } from '../api/baseApi';
import type {
  Anomaly,
  FinancialAdvice,
} from '../../types';

// Response types matching backend
export interface AnomaliesApiResponse {
  anomalies: Anomaly[];
  totalCount: number;
  message: string;
}

export interface AdviceApiResponse {
  advice: {
    recommendations: FinancialAdvice[];
    summary: string;
  };
}

export interface PredictionsApiResponse {
  predictions: {
    totalPredicted: number;
    byCategory: Array<{
      category: string;
      predictedAmount: number;
      confidence: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }>;
    confidence: number;
  } | null;
  message: string;
}

export interface InsightsApiResponse {
  month: string;
  insights: {
    summary: string;
    highlights: string[];
    warnings: string[];
    suggestions: string[];
  };
}

// Frontend-facing response types
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
      transformResponse: (response: AnomaliesApiResponse) => response.anomalies || [],
      providesTags: ['AI'],
    }),

    getAdvice: builder.query<AdviceResponse, void>({
      query: () => '/ai/advice',
      transformResponse: (response: AdviceApiResponse) => response.advice || { recommendations: [], summary: '' },
      providesTags: ['AI'],
    }),

    getPredictions: builder.query<PredictionResponse | null, void>({
      query: () => '/ai/predictions',
      transformResponse: (response: PredictionsApiResponse) => response.predictions,
      providesTags: ['AI'],
    }),

    getInsights: builder.query<InsightsResponse, void>({
      query: () => '/ai/insights',
      transformResponse: (response: InsightsApiResponse) => response.insights || { summary: '', highlights: [], warnings: [], suggestions: [] },
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
