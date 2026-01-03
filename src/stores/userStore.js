import { defineStore } from 'pinia';
import { calculateLevel, XP_REWARDS } from '../utils/levelSystem';
import userService from '../services/userService';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    xp: 0,
    level: 0
  }),
  
  getters: {
    getUser: (state) => state.user,
    getLoginStatus: (state) => state.isLoggedIn,
    getUserXP: (state) => state.xp,
    getUserLevel: (state) => state.level
  },
  
  actions: {
    login(userData) {
      this.isLoggedIn = true;
      this.user = userData;
      this.xp = userData.xp || 0;
      this.level = userData.level || 0;
      
      this.recalculateLevel();
    },
    
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.xp = 0;
      this.level = 0;
    },

    // calcula novamente e atualiza o nível do utilizador com base no XP atual
    recalculateLevel() {
      const newLevel = calculateLevel(this.xp);
      if (newLevel !== this.level) {
        this.level = newLevel;
        this.persistUserData();
      }
    },

    // adiciona XP ao utilizador e atualiza o nível
    async addXP(amount) {
      if (typeof amount !== 'number' || amount <= 0) {
        console.warn('Invalid XP amount:', amount);
        return;
      }

      const oldLevel = this.level;
      this.xp += amount;
      this.recalculateLevel();

      // atualiza o objeto User
      if (this.user) {
        this.user.xp = this.xp;
        this.user.level = this.level;
      }

      await this.persistUserData();

      // verifica se houve subida de nível
      if (this.level > oldLevel) {
        console.log(`Level up! You are now level ${this.level}!`);
      }

      return {
        xpAdded: amount,
        newXP: this.xp,
        leveledUp: this.level > oldLevel,
        newLevel: this.level
      };
    },

    // adiciona XP por cada crown obtida
    async addCrownXP() {
      return await this.addXP(XP_REWARDS.CROWN_GAINED);
    },

    // adiciona XP por cada objetivo concluído
    async addGoalXP(goalXP) {
      const xpToAdd = goalXP || XP_REWARDS.GOAL_COMPLETED;
      return await this.addXP(xpToAdd);
    },

    async persistUserData() {
      if (!this.user || !this.user.id) return;

      try {
        await userService.updateUser(this.user.id, {
          xp: this.xp,
          level: this.level
        });
      } catch (error) {
        console.error('Failed to persist user XP/level:', error);
      }
    }
  }
});