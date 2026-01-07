import { useState, useCallback, useEffect, useRef } from 'react';
import MonoConnect from '@mono.co/connect.js';

interface UseMonoConnectOptions {
  onSuccess: (code: string) => void | Promise<void>;
  onClose?: () => void;
}

interface UseMonoConnectReturn {
  open: () => void;
  isScriptLoading: boolean;
  isScriptLoaded: boolean;
  scriptError: string | null;
  retryLoadScript: () => void;
}

export function useMonoConnect(options: UseMonoConnectOptions): UseMonoConnectReturn {
  const { onSuccess, onClose } = options;
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const monoInstanceRef = useRef<MonoConnect | null>(null);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_MONO_PUBLIC_KEY;

    if (!publicKey) {
      setScriptError('Bank connection is not configured. Please contact support.');
      return;
    }

    try {
      monoInstanceRef.current = new MonoConnect({
        key: publicKey,
        onSuccess: (data: { code: string }) => onSuccess(data.code),
        onClose: () => onClose?.(),
      });
      monoInstanceRef.current.setup();
      setIsScriptLoaded(true);
    } catch {
      setScriptError('Failed to initialize bank connection.');
    }
  }, [onSuccess, onClose]);

  const open = useCallback(() => {
    if (!monoInstanceRef.current) {
      setScriptError('Bank connection is not ready. Please refresh the page.');
      return;
    }
    monoInstanceRef.current.open();
  }, []);

  const retryLoadScript = useCallback(() => {
    window.location.reload();
  }, []);

  return { open, isScriptLoading: false, isScriptLoaded, scriptError, retryLoadScript };
}
