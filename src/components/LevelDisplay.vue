<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import { getLevelInfo } from '../utils/levelSystem';
import { Trophy } from 'lucide-vue-next';

export default {
  name: 'LevelDisplay',
  components: {
    Trophy
  },
  computed: {
    ...mapState(useUserStore, ['user', 'xp', 'level']),
    
    levelInfo() {
      return getLevelInfo(this.xp);
    },
    
    progressPercentage() {
      return this.levelInfo.progressToNext;
    },

    levelColor() {
      const colors = [
        { from: '#C1121F', to: '#780000' },
        { from: '#C1440E', to: '#9E2A00' },
        { from: '#D16014', to: '#A84A00' },
        { from: '#FCA311', to: '#D68600' },
        { from: '#52B69A', to: '#168A6E' },
      ];
      return colors[this.level] || colors[0];
    }
  }
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <div 
        class="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg"
        :style="{ 
          background: `linear-gradient(135deg, ${levelColor.from} 0%, ${levelColor.to} 100%)`,
          boxShadow: `0 4px 20px ${levelColor.from}40`
        }"
      >
        <span class="text-2xl md:text-3xl font-bold text-white">{{ level }}</span>
      </div>
      <div class="flex-grow">
        <p 
          class="text-xl md:text-2xl font-bold font-heading"
          :style="{ color: levelColor.from }"
        >
          {{ levelInfo.levelName }}
        </p>
        <p class="text-sm text-text-secondary">{{ xp }} XP Total</p>
      </div>
    </div>

    <div v-if="!levelInfo.isMaxLevel" class="space-y-2">
      <div class="flex justify-between text-xs md:text-sm text-text-secondary">
        <span>Next: {{ levelInfo.nextLevelName }}</span>
        <span>{{ levelInfo.xpNeededForNext }} XP needed</span>
      </div>
      <div class="w-full bg-primary-dark rounded-full h-2.5 overflow-hidden">
        <div 
          class="h-2.5 rounded-full transition-all duration-700 ease-out"
          :style="{ 
            width: progressPercentage + '%',
            background: `linear-gradient(90deg, ${levelColor.from} 0%, ${levelColor.to} 100%)`
          }"
        ></div>
      </div>
      <p class="text-xs text-text-secondary text-right">{{ progressPercentage.toFixed(1) }}% complete</p>
    </div>

    <div v-else class="text-center py-2">
      <div 
        class="inline-block px-6 py-2 rounded-full flex items-center justify-center gap-2"
        :style="{ 
          background: `linear-gradient(135deg, ${levelColor.from} 0%, ${levelColor.to} 100%)`,
          boxShadow: `0 4px 20px ${levelColor.from}60`
        }"
      >
        <Trophy :size="24" class="text-white" />
        <p class="text-lg md:text-xl font-bold text-white">
          Max Level Achieved!
        </p>
        <Trophy :size="24" class="text-white" />
      </div>
    </div>
  </div>
</template>