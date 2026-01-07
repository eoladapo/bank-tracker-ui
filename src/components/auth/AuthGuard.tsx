import React, { useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { SplashScreen } from '../../pages/SplashScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Show splash screen during initial load
  if (showSplash && isLoading) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // If splash is still showing but loading is done, wait for splash to complete
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Protected route - redirect to login if not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Public route (login, register, etc.) - redirect to dashboard if already authenticated
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
