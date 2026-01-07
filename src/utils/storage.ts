/**
 * Storage utilities for cache persistence.
 * Implements localStorage-based persistence for RTK Query cache.
 * 
 * Requirements: 11.2, 11.3
 */

const CACHE_KEY = 'spendwise_api_cache';
const CACHE_VERSION = '1';
const CACHE_VERSION_KEY = 'spendwise_cache_version';

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheStore {
  [key: string]: CacheEntry;
}

// Default cache duration: 5 minutes (in milliseconds)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

/**
 * Check if cache version matches current version.
 * If not, clear the cache to prevent stale data issues.
 */
const validateCacheVersion = (): void => {
  try {
    const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    if (storedVersion !== CACHE_VERSION) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
    }
  } catch {
    // Ignore storage errors
  }
};

/**
 * Get all cached data from localStorage.
 */
export const getCacheStore = (): CacheStore => {
  try {
    validateCacheVersion();
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Ignore parse errors, return empty store
  }
  return {};
};

/**
 * Save cache store to localStorage.
 */
const saveCacheStore = (store: CacheStore): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage errors (e.g., quota exceeded)
  }
};

/**
 * Get a cached item by key.
 * Returns null if not found or expired.
 */
export const getCachedItem = <T>(key: string): T | null => {
  const store = getCacheStore();
  const entry = store[key];

  if (!entry) {
    return null;
  }

  // Check if cache has expired
  if (Date.now() > entry.expiresAt) {
    // Remove expired entry
    delete store[key];
    saveCacheStore(store);
    return null;
  }

  return entry.data as T;
};

/**
 * Set a cached item with optional custom duration.
 */
export const setCachedItem = <T>(
  key: string,
  data: T,
  duration: number = DEFAULT_CACHE_DURATION
): void => {
  const store = getCacheStore();
  const now = Date.now();

  store[key] = {
    data,
    timestamp: now,
    expiresAt: now + duration,
  };

  saveCacheStore(store);
};

/**
 * Remove a cached item by key.
 */
export const removeCachedItem = (key: string): void => {
  const store = getCacheStore();
  delete store[key];
  saveCacheStore(store);
};

/**
 * Clear all cached data.
 */
export const clearCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore storage errors
  }
};

/**
 * Clean up expired cache entries.
 * Should be called periodically to prevent storage bloat.
 */
export const cleanupExpiredCache = (): void => {
  const store = getCacheStore();
  const now = Date.now();
  let hasChanges = false;

  for (const key of Object.keys(store)) {
    if (now > store[key].expiresAt) {
      delete store[key];
      hasChanges = true;
    }
  }

  if (hasChanges) {
    saveCacheStore(store);
  }
};

// Auth token storage keys
const ACCESS_TOKEN_KEY = 'spendwise_access_token';
const REFRESH_TOKEN_KEY = 'spendwise_refresh_token';
const USER_KEY = 'spendwise_user';

/**
 * Get stored auth tokens.
 */
export const getStoredTokens = (): {
  accessToken: string | null;
  refreshToken: string | null;
} => {
  try {
    return {
      accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
};

/**
 * Store auth tokens.
 */
export const storeTokens = (accessToken: string, refreshToken: string): void => {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    // Ignore storage errors
  }
};

/**
 * Clear stored auth tokens.
 */
export const clearTokens = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Ignore storage errors
  }
};

/**
 * Get stored user data.
 */
export const getStoredUser = <T>(): T | null => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Store user data.
 */
export const storeUser = <T>(user: T): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Ignore storage errors
  }
};
