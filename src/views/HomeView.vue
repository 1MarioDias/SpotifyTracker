<script>
import LoginButton from '../components/LoginButton.vue'
import Footer from '../components/Footer.vue'
import { Music, Target, Grid3X3, Crown, TrendingUp, Award, ChevronDown } from 'lucide-vue-next'
import ProfileAvatar from '../components/ProfileAvatar.vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default {
  name: 'HomeView',
  components: {
    LoginButton,
    Footer,
    Music,
    Target,
    Grid3X3,
    Crown,
    TrendingUp,
    Award,
    ChevronDown,
    ProfileAvatar
  },
  data() {
    return {
      features: [
        {
          icon: 'Music',
          title: 'Track Your Music',
          description: 'Connect your Last.fm account and see your recently played tracks and top artists in real-time.',
          color: 'from-accent-pink to-accent-purple'
        },
        {
          icon: 'Crown',
          title: 'Crown System',
          description: 'Compete for artist crowns based on your play counts. Defend your territory and climb the leaderboards.',
          color: 'from-yellow-400 to-orange-500'
        },
        {
          icon: 'Target',
          title: 'Set Goals',
          description: 'Create custom listening goals and track your progress. Challenge yourself to discover new music.',
          color: 'from-green-400 to-teal-500'
        },
        {
          icon: 'Grid3X3',
          title: 'Create Collages',
          description: 'Generate beautiful visual collages of your top albums or artists to share with friends.',
          color: 'from-blue-400 to-purple-500'
        },
        {
          icon: 'TrendingUp',
          title: 'Level Up',
          description: 'Gain XP as you listen to music and unlock new achievements, badges, and profile customizations.',
          color: 'from-pink-500 to-red-500'
        },
        {
          icon: 'Award',
          title: 'Personalized Stats',
          description: 'Deep dive into your listening habits with detailed statistics across different time periods.',
          color: 'from-accent-purple to-accent-pink'
        }
      ],
      steps: [
        { number: '01', title: 'Connect', description: 'Link your Last.fm account during registration to start tracking your music automatically.' },
        { number: '02', title: 'Listen', description: 'Play your favorite music on Spotify, Apple Music, or any Last.fm-compatible platform.' },
        { number: '03', title: 'Compete', description: 'Earn XP, unlock achievements, and create beautiful collages to share your music taste.' }
      ],
      currentSection: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initScrollAnimations();
    });
  },
  beforeUnmount() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  },
  methods: {
    initScrollAnimations() {
      this.setupHeroAnimations();
      this.setupVinylSection();
      this.setupFeaturesSection();
      this.setupStepsSection();
      this.setupCTASection();
      this.setupProgressIndicator();
    },

    setupHeroAnimations() {
      const heroTl = gsap.timeline();
      
      heroTl
        .from('.hero-logo', {
          y: 100,
          opacity: 0,
          scale: 0.8,
          duration: 1.2,
          ease: 'power4.out'
        })
        .from('.hero-title-line', {
          y: 80,
          opacity: 0,
          rotationX: -80,
          stagger: 0.15,
          duration: 1,
          ease: 'power4.out'
        }, '-=0.6')
        .from('.hero-subtitle', {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.6')
        .from('.scroll-indicator', {
          y: -20,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.2');

      gsap.to('.scroll-indicator', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });

      gsap.to('.hero-bg-gradient', {
        backgroundPosition: '100% 100%',
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'none'
      });
    },

    setupVinylSection() {
      const vinylSection = this.$refs.vinylSection;
      const vinyl = this.$refs.vinylElement;

      gsap.set(vinyl, { rotation: 0 });

      gsap.to(vinyl, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });

      ScrollTrigger.create({
        trigger: vinylSection,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const scale = 1 + (self.progress * 0.5);
          const opacity = 1 - (self.progress * 0.7);
          gsap.set(vinyl, { scale, opacity });
        }
      });

      gsap.from('.vinyl-text', {
        scrollTrigger: {
          trigger: vinylSection,
          start: 'top center',
          end: 'center center',
          scrub: 1
        },
        y: 100,
        opacity: 0,
        stagger: 0.2
      });

      gsap.from('.vinyl-overlay', {
        scrollTrigger: {
          trigger: vinylSection,
          start: 'top center',
          end: 'center center',
          scrub: 1
        },
        opacity: 0
      });
    },

    setupFeaturesSection() {
      const featuresSection = this.$refs.featuresSection;
      const featureCards = this.$refs.featureCard;

      if (!featureCards) return;

      const cards = Array.isArray(featureCards) ? featureCards : [featureCards];

      ScrollTrigger.create({
        trigger: featuresSection,
        start: 'top top',
        end: `+=${cards.length * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const cardIndex = Math.floor(self.progress * cards.length);
          cards.forEach((card, index) => {
            if (index === cardIndex) {
              gsap.to(card, {
                opacity: 1,
                scale: 1,
                y: 0,
                rotationY: 0,
                duration: 0.3
              });
            } else if (index < cardIndex) {
              gsap.to(card, {
                opacity: 0.2,
                scale: 0.85,
                y: -80,
                rotationY: -15,
                duration: 0.3
              });
            } else {
              gsap.to(card, {
                opacity: 0,
                scale: 0.7,
                y: 100,
                rotationY: 15,
                duration: 0.3
              });
            }
          });
        }
      });

      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, scale: 0.7, y: 100, rotationY: 15 });
      });
      gsap.set(cards[0], { opacity: 1, scale: 1, y: 0, rotationY: 0 });
    },

    setupStepsSection() {
      const stepItems = this.$refs.stepItem;

      if (!stepItems) return;

      const items = Array.isArray(stepItems) ? stepItems : [stepItems];

      items.forEach((item, index) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse'
          }
        });

        tl.from(item.querySelector('.step-number-display'), {
          scale: 0,
          rotation: -180,
          duration: 0.8,
          ease: 'back.out(1.7)'
        })
        .from(item.querySelector('.step-content'), {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.4')
      });
    },

    setupCTASection() {
      const ctaSection = this.$refs.ctaSection;

      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: ctaSection,
          start: 'top 60%',
          end: 'center center',
          scrub: 1
        },
        y: 100,
        opacity: 0,
        scale: 0.9
      });

      gsap.from('.cta-particles span', {
        scrollTrigger: {
          trigger: ctaSection,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        stagger: {
          each: 0.05,
          from: 'random'
        },
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    },

    setupProgressIndicator() {
      const sections = [
        this.$refs.heroSection,
        this.$refs.vinylSection,
        this.$refs.featuresSection,
        this.$refs.stepsSection,
        this.$refs.ctaSection
      ].filter(Boolean);

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => { this.currentSection = index; },
          onEnterBack: () => { this.currentSection = index; }
        });
      });
    },

    scrollToSection(index) {
      const sections = [
        this.$refs.heroSection,
        this.$refs.vinylSection,
        this.$refs.featuresSection,
        this.$refs.stepsSection,
        this.$refs.ctaSection
      ];
      
      if (sections[index]) {
        gsap.to(window, {
          scrollTo: { y: sections[index], offsetY: 0 },
          duration: 1,
          ease: 'power3.inOut'
        });
      }
    }
  }
}
</script>

<template>
  <div class="home-container bg-primary-dark text-text-primary overflow-x-hidden">
    
    <div class="progress-nav fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3 sm:gap-4">
      <button
        v-for="(_, index) in 5"
        :key="index"
        @click="scrollToSection(index)"
        class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300"
        :class="currentSection === index 
          ? 'bg-accent-pink scale-125' 
          : 'bg-text-secondary/30 hover:bg-text-secondary/60'"
        :aria-label="`Go to section ${index + 1}`"
      ></button>
    </div>

    <section 
      ref="heroSection"
      class="hero-section min-h-screen flex flex-col items-center justify-center relative px-4 sm:px-6 lg:px-20 pt-20 sm:pt-0"
    >
      <div class="hero-bg-gradient absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-light to-primary-dark bg-[length:200%_200%] bg-[0%_0%]"></div>
      
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-2 h-2 bg-accent-pink rounded-full animate-pulse"></div>
        <div class="absolute top-40 right-20 w-3 h-3 bg-accent-purple rounded-full animate-pulse delay-300"></div>
        <div class="absolute bottom-40 left-1/4 w-2 h-2 bg-accent-pink rounded-full animate-pulse delay-500"></div>
        <div class="absolute bottom-20 right-1/3 w-4 h-4 bg-accent-purple/50 rounded-full animate-pulse delay-700"></div>
      </div>

      <div class="relative z-10 text-center max-w-5xl mx-auto">
        <div class="hero-logo mb-6 sm:mb-8 lg:mb-12">
          <img 
            src="../assets/images/logo.svg" 
            alt="WUSIK Logo"
            class="mx-auto w-40 sm:w-56 md:w-72 lg:w-96"
          />
        </div>
        
        <div class="overflow-hidden mb-2 sm:mb-3">
          <p class="hero-title-line font-heading text-xl sm:text-2xl md:text-3xl lg:text-5xl text-accent-pink">
            Track Your Music
          </p>
        </div>
        <div class="overflow-hidden mb-6 sm:mb-8">
          <p class="hero-title-line font-heading text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white">
            Like Never Before
          </p>
        </div>
        
        <p class="hero-subtitle text-text-secondary text-base sm:text-lg lg:text-2xl max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-4">
          A gamified music tracking platform that turns your listening habits into achievements, crowns, and visual art.
        </p>
      </div>

      <div class="scroll-indicator absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary">
        <span class="text-xs sm:text-sm uppercase tracking-widest hidden sm:block">Scroll to explore</span>
        <ChevronDown :size="20" class="sm:w-6 sm:h-6 animate-bounce" />
      </div>
    </section>

    <section 
      ref="vinylSection"
      class="vinyl-section min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div 
        ref="vinylElement"
        class="absolute w-[180vw] h-[180vw] sm:w-[140vw] sm:h-[140vw] lg:w-[90vw] lg:h-[90vw] max-w-[1400px] max-h-[1400px] opacity-30"
      >
        <ProfileAvatar />
      </div>

      <div class="vinyl-overlay absolute inset-0 bg-gradient-to-b from-primary-dark/60 via-transparent to-primary-dark/80 pointer-events-none"></div>

      <div class="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <h2 class="vinyl-text font-heading text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Your Music,
        </h2>
        <h2 class="vinyl-text font-heading text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple mb-6 sm:mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" style="filter: drop-shadow(0 2px 10px rgba(0,0,0,0.8));">
          Visualized
        </h2>
        <p class="vinyl-text text-text-secondary text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto bg-primary-dark/60 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 rounded-xl">
          Watch your listening habits come to life through beautiful visualizations and interactive experiences.
        </p>
      </div>
    </section>

    <section 
      ref="featuresSection"
      class="features-section min-h-screen flex items-center justify-center relative bg-primary-light/50 py-16 sm:py-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 w-full">
        <div class="text-center mb-12 sm:mb-16">
          <span class="text-accent-pink text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 block">Features</span>
          <h2 class="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white">
            Everything You Need
          </h2>
        </div>

        <div class="relative h-[500px] sm:h-[450px] md:h-[400px] flex items-center justify-center">
          <div
            v-for="(feature, index) in features"
            :key="index"
            ref="featureCard"
            class="feature-card absolute w-full max-w-2xl bg-primary-dark/90 backdrop-blur-lg p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl border border-primary-light"
          >
            <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div 
                class="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center"
                :class="`bg-gradient-to-br ${feature.color}`"
              >
                <component :is="feature.icon" :size="28" class="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div class="flex-grow">
                <h3 class="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                  {{ feature.title }}
                </h3>
                <p class="text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed">
                  {{ feature.description }}
                </p>
              </div>
            </div>
            
            <div class="mt-6 sm:mt-8 flex items-center gap-2 sm:gap-3 text-accent-pink">
              <span class="text-xs sm:text-sm font-semibold whitespace-nowrap">{{ index + 1 }} / {{ features.length }}</span>
              <div class="flex-grow h-1 bg-primary-light rounded-full overflow-hidden">
                <div 
                  class="h-full bg-accent-pink rounded-full transition-all duration-300"
                  :style="{ width: `${((index + 1) / features.length) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section 
      ref="stepsSection"
      class="steps-section min-h-screen py-16 sm:py-20 lg:py-32 relative"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-20">
        <div class="text-center mb-16 sm:mb-20">
          <span class="text-accent-purple text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 block">Getting Started</span>
          <h2 class="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white">
            How It Works
          </h2>
        </div>

        <div class="relative">
          <div 
            v-for="(step, index) in steps"
            :key="index"
            ref="stepItem"
            class="step-item flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-16 mb-16 sm:mb-20 lg:mb-32 last:mb-0"
            :class="index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'"
          >
            <div class="step-number-display relative flex-shrink-0">
              <div class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center">
                <span class="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">{{ step.number }}</span>
              </div>
              <div 
                v-if="index < steps.length - 1"
                class="step-line hidden sm:block absolute left-1/2 -translate-x-1/2 top-full w-1 h-16 sm:h-20 lg:h-32 bg-gradient-to-b from-accent-purple to-transparent origin-top"
              ></div>
            </div>

            <div class="step-content flex-grow text-center sm:text-left">
              <h3 class="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                {{ step.title }}
              </h3>
              <p class="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-md mx-auto sm:mx-0">
                {{ step.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section 
      ref="ctaSection"
      class="cta-section min-h-screen flex items-center justify-center relative overflow-hidden py-16 sm:py-20"
    >
      <div class="cta-particles absolute inset-0 pointer-events-none">
        <span v-for="n in 20" :key="n" 
          class="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-pink/30 rounded-full"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }"
        ></span>
      </div>

      <div class="cta-content relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div class="bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 backdrop-blur-lg p-6 sm:p-8 md:p-12 lg:p-20 rounded-3xl border border-accent-pink/20">
          <h2 class="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
            Ready to Start <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">
              Tracking?
            </span>
          </h2>
          
          <p class="text-text-secondary text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto px-2">
            Join other music lovers who are already tracking, competing, and sharing their musical journey.
          </p>

          <LoginButton />
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
.home-container {
  scroll-behavior: smooth;
}

.feature-card {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }
.delay-700 { animation-delay: 700ms; }

@media (max-width: 640px) {
  .home-container {
    overflow-x: hidden;
  }
}
</style>