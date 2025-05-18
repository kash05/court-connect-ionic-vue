<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonToggle,
  alertController,
  IonBadge,
} from '@ionic/vue';
import { notificationsOutline, chevronBackOutline } from 'ionicons/icons';
import { onClickOutside } from '@vueuse/core';
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProfilePopoverComponent from '@/components/ProfilePopoverComponent.vue';
import { UserRole } from '@/types/enums/UserEnum';

interface Props {
  title?: string;
  showBackButton?: boolean;
  backRoute?: string;
  showProfilePopover?: boolean;
  showNotificationsIcon?: boolean;
  showToggleRole?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBackButton: false,
  backRoute: '',
  showProfilePopover: true,
  showNotificationsIcon: true,
  showToggleRole: true,
});

const profileMenuRef = ref(null);
const showProfileMenu = ref(false);
const showNotifications = ref(false);
const notificationsRef = ref(null);
const route = useRoute();
const router = useRouter();
const userRole = ref<UserRole>(UserRole.PLAYER);

const isOwner = ref(userRole.value === UserRole.OWNER);

onMounted(() => {
  const savedRole = localStorage.getItem('userRole');
  if (savedRole === UserRole.PLAYER || savedRole === UserRole.OWNER) {
    userRole.value = savedRole;
    isOwner.value = savedRole === UserRole.OWNER;
  }
});

const onToggleClick = async () => {
  const targetRole = isOwner.value ? UserRole.PLAYER : UserRole.OWNER;

  const alert = await alertController.create({
    header: `Switch role to ${targetRole}?`,
    message: 'Your role will be remembered for future sessions.',
    backdropDismiss: false,
    buttons: [
      {
        text: 'Yes',
        handler: () => {
          userRole.value = targetRole;
          isOwner.value = targetRole === UserRole.OWNER;
          localStorage.setItem('userRole', targetRole);
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          isOwner.value = userRole.value === UserRole.OWNER;
        },
      },
    ],
  });

  await alert.present();
};

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

  if (route.name === 'Dashboard' || route.path.includes('/dashboard')) {
    return 'CourtConnect';
  }

  return route.name?.toString() || 'CourtConnect';
});

const notifications = ref([
  { id: 1, text: 'New team invitation', time: '10m ago' },
  { id: 2, text: 'Game scheduled tomorrow', time: '1h ago' },
  { id: 3, text: 'Payment receipt', time: '5h ago' },
]);
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

          <span class="header-title ml-2">{{ displayTitle }}</span>
        </div>

        <div class="action-buttons">
          <div class="role-toggle-container capitalize" v-if="showToggleRole">
            <ion-badge :color="userRole === 'player' ? 'primary' : 'secondary'">
              {{ userRole }}
            </ion-badge>
            <IonToggle
              v-model="isOwner"
              @click.prevent="onToggleClick"
              class="role-toggle"
            />
          </div>

          <div class="relative" v-if="showNotificationsIcon">
            <IonButton
              class="notification-btn"
              @click="showNotifications = !showNotifications"
            >
              <div class="notification-container">
                <IonIcon
                  :icon="notificationsOutline"
                  class="notification-icon"
                />
                <ion-badge color="danger" class="notification-badge">
                  {{ notifications.length }}
                </ion-badge>
              </div>
            </IonButton>

            <div
              v-if="showNotifications"
              class="notifications-menu"
              ref="notificationsRef"
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
          </div>

          <div v-if="showProfilePopover" class="relative">
            <IonButton
              class="profile-btn"
              @click="showProfileMenu = !showProfileMenu"
            >
              <div class="profile-container">
                <img
                  src="@/assets/appIcon.webp"
                  alt="Profile"
                  class="profile-image"
                />
              </div>
            </IonButton>

            <ProfilePopoverComponent
              v-if="showProfileMenu"
              ref="profileMenuRef"
            />
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

.action-buttons {
  display: flex;
  align-items: center;
}

.role-toggle-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-label {
  font-size: 14px;
  font-weight: 700;
  background-color: var(--ion-color-primary);
  border-radius: 8px;
  padding: 2px 8px;
  color: white;
}

.role-label-player {
  background-color: var(--ion-color-primary);
}
.role-label-owner {
  background-color: var(--ion-color-secondary);
}

.role-toggle {
  --handle-width: 20px;
  --handle-height: 20px;
  --handle-spacing: 2px;
}
ion-toggle::part(track) {
  background-color: var(--ion-color-primary);
}
ion-toggle.toggle-checked::part(track) {
  background-color: var(--ion-color-secondary);
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
}

.notifications-menu {
  position: absolute;
  top: 50px;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f1f1;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
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
  }

  .notification-time {
    font-size: 12px;
    color: var(--ion-color-medium);
  }
}

.profile-container {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: 1px solid var(--ion-color-primary);
  overflow: hidden;
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
    width: 28px;
    height: 28px;
  }

  .header-title {
    font-size: 0.9rem;
  }

  .notifications-menu {
    width: calc(100vw - 32px);
    right: -12px;
  }

  .role-label {
    font-size: 0.6rem;
    font-weight: 700;
    border-radius: 8px;
    padding: 2px 8px;
    color: white;
  }

  .role-toggle {
    --handle-width: 20px;
    --handle-height: 20px;
    --handle-spacing: 1px;
  }
}
</style>
