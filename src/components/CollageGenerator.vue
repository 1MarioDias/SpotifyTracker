<script>
import externalAPIs from '../services/externalAPIs';
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import { Grid3X3, Download, AlertCircle, Image as ImageIcon } from 'lucide-vue-next';
import html2canvas from 'html2canvas';

export default {
  name: 'CollageGenerator',
  components: {
    Grid3X3,
    Download,
    AlertCircle,
    ImageIcon
  },
  data() {
    return {
      contentType: 'artist',
      timeRange: '7day',
      gridSize: 3,
      collageItems: [],
      isLoading: false,
      error: null,
      
      timeRangeOptions: [
        { label: 'Last week', value: '7day' },
        { label: 'Last month', value: '1month' },
        { label: 'Last quarter', value: '3month' },
        { label: 'Last year', value: '12month' },
        { label: 'All time', value: 'overall' }
      ],
      
      gridSizeOptions: [
        { label: '3 x 3', value: 3 },
        { label: '5 x 5', value: 5 },
        { label: '10 x 10', value: 10 }
      ]
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    
    totalItems() {
      return this.gridSize * this.gridSize;
    },
    
    collageTitle() {
      const type = this.contentType === 'artist' ? 'Artists' : 'Albums';
      const timeLabel = this.timeRangeOptions.find(t => t.value === this.timeRange)?.label || 'Unknown';
      return `Top ${type} — ${timeLabel} — ${this.gridSize}x${this.gridSize}`;
    },
    
    hasLastfmUsername() {
      return this.user && this.user.lastfm_username;
    }
  },
  methods: {
    async generateCollage() {
      if (!this.hasLastfmUsername) {
        this.error = 'Connect your Last.fm account to generate a collage.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.collageItems = [];

      try {
        let items;
        
        if (this.contentType === 'artist') {
          items = await externalAPIs.getTopArtists(
            this.user.lastfm_username,
            this.timeRange,
            this.totalItems
          );
          
          this.collageItems = items.map((artist, index) => ({
            rank: index + 1,
            name: artist.name,
            imageUrl: artist.spotifyImage || artist.image?.[3]?.['#text'] || '',
            playcount: parseInt(artist.playcount || 0)
          }));
        } else {
          items = await externalAPIs.getTopAlbums(
            this.user.lastfm_username,
            this.timeRange,
            this.totalItems
          );
          
          this.collageItems = items.map((album, index) => ({
            rank: index + 1,
            name: album.name,
            artist: album.artist?.name || album.artist?.['#text'] || 'Unknown Artist',
            imageUrl: album.image?.[3]?.['#text'] || '',
            playcount: parseInt(album.playcount || 0)
          }));
        }

        if (this.collageItems.length === 0) {
          this.error = `No ${this.contentType}s found for the selected period.`;
        }

      } catch (err) {
        console.error('Error generating collage:', err);
        this.error = 'Could not generate collage. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    },

    downloadCollage() {
      const element = this.$refs.collageArea;
      if (!element) return;

      html2canvas(element, {
        backgroundColor: '#1D1A23',
        useCORS: true,
        allowTaint: true,
        scale: 2
      }).then(canvas => {
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `wusik-collage-${this.contentType}-${this.gridSize}x${this.gridSize}-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- form -->
    <div class="bg-primary-light p-6 rounded-lg">
      <h2 class="text-2xl font-heading font-bold text-text-primary mb-6 flex items-center gap-2">
        <Grid3X3 :size="28" />
        Collage Settings
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-text-secondary text-sm font-bold mb-3">Content Type</label>
          <div class="flex gap-2">
            <button
              @click="contentType = 'artist'"
              :class="[
                'flex-1 py-2 px-4 rounded-md font-medium transition-colors',
                contentType === 'artist'
                  ? 'bg-accent-pink text-white'
                  : 'bg-primary-dark text-text-secondary hover:bg-primary-dark/70'
              ]"
            >
              Artists
            </button>
            <button
              @click="contentType = 'album'"
              :class="[
                'flex-1 py-2 px-4 rounded-md font-medium transition-colors',
                contentType === 'album'
                  ? 'bg-accent-pink text-white'
                  : 'bg-primary-dark text-text-secondary hover:bg-primary-dark/70'
              ]"
            >
              Albums
            </button>
          </div>
        </div>

        <div>
          <label for="timeRange" class="block text-text-secondary text-sm font-bold mb-3">Time Range</label>
          <select
            id="timeRange"
            v-model="timeRange"
            class="w-full px-4 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
          >
            <option v-for="option in timeRangeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label for="gridSize" class="block text-text-secondary text-sm font-bold mb-3">Grid Size</label>
          <select
            id="gridSize"
            v-model.number="gridSize"
            class="w-full px-4 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
          >
            <option v-for="option in gridSizeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <button
        @click="generateCollage"
        :disabled="isLoading || !hasLastfmUsername"
        class="w-full mt-6 bg-accent-pink text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Grid3X3 :size="20" :class="{ 'animate-pulse': isLoading }" />
        {{ isLoading ? 'Generating...' : 'Generate Collage' }}
      </button>

      <div v-if="error" class="mt-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md flex items-center gap-2">
        <AlertCircle :size="20" />
        <p>{{ error }}</p>
      </div>
    </div>

    <div v-if="collageItems.length > 0" class="bg-primary-light p-6 rounded-lg">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-heading font-bold text-text-primary">
          {{ collageTitle }}
        </h3>
        <button
          @click="downloadCollage"
          class="bg-accent-purple text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          <Download :size="18" />
          Download
        </button>
      </div>

      <!-- grid -->
      <div ref="collageArea" class="bg-primary-dark p-4 rounded-lg">
        <div 
          class="grid gap-1"
          :class="{
            'grid-cols-3': gridSize === 3,
            'grid-cols-5': gridSize === 5,
            'grid-cols-10': gridSize === 10
          }"
        >
          <div
            v-for="item in collageItems"
            :key="item.rank"
            class="relative aspect-square group overflow-hidden bg-primary-dark"
          >
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.name"
              class="w-full h-full object-cover"
              crossorigin="anonymous"
            />
            
            <!-- placeholder para imagem em falta -->
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-primary-dark"
            >
              <ImageIcon :size="gridSize >= 5 ? 24 : 32" class="text-text-secondary opacity-30" />
            </div>

            <!-- overlay ao passar o rato -->
            <div class="absolute inset-0 bg-black/85 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
              <p 
                class="font-bold text-white text-center mb-1 line-clamp-2"
                :class="{
                  'text-[8px]': gridSize === 10,
                  'text-[10px]': gridSize === 5,
                  'text-xs': gridSize === 3
                }"
              >
                {{ item.name }}
              </p>
              <p 
                v-if="contentType === 'album'" 
                class="text-text-secondary text-center line-clamp-1"
                :class="{
                  'text-[7px]': gridSize === 10,
                  'text-[9px]': gridSize === 5,
                  'text-[10px]': gridSize === 3
                }"
              >
                {{ item.artist }}
              </p>
              <p 
                class="text-accent-pink mt-1"
                :class="{
                  'text-[7px]': gridSize === 10,
                  'text-[9px]': gridSize === 5,
                  'text-[10px]': gridSize === 3
                }"
              >
                {{ item.playcount.toLocaleString() }} plays
              </p>
              <p 
                class="text-text-secondary"
                :class="{
                  'text-[7px]': gridSize === 10,
                  'text-[8px]': gridSize === 5,
                  'text-[9px]': gridSize === 3
                }"
              >
                #{{ item.rank }}
              </p>
            </div>
          </div>

          <div
            v-for="i in Math.max(0, totalItems - collageItems.length)"
            :key="`empty-${i}`"
            class="aspect-square bg-primary-dark/50 flex items-center justify-center"
          >
            <ImageIcon :size="gridSize >= 5 ? 16 : 24" class="text-text-secondary opacity-20" />
          </div>
        </div>
      </div>
    </div>

    <!-- empty state -->
    <div v-else-if="!isLoading && !error" class="bg-primary-light p-12 rounded-lg text-center">
      <Grid3X3 :size="64" class="mx-auto text-text-secondary opacity-30 mb-4" />
      <h3 class="text-xl font-heading text-text-primary mb-2">No collage generated yet</h3>
      <p class="text-text-secondary">
        Select your preferences above and click "Generate Collage" to create your music grid.
      </p>
    </div>
  </div>
</template>