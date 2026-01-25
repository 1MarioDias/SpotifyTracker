<template>
  <div class="relative w-full h-full rounded-full shadow-xl animate-spin [animation-duration:5s]">
    <img
      :src="vinylSrc"
      :key="vinylSrc"
      alt="Vinyl Decoration"
      class="absolute inset-0 w-full h-full rounded-full object-cover"
    />

    <div
      v-if="isLoggedIn"
      class="absolute inset-0 flex items-center justify-center z-10"
    >
      <img
        :src="avatarImage"
        :key="avatarImage"
        alt="Profile Picture"
        class="w-[50%] h-[50%] rounded-full object-cover bg-black"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';

export default {
  name: 'ProfileAvatar',

  computed: {
    ...mapState(useUserStore, ['user']),

    isLoggedIn() {
      return !!this.user;
    },

    vinylSrc() {
      const file = this.user?.vinyl_color ? `${this.user.vinyl_color}.png` : 'black.png';
      return new URL(`../assets/images/vinyl/${file}`, import.meta.url).href;
    },

    avatarImage() {
      const file = this.user?.image || 'default_avatar.jpg';
      return new URL(`../assets/images/avatar/${file}`, import.meta.url).href;
    },
  }
};
</script>
