<script setup lang="ts">
import { IonTitle, IonButtons, IonButton, IonIcon } from "@ionic/vue";
import { notificationsOutline } from "ionicons/icons";
import { onClickOutside } from "@vueuse/core";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const profileMenuRef = ref(null);

// const authStore = useAuthStore();
const route = useRoute();

const showProfileMenu = ref(false);

const pageTitles: Record<string, string> = {
  Dashboard: "Dashboard",
  Teams: "Teams",
  Events: "Events",
  Profile: "Profile",
};

onClickOutside(profileMenuRef, () => {
  showProfileMenu.value = false;
});

const currentPageTitle = computed(() => {
  return pageTitles[route.name as string] || "Sports App";
});

// function toggleProfileMenu() {
//   showProfileMenu.value = !showProfileMenu.value;
// }
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

    <!-- <div class="profile-container">
      <IonButton class="profile-btn" @click="toggleProfileMenu">
        <div class="profile-image-container">
          <img
            :src="
              authStore.user?.profileImage ||
              'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100'
            "
            alt="Profile"
            class="profile-image"
          />
        </div>
      </IonButton>

      <div v-if="showProfileMenu" class="profile-menu" ref="profileMenuRef">
        <div class="menu-header">
          <img
            :src="
              authStore.user?.profileImage ||
              'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100'
            "
            alt="Profile"
            class="menu-profile-image"
          />
          <div class="menu-user-info">
            <h3 class="menu-user-name">John Doe</h3>
            <p class="menu-user-email">john@example.com</p>
          </div>
        </div>

        <div class="menu-content">
          <a href="#" class="menu-item" @click="$router.push('/profile')">
            <IonIcon :icon="personOutline" class="menu-item-icon" />
            Your Profile
          </a>
          <a href="#" class="menu-item">
            <IonIcon :icon="settingsOutline" class="menu-item-icon" />
            Settings
          </a>
          <a href="#" class="menu-item">
            <IonIcon :icon="moonOutline" class="menu-item-icon" />
            Dark Mode
          </a>
          <a href="#" class="menu-item">
            <IonIcon :icon="helpCircleOutline" class="menu-item-icon" />
            Help & Support
          </a>
          <div class="menu-divider"></div>
          <a href="#" class="menu-item menu-item-danger">
            <IonIcon :icon="logOutOutline" class="menu-item-icon" />
            Sign out
          </a>
        </div>
      </div>
    </div> -->
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

.profile-container {
  position: relative;
}

.profile-image-container {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.profile-btn:hover .profile-image-container {
  transform: scale(1.05);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 280px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.2s ease-out;
  overflow: hidden;
}

.menu-header {
  padding: 16px;
  background: rgba(var(--ion-color-primary-rgb), 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-profile-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
}

.menu-user-info {
  flex: 1;
  min-width: 0;
}

.menu-user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-user-email {
  font-size: 13px;
  color: var(--ion-color-medium);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-content {
  padding: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: var(--ion-color-dark);
  text-decoration: none;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.menu-item-icon {
  font-size: 20px;
  color: var(--ion-color-medium);
  transition: color 0.2s ease;
}

.menu-item:hover {
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  color: var(--ion-color-primary);
}

.menu-item:hover .menu-item-icon {
  color: var(--ion-color-primary);
}

.menu-item-danger {
  color: var(--ion-color-danger);
}

.menu-item-danger .menu-item-icon {
  color: var(--ion-color-danger);
}

.menu-item-danger:hover {
  background: rgba(var(--ion-color-danger-rgb), 0.1);
  color: var(--ion-color-danger);
}

.menu-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 8px 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
