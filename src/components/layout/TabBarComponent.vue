<script setup lang="ts">
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from '@ionic/vue';
import { useWindowSize } from '@vueuse/core';
import {
  homeOutline,
  personOutline,
  peopleOutline,
  calendarOutline,
} from 'ionicons/icons';
import { computed } from 'vue';

const { width } = useWindowSize();

const isDesktop = computed(() => width.value >= 768);
</script>

<template>
  <IonTabs>
    <IonRouterOutlet></IonRouterOutlet>

    <IonTabBar slot="bottom" v-if="!isDesktop" class="floating-tabs">
      <IonTabButton tab="home" href="/dashboard">
        <IonIcon :icon="homeOutline" />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="teams" href="/teams">
        <IonIcon :icon="peopleOutline" />
        <IonLabel>Teams</IonLabel>
      </IonTabButton>

      <IonTabButton tab="events" href="/events">
        <IonIcon :icon="calendarOutline" />
        <IonLabel>Events</IonLabel>
      </IonTabButton>

      <IonTabButton tab="profile" href="/profile">
        <IonIcon :icon="personOutline" />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
</template>

<style scoped lang="scss">
@use '@/theme/variables.scss' as *;

.floating-tabs {
  --background-color: var(--ion-color-medium-tint);
  padding: 5px;
}

ion-tab-button {
  position: relative;
  transition: all 0.3s ease;
  overflow: visible;
}

ion-tab-button ion-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--ion-color-medium);
}

ion-tab-button ion-label {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 12px;
  margin-top: 4px;
  color: var(--ion-color-medium);
}

// ion-tab-button.tab-selected {
// }

ion-tab-button.tab-selected ion-label,
ion-tab-button.tab-selected ion-icon {
  color: var(--ion-color-primary);
  font-weight: 600;
}
</style>
