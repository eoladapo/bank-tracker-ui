import { api } from '../api/baseApi';
import type { BankAccount } from '../../types';

// Response types matching backend API
interface GetAccountsResponse {
  accounts: BankAccount[];
}

interface LinkAccountResponse {
  id: string;
  institutionName: string;
  accountType: string;
  accountNumber: string;
  balance: number;
  currency: string;
  message: string;
}

interface SyncAccountResponse {
  accountId: string;
  transactionsAdded: number;
  transactionsUpdated: number;
  lastSyncedAt: string;
}

interface UnlinkAccountResponse {
  message: string;
}

export const accountsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /mono/accounts - Get all linked bank accounts
    getAccounts: builder.query<BankAccount[], void>({
      query: () => '/mono/accounts',
      transformResponse: (response: GetAccountsResponse) => response.accounts,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Accounts' as const, id })),
            { type: 'Accounts', id: 'LIST' },
          ]
          : [{ type: 'Accounts', id: 'LIST' }],
    }),

    // POST /mono/link - Link a bank account using Mono authorization code
    linkAccount: builder.mutation<LinkAccountResponse, { code: string }>({
      query: (body) => ({
        url: '/mono/link',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Accounts', id: 'LIST' }],
    }),

    // DELETE /mono/accounts/:accountId - Unlink a bank account
    unlinkAccount: builder.mutation<UnlinkAccountResponse, string>({
      query: (accountId) => ({
        url: `/mono/accounts/${accountId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, accountId) => [
        { type: 'Accounts', id: accountId },
        { type: 'Accounts', id: 'LIST' },
        { type: 'Transactions', id: 'LIST' },
      ],
    }),

    // POST /mono/accounts/:accountId/sync - Trigger transaction sync for an account
    syncAccount: builder.mutation<SyncAccountResponse, string>({
      query: (accountId) => ({
        url: `/mono/accounts/${accountId}/sync`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, accountId) => [
        { type: 'Accounts', id: accountId },
        { type: 'Accounts', id: 'LIST' },
        { type: 'Transactions', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useLinkAccountMutation,
  useUnlinkAccountMutation,
  useSyncAccountMutation,
} = accountsApi;
