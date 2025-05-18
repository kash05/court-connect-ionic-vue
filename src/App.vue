<script setup lang="ts">
import { IonApp } from '@ionic/vue';
import { onMounted } from 'vue';
import { toastService } from './services/toastService';
import { initializeApp } from './services/appInitializationService';
import { loadingService } from './services/loadingService';
import SideMenu from './components/layout/SideMenu.vue';
import { SplashScreen } from '@capacitor/splash-screen';

onMounted(async () => {
  SplashScreen.hide();
  loadingService.withLoading(async () => {
    try {
      initializeApp();
    } catch (err) {
      console.error('App failed to initialize', err);
      toastService.dangerMessage(
        'Failed to initialize the app. Please try again.',
      );
    }
  }, 'Please wait...');
});
</script>

<template>
  <IonApp mode="ios">
    <SideMenu />
  </IonApp>
</template>
