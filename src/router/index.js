import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import DashboardView from '../views/DashboardView.vue'
import GoalsView from '../views/GoalsView.vue'
import Profile from '../views/ProfileView.vue'
import CollagesView from '../views/CollagesView.vue'
import ProfileEdit from '../views/ProfileEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/goals/:action?/:id?',
      name: 'goals',
      component: GoalsView,
      props: true
    },
    {
      path: '/collages',
      name: 'collages',
      component: CollagesView
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
        {
      path: '/profileEdit',
      name: 'profileEdit',
      component: ProfileEdit
    }
  ]
})

export default router