import React from 'react';
import { Card } from '../../../common/Card';
import { Button } from '../../../common/Button';
import type { BankAccount } from '../../../../types';

export interface BankAccountCardProps {
  account: BankAccount;
  onSync: (accountId: string) => void;
  onUnlink: (accountId: string) => void;
  isSyncing?: boolean;
}

// Bank institution icons/colors mapping
const getInstitutionColor = (institutionName: string): string => {
  const name = institutionName.toLowerCase();
  if (name.includes('gtbank') || name.includes('guaranty')) return 'bg-orange-500';
  if (name.includes('access')) return 'bg-orange-600';
  if (name.includes('first bank')) return 'bg-blue-700';
  if (name.includes('uba')) return 'bg-red-600';
  if (name.includes('zenith')) return 'bg-red-700';
  if (name.includes('stanbic')) return 'bg-blue-600';
  if (name.includes('fidelity')) return 'bg-green-600';
  return 'bg-primary-500';
};

const getAccountTypeLabel = (accountType: string): string => {
  const type = accountType.toLowerCase();
  if (type === 'savings') return 'Savings';
  if (type === 'current') return 'Current';
  if (type === 'domiciliary') return 'Domiciliary';
  return accountType.charAt(0).toUpperCase() + accountType.slice(1);
};

const formatCurrency = (amount: number, currency: string): string => {
  const currencySymbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
  };
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatLastSynced = (lastSyncedAt: string | null): string => {
  if (!lastSyncedAt) return 'Never synced';
  
  const date = new Date(lastSyncedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
};


export const BankAccountCard: React.FC<BankAccountCardProps> = ({
  account,
  onSync,
  onUnlink,
  isSyncing = false,
}) => {
  const institutionColor = getInstitutionColor(account.institutionName);
  const accountTypeLabel = getAccountTypeLabel(account.accountType);
  const formattedBalance = formatCurrency(account.balance, account.currency);
  const lastSyncedText = formatLastSynced(account.lastSyncedAt);

  const handleSync = () => {
    onSync(account.id);
  };

  const handleUnlink = () => {
    onUnlink(account.id);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        {/* Institution Icon */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full ${institutionColor} flex items-center justify-center`}
          aria-hidden="true"
        >
          <span className="text-white font-bold text-lg">
            {account.institutionName.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Account Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {account.institutionName}
            </h3>
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {accountTypeLabel}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mb-2">
            •••• {account.accountNumber}
          </p>

          <p className="text-2xl font-bold text-gray-900">
            {formattedBalance}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {isSyncing ? 'Syncing...' : `Last synced: ${lastSyncedText}`}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSync}
          isLoading={isSyncing}
          disabled={isSyncing}
          className="flex-1 rounded-none border-r border-gray-100"
          aria-label={`Sync ${account.institutionName} account`}
        >
          {isSyncing ? 'Syncing...' : 'Sync'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUnlink}
          disabled={isSyncing}
          className="flex-1 rounded-none text-error hover:text-error hover:bg-red-50"
          aria-label={`Unlink ${account.institutionName} account`}
        >
          Unlink
        </Button>
      </div>
    </Card>
  );
};

export default BankAccountCard;
