<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import externalAPIs from '../services/externalAPIs';
import userService from '../services/userService';
import logo from '../assets/images/logo.svg';

export default {
  name: 'CrownsRun',
  data() {
    return {
      isScanning: false,
      scanError: null,
      scanMessage: '',
      userCrowns: [],
      logo: logo,
      currentPage: 1,
      itemsPerPage: 8,
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
  },
  methods: {
    async scanForCrowns() {
      if (this.isScanning) return;
      this.isScanning = true;
      this.scanError = null;
      this.scanMessage = 'Scanning... this may take a moment.';

      try {
        const currentUser = this.user;
        const allUsers = await userService.getAllUsers();
        const topArtists = await externalAPIs.getTopArtists(currentUser.lastfm_username, 'overall', 50); // Check top 50 artists

        const crownHolders = {};

        for (const artist of topArtists) {
          let maxPlays = 0;
          let crownHolderId = null;

          for (const u of allUsers) {
            const stats = await externalAPIs.getArtistInfo(u.lastfm_username, artist.name);
            const playcount = parseInt(stats.userplaycount || 0, 10);

            if (playcount > maxPlays) {
              maxPlays = playcount;
              crownHolderId = u.id;
            }
          }

          if (crownHolderId) {
            crownHolders[artist.name] = { userId: crownHolderId, playcount: maxPlays };
          }
        }

        // Rouba as crowns que estavam assigned a outros users após o scan
        for (const u of allUsers) {
          const newCrowns = Object.keys(crownHolders).filter(
            artistName => crownHolders[artistName].userId === u.id
          );
          await userService.updateUser(u.id, { crowns: newCrowns });
          if (u.id === currentUser.id) {
            this.userCrowns = newCrowns;
            this.currentPage = 1;
          }
        }

        this.scanMessage = `Scan complete! You now have ${this.userCrowns.length} crowns.`;
      } catch (err) {
        this.scanError = `An error occurred during the scan: ${err.message}`;
        this.scanMessage = '';
      } finally {
        this.isScanning = false;
      }
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
  watch: {
    user() {
      this.loadUserCrowns();
    }
  }
};
</script>

<template>
  <div class="bg-primary-light p-4 sm:p-6 rounded-lg h-full flex flex-col">
    <h2 class="text-xl sm:text-2xl font-heading text-text-primary mb-4">Crown Run</h2>
    
    <div class="mb-6">
      <button 
        @click="scanForCrowns" 
        :disabled="isScanning"
        class="w-full bg-accent-purple text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {{ isScanning ? 'Scanning...' : 'Scan For Crowns' }}
      </button>
      <p v-if="scanMessage" class="text-green-400 text-xs mt-2 text-center">{{ scanMessage }}</p>
      <p v-if="scanError" class="text-red-500 text-xs mt-2 text-center">{{ scanError }}</p>
    </div>

    <h3 class="text-lg font-semibold text-text-primary mb-3">Your Crowns ({{ userCrowns.length }})</h3>
    <div class="flex-grow overflow-y-auto space-y-2 pr-2">
        <div v-if="userCrowns.length > 0">
            <div class="grid grid-cols-2 gap-3">
                <div v-for="crown in paginatedCrowns" :key="crown" class="bg-primary-dark p-3 rounded-md flex items-center">
                    <img :src="logo" alt="Crown" class="inline-block w-6 h-6 mr-2" />
                    <p class="font-bold text-accent-pink truncate">{{ crown }}</p>
                </div>
            </div>

            <!-- pagination -->
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
        <div v-else class="text-center text-text-secondary py-4">
            <p>You don't have any crowns yet. Try scanning to claim them!</p>
        </div>
    </div>
  </div>
</template>