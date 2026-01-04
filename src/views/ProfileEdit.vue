<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import userService from '../services/userService';
import Navigation from '../components/Navigation.vue';

export default {
  name: 'ProfileEdit',
  components: { Navigation },
  computed: {
    ...mapState(useUserStore, ['user']),
    currentUsername() {
      return this.user?.username ?? '';
    },
    currentLastfm() {
      return this.user?.lastfm_username ?? '';
    }
  },
  data() {
    return {
      username: '',
      password: '',
      lastfm_username: '',
      error: null,
    };
  },
  methods: {
    async updateProfile() {
        this.error = null;
        try {
            const updatedData= {};
            if (this.username) updatedData.username = this.username;
            if (this.password) updatedData.password = this.password;
            if (this.lastfm) updatedData.lastfm_username = this.lastfm;
            await userService.updateUser(this.user.id, updatedData);
            this.$router.push({ name: 'profile' });
        } catch (error) {
            this.error = 'Failed to update profile. Please try again.'; 
        }
    }
  }
};
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 text-text-primary">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-heading font-bold mb-8">Edit Profile</h1>
      <form @submit.prevent="updateProfile" class="max-w-2xl mx-auto bg-primary-light p-8 rounded-lg space-y-6 border border-gray-700">
        <div class="flex flex-col items-center gap-4 mb-6">
          <img
            src="../assets/images/vinyl.png"
            alt="Vinyl record"
            class="w-32 h-32 rounded-full object-cover shadow"
          />
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
        <button type="submit" class="bg-accent-pink text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors w-full">
          Save Changes
        </button>
        <p v-if="error" class="text-red-500 text-xs italic mt-4 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>