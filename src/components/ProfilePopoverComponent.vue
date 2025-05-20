<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { IonIcon, IonAvatar } from '@ionic/vue';
import {
  personOutline,
  settingsOutline,
  helpCircleOutline,
  logOutOutline,
  cardOutline,
  lockClosedOutline,
} from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();
const { user } = useAuthStore();

const navigateTo = (path: string) => {
  router.push(path);
};

const handleLogout = () => {
  router.push('/login');
};
</script>

<template>
  <div class="profile-menu">
    <div class="profile-header">
      <div class="profile-info">
        <ion-avatar class="profile-avatar">
          <img
            v-if="user?.profileImage"
            src="@/assets/appIcon.webp"
            alt="Profile"
            class="avatar-image"
          />
          <span v-else class="avatar-placeholder">{{
            user?.full_name[0]
          }}</span>
        </ion-avatar>
        <div class="profile-details">
          <h4 class="profile-name">{{ user?.full_name }}</h4>
          <p class="profile-email">{{ user?.email }}</p>
        </div>
      </div>
    </div>

    <div class="menu-items">
      <div class="menu-item" @click="navigateTo('/profile')">
        <div class="menu-icon">
          <IonIcon :icon="personOutline" />
        </div>
        <span class="menu-text">My Profile</span>
      </div>

      <div class="menu-item" @click="navigateTo('/payments')">
        <div class="menu-icon">
          <IonIcon :icon="cardOutline" />
        </div>
        <span class="menu-text">Payments</span>
      </div>

      <div class="menu-item" @click="navigateTo('/settings')">
        <div class="menu-icon">
          <IonIcon :icon="settingsOutline" />
        </div>
        <span class="menu-text">Settings</span>
      </div>

      <div class="menu-item" @click="navigateTo('/security')">
        <div class="menu-icon">
          <IonIcon :icon="lockClosedOutline" />
        </div>
        <span class="menu-text">Security</span>
      </div>

      <div class="menu-item" @click="navigateTo('/help')">
        <div class="menu-icon">
          <IonIcon :icon="helpCircleOutline" />
        </div>
        <span class="menu-text">Help & Support</span>
      </div>

      <div class="menu-divider"></div>

      <div class="menu-item logout-item" @click="handleLogout">
        <div class="menu-icon logout-icon">
          <IonIcon :icon="logOutOutline" />
        </div>
        <span>Log Out</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-menu {
  position: absolute;
  top: 50px;
  right: 0;
  width: fit-content !important;
  background: var(--ion-color-light);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f1f1;
}

.profile-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  overflow: hidden;
  margin-right: 12px;
  border: 2px solid var(--ion-color-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder {
  color: var(--ion-color-primary);
  font-size: 20px;
  font-weight: 600;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details {
  flex: 1;
}

.profile-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.profile-email {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--ion-color-medium);
}

.view-profile-btn {
  background: transparent;
  border: 1px solid var(--ion-color-primary);
  color: var(--ion-color-primary);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--ion-color-primary-tint);
  }
}

.menu-items {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--ion-color-medium);
  }
}

.menu-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: var(--ion-color-medium);
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-dark);
}

.menu-divider {
  height: 1px;
  background: var(--ion-color-medium);
  margin: 8px 0;
}

.logout-item {
  color: #d32f2f;
}

.logout-icon {
  color: #d32f2f;
}

@media (max-width: 768px) {
  .profile-menu {
    width: calc(100vw - 32px);
    right: -12px;
  }
}
</style>
