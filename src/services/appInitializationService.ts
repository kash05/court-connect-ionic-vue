import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Service responsible for initializing the application.
 */
export const initializeApp = async () => {
  const authStore = useAuthStore();

  await authStore.initializeAuth();
};
