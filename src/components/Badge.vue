<script>
export default {
  name: 'Badge',
  props: {
    color: {
      type: String,
      default: 'teal'
    },
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    bgColor() {
      switch (this.color) {
        case 'gold': return '#D4AF37';
        case 'red': return '#E11D48';
        case 'teal': return '#14B8A6';
        default: return '#6B7280';
      }
    }
  }
}
</script>

<template>
  <div
    class="px-3 py-1 rounded-full text-sm font-semibold text-black"
    :style="{ backgroundColor: bgColor }">
    {{ text }}
  </div>
</template>
