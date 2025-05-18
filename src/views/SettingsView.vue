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
import PageTabBarComponent from '@/components/PageTabBarComponent.vue';
import { themeService, type ThemeMode } from '@/services/themeService';

const themeMode = ref<ThemeMode>('system');

onMounted(async () => {
  themeMode.value = await themeService.getThemeMode();
});

const updateTheme = async () => {
  await themeService.setTheme(themeMode.value);
};
</script>

<template>
  <IonPage>
    <PageHeaderComponent />
    <IonContent>
      <IonList>
        <IonRadioGroup v-model="themeMode" @ionChange="updateTheme">
          <IonItem>
            <IonLabel>Light</IonLabel>
            <IonRadio value="light" aria-label="light-theme" />
          </IonItem>
          <IonItem>
            <IonLabel>Dark</IonLabel>
            <IonRadio value="dark" aria-label="dark-theme" />
          </IonItem>
          <IonItem>
            <IonLabel>System</IonLabel>
            <IonRadio value="system" aria-label="system-preference" />
          </IonItem>
        </IonRadioGroup>
      </IonList>
    </IonContent>
    <PageTabBarComponent />
  </IonPage>
</template>
