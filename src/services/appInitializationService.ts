import { useAuthStore } from '@/stores/useAuthStore';
import { getRoles, getSports } from './systemDataService';
import { toastService } from './toastService';

const authStore = useAuthStore();

/**
 * Service responsible for initializing the application.
 */
export const initializeApp = async () => {
  await authStore.initializeAuth().catch(() => {
    authStore.resetStore();
    toastService.dangerMessage(
      'Failed to initialize the app. Please try again.',
    );
  });

  Promise.allSettled([getRoles(), OwnerConfig()]).catch(() => {
    toastService.dangerMessage('App Initialization failed');
  });
};

async function OwnerConfig() {
  if (!authStore.isCurrentRoleOwner) return;
  return await Promise.allSettled([getSports()]);
}
