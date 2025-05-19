import { authGuard, guestGuard } from '@/guards/authGuard';
import { roleGuard } from '@/guards/roleGuard';
import { UserRole } from '@/types/enums/UserEnum';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    beforeEnter: guestGuard,
  },
  {
    path: '/register',
    name: 'Registeration',
    component: () => import('../views/auth/RegistrationView.vue'),
    beforeEnter: guestGuard,
  },
  {
    path: '/player',
    name: 'PlayerDashboard',
    meta: { requiredRole: UserRole.PLAYER },
    component: () => import('@/views/player/DashboardView.vue'),
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/teams',
    name: 'Teams',
    meta: { requiredRole: UserRole.PLAYER },
    component: () => import('../views/player/TeamsView.vue'),
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/events',
    name: 'Events',
    meta: { requiredRole: UserRole.PLAYER },
    component: () => import('../views/player/EventsView.vue'),
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/settings',
    name: 'Settings',
    meta: { requiredRole: UserRole.PLAYER },
    component: () => import('../views/player/SettingsView.vue'),
    beforeEnter: [authGuard, roleGuard],
  },
  {
    path: '/owner',
    name: 'OwnerDashboard',
    meta: { requiredRole: UserRole.OWNER },
    component: () => import('@/views/owner/DashboardView.vue'),
    beforeEnter: [authGuard, roleGuard],
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
