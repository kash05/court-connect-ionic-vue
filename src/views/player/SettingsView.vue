<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
import PageTabBarComponent from '@/components/tabbar/PlayerTabBarComponent.vue';
import { themeService, type ThemeMode } from '@/services/themeService';
import { loadingService } from '@/services/loadingService';

const themeMode = ref<ThemeMode>('system');

onMounted(async () => {
  themeMode.value = await themeService.getThemeMode();
});

const updateTheme = async () => {
  loadingService.withLoading(async () => {
    await themeService.setTheme(themeMode.value);
  }, 'Setting theme...');
};
</script>

<template>
  <IonPage>
    <PageHeaderComponent />
    <IonContent>
      <IonList class="py-2">
        <IonRadioGroup
          v-model="themeMode"
          @ionChange="updateTheme"
          helper-text="Select your preferred theme"
        >
          <IonItem>
            <IonLabel>Light</IonLabel>
            <IonRadio value="light" aria-label="light-theme" slot="end" />
          </IonItem>
          <IonItem>
            <IonLabel>Dark</IonLabel>
            <IonRadio value="dark" aria-label="dark-theme" slot="end" />
          </IonItem>
          <IonItem>
            <IonLabel>System</IonLabel>
            <IonRadio
              value="system"
              aria-label="system-preference"
              slot="end"
            />
          </IonItem>
        </IonRadioGroup>
      </IonList>
    </IonContent>
    <PageTabBarComponent />
  </IonPage>
</template>
