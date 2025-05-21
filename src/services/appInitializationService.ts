import { useAuthStore } from '@/stores/useAuthStore';
import { getRoles } from './systemDataService';
import { toastService } from './toastService';

/**
 * Service responsible for initializing the application.
 */
export const initializeApp = async () => {
  const authStore = useAuthStore();

  await authStore.initializeAuth().catch(() => {
    authStore.resetStore();
    toastService.dangerMessage(
      'Failed to initialize the app. Please try again.',
    );
  });
  await getRoles().catch(() => {
    toastService.dangerMessage('App Initialization failed');
  });
};
