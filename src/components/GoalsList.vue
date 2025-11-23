<script>
import { mapState, mapActions } from 'pinia';
import { useGoalStore } from '../stores/goalStore';
import { useAppStore } from '../stores/useAppStore';

export default {
  name: 'GoalsList',
  data() {
    return {
      filter: 'active',
    };
  },
  computed: {
    ...mapState(useAppStore, ['user']),
    ...mapState(useGoalStore, ['isLoading', 'error', 'activeGoals', 'completedGoals']),
    filteredGoals() {
      return this.filter === 'active' ? this.activeGoals : this.completedGoals;
    },
  },
  methods: {
    ...mapActions(useGoalStore, ['fetchGoals', 'removeGoal', 'checkGoalProgress']),
    getGoalProgress(goal) {
      if (goal.target === 0) return 0;
      return (goal.progress / goal.target) * 100;
    },
    formatType(type) {
      return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    async confirmDelete(goalId) {
      if (window.confirm('Are you sure you want to delete this goal?')) {
        await this.removeGoal(goalId);
      }
    },
    isAutomatable(goal) {
      return ['listen_tracks', 'earn_badges'].includes(goal.type);
    }
  },
  mounted() {
    if (this.user) {
      this.fetchGoals(this.user.id);
    }
  },
  watch: {
    user(newUser) {
      if (newUser) {
        this.fetchGoals(newUser.id);
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl sm:text-4xl font-heading font-bold">Your Goals</h1>
      <router-link :to="{ name: 'goals', params: { action: 'create' } }" class="bg-accent-pink text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
        New Goal
      </router-link>
    </div>

    <div class="flex gap-2 mb-6 border-b border-primary-light">
      <button @click="filter = 'active'" :class="['py-2 px-4 text-lg', filter === 'active' ? 'text-accent-pink border-b-2 border-accent-pink' : 'text-text-secondary']">Active</button>
      <button @click="filter = 'completed'" :class="['py-2 px-4 text-lg', filter === 'completed' ? 'text-accent-pink border-b-2 border-accent-pink' : 'text-text-secondary']">Completed</button>
    </div>

    <div v-if="isLoading" class="text-center text-text-secondary py-8">Loading goals...</div>
    <div v-else-if="error" class="bg-red-900/50 text-red-300 p-4 rounded-md">{{ error }}</div>
    
    <div v-else-if="filteredGoals.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="goal in filteredGoals" :key="goal.id" class="bg-primary-light rounded-lg p-6 flex flex-col">
        <div class="flex-grow">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-text-primary mb-2">{{ goal.title }}</h3>
            <span class="text-xs font-semibold uppercase px-2 py-1 rounded-full" :class="goal.status === 'active' ? 'bg-accent-purple/20 text-accent-purple' : 'bg-green-500/20 text-green-400'">{{ goal.status }}</span>
          </div>
          <p class="text-sm text-text-secondary mb-4">{{ goal.description }}</p>
          <div class="text-xs text-text-secondary mb-4 space-y-1">
            <p><strong>Type:</strong> {{ formatType(goal.type) }}</p>
            <p><strong>Deadline:</strong> {{ new Date(goal.deadline).toLocaleDateString() }}</p>
            <p><strong>Reward:</strong> {{ goal.xp }} XP</p>
          </div>
        </div>
        
        <div>
          <div class="flex justify-between text-sm text-text-secondary mb-1">
            <span>Progress</span>
            <span>{{ goal.progress }} / {{ goal.target }}</span>
          </div>
          <div class="w-full bg-primary-dark rounded-full h-2.5">
            <div class="bg-accent-pink h-2.5 rounded-full" :style="{ width: getGoalProgress(goal) + '%' }"></div>
          </div>
        </div>

        <div class="flex gap-4 items-center mt-6 border-t border-primary-dark pt-4">
          <router-link :to="{ name: 'goals', params: { action: 'edit', id: goal.id } }" class="text-sm text-accent-purple hover:underline">Edit</router-link>
          <button @click="confirmDelete(goal.id)" class="text-sm text-red-500 hover:underline">Delete</button>
          <button v-if="isAutomatable(goal) && goal.status === 'active'" @click="checkGoalProgress(goal)" class="ml-auto text-sm bg-accent-purple/80 text-white px-3 py-1 rounded-md hover:bg-accent-purple transition-colors">
            Check Progress
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-text-secondary py-8">No {{ filter }} goals found.</div>
  </div>
</template>