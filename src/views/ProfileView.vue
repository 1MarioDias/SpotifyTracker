<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import Navigation from '../components/Navigation.vue';
import LevelDisplay from '../components/LevelDisplay.vue';

export default {
  name: 'Profile',
  components: { 
    Navigation,
    LevelDisplay
  },
  data() {
    return {
      showTooltip: false,
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    userName() {
      return this.user?.username ?? 'Guest';
    },
    email() {
      return this.user?.email ?? 'Not set';
    }
  },
  async mounted() {
    const store = useUserStore();
    if (!store.user) {
      this.$router.push({ name: 'login' });
      return;
    }
  },
};
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 text-text-primary">
    <div class="w-full">
      <div class="md:ml-[10%] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16">
        <div class="relative w-full mx-auto">
          <div
            class="relative overflow-hidden"
            :style="{
              background: 'linear-gradient(0deg, rgba(29, 26, 35, 0.50) 0%, rgba(29, 26, 35, 0.50) 100%), linear-gradient(90deg, #100C14 0%, #1D1A23 45.67%, #1D1A23 59.13%, #100C14 100%)',
              boxShadow: '0 4px 11.3px 0 rgba(0, 0, 0, 0.25)',
              borderRadius: '300px 0 0 300px'
            }"
          >
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16 p-6 md:p-12 lg:p-16">
              <div class="flex-shrink-0">
                <img
                  src="../assets/images/vinyl.png"
                  alt="Vinyl record"
                  class="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-[361px] xl:h-[361px] rounded-full object-cover"
                  :style="{ boxShadow: '0 0 26.3px 0 rgba(0, 0, 0, 0.50)' }"
                />
              </div>

              <div class="flex-1 space-y-6 md:space-y-8 text-center md:text-left">
                <div>
                  <div class="flex items-center justify-center md:justify-start gap-2">
                    <h1 class="text-5xl md:text-6xl lg:text-7xl xl:text-[77px] font-heading font-normal leading-tight">
                      {{ userName }}
                    </h1>
                    <button
                      @click="$router.push({ name: 'profileEdit' })"
                      class="ml-2 p-2 rounded-full bg-primary hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      aria-label="Edit Profile"
                    >
 
                      <span class="text-white text-lg font-bold">✎</span>
                    </button>
                  </div>
                  <p class="text-base md:text-lg mt-2 opacity-90 text-text-secondary">
                    {{ email }}
                  </p>
                </div>


                <div class="pt-4 border-t border-primary-dark/50">
                  <LevelDisplay />
                </div>
              </div>

              <div class="flex-shrink-0 flex flex-col items-center gap-6 relative">
                <div
                  class="relative"
                  @mouseenter="showTooltip = true"
                  @mouseleave="showTooltip = false"
                >
                  <div v-if="showTooltip" class="absolute z-10 -bottom-14 left-1/2 transform -translate-x-1/2" :style="{ filter: 'drop-shadow(0 6.207px 6.207px rgba(0, 0, 0, 0.25))' }">
                    <div class="relative">
                      <div class="w-3 h-3 bg-[#100C14] transform rotate-45 absolute left-1/2 -translate-x-1/2 -top-1.5"></div>
                      <div class="bg-[#100C14] rounded px-4 py-2 whitespace-nowrap text-center text-base">
                        #1 bandName
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>