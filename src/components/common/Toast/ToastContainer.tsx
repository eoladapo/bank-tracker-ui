import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { removeToast } from '../../../features/ui/uiSlice';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  const handleDismiss = (id: string) => {
    dispatch(removeToast(id));
  };

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 flex flex-col items-center gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={handleDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
