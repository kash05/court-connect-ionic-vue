import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";

import MainLayout from "../layouts/MainLayout.vue";
import AuthLayout from "../layouts/AuthLayout.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: "/login",
        name: "Login",
        component: () => import("../views/auth/LoginView.vue"),
      },
      {
        path: "/register",
        name: "Registeration",
        component: () => import("../views/auth/RegistrationView.vue"),
      },
    ],
  },
  {
    path: "/dashboard",
    component: MainLayout,
    // meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("@/views/DashboardView.vue"),
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("../views/ProfileView.vue"),
      },
      {
        path: "/teams",
        name: "Teams",
        component: () => import("../views/TeamsView.vue"),
      },
      {
        path: "/events",
        name: "Events",
        component: () => import("../views/EventsView.vue"),
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  await initializeAuthStore(authStore);

  const { requiresAuth, requiresGuest, requiresRole } =
    getRouteRequirements(to);

  if (shouldRedirectToLogin(requiresAuth, authStore.isAuthenticated())) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  if (shouldRedirectToDashboard(requiresGuest, authStore.isAuthenticated())) {
    return next("/login");
  }

  if (hasRoleMismatch(requiresRole, to.meta.role, authStore)) {
    return next("/dashboard");
  }

  next();
});

async function initializeAuthStore(authStore: any) {
  if (!authStore.isInitialized) {
    await authStore.initializeAuth().catch((error: any) => {
      console.error("Auth initialization failed:", error);
    });
  }
}

function getRouteRequirements(to: any) {
  return {
    requiresAuth: to.matched.some(
      (record: { meta: { requiresAuth: any } }) => record.meta.requiresAuth
    ),
    requiresGuest: to.matched.some(
      (record: { meta: { requiresGuest: any } }) => record.meta.requiresGuest
    ),
    requiresRole: to.matched.some(
      (record: { meta: { role: any } }) => record.meta.role
    ),
  };
}

function shouldRedirectToLogin(
  requiresAuth: boolean,
  isAuthenticated: boolean
) {
  return requiresAuth && !isAuthenticated;
}

function shouldRedirectToDashboard(
  requiresGuest: boolean,
  isAuthenticated: boolean
) {
  return requiresGuest && isAuthenticated;
}

function hasRoleMismatch(
  requiresRole: boolean,
  requiredRole: any,
  authStore: any
) {
  return (
    requiresRole &&
    authStore.isAuthenticated &&
    authStore.user?.role !== requiredRole
  );
}

export default router;
