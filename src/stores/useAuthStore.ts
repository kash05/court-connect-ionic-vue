import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  login as loginService,
  registerUser,
  resetPassword,
  logout as logoutService,
  currentUser,
} from '@/services/authService';
import type { UserInterface } from '@/types/userInterface';
import { UserRole } from '@/types/enums/UserEnum';
import { Preferences } from '@capacitor/preferences';
import { useRouter } from 'vue-router';
import { setAuthToken } from '@/lib/apiClient';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserInterface | null>(null);
  const token = ref<string | null>(null);
  const initialized = ref(false);
  const activeRole = ref<UserRole>(UserRole.PLAYER);
  const router = useRouter();

  function isAuthenticated() {
    return !!token.value && !!user.value;
  }

  // ——————————————————————————————————————————————
  // Persist user + token + default role on login
  async function login(credentials: { email: string; password: string }) {
    const resp = await loginService(credentials);
    if (!resp?.access_token) {
      throw new Error('Login failed');
    }

    token.value = resp.access_token;
    setAuthToken(resp.access_token);
    const userData = await currentUser();
    user.value = userData;

    await Preferences.set({ key: 'token', value: token.value });
    await Preferences.set({ key: 'user', value: JSON.stringify(userData) });

    const storedRole = await Preferences.get({ key: 'activeRole' });
    const role = storedRole.value as UserRole | null;

    if (role && Object.values(UserRole).includes(role)) {
      activeRole.value = role;
    } else {
      activeRole.value = UserRole.PLAYER;
      await Preferences.set({ key: 'activeRole', value: UserRole.PLAYER });
    }

    return userData;
  }

  // ——————————————————————————————————————————————
  // Restore from Preferences on app start
  async function initializeAuth() {
    if (initialized.value) return;

    const [{ value: t }, { value: u }] = await Promise.all([
      Preferences.get({ key: 'token' }),
      Preferences.get({ key: 'user' }),
    ]);
    if (t && u) {
      token.value = t;
      setAuthToken(t);
      try {
        user.value = JSON.parse(u);
      } catch {
        user.value = null;
      }
    }

    const { value: storedRole } = await Preferences.get({ key: 'activeRole' });
    activeRole.value = (storedRole as UserRole) || UserRole.PLAYER;

    initialized.value = true;
  }

  // ——————————————————————————————————————————————
  async function logout() {
    try {
      if (token.value) await logoutService();
    } finally {
      // clear everything
      user.value = null;
      token.value = null;
      activeRole.value = UserRole.PLAYER;
      setAuthToken(null);
      await Preferences.clear();
      router.push('/login');
    }
  }

  // ——————————————————————————————————————————————
  // Toggle between PLAYER ↔ OWNER
  async function toggleRole() {
    activeRole.value =
      activeRole.value === UserRole.PLAYER ? UserRole.OWNER : UserRole.PLAYER;
    await Preferences.set({
      key: 'activeRole',
      value: activeRole.value,
    });
  }

  // ——————————————————————————————————————————————
  const isCurrentRolePlayer = computed(
    () => activeRole.value === UserRole.PLAYER,
  );
  const isCurrentRoleOwner = computed(
    () => activeRole.value === UserRole.OWNER,
  );

  return {
    user,
    token,
    initialized,
    activeRole,
    isCurrentRolePlayer,
    isCurrentRoleOwner,
    login,
    logout,
    isAuthenticated,
    registerUser,
    resetPassword,
    initializeAuth,
    toggleRole,
  };
});
