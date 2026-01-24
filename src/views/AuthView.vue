<script>
import { mapActions } from 'pinia';
import { useUserStore } from '../stores/userStore';
import userService from '../services/userService';
import { isValidPassword, isValidUsername } from '../utils/validation';
import { Eye, EyeOff } from 'lucide-vue-next';

export default {
  name: 'AuthView',
  components: {
    Eye,
    EyeOff
  },
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
      showPassword: false,
      showConfirmPassword: false,
      validationErrors: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    ...mapActions(useUserStore, ['login']),
    
    toggleView(isLogin) {
      this.isLoginView = isLogin;
      this.error = null;
      this.resetForm();
      this.clearValidationErrors();
    },
    
    clearValidationErrors() {
      this.validationErrors = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
    },

    async validateLoginForm() {
      this.clearValidationErrors();

      if (!this.form.password) {
        this.validationErrors.password = 'Password is required.';
        return false;
      }
      
      return true;
    },

    async validateRegisterForm() {
      this.clearValidationErrors();
      let isValid = true;

      const usernameValidation = isValidUsername(this.form.username);
      const emailTaken = await userService.isEmailTaken(this.form.email);
      if (!usernameValidation.valid) {
        this.validationErrors.username = usernameValidation.message;
        isValid = false;
      } else {
        const usernameTaken = await userService.isUsernameTaken(this.form.username);
        if (usernameTaken) {
          this.validationErrors.username = 'This username is already taken.';
          isValid = false;
        }
      }

      if (emailTaken) {
        this.validationErrors.email = 'This email is already registered.';
        isValid = false;
      }

      const passwordValidation = isValidPassword(this.form.password);
      if (!passwordValidation.valid) {
        this.validationErrors.password = passwordValidation.message;
        isValid = false;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.validationErrors.confirmPassword = 'Passwords do not match.';
        isValid = false;
      }

      return isValid;
    },
    
    async handleLogin() {
      this.error = null;
      
      const isValid = await this.validateLoginForm();
      if (!isValid) return;

      try {
        const userData = await userService.loginUser({
          email: this.form.email,
          password: this.form.password,
        });
        
        this.login(userData);
        
        if (userData.isAdmin) {
          this.$router.push('/admin');
        } else {
          this.$router.push('/dashboard');
        }
      } catch (error) {
        this.error = 'Invalid email or password. Please try again.';
      }
    },
    
    async handleRegister() {
      this.error = null;

      const isValid = await this.validateRegisterForm();
      if (!isValid) return;

      try {
        const newUser = {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          lastfm_username: this.form.lastfm_username,
          xp: 0,
          level: 0,
          crowns: [],
          isAdmin: false
        };

        const response = await userService.registerUser(newUser);
        
        this.login(response.data);
        
        this.$router.push('/dashboard');
      } catch (error) {
        this.error = 'Registration failed. Please try again.';
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
      this.showPassword = false;
      this.showConfirmPassword = false;
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-primary-dark flex items-center justify-center p-4 font-body">
    <div class="w-full max-w-md bg-primary-light rounded-2xl shadow-lg p-8">
      <div class="text-center mb-8">
        <img src="../assets/images/logo.svg" alt="WUSIK Logo" class="w-32 mx-auto mb-4" />
      </div>

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
          <input 
            v-model="form.email" 
            type="email" 
            id="login-email" 
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
            :class="validationErrors.email ? 'border-red-500' : 'border-gray-700'"
            required
          />
          <p v-if="validationErrors.email" class="text-red-500 text-xs italic mt-1">{{ validationErrors.email }}</p>
        </div>
        
        <div class="mb-6">
          <label for="login-password" class="block text-text-secondary text-sm font-bold mb-2">Password</label>
          <div class="relative">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              id="login-password" 
              class="w-full px-3 py-2 bg-primary-dark text-text-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple pr-10"
              :class="validationErrors.password ? 'border-red-500' : 'border-gray-700'"
              required
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
        </div>
        
        <button type="submit" class="w-full bg-accent-pink text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200">
          Login
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="reg-username" class="block text-text-secondary text-sm font-bold mb-2">Username</label>
          <input 
            v-model="form.username" 
            type="text" 
            id="reg-username" 
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
            :class="validationErrors.username ? 'border-red-500' : 'border-gray-700'"
            required
          />
          <p v-if="validationErrors.username" class="text-red-500 text-xs italic mt-1">{{ validationErrors.username }}</p>
        </div>
        
        <div class="mb-4">
          <label for="reg-email" class="block text-text-secondary text-sm font-bold mb-2">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            id="reg-email" 
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple"
            :class="validationErrors.email ? 'border-red-500' : 'border-gray-700'"
            required
          />
          <p v-if="validationErrors.email" class="text-red-500 text-xs italic mt-1">{{ validationErrors.email }}</p>
        </div>
        
        <div class="mb-4">
          <label for="reg-lastfm" class="block text-text-secondary text-sm font-bold mb-2">Last.fm Username</label>
          <input 
            v-model="form.lastfm_username" 
            type="text" 
            id="reg-lastfm" 
            class="w-full px-3 py-2 bg-primary-dark text-text-primary border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple" 
            required
          />
        </div>
        
        <div class="mb-4">
          <label for="reg-password" class="block text-text-secondary text-sm font-bold mb-2">Password</label>
          <div class="relative">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              id="reg-password" 
              class="w-full px-3 py-2 bg-primary-dark text-text-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple pr-10"
              :class="validationErrors.password ? 'border-red-500' : 'border-gray-700'"
              required
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
          <p v-else class="text-text-secondary text-xs mt-1">Min. 8 characters, 1 uppercase, 1 lowercase, 1 number</p>
        </div>
        
        <div class="mb-6">
          <label for="reg-confirm-password" class="block text-text-secondary text-sm font-bold mb-2">Confirm Password</label>
          <div class="relative">
            <input 
              v-model="form.confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="reg-confirm-password" 
              class="w-full px-3 py-2 bg-primary-dark text-text-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-purple pr-10"
              :class="validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-700'"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <Eye v-if="!showConfirmPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
          <p v-if="validationErrors.confirmPassword" class="text-red-500 text-xs italic mt-1">{{ validationErrors.confirmPassword }}</p>
        </div>
        
        <button type="submit" class="w-full bg-accent-purple text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-200">
          Create Account
        </button>
      </form>
      
      <p v-if="error" class="text-red-500 text-xs italic mt-4 text-center">{{ error }}</p>
    </div>
  </div>
</template>