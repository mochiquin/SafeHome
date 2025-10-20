import { useEffect, useRef } from 'react';
import { authApi } from '@/lib/apis/auth';

/**
 * Hook to automatically refresh authentication token every 3 minutes
 * This ensures the token stays fresh and prevents unexpected 401 errors
 * during long user sessions.
 *
 * @param isAuthenticated - Whether the user is currently authenticated
 */
export function useTokenRefresh(isAuthenticated: boolean = true) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    // Only set up auto-refresh if user is authenticated
    if (!isAuthenticated) {
      console.log('[TokenRefresh] User not authenticated, skipping auto-refresh setup');
      return;
    }

    // Function to refresh the token
    const refreshToken = async () => {
      // Prevent concurrent refresh attempts
      if (isRefreshingRef.current) {
        console.log('[TokenRefresh] Already refreshing, skipping...');
        return;
      }

      try {
        isRefreshingRef.current = true;
        console.log('[TokenRefresh] Refreshing token at:', new Date().toISOString());

        await authApi.refreshToken();

        console.log('[TokenRefresh] Token refreshed successfully');
      } catch (error) {
        console.error('[TokenRefresh] Failed to refresh token:', error);

        // If refresh fails, stop the interval to prevent spamming
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log('[TokenRefresh] Stopped auto-refresh due to failure');
        }
      } finally {
        isRefreshingRef.current = false;
      }
    };

    // Set up interval to refresh token every 3 minutes (180000 ms)
    const REFRESH_INTERVAL = 3 * 60 * 1000; // 3 minutes in milliseconds

    console.log('[TokenRefresh] Setting up auto-refresh every 3 minutes');

    // Refresh immediately on mount to ensure we have a fresh token
    refreshToken();

    // Then set up the interval
    intervalRef.current = setInterval(refreshToken, REFRESH_INTERVAL);

    // Cleanup on unmount or when authentication status changes
    return () => {
      if (intervalRef.current) {
        console.log('[TokenRefresh] Cleaning up auto-refresh interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated]); // Re-run when authentication status changes
}
