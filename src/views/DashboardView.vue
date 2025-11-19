<script>
import { mapState } from 'pinia';
import { useAppStore } from '../stores/useAppStore';
import api from '../services/api';

export default {
  name: 'DashboardView',
  data() {
    return {
      tracks: [],
      isLoading: true,
      error: null,
    };
  },
  computed: {
    ...mapState(useAppStore, ['user']),
  },
  async mounted() {
    if (!this.user || !this.user.lastfm_username) {
      this.error = 'Could not find Last.fm username. Please log in again.';
      this.isLoading = false;
      return;
    }
    
    try {
      this.tracks = await api.getRecentTracks(this.user.lastfm_username);
    } catch (err) {
      this.error = `Failed to fetch recent tracks. Last.fm said: ${err.message}`;
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 text-text-primary">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-heading font-bold mb-6">Dashboard</h1>
      <h2 class="text-xl sm:text-2xl font-heading text-text-secondary mb-8">Recently Listened Tracks</h2>

      <div v-if="isLoading" class="text-center">
        <p>Loading recent tracks...</p>
      </div>

      <div v-else-if="error" class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md">
        <p><strong>Error:</strong> {{ error }}</p>
      </div>

      <div v-else-if="tracks.length > 0" class="space-y-4">
        <div 
          v-for="(track, index) in tracks" 
          :key="index" 
          class="flex items-center gap-4 bg-primary-light p-3 rounded-lg hover:bg-accent-purple/20 transition-colors duration-200"
        >
          <img :src="track.image[1]['#text']" alt="Album Art" class="w-12 h-12 rounded-md" />
          <div class="flex-grow">
            <p class="font-bold text-text-primary">{{ track.name }}</p>
            <p class="text-sm text-text-secondary">{{ track.artist['#text'] }}</p>
          </div>
          <div class="text-right text-sm text-text-secondary">
            <span v-if="track['@attr'] && track['@attr'].nowplaying">Now Playing</span>
            <span v-else>{{ track.date?.['#text'] || 'Just now' }}</span>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-text-secondary">
        <p>No recent tracks found. Go listen to some music!</p>
      </div>
    </div>
  </div>
</template>