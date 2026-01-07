import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setOffline, addToast } from '../features/ui/uiSlice';


export const useOffline = () => {
  const dispatch = useAppDispatch();
  const isOffline = useAppSelector((state) => state.ui.isOffline);

  const handleOnline = useCallback(() => {
    dispatch(setOffline(false));
    dispatch(
      addToast({
        type: 'success',
        message: 'Connection restored',
        duration: 3000,
      })
    );
  }, [dispatch]);

  const handleOffline = useCallback(() => {
    dispatch(setOffline(true));
    dispatch(
      addToast({
        type: 'warning',
        message: 'You are offline. Some features may be unavailable.',
        duration: 5000,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    // Set initial state based on current connectivity
    dispatch(setOffline(!navigator.onLine));

    // Add event listeners for connectivity changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, handleOnline, handleOffline]);

  return isOffline;
};

export default useOffline;
