import { Preferences } from '@capacitor/preferences';

export type ThemeMode = 'light' | 'dark' | 'system';
const THEME_KEY = 'theme-mode';

let mediaQuery: MediaQueryList;
let systemListener: ((e: MediaQueryListEvent) => void) | null = null;

export const themeService = {
    async setTheme(mode: ThemeMode) {
        await Preferences.set({ key: THEME_KEY, value: mode });

        this._apply(mode);

        this._teardownSystemListener();
        if (mode === 'system') {
            this._setupSystemListener();
        }
    },

    async getThemeMode(): Promise<ThemeMode> {
        const { value } = await Preferences.get({ key: THEME_KEY });
        if (value === 'light' || value === 'dark' || value === 'system') {
            return value;
        }
        return 'system';
    },

    async initialize() {
        const mode = await this.getThemeMode();
        this._apply(mode);
        if (mode === 'system') {
            this._setupSystemListener();
        }
    },

    // ——— Internal helpers ———
    _apply(mode: ThemeMode) {
        let effective: 'light' | 'dark';
        if (mode === 'system') {
            effective = window.matchMedia('(prefers-color-scheme: dark)')
                .matches
                ? 'dark'
                : 'light';
        } else {
            effective = mode;
        }
        document.documentElement.classList.toggle('dark', effective === 'dark');
    },

    _setupSystemListener() {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        systemListener = (e: MediaQueryListEvent) => {
            document.documentElement.classList.toggle('dark', e.matches);
        };
        mediaQuery.addEventListener('change', systemListener);
    },

    _teardownSystemListener() {
        if (mediaQuery && systemListener) {
            mediaQuery.removeEventListener('change', systemListener);
            systemListener = null;
        }
    },
};
