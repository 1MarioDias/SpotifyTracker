<template>
<div class="flex flex-wrap gap-2">
  <div
    v-for="vinyl in vinylsWithLockState"
    :key="vinyl.color"
    class="relative"
  >
    <button
      type="button"
      class="w-10 h-10 rounded-full shadow-md"
      :class="[
        `bg-${vinyl.color === 'gold' ? 'yellow-400' : vinyl.color + '-600'}`,
        selectedColor === vinyl.color ? 'ring-4 ring-accent-purple' : '',
        !vinyl.unlocked ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      :disabled="!vinyl.unlocked"
      @click="vinyl.unlocked && selectColor(vinyl.color)"
    ></button>

    <!-- lock -->
    <div
      v-if="!vinyl.unlocked"
      class="absolute inset-0 flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-5 h-5 text-white bg-black/60 rounded-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 11c1.1 0 2 .9 2 2v2h-4v-2c0-1.1.9-2 2-2zm6 0h-1V9a5 5 0 00-10 0v2H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2z"
        />
      </svg>
    </div>
  </div>
</div>

<!-- buttons -->
  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <button 
        type="button"
        class="w-10 h-10 rounded-full bg-black shadow-md"
        :class="selectedColor === 'black' ? 'ring-4 ring-accent-purple' : ''"
        @click="selectColor('black')"
      ></button>
      <button 
        type="button"
        class="w-10 h-10 rounded-full bg-purple-600 shadow-md"
        :class="selectedColor === 'purple' ? 'ring-4 ring-accent-purple' : ''"
        @click="selectColor('purple')"
      ></button>
      <button 
        type="button"
        class="w-10 h-10 rounded-full bg-blue-600 shadow-md"
        :class="selectedColor === 'blue' ? 'ring-4 ring-accent-purple' : ''"
        @click="selectColor('blue')"
      ></button>
    </div>
    <div class="flex gap-2 ml-5">
      <button 
        type="button"
        class="w-10 h-10 rounded-full bg-yellow-400 shadow-md"
        :class="selectedColor === 'gold' ? 'ring-4 ring-accent-purple' : ''"
        @click="selectColor('gold')"
      ></button>
      <button 
        type="button"
        class="w-10 h-10 rounded-full bg-red-500 shadow-md"
        :class="selectedColor === 'red' ? 'ring-4 ring-accent-purple' : ''"
        @click="selectColor('red')"
      ></button>
    </div>
  </div>
</template>