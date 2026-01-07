import { api } from '../api/baseApi';
import type { Transaction, TransactionFilters, PaginatedResponse } from '../../types';

// Response types matching backend API
interface GetTransactionsResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface GetTransactionResponse {
  transaction: Transaction;
}

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // GET /transactions - Get paginated transactions with filtering
    getTransactions: builder.query<PaginatedResponse<Transaction>, TransactionFilters>({
      query: (params) => ({
        url: '/transactions',
        params: {
          page: params.page,
          limit: params.limit,
          ...(params.startDate && { startDate: params.startDate }),
          ...(params.endDate && { endDate: params.endDate }),
          ...(params.category && { category: params.category }),
          ...(params.type && { type: params.type }),
        },
      }),
      transformResponse: (response: GetTransactionsResponse): PaginatedResponse<Transaction> => ({
        data: response.transactions,
        total: response.total,
        page: response.page,
        limit: response.limit,
        hasMore: response.hasMore,
      }),
      // Serialize query args excluding page for infinite scroll caching
      serializeQueryArgs: ({ queryArgs }) => {
        const { page: _page, ...rest } = queryArgs;
        return rest;
      },
      // Merge new items with existing cache for infinite scroll
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: [...currentCache.data, ...newItems.data],
        };
      },
      // Force refetch when page changes
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.data.map(({ id }) => ({ type: 'Transactions' as const, id })),
            { type: 'Transactions', id: 'LIST' },
          ]
          : [{ type: 'Transactions', id: 'LIST' }],
    }),

    // GET /transactions/:id - Get single transaction details
    getTransaction: builder.query<Transaction, string>({
      query: (id) => `/transactions/${id}`,
      transformResponse: (response: GetTransactionResponse) => response.transaction,
      providesTags: (_result, _error, id) => [{ type: 'Transactions', id }],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionQuery,
  useLazyGetTransactionsQuery,
} = transactionsApi;
