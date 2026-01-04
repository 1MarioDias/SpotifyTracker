<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="bg-primary-light p-8 rounded-lg max-w-md w-full relative">
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-text-secondary hover:text-white"
      >
        ✕
      </button>

      <h2 class="text-2xl font-heading font-bold mb-6 text-center">Edit User</h2>

      <form @submit.prevent="submitUpdate" class="space-y-4">
        <div>
          <label class="block text-text-secondary text-sm font-bold mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            :placeholder="user.username"
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
        </div>

        <div>
          <label class="block text-text-secondary text-sm font-bold mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter new password"
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
          <p class="text-sm text-gray-500 mt-1">Leave blank to keep current password</p>
        </div>

        <div>
          <label class="block text-text-secondary text-sm font-bold mb-1">Last.fm Username</label>
          <input
            v-model="lastfm_username"
            type="text"
            :placeholder="user.lastfm_username || 'Enter Last.fm username'"
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
          />
        </div>

        <p v-if="error" class="text-red-500 text-xs italic mt-2 text-center">{{ error }}</p>

        <button
          type="submit"
          class="bg-accent-pink text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors w-full"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import userService from '../services/userService';

export default {
  name: 'AdminEditUser',
  props: {
    visible: { type: Boolean, required: true },
    user: { type: Object, required: true }
  },
  data() {
    return {
      username: this.user.username,
      password: '',
      lastfm_username: this.user.lastfm_username || '',
      error: null
    };
  },
  watch: {
    user(newUser) {
      // Reset fields when a different user is selected
      this.username = newUser.username;
      this.password = '';
      this.lastfm_username = newUser.lastfm_username || '';
      this.error = null;
    }
  },
  methods: {
    async submitUpdate() {
      this.error = null;

      try {
        const updatedData = {};
        if (this.username && this.username !== this.user.username) updatedData.username = this.username;
        if (this.password) updatedData.password = this.password;
        if (this.lastfm_username !== this.user.lastfm_username) updatedData.lastfm_username = this.lastfm_username;

        if (Object.keys(updatedData).length === 0) {
          this.$emit('close');
          return;
        }

        await userService.updateUser(this.user.id, updatedData);
        this.$emit('updated'); // Notify parent to refresh user list
        this.$emit('close');
      } catch (err) {
        this.error = 'Failed to update user. Please try again.';
      }
    }
  }
};
</script>

<style scoped>
/* Optional: smooth fade-in for modal */
</style>
