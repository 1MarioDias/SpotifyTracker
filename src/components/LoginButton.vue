<script>
import { RouterView } from 'vue-router'
import { mapState } from 'pinia'
import { useAppStore } from '../stores/useAppStore'

export default {
  name: 'LoginButton',
  components: {
    RouterView
  },
  methods: {
    handleLogin() {
      this.$router.push('/login');
    },
    handleDashboard() {
      this.$router.push('/dashboard');
    }
  },
  computed: {
    ...mapState(useAppStore, ['isLoggedIn'])
  },
}
</script>

<template>
  <section class="w-full px-4 py-8 lg:py-12 flex justify-center">
    <template v-if="!isLoggedIn">
      <button 
        @click="handleLogin"
        class="relative w-full max-w-[405px] h-[86px] rounded-full bg-vinyl-gray shadow-[inset_0_-4px_4px_-2px_rgba(148,165,172,0.2),inset_0_-4px_9.6px_4px_rgba(0,0,0,0.25)] hover:bg-opacity-90 transition-all duration-300"
      >
        <div class="absolute left-[23px] top-[31px] w-[calc(100%-46px)] h-6 rounded-full bg-primary-light shadow-[inset_0_-4px_4px_0_rgba(0,0,0,0.25),inset_0_-10px_16.5px_0_rgba(255,255,255,0.25),0_-4px_6.4px_0_rgba(0,0,0,0.20),0_4px_4px_0_rgba(255,255,255,0.20),inset_0_4px_4px_0_rgba(0,0,0,0.25)]"></div>
        <div class="absolute left-64 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-6 rounded-full bg-accent-pink shadow-[inset_0_0_4px_6px_rgba(0,0,0,0.05),inset_-1px_-2px_4px_0_rgba(224,33,138,0.43),inset_0_-4px_4px_3px_rgba(0,0,0,0.25),0_4px_7.6px_0_rgba(0,0,0,0.25)] rotate-90"></div>
        <span class="absolute inset-0 flex items-center justify-center font-body text-text-primary text-5xl sm:text-6xl lg:text-[70px] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          LOG<span class="ml-4">I</span><span class="ml-1"> N</span>
        </span>
      </button>
    </template>
    <template v-else>
      <button 
        @click="handleDashboard"
        class="relative w-full max-w-[405px] h-[86px] rounded-full bg-vinyl-gray shadow-[inset_0_-4px_4px_-2px_rgba(148,165,172,0.2),inset_0_-4px_9.6px_4px_rgba(0,0,0,0.25)] hover:bg-opacity-90 transition-all duration-300"
      >
        <div class="absolute left-[23px] top-[31px] w-[calc(100%-46px)] h-6 rounded-full bg-primary-light shadow-[inset_0_-4px_4px_0_rgba(0,0,0,0.25),inset_0_-10px_16.5px_0_rgba(255,255,255,0.25),0_-4px_6.4px_0_rgba(0,0,0,0.20),0_4px_4px_0_rgba(255,255,255,0.20),inset_0_4px_4px_0_rgba(0,0,0,0.25)]"></div>
        <div class="absolute left-64 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-6 rounded-full bg-accent-pink shadow-[inset_0_0_4px_6px_rgba(0,0,0,0.05),inset_-1px_-2px_4px_0_rgba(224,33,138,0.43),inset_0_-4px_4px_3px_rgba(0,0,0,0.25),0_4px_7.6px_0_rgba(0,0,0,0.25)] rotate-90"></div>
        <span class="absolute inset-0 flex items-center justify-center font-body text-text-primary text-2xl sm:text-6xl lg:text-[50px] font-bold drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          DASHBOARD
        </span>
      </button>
    </template>
  </section>
</template>

<style scoped></style>