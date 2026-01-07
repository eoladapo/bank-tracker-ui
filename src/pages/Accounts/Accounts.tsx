import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addToast } from '../../features/ui/uiSlice';
import {
  useGetAccountsQuery,
  useSyncAccountMutation,
  useUnlinkAccountMutation,
  useLinkAccountMutation,
} from '../../features/accounts/accountsApi';
import { BankAccountCard } from '../../components/features/accounts';
import { Button } from '../../components/common/Button';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ConfirmModal } from '../../components/common/Modal';
import { MainLayout } from '../../components/layout';

// Mono Connect widget types
declare global {
  interface Window {
    MonoConnect?: new (config: MonoConnectConfig) => MonoConnectInstance;
  }
}

interface MonoConnectConfig {
  key: string;
  onSuccess: (data: { code: string }) => void;
  onClose: () => void;
}

interface MonoConnectInstance {
  open: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


export const Accounts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: accounts, isLoading, isError, refetch } = useGetAccountsQuery();
  const [syncAccount, { isLoading: isSyncingAccount }] = useSyncAccountMutation();
  const [unlinkAccount, { isLoading: isUnlinking }] = useUnlinkAccountMutation();
  const [linkAccount, { isLoading: isLinking }] = useLinkAccountMutation();

  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);
  const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);
  const [accountToUnlink, setAccountToUnlink] = useState<string | null>(null);

  // Navigation handler
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleSync = useCallback(async (accountId: string) => {
    setSyncingAccountId(accountId);
    try {
      await syncAccount(accountId).unwrap();
      dispatch(
        addToast({
          type: 'success',
          message: 'Account synced successfully',
        })
      );
    } catch {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to sync account. Please try again.',
        })
      );
    } finally {
      setSyncingAccountId(null);
    }
  }, [syncAccount, dispatch]);

  const handleUnlinkClick = useCallback((accountId: string) => {
    setAccountToUnlink(accountId);
    setUnlinkModalOpen(true);
  }, []);

  const handleUnlinkConfirm = useCallback(async () => {
    if (!accountToUnlink) return;

    try {
      await unlinkAccount(accountToUnlink).unwrap();
      dispatch(
        addToast({
          type: 'success',
          message: 'Account unlinked successfully',
        })
      );
    } catch {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to unlink account. Please try again.',
        })
      );
    } finally {
      setUnlinkModalOpen(false);
      setAccountToUnlink(null);
    }
  }, [accountToUnlink, unlinkAccount, dispatch]);

  const handleUnlinkCancel = useCallback(() => {
    setUnlinkModalOpen(false);
    setAccountToUnlink(null);
  }, []);


  const handleLinkAccount = useCallback(() => {
    const monoPublicKey = import.meta.env.VITE_MONO_PUBLIC_KEY;

    if (!monoPublicKey) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Mono Connect is not configured. Please contact support.',
        })
      );
      return;
    }

    if (!window.MonoConnect) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Mono Connect widget failed to load. Please refresh the page.',
        })
      );
      return;
    }

    const monoConnect = new window.MonoConnect({
      key: monoPublicKey,
      onSuccess: async (data: { code: string }) => {
        try {
          await linkAccount({ code: data.code }).unwrap();
          dispatch(
            addToast({
              type: 'success',
              message: 'Bank account linked successfully!',
            })
          );
          refetch();
        } catch {
          dispatch(
            addToast({
              type: 'error',
              message: 'Failed to link account. Please try again.',
            })
          );
        }
      },
      onClose: () => {
        // User closed the widget without completing
      },
    });

    monoConnect.open();
  }, [linkAccount, dispatch, refetch]);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout
        userName={user?.name}
        activeNavItem={location.pathname}
        onNavigate={handleNavigate}
        showHeader={false}
        pageKey="accounts"
      >
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <LoadingSkeleton variant="text" width={150} height={28} />
            <LoadingSkeleton variant="rectangular" width={120} height={44} />
          </div>
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} variant="card" height={160} />
          ))}
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (isError) {
    return (
      <MainLayout
        userName={user?.name}
        activeNavItem={location.pathname}
        onNavigate={handleNavigate}
        showHeader={false}
        pageKey="accounts"
      >
        <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load accounts</h3>
            <p className="text-gray-600 mb-4">Something went wrong. Please try again.</p>
            <Button variant="primary" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }


  const hasAccounts = accounts && accounts.length > 0;

  return (
    <MainLayout
      userName={user?.name}
      activeNavItem={location.pathname}
      onNavigate={handleNavigate}
      showHeader={false}
      pageKey="accounts"
    >
      <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1>
        <Button
          variant="primary"
          onClick={handleLinkAccount}
          isLoading={isLinking}
          disabled={isLinking}
        >
          Link Account
        </Button>
      </div>

      {/* Empty State */}
      {!hasAccounts && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="w-20 h-20 mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No accounts linked</h2>
          <p className="text-gray-600 text-center mb-6 max-w-sm">
            Link your bank accounts to start tracking your transactions and get personalized insights.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleLinkAccount}
            isLoading={isLinking}
            disabled={isLinking}
          >
            Link Your First Account
          </Button>
        </motion.div>
      )}

      {/* Accounts List */}
      {hasAccounts && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {accounts.map((account) => (
            <motion.div key={account.id} variants={itemVariants}>
              <BankAccountCard
                account={account}
                onSync={handleSync}
                onUnlink={handleUnlinkClick}
                isSyncing={syncingAccountId === account.id && isSyncingAccount}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Unlink Confirmation Modal */}
      <ConfirmModal
        isOpen={unlinkModalOpen}
        onClose={handleUnlinkCancel}
        title="Unlink Account"
        message="Are you sure you want to unlink this account? All associated transactions will be removed. This action cannot be undone."
        confirmText="Unlink"
        cancelText="Cancel"
        onConfirm={handleUnlinkConfirm}
        confirmVariant="primary"
        isConfirmLoading={isUnlinking}
      />
      </div>
    </MainLayout>
  );
};

export default Accounts;
