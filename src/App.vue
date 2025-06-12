<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { toastService } from './services/toastService';
import { initializeApp } from './services/appInitializationService';
import { loadingService } from './services/loadingService';
import { SplashScreen } from '@capacitor/splash-screen';
import { themeService } from '@/services/themeService';
import { useAuthStore } from './stores/useAuthStore';

const authStore = useAuthStore();

onMounted(async () => {
    SplashScreen.hide();
    await themeService.initialize();

    if (authStore.isAuthenticated) {
        loadingService.withLoading(async () => {
            try {
                await initializeApp();
            } catch (err) {
                console.error('App failed to initialize', err);
                toastService.dangerMessage(
                    'Failed to initialize the app. Please try again.',
                );
            }
        }, 'Please wait...');
    }
});
</script>

<template>
    <IonApp mode="ios">
        <IonRouterOutlet />
    </IonApp>
</template>
