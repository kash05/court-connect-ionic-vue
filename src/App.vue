<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { toastService } from './services/toastService';
import { initializeApp } from './services/appInitializationService';
import { loadingService } from './services/loadingService';
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
    <IonRouterOutlet />
  </IonApp>
</template>

<style scoped lang="scss">
ion-tab-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
