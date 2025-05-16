<script setup lang="ts">
import { IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/vue';
import { notificationsOutline } from 'ionicons/icons';
import { onClickOutside } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const profileMenuRef = ref(null);

const route = useRoute();

const showProfileMenu = ref(false);

const pageTitles: Record<string, string> = {
  Dashboard: 'Dashboard',
  Teams: 'Teams',
  Events: 'Events',
  Profile: 'Profile',
};

onClickOutside(profileMenuRef, () => {
  showProfileMenu.value = false;
});

const currentPageTitle = computed(() => {
  return pageTitles[route.name as string] || 'Sports App';
});
</script>

<template>
  <IonTitle class="ion-text-center">
    <div class="flex items-center justify-center">
      <div class="logo-container">
        <img
          src="https://images.pexels.com/photos/1432039/pexels-photo-1432039.jpeg?auto=compress&cs=tinysrgb&w=100"
          alt="Logo"
          class="logo-image"
        />
      </div>
      <span class="page-title">{{ currentPageTitle }}</span>
    </div>
  </IonTitle>

  <IonButtons slot="end" class="action-buttons">
    <IonButton class="notification-btn">
      <div class="notification-container">
        <IonIcon :icon="notificationsOutline" class="notification-icon" />
        <span class="notification-badge">3</span>
      </div>
    </IonButton>
  </IonButtons>
</template>

<style scoped lang="scss">
.logo-container {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  overflow: hidden;
  margin-right: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ion-color-dark);
  letter-spacing: -0.5px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
}

.notification-btn,
.profile-btn {
  --background: transparent;
  --background-hover: rgba(var(--ion-color-primary-rgb), 0.1);
  --border-radius: 12px;
  --padding-start: 12px;
  --padding-end: 12px;
  height: 44px;
  position: relative;
}

.notification-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-icon {
  font-size: 24px;
  color: var(--ion-color-dark);
  transition: transform 0.2s ease;
}

.notification-btn:hover .notification-icon {
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--ion-color-primary);
  color: white;
  font-size: 10px;
  font-weight: 600;
  height: 18px;
  width: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

@media (max-width: 768px) {
  .nav-toolbar {
    height: 60px;
  }

  .logo-container {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }

  .page-title {
    font-size: 1.125rem;
  }

  .profile-menu {
    width: calc(100vw - 32px);
    right: -8px;
  }
}
</style>
