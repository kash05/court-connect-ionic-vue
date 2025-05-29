import { useAuthStore } from '@/stores/useAuthStore';
import { getAmenities, getRoles, getSports } from './systemDataService';
import { toastService } from './toastService';

/**
 * Service responsible for initializing the application.
 */
export const initializeApp = async () => {
  const authStore = useAuthStore();
  try {
    await authStore.initializeAuth();
  } catch {
    authStore.resetStore();
    toastService.dangerMessage('Authentication failed. Please login again.');
    return;
  }

  const results = await Promise.allSettled([getRoles(), OwnerConfig()]);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      toastService.dangerMessage('Missing some data');
    }
  });
};

async function OwnerConfig() {
  const authStore = useAuthStore();
  if (!authStore.isCurrentRoleOwner) return;
  return await Promise.allSettled([getSports(), getAmenities()]);
}
