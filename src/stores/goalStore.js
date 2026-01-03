import { defineStore } from 'pinia';
import goalService from '../services/goalService';
import externalAPIs from '../services/externalAPIs';
import userService from '../services/userService';
import { useUserStore } from './userStore';

export const useGoalStore = defineStore('goal', {
  state: () => ({
    goals: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    activeGoals: (state) => state.goals.filter(g => g.status === 'active'),
    completedGoals: (state) => state.goals.filter(g => g.status === 'completed'),
  },

  actions: {
    async fetchGoals(userId) {
      this.isLoading = true;
      this.error = null;
      try {
        this.goals = await goalService.getGoals(userId);
      } catch (err) {
        this.error = 'Failed to load goals.';
      } finally {
        this.isLoading = false;
      }
    },

    async addGoal(goalData) {
      this.isLoading = true;
      try {
        const newGoal = await goalService.createGoal(goalData);
        this.goals.push(newGoal);
      } catch (err) {
        this.error = 'Failed to create goal.';
      } finally {
        this.isLoading = false;
      }
    },

    async editGoal(id, goalData) {
      this.isLoading = true;
      try {
        const updatedGoal = await goalService.updateGoal(id, goalData);
        const index = this.goals.findIndex(g => g.id === id);
        if (index !== -1) {
          this.goals[index] = updatedGoal;
        }
      } catch (err) {
        this.error = 'Failed to update goal.';
      } finally {
        this.isLoading = false;
      }
    },

    async removeGoal(id) {
      this.isLoading = true;
      try {
        await goalService.deleteGoal(id);
        this.goals = this.goals.filter(g => g.id !== id);
      } catch (err) {
        this.error = 'Failed to delete goal.';
      } finally {
        this.isLoading = false;
      }
    },

    async updateProgress(goalId, newProgress) {
      const goal = this.goals.find(g => g.id === goalId);
      if (!goal) return;

      const progress = Math.min(newProgress, goal.target);
      const status = progress >= goal.target ? 'completed' : 'active';
      
      await this.editGoal(goalId, { progress, status });
    },

    async checkGoalProgress(goal) {
      const userStore = useUserStore();
      if (!userStore.user) return;

      this.isLoading = true;
      this.error = null;
      let newProgress = goal.progress;
      const wasCompleted = goal.status === 'completed';

      try {
        // tracking do progresso em relação a oubir tracks de x artista já está automatizado
        if (goal.type === 'listen_tracks' && goal.meta.artistName) {
          const artistInfo = await externalAPIs.getArtistInfo(userStore.user.lastfm_username, goal.meta.artistName);
          newProgress = parseInt(artistInfo.userplaycount || 0, 10);
        } else if (goal.type === 'earn_badges') {
          // checka as crowns previamente fetched do user
          const user = await userService.loginUser({ email: userStore.user.email, password: userStore.user.password });
          userStore.login(user);
          newProgress = user.crowns.length;
        } else {
          // é preciso automatizar depois ao usar a library.getartists da API do LastFM
          console.log("This goal type requires manual progress updates.");
          this.isLoading = false;
          return;
        }

        const progress = Math.min(newProgress, goal.target);
        const status = progress >= goal.target ? 'completed' : 'active';
        
        await this.editGoal(goal.id, { ...goal, progress, status });

        // adiciona XP se o goal foi completado agora
        if (status === 'completed' && !wasCompleted) {
          const xpResult = await userStore.addGoalXP(goal.xp);
          console.log(`Goal completed! Earned ${goal.xp} XP!`, xpResult);
        }

      } catch (err) {
        this.error = `Failed to check progress: ${err.message}`;
      } finally {
        this.isLoading = false;
      }
    }
  }
});