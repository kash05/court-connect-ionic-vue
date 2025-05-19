import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  login as loginService,
  registerUser,
  resetPassword,
  logout as logoutService,
  currentUser,
} from '@/services/authService';
import type { User } from '@/types/authInterface';
import { UserRole } from '@/types/enums/UserEnum';
import { Preferences } from '@capacitor/preferences';
import { useRouter } from 'vue-router';
import { setAuthToken } from '@/lib/apiClient';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const initialized = ref(false);
  const router = useRouter();

  async function setAuth(newUser: User, newToken: string) {
    user.value = newUser;
    token.value = newToken;

    setAuthToken(newToken);

    await Preferences.set({
      key: 'token',
      value: newToken,
    });

    await Preferences.set({
      key: 'user',
      value: JSON.stringify(newUser),
    });
  }

  async function clearAuth() {
    user.value = null;
    token.value = null;

    setAuthToken(null);

    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'user' });
  }

  function isAuthenticated() {
    return !!token.value && !!user.value;
  }

  function isPlayer() {
    return user.value?.role === UserRole.PLAYER;
  }

  function isOwner() {
    return user.value?.role === UserRole.OWNER;
  }

  async function initializeAuth() {
    if (initialized.value) {
      return Promise.resolve();
    }

    try {
      const tokenResult = await Preferences.get({ key: 'token' });
      const storedToken = tokenResult.value;

      if (!storedToken) {
        initialized.value = true;
        return Promise.resolve();
      }
      token.value = storedToken;
      setAuthToken(storedToken);
      const userResult = await Preferences.get({ key: 'user' });
      if (userResult.value) {
        try {
          user.value = JSON.parse(userResult.value);
        } catch (e) {
          console.error('Failed to parse stored user data:', e);
        }
      }

      try {
        const userData = await currentUser();
        user.value = userData;
        await Preferences.set({
          key: 'user',
          value: JSON.stringify(userData),
        });
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        await clearAuth();
      }
    } catch (error) {
      console.error('Authentication initialization failed:', error);
      await clearAuth();
    } finally {
      initialized.value = true;
    }

    return Promise.resolve();
  }

  async function login(credentials: { email: string; password: string }) {
    const response = await loginService(credentials);

    if (response?.access_token) {
      token.value = response.access_token;
      setAuthToken(response.access_token);
      const userData = await currentUser();
      await setAuth(userData, response.access_token);
      return userData;
    } else {
      throw new Error('Login failed: Invalid response');
    }
  }

  async function logout() {
    try {
      if (token.value) {
        logoutService();
      }
    } catch (error) {
      console.error('Logout service error:', error);
    } finally {
      await clearAuth();
      router.push('/login');
    }
  }

  return {
    user,
    token,
    initialized,
    setAuth,
    clearAuth,
    isAuthenticated,
    isPlayer,
    isOwner,
    login,
    logout,
    registerUser,
    resetPassword,
    initializeAuth,
  };
});
