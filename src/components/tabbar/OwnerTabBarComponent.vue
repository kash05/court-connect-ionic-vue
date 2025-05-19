<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRippleEffect,
  IonTabs,
  IonTab,
  useIonRouter,
} from '@ionic/vue';
import { useWindowSize } from '@vueuse/core';
import {
  homeOutline,
  personOutline,
  businessOutline,
  barChartOutline,
} from 'ionicons/icons';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const ionRouter = useIonRouter();

const { width } = useWindowSize();
const isDesktop = computed(() => width.value >= 768);
const route = useRoute();

const activeTab = computed(() => {
  const path = route.path;
  if (path.includes('/owner')) return 'home';
  if (path.includes('/properties')) return 'properties';
  if (path.includes('/stats')) return 'stats';
  if (path.includes('/profile')) return 'profile';
  return '';
});

const animatingTab = ref('');

type TabKey = 'home' | 'properties' | 'stats' | 'profile';

const tabRoutes: Record<TabKey, string> = {
  home: '/owner',
  properties: '/properties',
  stats: '/stats',
  profile: '/profile',
};

const handleTabClick = (tab: TabKey) => {
  animatingTab.value = tab;
  setTimeout(() => {
    animatingTab.value = '';
  }, 300);
  ionRouter.push(tabRoutes[tab]);
};
</script>

<template>
  <ion-tabs v-if="!isDesktop">
    <ion-tab tab="fail"></ion-tab>
    <IonTabBar slot="bottom">
      <IonTabButton
        href="/owner"
        :class="{
          'tab-selected': activeTab === 'home',
          'tab-animating': animatingTab === 'home',
        }"
        @click="handleTabClick('home')"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="homeOutline" />
        </div>
        <IonLabel>Home</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>

      <IonTabButton
        href="/teams"
        :class="{
          'tab-selected': activeTab === 'properties',
          'tab-animating': animatingTab === 'properties',
        }"
        @click="handleTabClick('properties')"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="businessOutline" />
        </div>
        <IonLabel>Properties</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>

      <IonTabButton
        href="/events"
        :class="{
          'tab-selected': activeTab === 'stats',
          'tab-animating': animatingTab === 'stats',
        }"
        @click="handleTabClick('stats')"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="barChartOutline" />
        </div>
        <IonLabel>Stats</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>

      <IonTabButton
        href="/profile"
        :class="{
          'tab-selected': activeTab === 'profile',
          'tab-animating': animatingTab === 'profile',
        }"
        @click="handleTabClick('profile')"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="personOutline" />
        </div>
        <IonLabel>Profile</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>
    </IonTabBar>
  </ion-tabs>
</template>

<style scoped lang="scss">
@use '@/theme/variables.scss' as *;

ion-tabs {
  padding-top: var(--padding-top, 0);
  display: block;
  position: static;
  height: 60px;

  ion-tab-bar {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    --background: var(--ion-color-light);
    height: 60px;
  }
}

ion-tab {
  display: none;
}

ion-tab-button {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
  margin: 0 4px;
  --color: var(--ion-color-medium);
  --color-selected: var(--ion-color-primary);

  .tab-icon-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ion-icon {
    font-size: 20px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }

  ion-label {
    font-size: 11px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 400;
  }

  &.tab-selected {
    .tab-icon-container {
      background-color: var(--ion-color-primary-tint);
    }

    ion-icon {
      color: var(--ion-color-light);
      transform: translateY(-2px);
    }

    ion-label {
      color: var(--ion-color-primary);
      font-weight: 600;
      transform: translateY(-1px);
    }
  }

  &.tab-animating {
    ion-icon {
      animation: pulse 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

ion-ripple-effect {
  color: var(--ion-color-primary);
}
</style>
