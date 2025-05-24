import { useAuthStore } from '@/stores/useAuthStore';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { UserRole } from '@/types/enums/UserEnum';

/**
 * Ensures the auth store is initialized before proceeding.
 */
export async function ensureAuthInitialized(): Promise<
  ReturnType<typeof useAuthStore>
> {
  const auth = useAuthStore();
  if (!auth.initialized) {
    await auth.initializeAuth();
  }
  return auth;
}

/**
 * Guard for authenticated routes.
 * Redirects unauthenticated users to login.
 */
export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const auth = await ensureAuthInitialized();

  if (auth.isAuthenticated) {
    next();
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath !== '/login' ? to.fullPath : undefined },
    });
  }
};

/**
 * Guard for guest-only routes (login, register).
 * Redirects authenticated users to their respective dashboard.
 */
export const guestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const auth = await ensureAuthInitialized();

  if (auth.isAuthenticated) {
    next(auth.activeRole === UserRole.OWNER ? '/owner' : '/player');
  } else {
    next();
  }
};
