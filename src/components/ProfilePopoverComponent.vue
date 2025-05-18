<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
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
        <div class="profile-avatar">
          <img src="@/assets/icon.webp" alt="Profile" class="avatar-image" />
        </div>
        <div class="profile-details">
          <h4 class="profile-name">John Smith</h4>
          <p class="profile-email">john.smith@example.com</p>
        </div>
      </div>
      <button class="view-profile-btn" @click="navigateTo('/profile')">
        View Profile
      </button>
    </div>

    <div class="menu-items">
      <div class="menu-item" @click="navigateTo('/profile')">
        <div class="menu-icon">
          <IonIcon :icon="personOutline" />
        </div>
        <span>My Profile</span>
      </div>

      <div class="menu-item" @click="navigateTo('/payments')">
        <div class="menu-icon">
          <IonIcon :icon="cardOutline" />
        </div>
        <span>Payments</span>
      </div>

      <div class="menu-item" @click="navigateTo('/settings')">
        <div class="menu-icon">
          <IonIcon :icon="settingsOutline" />
        </div>
        <span>Settings</span>
      </div>

      <div class="menu-item" @click="navigateTo('/security')">
        <div class="menu-icon">
          <IonIcon :icon="lockClosedOutline" />
        </div>
        <span>Security</span>
      </div>

      <div class="menu-item" @click="navigateTo('/help')">
        <div class="menu-icon">
          <IonIcon :icon="helpCircleOutline" />
        </div>
        <span>Help & Support</span>
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
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.profile-header {
  padding: 16px;
  background: #f9f9f9;
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
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    background: #f5f5f5;
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

.menu-divider {
  height: 1px;
  background: #f1f1f1;
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
