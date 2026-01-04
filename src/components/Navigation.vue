<script>
import { useUserStore } from '../stores/userStore'
import { mapState, mapActions } from 'pinia'
import { RouterLink } from 'vue-router'

export default {
  name: 'Navigation',
  components: {
    RouterLink
  },
  data() {
    return {
      isProfileOpen: false
    }
  },
  computed: {
    ...mapState(useUserStore, ['isLoggedIn', 'user']),

    isAdmin() {
      return this.user?.isAdmin ?? false;
    }
  },
  methods: {
    ...mapActions(useUserStore, ['logout']),
    toggleProfileDropdown() {
      this.isProfileOpen = !this.isProfileOpen
    },
    handleLogout() {
      this.logout()
      this.isProfileOpen = false
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <nav class="w-full px-4 sm:px-6 lg:px-20 py-6 sm:py-8 bg-primary-dark">
    <div class="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="mb-2 lg:mb-4">
        <RouterLink to="/">
          <img 
            src="../assets/images/logo.svg" 
            alt="SpotifyTracker Logo"
            class="mx-auto w-24 sm:w-32 lg:w-40"
            />
        </RouterLink>
        </div>
      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-12 font-nav text-text-primary text-lg sm:text-xl lg:text-2xl">
        

        <template v-if="!isLoggedIn">
          <RouterLink 
            to="/login"
            class="hover:text-accent-pink transition-colors duration-200"
          >
            LOGIN
          </RouterLink>
        </template>

        <template v-if="isLoggedIn">
           <RouterLink
              :to="isAdmin ? '/admin' : '/dashboard'"
              class="hover:text-accent-pink transition-colors duration-200"
            >
              {{ isAdmin ? 'ADMIN' : 'DASHBOARD' }}
          </RouterLink>
          <RouterLink to="/goals" class="hover:text-accent-pink transition-colors duration-200">GOALS</RouterLink>
          <RouterLink to="/collages" class="hover:text-accent-pink transition-colors duration-200">COLLAGES</RouterLink>
          <div class="relative">
            <button @click="toggleProfileDropdown" class="hover:text-accent-pink transition-colors duration-200">
              PROFILE
            </button>
            <div v-if="isProfileOpen" class="absolute right-0 mt-2 w-48 bg-primary-light rounded-md shadow-lg py-1 z-50">
              <RouterLink to="/profile" class="block px-4 py-2 text-sm text-text-primary hover:bg-accent-purple">View Profile</RouterLink>
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-accent-purple">
                Logout
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>