import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Preferences } from '@capacitor/preferences';

import {
    login as loginService,
    registerUser,
    resetPassword,
    logout as logoutService,
    currentUser,
} from '@/services/authService';
import { setAuthToken } from '@/lib/apiClient';
import { toastService } from '@/services/toastService';

import type { UserInterface } from '@/types/userInterface';
import { UserRole } from '@/types/enums/UserEnum';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<UserInterface | null>(null);
    const token = ref<string | null>(null);
    const activeRole = ref<UserRole>(UserRole.PLAYER);
    const initialized = ref(false);
    const router = useRouter();

    const isAuthenticated = computed(() => !!user.value && !!token.value);
    const isCurrentRolePlayer = computed(
        () => activeRole.value === UserRole.PLAYER,
    );
    const isCurrentRoleOwner = computed(
        () => activeRole.value === UserRole.OWNER,
    );

    async function login(credentials: { email: string; password: string }) {
        const resp = await loginService(credentials);
        if (!resp?.access_token) {
            throw new Error('Login failed');
        }

        token.value = resp.access_token;
        setAuthToken(resp.access_token);

        const userData = await currentUser().catch(() => {
            resetStore();
            toastService.dangerMessage('Unable to fetch user details');
        });

        user.value = userData;

        const firstRole = userData?.roles?.[0]?.id;
        if (firstRole === UserRole.OWNER) {
            activeRole.value = UserRole.OWNER;
        } else if (firstRole === UserRole.PLAYER) {
            activeRole.value = UserRole.PLAYER;
        } else {
            activeRole.value = UserRole.PLAYER;
        }

        await Preferences.set({ key: 'token', value: token.value });
        await Preferences.set({ key: 'user', value: JSON.stringify(userData) });

        return userData;
    }

    async function initializeAuth() {
        if (initialized.value) return;

        const [{ value: savedToken }, { value: savedUser }] = await Promise.all(
            [
                Preferences.get({ key: 'token' }),
                Preferences.get({ key: 'user' }),
            ],
        );

        if (savedToken) {
            token.value = savedToken;
            setAuthToken(savedToken);
        }

        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                user.value = parsedUser;

                const firstRole = parsedUser?.roles?.[0]?.name;
                if (firstRole === 'owner') {
                    activeRole.value = UserRole.OWNER;
                } else if (firstRole === 'player') {
                    activeRole.value = UserRole.PLAYER;
                } else {
                    activeRole.value = UserRole.PLAYER;
                }
            } catch {
                user.value = null;
                activeRole.value = UserRole.PLAYER;
            }
        } else {
            activeRole.value = UserRole.PLAYER;
        }

        initialized.value = true;
    }

    async function logout() {
        try {
            if (token.value) await logoutService();
        } catch {
            // Optional: handle logout error silently
        } finally {
            resetStore();
        }
    }

    async function resetStore() {
        user.value = null;
        token.value = null;
        activeRole.value = UserRole.PLAYER;
        initialized.value = false;
        setAuthToken(null);
        await Preferences.clear();
        router.push('/login');
    }

    async function setActiveRole(role: UserRole) {
        activeRole.value = role;
        await Preferences.set({ key: 'activeRole', value: role.toString() });
    }

    return {
        user,
        token,
        initialized,
        activeRole,
        isAuthenticated,
        isCurrentRolePlayer,
        isCurrentRoleOwner,
        login,
        logout,
        registerUser,
        resetPassword,
        initializeAuth,
        resetStore,
        setActiveRole,
    };
});
