import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Service responsible for initializing the application.
 */
export const initializeApp = async () => {
  await authenticateUser();
};

async function authenticateUser() {
  const authStore = useAuthStore();

  try {
    await authStore.initializeAuth();
  } catch (error) {
    console.error('Auth initialization failed:', error);
  }
}
