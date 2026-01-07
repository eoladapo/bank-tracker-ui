import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AuthGuard } from './components/auth/AuthGuard';
import { ToastContainer } from './components/common/Toast/ToastContainer';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

// Lazy load pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));

// Placeholder for Dashboard (to be implemented in later tasks)
const Dashboard = () => (
  <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary-700">Dashboard</h1>
      <p className="mt-2 text-gray-600">Coming soon...</p>
    </div>
  </div>
);

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
    <div className="w-full max-w-md px-4">
      <LoadingSkeleton variant="card" height={400} />
    </div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
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

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
