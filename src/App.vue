// filepath: c:\Users\User\Documents\LTSIW\Ano3\PW1\SpotifyTracker\src\App.vue
<script>
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'

export default {
  name: 'App',
  components: {
    RouterView,
    Navigation
  }
}
</script>

<template>
  <div class="min-h-screen bg-primary-dark overflow-x-hidden font-body">
    <Navigation />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>