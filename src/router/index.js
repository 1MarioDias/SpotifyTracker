import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import GoalsView from '../views/GoalsView.vue'
import Profile from '../views/ProfileView.vue'
import CollagesView from '../views/CollagesView.vue'
import ProfileEdit from '../views/ProfileEdit.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/goals/:action?/:id?',
      name: 'goals',
      component: GoalsView,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/collages',
      name: 'collages',
      component: CollagesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/profileEdit',
      name: 'profileEdit',
      component: ProfileEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboard,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const SESSION_KEY = 'wusik_user_session';
  let isAuthenticated = false;
  let isAdmin = false;

  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      isAuthenticated = true;
      isAdmin = userData.isAdmin || false;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    isAuthenticated = false;
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'dashboard' });
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router