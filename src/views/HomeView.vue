<script>
import Navigation from '../components/Navigation.vue'
import LoginButton from '../components/LoginButton.vue'
import Footer from '../components/Footer.vue'
import { Music, Target, Grid3X3, Crown, TrendingUp, Zap, Award, Users } from 'lucide-vue-next'
import ProfileAvatar from '../components/ProfileAvatar.vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    Zap,
    Award,
    Users,
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
      stats: [
        { value: '10K+', label: 'Scrobbles Tracked', icon: 'Zap' },
        { value: '10+', label: 'Active Users', icon: 'Users' },
        { value: '50+', label: 'Artists Crowned', icon: 'Crown' },
        { value: '10+', label: 'Goals Completed', icon: 'Target' }
      ]
    }
  },
  mounted() {
    this.initAnimations();
  },
  methods: {
    initAnimations() {
      this.$nextTick(() => {
        this.animateHeroSection();
        this.animateFeaturesSection();
        this.animateStatsSection();
        this.animateHowItWorksSection();
        this.animateCTASection();
      });
    },

    animateHeroSection() {
      const timeline = gsap.timeline();

      timeline
        .from('.hero-logo', {
          scale: 0,
          rotation: 360,
          opacity: 0,
          duration: 1,
          ease: 'back.out(1.7)'
        })
        .from('.hero-title', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-subtitle', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.5');

      gsap.from('.vinyl-showcase', {
        scrollTrigger: {
          trigger: '.vinyl-showcase',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    },

    animateFeaturesSection() {
      const titleChars = this.$refs.featuresTitle?.textContent.split('') || [];
      if (this.$refs.featuresTitle) {
        this.$refs.featuresTitle.innerHTML = titleChars
          .map(char => char === ' ' ? ' ' : `<span class="inline-block">${char}</span>`)
          .join('');
      }

      gsap.from('.features-title span', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        rotationX: -90,
        stagger: 0.03,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });

      gsap.from('.features-subtitle', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out'
      });

      if (this.$refs.featureCard) {
        this.$refs.featureCard.forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            rotationY: 180,
            opacity: 0,
            scale: 0.5,
            duration: 0.25,
            delay: index * 0.1,
            ease: 'power2.out'
          });

          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              rotationY: 5,
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out'
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              rotationY: 0,
              scale: 1,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        });
      }
    },

    animateStatsSection() {
      if (this.$refs.statCard) {
        this.$refs.statCard.forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            rotationX: 90,
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
          });

          const valueElement = card.querySelector('.stat-value');
          if (valueElement) {
            ScrollTrigger.create({
              trigger: card,
              start: 'top 85%',
              onEnter: () => {
                const endValue = valueElement.textContent;
                const numValue = parseInt(endValue.replace(/\D/g, ''));
                const suffix = endValue.replace(/[0-9]/g, '');
                
                gsap.from(valueElement, {
                  textContent: 0,
                  duration: 1.5,
                  delay: index * 0.1,
                  ease: 'power1.out',
                  snap: { textContent: 1 },
                  onUpdate: function() {
                    valueElement.textContent = Math.ceil(this.targets()[0].textContent) + suffix;
                  }
                });
              }
            });
          }
        });
      }
    },

    animateHowItWorksSection() {
      const stepCards = Array.isArray(this.$refs.stepCard) 
        ? this.$refs.stepCard 
        : [this.$refs.stepCard].filter(Boolean);
      
      if (stepCards && stepCards.length > 0) {
        stepCards.forEach((card, index) => {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          });

          timeline
            .from(card.querySelector('.step-number'), {
              scale: 0,
              rotation: 720,
              opacity: 0,
              duration: 0.8,
              ease: 'back.out(1.7)'
            })
            .from(card.querySelector('.step-title'), {
              x: -50,
              opacity: 0,
              duration: 0.6,
              ease: 'power3.out'
            }, '-=0.4')
            .from(card.querySelector('.step-description'), {
              y: 20,
              opacity: 0,
              duration: 0.6,
              ease: 'power3.out'
            }, '-=0.3');
        });
      }
    },

    animateCTASection() {
      gsap.from('.cta-section', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      const ctaTitle = this.$refs.ctaTitle;
      if (ctaTitle) {
        const titleChars = ctaTitle.textContent.split('');
        ctaTitle.innerHTML = titleChars
          .map(char => char === ' ' ? ' ' : `<span class="inline-block">${char}</span>`)
          .join('');

        gsap.from('.cta-title span', {
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          rotationX: -90,
          stagger: 0.02,
          duration: 0.6,
          ease: 'back.out(1.7)'
        });
      }
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-primary-dark overflow-x-hidden">
    <Navigation />
    
    <section class="w-full px-4 sm:px-6 lg:px-20 py-8 sm:py-12 lg:py-16">
      <div class="max-w-[1440px] mx-auto text-center">
        <div class="mb-6 lg:mb-8 hero-logo">
          <img 
            src="../assets/images/logo.svg" 
            alt="WUSIK Logo"
            class="mx-auto w-48 sm:w-64 lg:w-80"
          />
        </div>
        <p class="hero-title font-heading text-white text-xl sm:text-2xl lg:text-4xl max-w-4xl mx-auto px-4 mb-4">
          Track Your Music Like Never Before
        </p>
        <p class="hero-subtitle text-text-secondary text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 mb-8">
          A gamified music tracking platform that turns your listening habits into achievements, crowns, and visual art.
        </p>
      </div>
    </section>

    <section class="relative w-full">
      <div class="absolute inset-0 flex items-start justify-center pt-0 pointer-events-none">
        <div class="vinyl-showcase relative w-full max-w-[600px] lg:max-w-[900px] opacity-40">
          <div class="relative w-full aspect-square drop-shadow-[0_4px_50px_rgba(0,0,0,0.50)]">
            <ProfileAvatar />
          </div>
        </div>
      </div>

      <section class="features-section relative w-full px-4 sm:px-6 lg:px-20 pt-12 sm:pt-16 lg:pt-20 pb-12 lg:pb-20 bg-gradient-to-b from-transparent via-primary-light/80 to-primary-light/90 backdrop-blur-sm">
        <div class="max-w-[1440px] mx-auto">
          <div class="text-center mb-12 relative z-10">
            <h2 ref="featuresTitle" class="features-title font-heading text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p class="features-subtitle text-text-secondary text-base lg:text-lg max-w-2xl mx-auto">
              Powerful features designed to enhance your music listening experience
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            <div 
              v-for="(feature, index) in features" 
              :key="index"
              ref="featureCard"
              class="bg-primary-light/90 backdrop-blur-sm p-6 rounded-lg transition-transform duration-300 border border-primary-dark hover:border-accent-pink/30"
              style="perspective: 1000px"
            >
              <div class="mb-4">
                <div 
                  class="w-12 h-12 rounded-lg flex items-center justify-center"
                  :class="`bg-gradient-to-br ${feature.color}`"
                >
                  <component :is="feature.icon" :size="24" class="text-white" />
                </div>
              </div>
              <h3 class="font-heading text-white text-xl font-bold mb-3">
                {{ feature.title }}
              </h3>
              <p class="text-text-secondary text-sm leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>

    <section class="w-full px-4 sm:px-6 lg:px-20 py-12 lg:py-20 bg-primary-light/90">
      <div class="max-w-[1440px] mx-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            ref="statCard"
            class="text-center p-6 bg-primary-light rounded-lg border border-primary-dark"
            style="perspective: 1000px"
          >
            <component :is="stat.icon" :size="32" class="mx-auto mb-3 text-accent-pink" />
            <div class="stat-value font-heading text-3xl lg:text-4xl font-bold text-white mb-2">
              {{ stat.value }}
            </div>
            <div class="text-text-secondary text-sm">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full px-4 sm:px-6 lg:px-20 py-12 lg:py-20 bg-primary-light/30">
      <div class="max-w-[1440px] mx-auto">
        <div class="text-center mb-12">
          <h2 class="font-heading text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p class="text-text-secondary text-base lg:text-lg">
            Get started in just a few simple steps
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div ref="stepCard" class="text-center">
            <div class="step-number w-16 h-16 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-heading text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 class="step-title font-heading text-white text-xl font-bold mb-3">
              Connect Your Account
            </h3>
            <p class="step-description text-text-secondary text-sm">
              Link your Last.fm account during registration to start tracking your music automatically.
            </p>
          </div>

          <div ref="stepCard" class="text-center">
            <div class="step-number w-16 h-16 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-heading text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 class="step-title font-heading text-white text-xl font-bold mb-3">
              Start Listening
            </h3>
            <p class="step-description text-text-secondary text-sm">
              Play your favorite music on Spotify, Apple Music, or any Last.fm-compatible platform.
            </p>
          </div>

          <div ref="stepCard" class="text-center">
            <div class="step-number w-16 h-16 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-white font-heading text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 class="step-title font-heading text-white text-xl font-bold mb-3">
              Track & Compete
            </h3>
            <p class="step-description text-text-secondary text-sm">
              Earn XP, unlock achievements, and create beautiful collages to share your music taste.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section w-full px-4 sm:px-6 lg:px-20 py-16 lg:py-24">
      <div class="max-w-[1440px] mx-auto text-center">
        <div class="bg-gradient-to-br from-accent-pink to-accent-purple p-8 lg:p-12 rounded-2xl">
          <h2 ref="ctaTitle" class="cta-title font-heading text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Start Tracking?
          </h2>
          <p class="text-white/90 text-base lg:text-lg mb-8 max-w-2xl mx-auto">
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
</style>