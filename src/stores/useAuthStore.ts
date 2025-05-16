import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  login,
  registerUser,
  resetPassword,
  validateToken,
  logout,
} from '@/services/authService';
import type { User } from '@/types/authInterface';
import { UserRole } from '@/types/enums/UserEnum';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const initialized = ref(false);

  function setAuth(newUser: User, newToken: string) {
    user.value = newUser;
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function clearAuth() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
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
    if (initialized.value || !token.value) {
      initialized.value = true;
      return Promise.resolve();
    }

    return validateToken()
      .then((res) => {
        if (res.user) {
          user.value = res.user;
        } else {
          clearAuth();
        }
      })
      .catch((err) => {
        console.error('Token validation failed:', err);
        clearAuth();
      })
      .finally(() => {
        initialized.value = true;
      });
  }

  return {
    user,
    token,
    setAuth,
    clearAuth,
    isAuthenticated,
    isPlayer,
    isOwner,
    login,
    registerUser,
    resetPassword,
    initializeAuth,
    logout,
  };
});
