import { useAuthStore } from '@/stores/useAuthStore';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { UserRole } from '@/types/enums/UserEnum';

export const roleGuard: (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => Promise<void> = async (to, from, next) => {
  const auth = useAuthStore();

  const requiredRole = (to.meta.requiredRole as UserRole) || null;
  const current = auth.activeRole;

  if (requiredRole && requiredRole !== current) {
    const redirectPath = current === UserRole.OWNER ? '/owner' : '/player';
    return next(redirectPath);
  }

  return next();
};
