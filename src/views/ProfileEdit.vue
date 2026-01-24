<script>
import { mapState, mapActions } from 'pinia';
import { useUserStore } from '../stores/userStore';
import Navigation from '../components/Navigation.vue';
import Footer from '../components/Footer.vue';
import { VINYL_COLORS } from '../utils/vinylSystem';
import { isValidPassword, isValidUsername } from '../utils/validation';
import userService from '../services/userService';
import { Eye, EyeOff } from 'lucide-vue-next';

export default {
  name: 'ProfileEdit',
  components: { 
    Navigation,
    Eye,
    EyeOff,
    Footer
  },
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
      success: false,
      showPassword: false,
      validationErrors: {
        username: '',
        password: ''
      }
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

    clearValidationErrors() {
      this.validationErrors = {
        username: '',
        password: ''
      };
    },

    async validateForm() {
      this.clearValidationErrors();
      let isValid = true;

      if (this.username && this.username !== this.user.username) {
        const usernameValidation = isValidUsername(this.username);
        if (!usernameValidation.valid) {
          this.validationErrors.username = usernameValidation.message;
          isValid = false;
        } else {
          const usernameTaken = await userService.isUsernameTaken(this.username, this.user.id);
          if (usernameTaken) {
            this.validationErrors.username = 'This username is already taken.';
            isValid = false;
          }
        }
      }

      if (this.password) {
        const passwordValidation = isValidPassword(this.password);
        if (!passwordValidation.valid) {
          this.validationErrors.password = passwordValidation.message;
          isValid = false;
        }
      }

      return isValid;
    },
    
    async updateProfile() {
      this.error = null;
      this.success = false;

      const isValid = await this.validateForm();
      if (!isValid) return;

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

        await this.updateUserData(updatedData);
        
        this.success = true;
        
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
      
      <div v-if="success" class="mb-6 bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded-md">
        Profile updated successfully! Redirecting...
      </div>

      <form @submit.prevent="updateProfile" class="max-w-2xl mx-auto bg-primary-light p-8 rounded-lg space-y-6 border border-gray-700">
        <div class="flex flex-col items-center gap-4 mb-6">
          <div class="flex items-center gap-6 mb-6">
            <div>
              <img
                src="../assets/images/vinyl.png"
                alt="Vinyl record"
                class="w-32 h-32 rounded-full object-cover shadow"
              />
            </div>

            <div class="flex flex-wrap gap-2">
              <div
                v-for="vinyl in lockedVinyls"
                :key="vinyl.color"
                @click="vinyl.unlocked && selectColor(vinyl.color)"
                :class="[
                  'w-12 h-12 rounded-full border-2 cursor-pointer transition-all',
                  vinylColor[vinyl.color],
                  selectedColor === vinyl.color ? 'border-accent-pink scale-110' : 'border-gray-600',
                  !vinyl.unlocked && 'opacity-30 cursor-not-allowed'
                ]"
                :title="vinyl.unlocked ? `Select ${vinyl.color}` : `Unlock at Level ${vinyl.level}`"
              >
                <div v-if="!vinyl.unlocked" class="w-full h-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 11c1.1 0 2 .9 2 2v2h-4v-2c0-1.1.9-2 2-2zm6 0h-1V9a5 5 0 00-10 0v2H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2z" />
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
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
            :class="validationErrors.username ? 'border-red-500' : 'border-gray-700'"
          />
          <p v-if="validationErrors.username" class="text-red-500 text-xs italic mt-1">{{ validationErrors.username }}</p>
        </div>

        <div>
          <label class="block text-text-secondary text-sm font-bold mb-2">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter new password"
              class="w-full px-3 py-2 bg-primary-dark text-text-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple pr-10"
              :class="validationErrors.password ? 'border-red-500' : 'border-gray-700'"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <p v-if="validationErrors.password" class="text-red-500 text-xs italic mt-1">{{ validationErrors.password }}</p>
          <p v-else class="text-sm text-gray-500 mt-1">Leave blank to keep current password. Min. 8 characters, 1 uppercase, 1 lowercase, 1 number</p>
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
  <Footer />
</template>