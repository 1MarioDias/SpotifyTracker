<script>
import { mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import { VINYL_COLORS } from '../utils/vinylSystem';
import { Disc3, Lock, Sparkles } from 'lucide-vue-next';
import { gsap } from 'gsap';

export default {
  name: 'VinylShowcase',
  components: {
    Disc3,
    Lock,
    Sparkles
  },
  data() {
    return {
      previousXP: 0
    };
  },
  computed: {
    ...mapState(useUserStore, ['user', 'xp', 'level']),
    
    vinylsWithStatus() {
      return VINYL_COLORS.map(vinyl => ({
        ...vinyl,
        unlocked: this.level >= vinyl.level,
        isNext: this.level === vinyl.level - 1
      }));
    },
    
    nextVinyl() {
      return this.vinylsWithStatus.find(v => v.isNext);
    }
  },
  watch: {
    xp(newXP, oldXP) {
      if (newXP > oldXP && this.nextVinyl) {
        this.animateNextVinyl();
      }
    }
  },
  mounted() {
    this.previousXP = this.xp;
    this.initializeAnimations();
  },
  methods: {
    getVinylImage(color) {
      return new URL(`../assets/images/vinyl/${color}.png`, import.meta.url).href;
    },

    initializeAnimations() {
      this.$nextTick(() => {
        const unlockedVinyls = this.$refs.vinylItem?.filter((_, index) => 
          this.vinylsWithStatus[index]?.unlocked
        );
        
        if (unlockedVinyls) {
          gsap.from(unlockedVinyls, {
            scale: 0,
            rotation: 360,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)'
          });
        }

        const lockedVinyls = this.$refs.vinylItem?.filter((_, index) => 
          !this.vinylsWithStatus[index]?.unlocked
        );
        
        if (lockedVinyls) {
          gsap.from(lockedVinyls, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power2.out'
          });
        }
      });
    },
    
    animateNextVinyl() {
      this.$nextTick(() => {
        const nextVinylIndex = this.vinylsWithStatus.findIndex(v => v.isNext);
        if (nextVinylIndex !== -1 && this.$refs.vinylItem) {
          const nextVinylElement = this.$refs.vinylItem[nextVinylIndex];
          
          gsap.to(nextVinylElement, {
            x: -5,
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            ease: 'power1.inOut',
            onComplete: () => {
              gsap.to(nextVinylElement, {
                scale: 1.15,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
              });
            }
          });

          const sparkle = nextVinylElement.querySelector('.sparkle-icon');
          if (sparkle) {
            gsap.fromTo(sparkle, 
              { rotation: 0, scale: 1 },
              {
                rotation: 360,
                scale: 1.3,
                duration: 0.6,
                repeat: 1,
                yoyo: true,
                ease: 'power2.inOut'
              }
            );
          }
        }
      });
    },
    
    onVinylHover(event, vinyl) {
      if (vinyl.unlocked) {
        const vinylImg = event.currentTarget.querySelector('.vinyl-image');
        gsap.to(event.currentTarget, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
        if (vinylImg) {
          gsap.to(vinylImg, {
            rotation: 180,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      }
    },
    
    onVinylLeave(event, vinyl) {
      if (vinyl.unlocked) {
        const vinylImg = event.currentTarget.querySelector('.vinyl-image');
        gsap.to(event.currentTarget, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
        if (vinylImg) {
          gsap.to(vinylImg, {
            rotation: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      }
    }
  }
};
</script>

<template>
  <div class="bg-primary-light p-4 sm:p-6 rounded-lg h-full flex flex-col">
    <h2 class="text-xl sm:text-2xl font-heading text-text-primary mb-4 flex items-center gap-2">
      <Disc3 :size="24" />
      Vinyl Collection
    </h2>

    <div class="mb-4 bg-primary-dark p-3 rounded-md">
      <p class="text-sm text-text-secondary">
        Unlock new vinyl colors as you level up! 
        <span v-if="nextVinyl" class="text-accent-pink font-semibold">
          Next at Level {{ nextVinyl.level }}
        </span>
      </p>
    </div>

    <div class="flex-grow flex items-center justify-center pb-8">
      <div class="grid grid-cols-3 gap-6 w-full max-w-md">
        <div
          v-for="(vinyl, index) in vinylsWithStatus"
          :key="vinyl.color"
          ref="vinylItem"
          @mouseenter="onVinylHover($event, vinyl)"
          @mouseleave="onVinylLeave($event, vinyl)"
          class="relative flex flex-col items-center cursor-pointer"
        >
          <div class="relative w-20 h-20 sm:w-24 sm:h-24">
            <img
              :src="getVinylImage(vinyl.color)"
              :alt="`${vinyl.color} vinyl`"
              class="vinyl-image w-full h-full object-contain transition-all duration-300"
              :class="[
                vinyl.unlocked ? 'opacity-100' : 'opacity-30 grayscale'
              ]"
            />
            
            <div 
              v-if="!vinyl.unlocked"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="bg-black/70 rounded-full p-2">
                <Lock :size="20" class="text-text-secondary" />
              </div>
            </div>

            <div 
              v-if="vinyl.isNext"
              class="sparkle-icon absolute -top-1 -right-1 bg-accent-purple rounded-full p-1.5"
            >
              <Sparkles :size="14" class="text-white" />
            </div>
          </div>

          <div 
            class="mt-2 text-xs font-semibold text-center"
            :class="vinyl.unlocked ? 'text-text-primary' : 'text-text-secondary'"
          >
            {{ vinyl.color.charAt(0).toUpperCase() + vinyl.color.slice(1) }}
          </div>
        </div>
      </div>
    </div>

    <div class="pt-4 border-t border-primary-dark">
      <div class="flex justify-between items-center text-sm">
        <span class="text-text-secondary">Unlocked:</span>
        <span class="text-accent-pink font-bold">
          {{ vinylsWithStatus.filter(v => v.unlocked).length }} / {{ vinylsWithStatus.length }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sparkle-icon {
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.9);
  }
}
</style>