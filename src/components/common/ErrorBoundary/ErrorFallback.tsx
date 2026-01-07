import { motion } from 'framer-motion';
import { Button } from '../Button';

interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

export const ErrorFallback = ({ error, onRetry }: ErrorFallbackProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-bg-secondary flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-500 mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        {error && import.meta.env.DEV && (
          <pre className="text-left text-xs bg-gray-100 p-3 rounded-lg mb-6 overflow-auto max-h-32 text-gray-600">
            {error.message}
          </pre>
        )}
        <Button onClick={onRetry} variant="primary" className="w-full">
          Try Again
        </Button>
      </div>
    </motion.div>
  );
};
