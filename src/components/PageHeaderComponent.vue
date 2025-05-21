<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonBadge,
  IonAvatar,
} from '@ionic/vue';
import { notificationsOutline, chevronBackOutline } from 'ionicons/icons';
import { onClickOutside } from '@vueuse/core';
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProfilePopoverComponent from '@/components/ProfilePopoverComponent.vue';
import { useAuthStore } from '@/stores/useAuthStore';

const { user } = useAuthStore();

interface Props {
  title?: string;
  showBackButton?: boolean;
  backRoute?: string;
  showProfilePopover?: boolean;
  showNotificationsIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBackButton: false,
  backRoute: '',
  showProfilePopover: true,
  showNotificationsIcon: true,
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const profileMenuRef = ref(null);
const showProfileMenu = ref(false);
const showNotifications = ref(false);
const notificationsRef = ref(null);

onMounted(async () => {
  if (!authStore.initialized) {
    await authStore.initializeAuth();
  }
});

watch(
  () => route.fullPath,
  () => {
    showProfileMenu.value = false;
    showNotifications.value = false;
  },
);

onClickOutside(profileMenuRef, () => {
  showProfileMenu.value = false;
});

onClickOutside(notificationsRef, () => {
  showNotifications.value = false;
});

const handleBackClick = () => {
  if (props.backRoute) {
    router.push(props.backRoute);
  } else {
    router.back();
  }
};

const displayTitle = computed(() => {
  if (props.title) {
    return props.title;
  }

  if (
    route.name === 'player' ||
    route.path.includes('/player') ||
    route.path.includes('/owner') ||
    route.name === 'owner'
  ) {
    return 'CourtConnect';
  }

  return route.name?.toString() || 'CourtConnect';
});

const notifications = ref([
  { id: 1, text: 'New team invitation', time: '10m ago' },
  { id: 2, text: 'Game scheduled tomorrow', time: '1h ago' },
  { id: 3, text: 'Payment receipt', time: '5h ago' },
]);

const notificationsPosition = ref({ top: 30, right: 10 });
const profilePosition = ref({ top: 30, right: 10 });

const toggleNotifications = () => {
  const button = (
    notificationsRef.value as unknown as HTMLElement
  )?.getBoundingClientRect();
  if (button) {
    notificationsPosition.value = {
      top: button.bottom + window.scrollY,
      right: window.innerWidth - button.right + 16,
    };
  }
  showNotifications.value = !showNotifications.value;
};

const toggleProfileMenu = () => {
  const button = (
    profileMenuRef.value as unknown as HTMLElement
  )?.getBoundingClientRect();
  if (button) {
    profilePosition.value = {
      top: button.bottom + window.scrollY,
      right: window.innerWidth - button.right + 16,
    };
  }
  showProfileMenu.value = !showProfileMenu.value;
};
</script>

<template>
  <IonHeader>
    <IonToolbar class="header-toolbar">
      <div class="flex items-center justify-between w-full px-2">
        <div class="flex items-center">
          <IonButton
            v-if="showBackButton"
            fill="clear"
            class="back-button"
            @click="handleBackClick"
          >
            <IonIcon :icon="chevronBackOutline" class="back-icon" />
          </IonButton>

          <div class="flex items-center">
            <div class="logo-container">
              <img
                src="@/assets/appIcon.webp"
                alt="CourtConnect Logo"
                class="logo-image"
              />
            </div>
          </div>

          <span class="header-title ml-2 mr-2">{{ displayTitle }}</span>
          <ion-badge
            :color="authStore.isCurrentRolePlayer ? 'primary' : 'secondary'"
            class="ion-no-padding role-text"
          >
            {{ authStore.activeRole }}
          </ion-badge>
        </div>

        <div class="action-buttons">
          <div class="relative" v-if="showNotificationsIcon">
            <IonButton class="notification-btn" @click="toggleNotifications">
              <div class="notification-container">
                <IonIcon
                  :icon="notificationsOutline"
                  class="notification-icon"
                />
                <ion-badge color="danger" class="notification-badge">
                  {{ notifications.length > 99 ? '99+' : notifications.length }}
                </ion-badge>
              </div>
            </IonButton>

