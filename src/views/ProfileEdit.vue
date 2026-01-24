<script>
import { mapState } from 'pinia';
import { mapActions } from 'pinia';
import { useUserStore } from '../stores/userStore';
import userService from '../services/userService';
import Navigation from '../components/Navigation.vue';
import { VINYL_COLORS }from '../utils/vinylSystem';

export default {
  name: 'ProfileEdit',
  components: { Navigation },
  computed: {
    ...mapState(useUserStore, ['user']),
    vinylColor(){
      return {
        black: 'bg-black',
        purple: 'bg-purple-600',
        blue: 'bg-blue-600',
        red: 'bg-red-500',
        gold: 'bg-yellow-400'
      };  
    },
    userLevel() {
      return this.user?.level ?? 1;
    },
    lockedVinyls() {
      return VINYL_COLORS.map(vinyl => ({
        ...vinyl,
        unlocked: vinyl.level <= this.userLevel
      }));
    },
    currentUsername() {
      return this.user?.username ?? '';
    },
    currentLastfm() {
      return this.user?.lastfm_username ?? '';
    },
    currentColor() {
      return this.user?.vinyl_color ?? '';
    },
  },
  data() {
    return {
      username: '',
      password: '',
      lastfm_username: '',
      error: null,
      selectedColor: '',
    };
  },
  async mounted() {
    const store = useUserStore();
    if (!store.user) {
      this.$router.push({ name: 'login' });
      return;
    }
    this.selectedColor = store.user.vinyl_color || '';
  },
  methods: {
    ...mapActions(useUserStore, ['updateUserData']),

    selectColor(color) {
      this.selectedColor = color;
    },
    async updateProfile() {
      this.error = null;
      try {
        const updatedData = {};
        
        if (this.username && this.username !== this.user.username) {
          updatedData.username = this.username;
        }
        if (this.password) {
          updatedData.password = this.password;
        }
        if (this.lastfm_username && this.lastfm_username !== this.user.lastfm_username) {
          updatedData.lastfm_username = this.lastfm_username;
        }
        if (this.selectedColor && this.selectedColor !== this.user.vinyl_color) {
          updatedData.vinyl_color = this.selectedColor;
        }

        if (Object.keys(updatedData).length === 0) {
          this.$router.push({ name: 'profile' });
          return;
        }

        // atualiza backend + state + localStorage
        await this.updateUserData(updatedData);
        
        this.success = true;
        
        // Redireciona após 1 segundo para mostrar mensagem de sucesso
        setTimeout(() => {
          this.$router.push({ name: 'profile' });
        }, 1000);

      } catch (error) {
        console.error('Error updating profile:', error);
        this.error = 'Failed to update profile. Please try again.';
      }
    },
  },
};
</script>



<template>
  <div class="p-4 sm:p-6 lg:p-8 text-text-primary">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-heading font-bold mb-8">Edit Profile</h1>
      <form @submit.prevent="updateProfile" class="max-w-2xl mx-auto bg-primary-light p-8 rounded-lg space-y-6 border border-gray-700">
        <div class="flex flex-col items-center gap-4 mb-6">
<div class="flex items-center gap-6 mb-6">
  <!-- vinyl  -->
  <div>
    <img
      src="../assets/images/vinyl.png"
      alt="Vinyl record"
      class="w-32 h-32 rounded-full object-cover shadow"
    />
  </div>

<!-- buttons -->
  <div class="flex flex-wrap gap-2">
  <div
    v-for="vinyl in lockedVinyls"
    :key="vinyl.color"
    class="relative"
  >
    <button
  type="button"
  class="w-10 h-10 rounded-full shadow-md"
:class="[
  vinylColor[vinyl.color],
  selectedColor === vinyl.color ? 'ring-4 ring-accent-purple' : '',
  !vinyl.unlocked ? 'opacity-50 cursor-not-allowed' : ''
]"

  :disabled="!vinyl.unlocked"
  @click="vinyl.unlocked && selectColor(vinyl.color)"
></button>


    <!-- lock -->
    <div
      v-if="!vinyl.unlocked"
      class="absolute inset-0 flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-white bg-black/60 rounded-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 11c1.1 0 2 .9 2 2v2h-4v-2c0-1.1.9-2 2-2zm6 0h-1V9a5 5 0 00-10 0v2H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2z"
        />
      </svg>
    </div>
  </div>
</div>
</div>
        </div>
        <div>
          <label class="block text-text-secondary text-sm font-bold mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            :placeholder="currentUsername ? currentUsername : 'Enter username'"
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
        </div>
        <div>
          <label class="block text-text-secondary text-sm font-bold mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter new password"
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <p class="text-sm text-gray-500 mt-1">Leave blank to keep current password</p>
        </div>
        <div>
          <label class="block text-text-secondary text-sm font-bold mb-2">Last.fm Username</label>
          <input
            v-model="lastfm_username"
            type="text"
            :placeholder="currentLastfm ? currentLastfm : 'Enter Last.fm username'"
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
        </div>
        <p v-if="error" class="text-red-500 text-xs italic mt-2">{{ error }}</p>

        <div class="flex gap-4">
          <button
            type="submit"
            class="flex-1 bg-accent-pink text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            @click="$router.push({ name: 'profile' })"
            class="flex-1 bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>