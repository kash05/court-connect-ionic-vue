import { useAuthStore } from '@/stores/useAuthStore';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

/**
 * Authentication guard for protected routes
 * Redirects to login if user is not authenticated
 */
export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.initializeAuth();
  }

  if (authStore.isAuthenticated()) {
    next();
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath !== '/login' ? to.fullPath : undefined },
    });
  }
};

/**
 * Guest guard for login/register routes
 * Redirects to dashboard if user is already authenticated
 */
export const guestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    await authStore.initializeAuth();
  }

  if (authStore.isAuthenticated()) {
    next('/dashboard');
  } else {
    next();
  }
};
