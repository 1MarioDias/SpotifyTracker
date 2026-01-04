<script>
import CollageGenerator from '../components/CollageGenerator.vue';

export default {
  name: 'CollagesView',
  components: {
    CollageGenerator
  }
};
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 text-text-primary">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-heading font-bold mb-8">Collages</h1>
      <CollageGenerator />
    </div>
  </div>
</template>