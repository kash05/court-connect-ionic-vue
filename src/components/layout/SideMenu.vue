<script setup lang="ts">
import { IonIcon, IonMenu, IonRouterOutlet, IonSplitPane } from "@ionic/vue";
import {
  homeOutline,
  personOutline,
  peopleOutline,
  calendarOutline,
  settingsOutline,
  trophyOutline,
  locationOutline,
  timeOutline,
  statsChartOutline,
  walletOutline,
  logOutOutline,
} from "ionicons/icons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const currentPath = computed(() => route.path);

interface MenuItem {
  title: string;
  icon: string;
  path: string;
  badge?: number;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const playerMenuGroups: MenuGroup[] = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", icon: homeOutline, path: "/dashboard" },
      { title: "My Teams", icon: peopleOutline, path: "/teams" },
      { title: "Tournaments", icon: trophyOutline, path: "/tournaments" },
      { title: "Events", icon: calendarOutline, path: "/events", badge: 2 },
    ],
  },
  {
    title: "Personal",
    items: [
      { title: "Statistics", icon: statsChartOutline, path: "/player/stats" },
      { title: "Profile", icon: personOutline, path: "/profile" },
    ],
  },
];

const ownerMenuGroups: MenuGroup[] = [
  {
    title: "Management",
    items: [
      { title: "Dashboard", icon: homeOutline, path: "/dashboard" },
      { title: "Grounds", icon: locationOutline, path: "/owner/grounds" },
      {
        title: "Bookings",
        icon: timeOutline,
        path: "/owner/bookings",
        badge: 3,
      },
      { title: "Revenue", icon: walletOutline, path: "/owner/revenue" },
    ],
  },
  {
    title: "Organization",
    items: [
      { title: "Teams", icon: peopleOutline, path: "/teams" },
      { title: "Events", icon: calendarOutline, path: "/events" },
    ],
  },
];
</script>

<template>
  <IonSplitPane content-id="main" class="sidebar-split-pane">
    <IonMenu
      side="start"
      class="main-menu"
      content-id="main"
      menu-id="primaryMenu"
      color="primary"
    >
      <div class="side-menu">
        <div class="side-menu-header">
          <div class="user-info">
            <div class="avatar">
              <img
                :src="
                  authStore.user?.profileImage ||
                  'https://via.placeholder.com/40x40'
                "
                alt="User Avatar"
              />
            </div>
            <div class="user-details">
              <h3 class="user-name">{{ authStore.user?.name || "User" }}</h3>
              <p class="user-role">Player</p>
            </div>
          </div>
        </div>

        <div class="side-menu-content">
          <div
            v-for="(group, index) in playerMenuGroups"
            :key="index"
            class="menu-group"
          >
            <h4 class="menu-group-title">{{ group.title }}</h4>
            <ul class="menu-list">
              <li
                v-for="item in group.items"
                :key="item.path"
                :class="['menu-item', { active: currentPath === item.path }]"
                @click="router.push(item.path)"
              >
                <div class="flex items-center">
                  <IonIcon :icon="item.icon" class="menu-icon" />
                  <span class="menu-label">{{ item.title }}</span>
                </div>
                <span v-if="item.badge" class="badge">
                  {{ item.badge }}
                </span>
              </li>
            </ul>
          </div>

          <div
            v-for="(group, index) in ownerMenuGroups"
            :key="index"
            class="menu-group"
          >
            <h4 class="menu-group-title">{{ group.title }}</h4>
            <ul class="menu-list">
              <li
                v-for="item in group.items"
                :key="item.path"
                :class="['menu-item', { active: currentPath === item.path }]"
                @click="router.push(item.path)"
              >
                <div class="flex items-center">
                  <IonIcon :icon="item.icon" class="menu-icon" />
                  <span class="menu-label">{{ item.title }}</span>
                </div>
                <span v-if="item.badge" class="badge">
                  {{ item.badge }}
                </span>
              </li>
            </ul>
          </div>

          <div class="menu-group">
            <h4 class="menu-group-title">Settings</h4>
            <ul class="menu-list">
              <li
                class="flex cursor-pointer items-center rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <IonIcon :icon="settingsOutline" class="menu-icon" />
                <span class="menu-label">Settings</span>
              </li>
              <li
                class="logout flex cursor-pointer items-center rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                @click="authStore.logout"
              >
                <IonIcon :icon="logOutOutline" class="menu-icon" />
                <span class="menu-label">Logout</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </IonMenu>
    <IonRouterOutlet id="main" />
  </IonSplitPane>
</template>

<style scoped>
.sidebar-split-pane {
  --side-width: xs;
}

.side-menu {
  @apply flex flex-col h-full bg-white;
}

.side-menu-header {
  @apply border-b border-gray-200 p-4;
}

.user-info {
  @apply flex items-center;
}

.avatar {
  @apply mr-3 h-10 w-10 overflow-hidden rounded-full;
}

.avatar img {
  @apply h-full w-full object-cover;
}

.user-details {
  @apply flex flex-col;
}

.user-name {
  @apply text-sm font-bold text-gray-800;
}

.user-role {
  @apply text-xs text-gray-500;
}

.side-menu-content {
  @apply flex flex-1 flex-col overflow-y-auto p-4;
}

.menu-group {
  @apply mb-6;
}

.menu-group-title {
  @apply mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500;
}

.menu-list {
  @apply space-y-1;
}

.menu-item {
  @apply flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100;
}

.menu-item.active {
  @apply bg-primary-50 text-primary-600;
}

.menu-icon {
  @apply mr-3 text-lg;
}

.menu-label {
  @apply text-sm;
}

.badge {
  @apply flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-600;
}

.logout {
  @apply mt-4 text-red-500 hover:bg-red-50 hover:text-red-600;
}
</style>
