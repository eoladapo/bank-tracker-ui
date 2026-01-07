import { api } from '../api/baseApi';
import type { User } from '../../types';

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserResponse, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    updateCurrentUser: builder.mutation<UserResponse, UpdateUserRequest>({
      query: (data) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} = usersApi;
