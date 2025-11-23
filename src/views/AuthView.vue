<script>
import { mapActions } from 'pinia';
import { useUserStore } from '../stores/userStore';
import userService from '../services/userService';

export default {
  name: 'AuthView',
  data() {
    return {
      isLoginView: true,
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        lastfm_username: ''
      },
      error: null,
    };
  },
  methods: {
    ...mapActions(useUserStore, ['login']),
    toggleView(isLogin) {
      this.isLoginView = isLogin;
      this.error = null;
      this.resetForm();
    },
    async handleLogin() {
      this.error = null;
      try {
        const userData = await userService.loginUser({
          email: this.form.email,
          password: this.form.password,
        });
        this.login(userData);
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = 'Invalid email or password. Please try again.';
      }
    },
    async handleRegister() {
      this.error = null;
      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Passwords do not match.';
        return;
      }
      try {
        await userService.registerUser({
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          lastfm_username: this.form.lastfm_username
        });
        this.toggleView(true);
      } catch (error) {
        this.error = 'Registration failed. The email might already be in use.';
      }
    },
    resetForm() {
      this.form = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        lastfm_username: ''
      };
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-primary-dark flex items-center justify-center p-4 font-body">
    <div class="w-full max-w-md bg-primary-light rounded-2xl shadow-lg p-8">
      <div class="text-center mb-8">
        <img src="../assets/images/logo.svg" alt="SpotifyTracker Logo" class="w-32 mx-auto mb-4" />
      </div>

      <!-- Toggles -->
      <div class="flex justify-center mb-8 border-b border-gray-700">
        <button
          @click="toggleView(true)"
          :class="['py-2 px-6 text-lg focus:outline-none', isLoginView ? 'text-accent-pink border-b-2 border-accent-pink' : 'text-text-secondary']"
        >
          Login
        </button>
        <button
          @click="toggleView(false)"
          :class="['py-2 px-6 text-lg focus:outline-none', !isLoginView ? 'text-accent-pink border-b-2 border-accent-pink' : 'text-text-secondary']"
        >
          Register
        </button>
      </div>

      <!-- Login Form -->
      <form v-if="isLoginView" @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="login-email" class="block text-text-secondary text-sm font-bold mb-2">Email</label>
          <input v-model="form.email" type="email" id="login-email" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
        </div>
        <div class="mb-6">
          <label for="login-password" class="block text-text-secondary text-sm font-bold mb-2">Password</label>
          <input v-model="form.password" type="password" id="login-password" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
        </div>
        <button type="submit" class="w-full bg-accent-pink text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200">
          Login
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="reg-username" class="block text-text-secondary text-sm font-bold mb-2">Username</label>
          <input v-model="form.username" type="text" id="reg-username" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
        </div>
        <div class="mb-4">
          <label for="reg-email" class="block text-text-secondary text-sm font-bold mb-2">Email</label>
          <input v-model="form.email" type="email" id="reg-email" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
        </div>
        <div class="mb-4">
          <label for="reg-lastfm" class="block text-text-secondary text-sm font-bold mb-2">Last.fm Username</label>
          <input v-model="form.lastfm_username" type="text" id="reg-lastfm" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
        </div>
        <div class="mb-4">
          <label for="reg-password" class="block text-text-secondary text-sm font-bold mb-2">Password</label>
          <input v-model="form.password" type="password" id="reg-password" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
        </div>
        <div class="mb-6">
          <label for="reg-confirm-password" class="block text-text-secondary text-sm font-bold mb-2">Confirm Password</label>
          <input v-model="form.confirmPassword" type="password" id="reg-confirm-password" class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" required>
        </div>
        <button type="submit" class="w-full bg-accent-purple text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200">
          Create Account
        </button>
      </form>
      
      <p v-if="error" class="text-red-500 text-xs italic mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>