<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>
  <IonPage>
    <IonContent>
      <div class="auth-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
ion-content {
  .auth-container {
    @apply flex min-h-screen items-center justify-center p-4;
    background: linear-gradient(
      135deg,
      theme('colors.primary.600') 0%,
      theme('colors.secondary.600') 100%
    );
  }
}
</style>
