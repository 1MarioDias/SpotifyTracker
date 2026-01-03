<script>
import externalAPIs from '../services/externalAPIs';
import html2canvas from 'html2canvas';
import LoadingSkeleton from './LoadingSkeleton.vue';

export default {
  name: 'TopArtists',
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
      artists: [],
      isLoading: true,
      error: null,
      selectedPeriod: '7day',
      periods: [
        { label: 'Week', value: '7day' },
        { label: 'Month', value: '1month' },
        { label: 'Quarter', value: '3month' },
        { label: 'Year', value: '12month' },
        { label: 'All Time', value: 'overall' },
      ],
    };
  },
  methods: {
    async fetchTopArtists() {
      this.isLoading = true;
      this.error = null;
      try {
        this.artists = await externalAPIs.getTopArtists(this.lastfmUsername, this.selectedPeriod);
      } catch (err) {
        this.error = `Failed to fetch top artists: ${err.message}`;
        this.artists = [];
      } finally {
        this.isLoading = false;
      }
    },
    changePeriod(periodValue) {
      this.selectedPeriod = periodValue;
    },
    getArtistImage(artist) {
      // só vai buscar a lógica ao service da api
      if (artist.spotifyImage) {
        return artist.spotifyImage;
      }
      return '';
    },
    downloadAsJPEG() {
      const element = this.$refs.captureArea;
      html2canvas(element, { 
        backgroundColor: '#1D1A23',
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `top-artists-${this.selectedPeriod}.jpeg`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      });
    }
  },
  watch: {
    selectedPeriod: {
      handler: 'fetchTopArtists',
      immediate: true,
    },
  },
};
</script>

<template>
  <div class="bg-primary-light p-4 sm:p-6 rounded-lg h-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl sm:text-2xl font-heading text-text-primary">Top Artists</h2>
      <button @click="downloadAsJPEG" class="text-sm bg-accent-purple text-white px-3 py-1 rounded-md hover:bg-opacity-90 transition-colors">
        Print
      </button>
    </div>
    
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="period in periods"
        :key="period.value"
        @click="changePeriod(period.value)"
        :class="[
          'px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200',
          selectedPeriod === period.value
            ? 'bg-accent-pink text-white'
            : 'bg-primary-dark text-text-secondary hover:bg-accent-purple/50',
        ]"
      >
        {{ period.label }}
      </button>
    </div>

    <div ref="captureArea">
      <div v-if="isLoading">
        <LoadingSkeleton type="artists" />
      </div>

      <div v-else-if="error" class="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md">
        <p><strong>Error:</strong> {{ error }}</p>
      </div>

      <div v-else-if="artists.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div 
          v-for="artist in artists" 
          :key="artist.mbid || artist.name" 
          class="relative aspect-square group"
        >
          <img 
            v-if="getArtistImage(artist)"
            :src="getArtistImage(artist)" 
            :alt="artist.name" 
            class="w-full h-full object-cover rounded-md bg-primary-dark"
            crossorigin="anonymous"
            @error="$event.target.style.display = 'none'"
          />
          <div 
            v-else 
            class="w-full h-full flex items-center justify-center bg-primary-dark rounded-md"
          >
            <span class="text-text-secondary text-sm">No Image</span>
          </div>
          <div class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
            <div class="text-center p-2">
              <p class="font-bold text-white">{{ artist.name }}</p>
              <p class="text-sm text-gray-300">{{ parseInt(artist.playcount).toLocaleString() }} plays</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-text-secondary">
        <p>No top artists found for this period.</p>
      </div>
    </div>
  </div>
</template>