<script>
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
import ProfileView from './views/ProfileView.vue'

export default {
  name: 'App',
  components: {
    RouterView,
    Navigation,
    ProfileView
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