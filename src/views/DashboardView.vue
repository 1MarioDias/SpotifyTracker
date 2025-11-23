<script>
import { mapState } from 'pinia';
import { useAppStore } from '../stores/useAppStore';
import RecentTracks from '../components/RecentTracks.vue';
import TopArtists from '../components/TopArtists.vue';

export default {
  name: 'DashboardView',
  components: {
    RecentTracks,
    TopArtists,
  },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['user']),
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

      <div v-if="error" class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-8">
        <p><strong>Error:</strong> {{ error }}</p>
      </div>

      <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="lg:col-span-1">
          <RecentTracks :lastfm-username="user.lastfm_username" />
        </div>

        <div class="lg:col-span-1">
          <TopArtists :lastfm-username="user.lastfm_username" />
        </div>
      </div>
      
      <div v-else class="text-center text-text-secondary">
        <p>Loading user data...</p>
      </div>
    </div>
  </div>
</template>