import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { ensureAuthInitialized } from './authGuard';
import { UserRole } from '../types/enums/UserEnum';

/**
 * Role-based access guard (parameterized).
 * Only allows access if user's activeRole is in the allowedRoles list.
 */
export const roleGuard =
    (allowedRoles: UserRole[]) =>
    async (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext,
    ) => {
        const auth = await ensureAuthInitialized();

        if (!allowedRoles.includes(auth.activeRole)) {
            const fallback =
                auth.activeRole === UserRole.OWNER ? '/owner' : '/player';
            return next(fallback);
        }

        return next();
    };
