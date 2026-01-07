import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../app/hooks';
import { addToast } from '../../features/ui/uiSlice';
import {
  useGetAnomaliesQuery,
  useGetAdviceQuery,
  useGetPredictionsQuery,
  useGetInsightsQuery,
} from '../../features/ai/aiApi';
import { AIAdvicePanel } from '../../components/features/ai/AIAdvicePanel';
import { AnomalyAlert } from '../../components/features/ai/AnomalyAlert';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Card } from '../../components/common/Card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const AI: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Fetch AI data
  const {
    data: anomalies,
    isLoading: isLoadingAnomalies,
    isError: isAnomaliesError,
    refetch: refetchAnomalies,
  } = useGetAnomaliesQuery();

  const {
    data: advice,
    isLoading: isLoadingAdvice,
  } = useGetAdviceQuery();

  const {
    data: predictions,
    isLoading: isLoadingPredictions,
  } = useGetPredictionsQuery();

  const {
    data: insights,
    isLoading: isLoadingInsights,
  } = useGetInsightsQuery();

  const isLoading = isLoadingAnomalies || isLoadingAdvice || isLoadingPredictions || isLoadingInsights;

  // Handle anomaly click - navigate to transaction
  const handleAnomalyClick = useCallback((transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
    dispatch(
      addToast({
        type: 'info',
        message: 'Viewing anomaly transaction',
        duration: 2000,
      })
    );
  }, [navigate, dispatch]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-secondary p-4 space-y-4">
        <LoadingSkeleton variant="text" width={150} height={28} />
        <LoadingSkeleton variant="card" height={150} />
        <LoadingSkeleton variant="card" height={200} />
        <LoadingSkeleton variant="card" height={300} />
        <LoadingSkeleton variant="card" height={200} />
      </div>
    );
  }

  // Error state
  if (isAnomaliesError) {
    return (
      <div className="min-h-screen bg-bg-secondary p-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load AI features</h3>
          <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
          <button
            onClick={() => refetchAnomalies()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasData = anomalies?.length || advice?.recommendations?.length || predictions || insights;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-500">Personalized financial insights</p>
          </div>
        </div>

        {/* Empty State */}
        {!hasData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-4xl">🤖</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No AI insights yet</h2>
            <p className="text-gray-600 text-center max-w-sm">
              Link a bank account and sync your transactions to get AI-powered financial insights.
            </p>
          </motion.div>
        )}

        {/* AI Content */}
        {hasData && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* AI Insights Summary */}
            {insights && (
              <motion.div variants={itemVariants}>
                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
                    </div>
                  </Card.Header>
                  <Card.Body className="space-y-4">
                    {insights.summary && (
                      <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
                    )}
                    
                    {insights.highlights && insights.highlights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Highlights</h4>
                        <ul className="space-y-2">
                          {insights.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-emerald-500 mt-0.5">✓</span>
                              <span className="text-sm text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {insights.warnings && insights.warnings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Warnings</h4>
                        <ul className="space-y-2">
                          {insights.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">⚠️</span>
                              <span className="text-sm text-gray-700">{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {insights.suggestions && insights.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Suggestions</h4>
                        <ul className="space-y-2">
                          {insights.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary-500 mt-0.5">💡</span>
                              <span className="text-sm text-gray-700">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Spending Predictions */}
            {predictions && (
              <motion.div variants={itemVariants}>
                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      <h2 className="text-lg font-semibold text-gray-900">Spending Predictions</h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Estimated spending for this month
                    </p>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-4">
                      {/* Total Predicted */}
                      <div className="bg-primary-50 rounded-lg p-4">
                        <p className="text-sm text-primary-600 font-medium">Predicted Total</p>
                        <p className="text-3xl font-bold text-primary-700">
                          ₦{predictions.totalPredicted.toLocaleString('en-NG')}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 bg-primary-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${Math.min(predictions.confidence * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-primary-600">
                            {(predictions.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                      </div>

                      {/* Category Predictions */}
                      {predictions.byCategory && predictions.byCategory.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-3">By Category</h4>
                          <div className="space-y-3">
                            {predictions.byCategory.slice(0, 5).map((cat, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700">{cat.category}</span>
                                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                                    cat.trend === 'increasing' ? 'bg-red-100 text-red-600' :
                                    cat.trend === 'decreasing' ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {cat.trend === 'increasing' ? '↑' : cat.trend === 'decreasing' ? '↓' : '→'}
                                  </span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  ₦{cat.predictedAmount.toLocaleString('en-NG')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            )}

            {/* Financial Advice */}
            {advice && advice.recommendations && (
              <motion.div variants={itemVariants}>
                <AIAdvicePanel
                  advice={advice.recommendations}
                  summary={advice.summary}
                />
              </motion.div>
            )}

            {/* Anomaly Alerts */}
            {anomalies && anomalies.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚨</span>
                    <h2 className="text-lg font-semibold text-gray-900">Anomaly Alerts</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {anomalies.length} detected
                  </span>
                </div>
                <div className="space-y-3">
                  {anomalies.map((anomaly, index) => (
                    <AnomalyAlert
                      key={anomaly.transactionId || index}
                      anomaly={anomaly}
                      onClick={handleAnomalyClick}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AI;
