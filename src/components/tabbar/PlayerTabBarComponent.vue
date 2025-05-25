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
  IonActionSheet,
} from '@ionic/vue';
import { useWindowSize } from '@vueuse/core';
import {
  homeOutline,
  peopleOutline,
  calendarOutline,
  searchSharp,
  chatbubbleOutline,
  searchOutline,
} from 'ionicons/icons';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const ionRouter = useIonRouter();

const { width } = useWindowSize();
const isDesktop = computed(() => width.value >= 768);
const route = useRoute();

const activeTab = computed(() => {
  const path = route.path;
  if (path.includes('/player')) return 'home';
  if (path.includes('/messages')) return 'messages';
  if (path.includes('/bookings')) return 'bookings';
  if (path.includes('/connections')) return 'connections';
  return '';
});

const animatingTab = ref('');

const isActionSheetOpen = ref(false);

type TabKey = 'home' | 'messages' | 'bookings' | 'connections';

const tabRoutes: Record<TabKey, string> = {
  home: '/player',
  messages: '/messages',
  bookings: '/bookings',
  connections: '/connections',
};

const handleTabClick = (tab: TabKey) => {
  animatingTab.value = tab;
  setTimeout(() => {
    animatingTab.value = '';
  }, 300);
  ionRouter.push(tabRoutes[tab]);
};

const actionSheetButtons = [
  {
    text: 'Find Players Near You',
    icon: searchSharp,
    handler: () => findPlayers(),
  },
  {
    text: 'Find Nearby Courts & Properties',
    icon: searchOutline,
    handler: () => findCourts(),
  },
  {
    text: 'Cancel',
    role: 'cancel',
    icon: close,
    handler: () => {
      isActionSheetOpen.value = false;
    },
  },
];

const findPlayers = () => {
  console.log('Find players clicked');
};

const findCourts = () => {
  console.log('Find courts clicked');
};
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
        href="/messages"
        :class="{
          'tab-selected': activeTab === 'messages',
          'tab-animating': animatingTab === 'messages',
        }"
        @click="handleTabClick('messages')"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="chatbubbleOutline" />
        </div>
        <IonLabel>Messages</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>

      <IonTabButton @click="isActionSheetOpen = true">
        <div class="find-tab-icon">
          <ion-icon :icon="searchSharp"></ion-icon>
        </div>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>

      <IonTabButton
        href="/bookings"
        :class="{
          'tab-selected': activeTab === 'bookings',
          'tab-animating': animatingTab === 'bookings',
        }"
        @click="handleTabClick('bookings')"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="calendarOutline" />
        </div>
        <IonLabel>Bookings</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>

      <IonTabButton
        href="/connections"
        :class="{
          'tab-selected': activeTab === 'connections',
          'tab-animating': animatingTab === 'connections',
        }"
      >
        <div class="tab-icon-container">
          <IonIcon :icon="peopleOutline" />
        </div>
        <IonLabel>Connections</IonLabel>
        <IonRippleEffect type="unbounded"></IonRippleEffect>
      </IonTabButton>
    </IonTabBar>

    <IonActionSheet
      :is-open="isActionSheetOpen"
      header="Search for players and courts near you"
      :buttons="actionSheetButtons"
      class="custom-action-sheet"
      :backdrop-dismiss="false"
    />
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

.find-tab-icon {
  background-color: var(--ion-orange-primary) !important;
  color: var(--ion-color-light);
  border-radius: 50%;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 13px;

  ion-icon {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

ion-action-sheet.find {
  --background: var(--ion-color-light-shade);
  --backdrop-opacity: 0.6;
  --button-background-selected: var(--ion-color-danger);
  --button-color: var(--ion-color-dark);
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
