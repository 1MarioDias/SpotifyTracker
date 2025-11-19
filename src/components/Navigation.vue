<script>
export default {
  name: 'Navigation',
  data() {
    return {
      activeNav: ''
    }
  },
  methods: {
    handleNavClick(item) {
      this.activeNav = item
    }
  }
}
</script>

<template>
  <nav class="w-full px-4 sm:px-6 lg:px-20 py-6 sm:py-8">
    <div class="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="mb-2 lg:mb-4">
        <a href="../views/HomeView.vue">
          <img 
            src="../assets/images/logo.svg" 
            alt="SpotifyTracker Logo"
            class="mx-auto w-24 sm:w-32 lg:w-40"
            />
        </a>
        </div>
      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-12 font-nav text-white text-lg sm:text-xl lg:text-2xl">
        <button 
          @click="handleNavClick('tracks')"
          class="hover:text-vinyl-orange transition-colors duration-200"
        >
          TOP TRACKS
        </button>
        <button 
          @click="handleNavClick('artists')"
          class="hover:text-vinyl-orange transition-colors duration-200"
        >
          TOP ARTISTS
        </button>
        <button 
          @click="handleNavClick('genres')"
          class="hover:text-vinyl-orange transition-colors duration-200"
        >
          TOP GENRES
        </button>
        <button 
          @click="handleNavClick('custom')"
          class="hover:text-vinyl-orange transition-colors duration-200"
        >
          CUSTOM
        </button>
        <button 
          @click="handleNavClick('login')"
          class="hover:text-vinyl-orange transition-colors duration-200 ml-4 sm:ml-8"
        >
          LOGIN
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>