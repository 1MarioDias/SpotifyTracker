<script>
import externalAPIs from '../services/externalAPIs';
import LoadingSkeleton from './LoadingSkeleton.vue';

export default {
  name: 'RecentTracks',
  components: {
    LoadingSkeleton
  },
  props: {
    lastfmUsername: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tracks: [],
      isLoading: true,
      error: null,
      currentPage: 1,
      itemsPerPage: 7,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.tracks.length / this.itemsPerPage);
    },
    paginatedTracks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tracks.slice(start, end);
    },
  },
  methods: {
    async fetchRecentTracks() {
      this.isLoading = true;
      try {
        this.tracks = await externalAPIs.getRecentTracks(this.lastfmUsername);
      } catch (err) {
        this.error = `Failed to fetch recent tracks: ${err.message}`;
      } finally {
        this.isLoading = false;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  mounted() {
    this.fetchRecentTracks();
  },
};
</script>

<template>
  <div class="bg-primary-light p-4 sm:p-6 rounded-lg h-full flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl sm:text-2xl font-heading text-text-primary">Recently Listened</h2>
    </div>

    <div v-if="isLoading" class="flex-grow">
      <LoadingSkeleton type="tracks" />
    </div>

    <div v-else-if="error" class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md">
      <p><strong>Error:</strong> {{ error }}</p>
    </div>

    <div v-else-if="tracks.length > 0" class="flex flex-col flex-grow justify-between">
      <!-- Lista -->
      <div class="space-y-3">
        <div 
          v-for="(track, index) in paginatedTracks" 
          :key="index" 
          class="flex items-center gap-4"
        >
          <img :src="track.image[1]['#text']" alt="Album Art" class="w-12 h-12 rounded-md flex-shrink-0" />
          <div class="flex-grow min-w-0">
            <p class="font-bold text-text-primary truncate">{{ track.name }}</p>
            <p class="text-sm text-text-secondary truncate">{{ track.artist['#text'] }}</p>
          </div>
          <div class="text-right text-sm text-text-secondary flex-shrink-0">
            <span v-if="track['@attr'] && track['@attr'].nowplaying" class="text-accent-pink">Now Playing</span>
            <span v-else>{{ track.date?.['#text'] || 'Just now' }}</span>
          </div>
        </div>
      </div>
      
      <!-- Paginaçãoa -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-primary-dark">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-primary-dark hover:bg-accent-purple/50">
            Prev
        </button>
        <span class="text-sm text-text-secondary">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-primary-dark hover:bg-accent-purple/50">
            Next
        </button>
      </div>
    </div>

    <div v-else class="text-center text-text-secondary flex-grow flex items-center justify-center">
      <p>No recent tracks found.</p>
    </div>
  </div>
</template>