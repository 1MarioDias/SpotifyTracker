<script>
export default {
  name: 'LoadingSkeleton',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'tracks', 'artists', 'crowns'].includes(value)
    }
  }
}
</script>

<template>
  <!-- recent tracks -->
  <div v-if="type === 'tracks'" class="space-y-3">
    <div v-for="i in 7" :key="i" class="flex items-center gap-4 animate-pulse">
      <div class="w-12 h-12 rounded-md bg-primary-dark/50 flex-shrink-0"></div>
      <div class="flex-grow min-w-0 space-y-2">
        <div class="h-4 bg-primary-dark/50 rounded w-3/4"></div>
        <div class="h-3 bg-primary-dark/50 rounded w-1/2"></div>
      </div>
      <div class="w-20 h-3 bg-primary-dark/50 rounded flex-shrink-0"></div>
    </div>
  </div>

  <!-- top artists -->
  <div v-else-if="type === 'artists'" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
    <div v-for="i in 6" :key="i" class="aspect-square animate-pulse">
      <div class="w-full h-full bg-primary-dark/50 rounded-md"></div>
    </div>
  </div>

  <!-- crowns skeleton -->
  <div v-else-if="type === 'crowns'" class="grid grid-cols-2 gap-3">
    <div v-for="i in 8" :key="i" class="animate-pulse">
      <div class="bg-primary-dark/50 p-3 rounded-md h-12"></div>
    </div>
  </div>

  <!-- default -->
  <div v-else class="animate-pulse space-y-4">
    <div class="h-4 bg-primary-dark/50 rounded w-3/4"></div>
    <div class="h-4 bg-primary-dark/50 rounded w-1/2"></div>
    <div class="h-4 bg-primary-dark/50 rounded w-5/6"></div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>