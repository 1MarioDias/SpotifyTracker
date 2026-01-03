<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import RecentTracks from '../components/RecentTracks.vue';
import TopArtists from '../components/TopArtists.vue';
import CrownsRun from '../components/CrownsRun.vue';
import { Music2, AlertCircle } from 'lucide-vue-next';

export default {
  name: 'DashboardView',
  components: {
    RecentTracks,
    TopArtists,
    CrownsRun,
    Music2,
    AlertCircle
  },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    welcomeMessage() {
      return this.user ? `Welcome, ${this.user.username}!` : 'Dashboard';
    }
  },
  mounted() {
    if (!this.user || !this.user.lastfm_username) {
      this.error = 'Could not find Last.fm username. Please log in again.';
    }
  },
};
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 text-text-primary">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-heading font-bold mb-8">{{ welcomeMessage }}</h1>

      <div v-if="error" class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-8 flex items-center gap-2">
        <AlertCircle :size="20" />
        <p><strong>Error:</strong> {{ error }}</p>
      </div>

      <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="lg:col-span-1">
          <RecentTracks :lastfm-username="user.lastfm_username" />
        </div>

        <div class="lg:col-span-1">
          <TopArtists :lastfm-username="user.lastfm_username" />
        </div>

        <div class="lg:col-span-1">
          <CrownsRun />
        </div>
      </div>
      
      <div v-else class="text-center text-text-secondary flex items-center justify-center gap-2">
        <Music2 :size="20" class="animate-pulse" />
        <p>Loading user data...</p>
      </div>
    </div>
  </div>
</template>