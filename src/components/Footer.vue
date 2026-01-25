<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'Footer',
  computed: {
    ...mapState(useUserStore, ['isLoggedIn', 'user']),
    
    isAdmin() {
      return this.user?.isAdmin ?? false;
    },
    
    quickLinks() {
      if (!this.isLoggedIn) {
        return [
          { name: 'Login', path: '/login' }
        ];
      }
      
      const links = [
        { name: this.isAdmin ? 'Admin' : 'Dashboard', path: this.isAdmin ? '/admin' : '/dashboard' },
        { name: 'Goals', path: '/goals' },
        { name: 'Collages', path: '/collages' },
        { name: 'Profile', path: '/profile' }
      ];
      
      return links;
    }
  }
};
</script>

<template>
  <footer class="w-full px-4 sm:px-6 lg:px-20 py-8 bg-primary-light border-t border-primary-dark">
    <div class="max-w-[1440px] mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <router-link to="/">
            <img 
              src="../assets/images/logo.svg" 
              alt="WUSIK Logo"
              class="w-32 mb-4"
            />
          </router-link>
          <p class="text-text-secondary text-sm">
            A gamified music tracking platform for passionate listeners.
          </p>
        </div>

        <div>
          <h4 class="font-heading text-white font-bold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.path">
              <router-link 
                :to="link.path" 
                class="text-text-secondary hover:text-accent-pink transition-colors text-sm"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-heading text-white font-bold mb-4">Resources</h4>
          <ul class="space-y-2">
            <li>
              <a 
                href="https://www.last.fm/api" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-text-secondary hover:text-accent-pink transition-colors text-sm"
              >
                Last.fm
              </a>
            </li>
            <li>
              <a 
                href="https://developer.spotify.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-text-secondary hover:text-accent-pink transition-colors text-sm"
              >
                Spotify API
              </a>
            </li>
            <li>
              <a 
                href="https://github.com/1MarioDias/SpotifyTracker/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-text-secondary hover:text-accent-pink transition-colors text-sm"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-primary-dark flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-text-secondary text-sm">
          © 2025 WUSIK. Made with Vue.js
        </p>
        <div class="flex items-center gap-4 text-text-secondary text-sm">
          <span>Developed by Mário Dias & Diana Teles</span>
        </div>
      </div>
    </div>
  </footer>
</template>