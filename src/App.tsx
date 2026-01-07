import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AuthGuard } from './components/auth/AuthGuard';
import { ToastContainer } from './components/common/Toast/ToastContainer';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useOffline } from './hooks';

// Lazy load pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions/Transactions'));
const TransactionDetail = lazy(() => import('./pages/Transactions/TransactionDetail'));
const Insights = lazy(() => import('./pages/Insights/Insights'));
const AI = lazy(() => import('./pages/AI/AI'));
const Accounts = lazy(() => import('./pages/Accounts/Accounts'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const ChangePassword = lazy(() => import('./pages/Profile/ChangePassword'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
    <div className="w-full max-w-md px-4">
      <LoadingSkeleton variant="card" height={400} />
    </div>
  </div>
);

// App content wrapper that uses hooks requiring Redux context
const AppContent = () => {
  // Initialize offline detection
  useOffline();

  return (
    <>
      <OfflineIndicator />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes (redirect to dashboard if authenticated) */}
          <Route
            path="/login"
            element={
              <AuthGuard requireAuth={false}>
                <Login />
              </AuthGuard>
            }
          />
          <Route
            path="/register"
            element={
              <AuthGuard requireAuth={false}>
                <Register />
              </AuthGuard>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthGuard requireAuth={false}>
                <ForgotPassword />
              </AuthGuard>
            }
          />
          <Route
            path="/reset-password"
            element={
              <AuthGuard requireAuth={false}>
                <ResetPassword />
              </AuthGuard>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard requireAuth={true}>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/transactions"
            element={
              <AuthGuard requireAuth={true}>
                <Transactions />
              </AuthGuard>
            }
          />
          <Route
            path="/transactions/:id"
            element={
              <AuthGuard requireAuth={true}>
                <TransactionDetail />
              </AuthGuard>
            }
          />
          <Route
            path="/insights"
            element={
              <AuthGuard requireAuth={true}>
                <Insights />
              </AuthGuard>
            }
          />
          <Route
            path="/ai"
            element={
              <AuthGuard requireAuth={true}>
                <AI />
              </AuthGuard>
            }
          />
          <Route
            path="/accounts"
            element={
              <AuthGuard requireAuth={true}>
                <Accounts />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard requireAuth={true}>
                <Profile />
              </AuthGuard>
            }
          />
          <Route
            path="/profile/change-password"
            element={
              <AuthGuard requireAuth={true}>
                <ChangePassword />
              </AuthGuard>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