            <teleport to="body">
              <div
                v-if="showNotifications"
                class="notifications-menu"
                ref="notificationsRef"
                :style="{
                  top: `${notificationsPosition.top}px`,
                  right: `${notificationsPosition.right}px`,
                  position: 'absolute',
                  zIndex: 1000,
                }"
              >
                <div class="notifications-header">
                  <h3>Notifications</h3>
                  <IonButton fill="clear" size="small">Mark all read</IonButton>
                </div>
                <div class="notifications-list">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="notification-item"
                  >
                    <div class="notification-content">
                      <p class="notification-text">{{ notification.text }}</p>
                      <span class="notification-time">{{
                        notification.time
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </teleport>
          </div>

          <div v-if="showProfilePopover" class="relative">
            <IonButton class="profile-btn" @click="toggleProfileMenu">
              <ion-avatar class="profile-container">
                <img
                  v-if="user?.profileImage"
                  src="@/assets/appIcon.webp"
                  alt="Profile"
                  class="profile-image"
                />
                <span v-else class="avatar-placeholder">{{
                  user?.full_name[0]
                }}</span>
              </ion-avatar>
            </IonButton>

            <teleport to="body">
              <ProfilePopoverComponent
                v-if="showProfileMenu"
                ref="profileMenuRef"
                :style="{
                  top: `${profilePosition.top}px`,
                  right: `${profilePosition.right}px`,
                  position: 'absolute',
                  zIndex: 1000,
                }"
              />
            </teleport>
          </div>
        </div>
      </div>
    </IonToolbar>
  </IonHeader>
</template>

<style scoped lang="scss">
.header-toolbar {
  --padding-top: 5px;
  --padding-bottom: 5px;
  --min-height: 64px;
  --border-style: none;
  --background: var(--ion-color-light);
}

.back-button {
  --padding-start: 0;
  --padding-end: 8px;
  margin-right: 8px;
}

.back-icon {
  font-size: 24px;
  color: var(--ion-color-dark);
}

.logo-container {
  width: 36px;
  border-radius: 8px;
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.role-text {
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 4px 8px;
  color: var(--ion-color-light);
}

.action-buttons {
  display: flex;
  align-items: center;
}

.notification-btn,
.profile-btn {
  --background: transparent;
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 2px;
  --padding-bottom: 2px;
  position: relative;
}

.notification-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon {
  font-size: 22px;
  color: var(--ion-color-dark);
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 10px;
  font-weight: 600;
  height: 18px;
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.notifications-menu {
  position: absolute;
  top: 50px;
  right: 0;
  width: 300px;
  background: var(--ion-color-light);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ion-color-medium);

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--ion-color-dark);
  }
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--ion-color-medium);
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--ion-color-medium);
  }

  &:last-child {
    border-bottom: none;
  }
}

.notification-content {
  .notification-text {
    margin: 0 0 4px;
    font-size: 14px;
    color: var(--ion-color-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .notification-time {
    font-size: 12px;
    color: var(--ion-color-medium);
  }
}

.profile-container {
  width: 32px;
  height: 32px;
  border-radius: 24px;
  border: 2px solid var(--ion-color-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder {
  color: var(--ion-color-primary);
  font-size: 20px;
  font-weight: 600;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .header-toolbar {
    --min-height: 56px;
  }

  .logo-container,
  .profile-container {
    width: 30px;
    height: 30px;
  }

  .header-title {
    font-size: 1.1rem;
  }

  .notifications-menu {
    width: calc(100vw - 32px);
    right: -12px;
  }
}

@media (max-width: 400px) {
  .logo-container,
  .profile-container {
    width: 28px;
    height: 28px;
  }

  .header-title {
    font-size: 0.9rem;
  }
}
</style>
