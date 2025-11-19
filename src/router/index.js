import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'

const Dashboard = { template: '<div class="text-white text-center p-8">Dashboard Page</div>' }
const Goals = { template: '<div class="text-white text-center p-8">Goals Page</div>' }
const Collages = { template: '<div class="text-white text-center p-8">Collages Page</div>' }
const Profile = { template: '<div class="text-white text-center p-8">Profile Page</div>' }


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
      component: Dashboard
    },
    {
      path: '/goals',
      name: 'goals',
      component: Goals
    },
    {
      path: '/collages',
      name: 'collages',
      component: Collages
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    }
  ]
})

export default router