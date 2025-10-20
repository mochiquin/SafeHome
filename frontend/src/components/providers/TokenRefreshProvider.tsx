'use client';

import { useTokenRefresh } from '@/hooks/use-token-refresh';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Provider component that enables automatic token refresh
 * Must be a client component to use hooks and timers
 *
 * This component wraps the application and ensures that authenticated
 * users' tokens are refreshed every 3 minutes to prevent session expiration.
 *
 * It only activates token refresh when the user is on authenticated pages.
 */
export function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is on an authenticated page
    // Skip token refresh on login/register pages
    const publicPaths = ['/', '/login', '/register'];
    const isPublicPath = publicPaths.includes(pathname);

    // Also check if there's a token in cookies or localStorage
    const hasToken = typeof window !== 'undefined' && (
      document.cookie.includes('access_token') ||
      !!localStorage.getItem('token')
    );

    setIsAuthenticated(!isPublicPath && hasToken);
  }, [pathname]);

  // Enable automatic token refresh every 3 minutes (only when authenticated)
  useTokenRefresh(isAuthenticated);

  return <>{children}</>;
}
