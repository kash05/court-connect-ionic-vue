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
    path: '/register/:roleId',
    name: 'RegisterationForm',
    component: () => import('../views/auth/RegisterationForm.vue'),
    beforeEnter: guestGuard,
  },
  {
    path: '/switch-mode/:mode',
    name: 'SwitchMode',
    component: () => import('@/views/SwitchModeSplashView.vue'),
    props: true,
  },
  {
    path: '/player',
    name: 'PlayerDashboard',
    component: () => import('@/views/player/DashboardView.vue'),
    beforeEnter: [authGuard, roleGuard([UserRole.PLAYER])],
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    beforeEnter: [authGuard],
  },
  {
    path: '/teams',
    name: 'Teams',
    component: () => import('../views/player/TeamsView.vue'),
    beforeEnter: [authGuard, roleGuard([UserRole.PLAYER])],
  },
  {
    path: '/events',
    meta: { requiredRole: UserRole.PLAYER },
    component: () => import('../views/player/EventsView.vue'),
    beforeEnter: [authGuard, roleGuard([UserRole.PLAYER])],
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/player/SettingsView.vue'),
    beforeEnter: [authGuard],
  },
  {
    path: '/owner',
    name: 'OwnerDashboard',
    component: () => import('../views/owner/DashboardView.vue'),
    beforeEnter: [authGuard, roleGuard([UserRole.OWNER])],
  },
  {
    path: '/add-property',
    name: 'AddProperty',
    component: () => import('../views/owner/AddProperty.vue'),
    beforeEnter: [authGuard, roleGuard([UserRole.OWNER])],
  },
  {
    path: '/properties',
    name: 'Properties',
    component: () => import('../views/owner/PropertyDetailView.vue'),
    beforeEnter: [authGuard, roleGuard([UserRole.OWNER])],
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../views/owner/StatisticsView.vue'),
    beforeEnter: [authGuard, roleGuard([UserRole.OWNER])],
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
