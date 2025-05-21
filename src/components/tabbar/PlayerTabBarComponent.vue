<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import {
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRippleEffect,
  IonTabs,
  IonTab,
  useIonRouter,
  IonActionSheet,
} from '@ionic/vue';
import { useWindowSize } from '@vueuse/core';
import {
  homeOutline,
  peopleOutline,
  calendarOutline,
  repeatOutline,
} from 'ionicons/icons';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const ionRouter = useIonRouter();
const authStore = useAuthStore();

const { width } = useWindowSize();
const isDesktop = computed(() => width.value >= 768);
const route = useRoute();

const activeTab = computed(() => {
  const path = route.path;
  if (path.includes('/player')) return 'home';
  if (path.includes('/teams')) return 'teams';
  if (path.includes('/events')) return 'events';
  return '';
});

const animatingTab = ref('');

type TabKey = 'home' | 'teams' | 'events';

const tabRoutes: Record<TabKey, string> = {
  home: '/player',
  teams: '/teams',
  events: '/events',
};

const handleTabClick = (tab: TabKey) => {
  animatingTab.value = tab;
  setTimeout(() => {
    animatingTab.value = '';
  }, 300);
  ionRouter.push(tabRoutes[tab]);
};

function switchMode() {
  authStore.toggleRole();
  ionRouter.push({
    path: `/switch-mode/owner`,
    query: {
      redirectTo: `/owner`,
    },
  });
}

const actionSheetButtons = [
  {
    text: 'Switch',
  },
  {
    text: 'Cancel',
    role: 'cancel',
    data: {
      action: 'cancel',
    },
  },
];
</script>

<template>
  <ion-tabs v-if="!isDesktop">
    <ion-tab tab="fail"></ion-tab>
    <IonTabBar slot="bottom">
      <IonTabButton
        href="/player"
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
          'tab-selected': activeTab === 'teams',
          'tab-animating': animatingTab === 'teams',
        }"
        @click="handleTabClick('teams')"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="peopleOutline" />
        </div>
        <IonLabel>Teams</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>

      <IonTabButton
        href="/events"
        :class="{
          'tab-selected': activeTab === 'events',
          'tab-animating': animatingTab === 'events',
        }"
        @click="handleTabClick('events')"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="calendarOutline" />
        </div>
        <IonLabel>Events</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>

      <IonTabButton id="open-action-sheet">
        <div class="tab-icon-container">
          <IonIcon :icon="repeatOutline" color="secondary" size="large" />
        </div>
        <IonLabel>Switch</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>
    </IonTabBar>
  </ion-tabs>
  <IonActionSheet
    trigger="open-action-sheet"
    header="Switch to Owner mode?"
    :buttons="actionSheetButtons"
    sub-header="Your choice will be saved."
    backdrop-dismiss="false"
    keyboard-close="true"
    @didDismiss="switchMode()"
  ></IonActionSheet>
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
