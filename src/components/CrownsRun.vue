<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import userService from '../services/userService';
import logo from '../assets/images/logo.svg';
import LoadingSkeleton from './LoadingSkeleton.vue';
import { Crown, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-vue-next';
import CrownScannerWorker from '../services/crownScanner.worker.js?worker';

export default {
  name: 'CrownsRun',
  components: {
    LoadingSkeleton,
    Crown,
    Search,
    ChevronLeft,
    ChevronRight,
    AlertCircle
  },
  data() {
    return {
      isScanning: false,
      scanError: null,
      scanMessage: '',
      userCrowns: [],
      logo: logo,
      currentPage: 1,
      itemsPerPage: 8,
      scanProgress: 0,
      scanStep: '',
      artistsProcessed: 0,
      totalArtists: 50,
      worker: null
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    totalPages() {
      return Math.max(1, Math.ceil(this.userCrowns.length / this.itemsPerPage));
    },
    paginatedCrowns() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.userCrowns.slice(start, end);
    },
    progressMessage() {
      if (!this.isScanning) return '';
      
      if (this.scanStep === 'fetching') {
        return 'Fetching your top artists...';
      } else if (this.scanStep === 'scanning') {
        return `Scanning... ${this.artistsProcessed}/${this.totalArtists} artists`;
      } else if (this.scanStep === 'updating') {
        return 'Updating crowns...';
      }
      return 'Initializing...';
    }
  },
  methods: {
    async scanForCrowns() {
      if (this.isScanning || !this.user) return;
      
      this.isScanning = true;
      this.scanError = null;
      this.scanMessage = '';
      this.scanProgress = 0;
      this.scanStep = 'initializing';
      this.artistsProcessed = 0;

      // Cria worker se não existir
      if (!this.worker) {
        this.worker = new CrownScannerWorker();
        this.setupWorkerListeners();
      }

      // Envia comando para iniciar scan
      this.worker.postMessage({
        type: 'START_SCAN',
        payload: {
          currentUserId: this.user.id,
          lastfmUsername: this.user.lastfm_username
        }
      });
    },

    setupWorkerListeners() {
      this.worker.onmessage = async (e) => {
        const { type, data } = e.data;

        switch (type) {
          case 'PROGRESS':
            this.scanProgress = data.percent;
            this.scanStep = data.step;
            if (data.artistsProcessed) {
              this.artistsProcessed = data.artistsProcessed;
              this.totalArtists = data.totalArtists;
            }
            break;

          case 'SCAN_COMPLETE':
            this.userCrowns = data.crowns;
            this.currentPage = 1;
            
            const userStore = useUserStore();
            
            // Atualiza store com novas crowns
            const updatedUser = await userService.loginUser({
              email: this.user.email,
              password: this.user.password
            });
            userStore.login(updatedUser);

            // Adiciona XP pelas crowns ganhas
            if (data.crownsGained > 0) {
              for (let i = 0; i < data.crownsGained; i++) {
                await userStore.addCrownXP();
              }
              this.scanMessage = `Scan complete! You gained ${data.crownsGained} new crown(s) and earned ${data.crownsGained * 5} XP!`;
            } else if (data.crownsGained < 0) {
              this.scanMessage = `Scan complete! You lost ${Math.abs(data.crownsGained)} crown(s). You now have ${data.totalCrowns} crowns.`;
            } else {
              this.scanMessage = `Scan complete! You have ${data.totalCrowns} crowns.`;
            }

            this.isScanning = false;
            this.scanProgress = 100;
            break;

          case 'SCAN_ERROR':
            this.scanError = `Scan failed: ${data.message}`;
            this.scanMessage = '';
            this.isScanning = false;
            this.scanProgress = 0;
            break;
        }
      };

      this.worker.onerror = (error) => {
        this.scanError = `Worker error: ${error.message}`;
        this.isScanning = false;
        this.scanProgress = 0;
      };
    },

    loadUserCrowns() {
        if (this.user && Array.isArray(this.user.crowns)) {
            this.userCrowns = this.user.crowns.slice();
        } else {
            this.userCrowns = [];
        }
        this.currentPage = 1;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    }
  },
  mounted() {
      this.loadUserCrowns();
  },
  beforeUnmount() {
    // Limpa worker quando componente é destruído
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  },
  watch: {
    user() {
      this.loadUserCrowns();
    }
  }
};
</script>

<template>
  <div class="bg-primary-light p-4 sm:p-6 rounded-lg h-full flex flex-col">
    <h2 class="text-xl sm:text-2xl font-heading text-text-primary mb-4 flex items-center gap-2">
      <Crown :size="24" />
      Crown Run
    </h2>
    
    <div class="mb-6">
      <button 
        @click="scanForCrowns" 
        :disabled="isScanning"
        class="w-full bg-accent-purple text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Search :size="20" :class="{ 'animate-pulse': isScanning }" />
        {{ isScanning ? 'Scanning...' : 'Scan For Crowns' }}
      </button>

      <!-- Progress Bar -->
      <div v-if="isScanning" class="mt-3">
        <div class="w-full bg-primary-dark rounded-full h-2 mb-2">
          <div 
            class="bg-accent-purple h-2 rounded-full transition-all duration-300"
            :style="{ width: `${scanProgress}%` }"
          ></div>
        </div>
        <p class="text-text-secondary text-xs text-center">
          {{ progressMessage }} ({{ scanProgress }}%)
        </p>
      </div>

      <p v-if="scanMessage" class="text-green-400 text-xs mt-2 text-center">{{ scanMessage }}</p>
      <p v-if="scanError" class="text-red-500 text-xs mt-2 text-center flex items-center justify-center gap-1">
        <AlertCircle :size="14" />
        {{ scanError }}
      </p>
    </div>

    <h3 class="text-lg font-semibold text-text-primary mb-3">Your Crowns ({{ userCrowns.length }})</h3>
    
    <div v-if="isScanning" class="flex-grow">
      <LoadingSkeleton type="crowns" />
    </div>
    <div v-else class="flex-grow overflow-y-auto space-y-2 pr-2">
        <div v-if="userCrowns.length > 0">
            <div class="grid grid-cols-2 gap-3">
                <div v-for="crown in paginatedCrowns" :key="crown" class="bg-primary-dark p-3 rounded-md flex items-center">
                    <Crown :size="20" class="text-accent-pink mr-2" />
                    <p class="font-bold text-accent-pink truncate">{{ crown }}</p>
                </div>
            </div>

            <div class="flex justify-between items-center mt-4 pt-4 border-t border-primary-dark">
              <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-primary-dark hover:bg-accent-purple/50 flex items-center gap-1">
                  <ChevronLeft :size="16" />
                  Prev
              </button>
              <span class="text-sm text-text-secondary">Page {{ currentPage }} of {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-primary-dark hover:bg-accent-purple/50 flex items-center gap-1">
                  Next
                  <ChevronRight :size="16" />
              </button>
            </div>
        </div>
        <div v-else class="text-center text-text-secondary py-4 flex flex-col items-center gap-2">
            <Crown :size="48" class="opacity-50" />
            <p>You don't have any crowns yet. Try scanning to claim them!</p>
        </div>
    </div>
  </div>
</template>