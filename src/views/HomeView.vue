<script>
import Navigation from '../components/Navigation.vue'
import LoginButton from '../components/LoginButton.vue'
import { Music, Target, Grid3X3, Crown, TrendingUp, Zap, Award, Users } from 'lucide-vue-next'

export default {
  name: 'HomeView',
  components: {
    LoginButton,
    Music,
    Target,
    Grid3X3,
    Crown,
    TrendingUp,
    Zap,
    Award,
    Users
  },
  data() {
    return {
      features: [
        {
          icon: 'Music',
          title: 'Track Your Music',
          description: 'Connect your Last.fm account and see your recently played tracks and top artists in real-time.',
          color: 'from-accent-pink to-accent-purple'
        },
        {
          icon: 'Crown',
          title: 'Compete for Crowns',
          description: 'Battle other users to become the #1 listener for your favorite artists and earn exclusive crowns.',
          color: 'from-accent-purple to-[#52B69A]'
        },
        {
          icon: 'Target',
          title: 'Set Musical Goals',
          description: 'Create custom listening goals, track your progress, and earn XP rewards when you complete them.',
          color: 'from-[#FCA311] to-accent-pink'
        },
        {
          icon: 'Grid3X3',
          title: 'Generate Collages',
          description: 'Create beautiful visual grids of your top artists or albums and share your unique music taste.',
          color: 'from-[#52B69A] to-accent-purple'
        },
        {
          icon: 'TrendingUp',
          title: 'Level Up System',
          description: 'Earn XP by completing goals and gaining crowns. Progress through 5 levels from Novice to Music Legend.',
          color: 'from-accent-pink to-[#FCA311]'
        },
        {
          icon: 'Award',
          title: 'Personalized Stats',
          description: 'Deep dive into your listening habits with detailed statistics across different time periods.',
          color: 'from-accent-purple to-accent-pink'
        }
      ],
      stats: [
        { value: '10K+', label: 'Scrobbles Tracked', icon: 'Zap' },
        { value: '10+', label: 'Active Users', icon: 'Users' },
        { value: '50+', label: 'Artists Crowned', icon: 'Crown' },
        { value: '10+', label: 'Goals Completed', icon: 'Target' }
      ]
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-primary-dark overflow-x-hidden">
    <Navigation />
    
    <section class="w-full px-4 sm:px-6 lg:px-20 py-8 sm:py-12 lg:py-16">
      <div class="max-w-[1440px] mx-auto text-center">
        <div class="mb-6 lg:mb-8">
          <img 
            src="../assets/images/logo.svg" 
            alt="WUSIK Logo"
            class="mx-auto w-48 sm:w-64 lg:w-80"
          />
        </div>
        <p class="font-heading text-white text-xl sm:text-2xl lg:text-4xl max-w-4xl mx-auto px-4 mb-4">
          Track Your Music Like Never Before
        </p>
        <p class="text-text-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 mb-8">
          A gamified music tracking platform that turns your listening habits into achievements, crowns, and visual art.
        </p>
      </div>
    </section>

    <section class="relative w-full px-4 py-12 lg:py-20">
      <div class="max-w-[1440px] mx-auto flex flex-col items-center">
        <div class="relative w-full max-w-[600px] lg:max-w-[990px] mb-[-300px] lg:mb-[-400px]">
          <div class="relative w-full aspect-square drop-shadow-[0_4px_50px_rgba(0,0,0,0.50)]">
            <img 
              src="../assets/images/vinyl.png"
              alt="Vinyl record" 
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="relative w-full px-4 sm:px-6 lg:px-20 py-12 lg:py-20 bg-primary-light/90 backdrop-blur-sm">
      <div class="max-w-[1440px] mx-auto">
        <div class="text-center mb-12">
          <h2 class="font-heading text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need
          </h2>
          <p class="text-text-secondary text-base lg:text-lg max-w-2xl mx-auto">
            Powerful features designed to enhance your music listening experience
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="bg-primary-light/90 backdrop-blur-sm p-6 rounded-lg hover:scale-105 transition-transform duration-300 border border-primary-dark hover:border-accent-pink/30"
          >
            <div class="mb-4">
              <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center"
                :class="`bg-gradient-to-br ${feature.color}`"
              >
                <component :is="feature.icon" :size="24" class="text-white" />
              </div>
            </div>
            <h3 class="font-heading text-white text-xl font-bold mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-text-secondary text-sm leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full px-4 sm:px-6 lg:px-20 py-12 lg:py-20">
      <div class="max-w-[1440px] mx-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="text-center p-6 bg-primary-light rounded-lg border border-primary-dark"
          >
            <component :is="stat.icon" :size="32" class="mx-auto mb-3 text-accent-pink" />
            <div class="font-heading text-3xl lg:text-4xl font-bold text-white mb-2">
              {{ stat.value }}
            </div>
            <div class="text-text-secondary text-sm">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full px-4 sm:px-6 lg:px-20 py-12 lg:py-20 bg-primary-light/30">
      <div class="max-w-[1440px] mx-auto">
        <div class="text-center mb-12">
          <h2 class="font-heading text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p class="text-text-secondary text-base lg:text-lg">
            Get started in just a few simple steps
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-heading text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 class="font-heading text-white text-xl font-bold mb-3">
              Connect Your Account
            </h3>
            <p class="text-text-secondary text-sm">
              Link your Last.fm account during registration to start tracking your music automatically.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-accent-purple to-[#52B69A] flex items-center justify-center text-white font-heading text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 class="font-heading text-white text-xl font-bold mb-3">
              Set Your Goals
            </h3>
            <p class="text-text-secondary text-sm">
              Create personalized listening goals and compete with friends for artist crowns.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[#52B69A] to-accent-pink flex items-center justify-center text-white font-heading text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 class="font-heading text-white text-xl font-bold mb-3">
              Level Up & Share
            </h3>
            <p class="text-text-secondary text-sm">
              Earn XP, unlock achievements, and create beautiful collages to share your music taste.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA-->
    <section class="w-full px-4 sm:px-6 lg:px-20 py-16 lg:py-24">
      <div class="max-w-[1440px] mx-auto text-center">
        <div class="bg-gradient-to-br from-accent-pink to-accent-purple p-8 lg:p-12 rounded-2xl">
          <h2 class="font-heading text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Start Tracking?
          </h2>
          <p class="text-white/90 text-base lg:text-lg mb-8 max-w-2xl mx-auto">
            Join other music lovers who are already tracking, competing, and sharing their musical journey.
          </p>
          <LoginButton />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="w-full px-4 sm:px-6 lg:px-20 py-8 bg-primary-light border-t border-primary-dark">
      <div class="max-w-[1440px] mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img 
              src="../assets/images/logo.svg" 
              alt="WUSIK Logo"
              class="w-32 mb-4"
            />
            <p class="text-text-secondary text-sm">
              A gamified music tracking platform for passionate listeners.
            </p>
          </div>
          <div>
            <h4 class="font-heading text-white font-bold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li>
                <router-link to="/dashboard" class="text-text-secondary hover:text-accent-pink transition-colors text-sm">
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/goals" class="text-text-secondary hover:text-accent-pink transition-colors text-sm">
                  Goals
                </router-link>
              </li>
              <li>
                <router-link to="/collages" class="text-text-secondary hover:text-accent-pink transition-colors text-sm">
                  Collages
                </router-link>
              </li>
              <li>
                <router-link to="/profile" class="text-text-secondary hover:text-accent-pink transition-colors text-sm">
                  Profile
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-heading text-white font-bold mb-4">Resources</h4>
            <ul class="space-y-2">
              <li>
                <a 
                  href="https://www.last.fm/" 
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
  </div>
</template>

<style scoped>
</style>