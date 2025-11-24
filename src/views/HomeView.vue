<script>
import Navigation from '../components/Navigation.vue'
import LoginButton from '../components/LoginButton.vue'

export default {
  name: 'HomeView',
  components: {
    LoginButton,
  },
  methods: {
  }
}
</script>

<template>
  <div class="min-h-screen bg-vinyl-dark overflow-x-hidden">
    <Navigation />
    <section class="w-full px-4 sm:px-6 lg:px-20 py-8 sm:py-12 lg:py-16">
        <div class="max-w-[1440px] mx-auto text-center">
        <div class="mb-6 lg:mb-8">
            <img 
            src="../assets/images/logo.svg" 
            alt="SpotifyTracker Logo"
            class="mx-auto w-48 sm:w-64 lg:w-80"
            />
        </div>
        <p class="font-rough text-white text-xl sm:text-2xl lg:text-4xl max-w-4xl mx-auto px-4">
            Track Your Listening Stats Like Never Before
        </p>
        </div>
    </section>
    <LoginButton class="mx-auto mb-12" />
    <section class="relative w-full px-4 py-12 lg:py-20">
        <div class="max-w-[1440px] mx-auto flex flex-col items-center">
        <!-- Vinyl Record -->
        <div class="relative w-full max-w-[600px] lg:max-w-[990px] mb-12 lg:mb-16">
            <div class="relative w-full aspect-square drop-shadow-[0_4px_50px_rgba(0,0,0,0.50)]">
            <img 
                src="../assets/images/vinyl.png"
                alt="Vinyl record" 
                class="absolute inset-0 w-full h-full object-cover"
            />
            <img 
                src="../assets/images/cover.png" 
                alt="Album cover" 
                class="absolute left-0 top-1/2 w-full h-full object-cover "
            />
            </div>
        </div>

        <!-- Text -->
        <h2 class="font-heading text-vinyl-brown text-3xl sm:text-4xl lg:text-5xl xl:text-[64px] text-center font-normal max-w-[990px] px-4 mb-8 lg:mb-12">
            Your taste deserves its own visuals
        </h2>
        </div>
    </section>
  </div>
</template>

<style scoped></style>
