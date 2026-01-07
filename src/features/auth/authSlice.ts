import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types';
import {
  getStoredTokens,
  storeTokens,
  clearTokens,
  getStoredUser,
  storeUser,
} from '../../utils/storage';

// Initialize state from localStorage for persistence
const storedTokens = getStoredTokens();
const storedUser = getStoredUser<User>();

const initialState: AuthState = {
  user: storedUser,
  accessToken: storedTokens.accessToken,
  refreshToken: storedTokens.refreshToken,
  isAuthenticated: !!(storedTokens.accessToken && storedUser),
  isLoading: !storedTokens.accessToken, // Only loading if no stored token
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      // Persist to localStorage
      storeTokens(action.payload.accessToken, action.payload.refreshToken);
      storeUser(action.payload.user);
    },
    updateTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      // Persist to localStorage
      storeTokens(action.payload.accessToken, action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear from localStorage
      clearTokens();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, updateTokens, logout, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
