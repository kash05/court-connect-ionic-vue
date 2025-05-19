import { authGuard, guestGuard } from '@/guards/authGuard';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
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
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/teams',
    name: 'Teams',
    component: () => import('../views/TeamsView.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/events',
    name: 'Events',
    component: () => import('../views/EventsView.vue'),
    beforeEnter: authGuard,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue'),
    beforeEnter: authGuard,
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
