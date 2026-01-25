import { defineStore } from 'pinia';
import { calculateLevel, XP_REWARDS } from '../utils/levelSystem';
import userService from '../services/userService';

const SESSION_KEY = 'wusik_user_session';

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
    // Inicializa a sessão a partir do localStorage
    initializeSession() {
      try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (sessionData) {
          const userData = JSON.parse(sessionData);
          this.isLoggedIn = true;
          this.user = userData;
          this.xp = userData.xp || 0;
          this.level = userData.level || 0;
          this.recalculateLevel();
          console.log('Session restored from localStorage');
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        this.clearSession();
      }
    },

    // Salva a sessão no localStorage
    saveSession() {
      try {
        if (this.user) {
          const sessionData = {
            ...this.user,
            xp: this.xp,
            level: this.level
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        }
      } catch (error) {
        console.error('Error saving session:', error);
      }
    },

    // Limpa a sessão do localStorage
    clearSession() {
      localStorage.removeItem(SESSION_KEY);
      this.isLoggedIn = false;
      this.user = null;
      this.xp = 0;
      this.level = 0;
    },

    login(userData) {
      this.isLoggedIn = true;
      this.user = userData;
      this.xp = userData.xp || 0;
      this.level = userData.level || 0;
      
      this.recalculateLevel();
      this.saveSession();
    },
    
    logout() {
      this.clearSession();
    },

    async updateUserData(updatedFields) {
      if (!this.user) return;

      try {
        //backend
        await userService.updateUser(this.user.id, updatedFields);

        //local
        this.user = {
          ...this.user,
          ...updatedFields
        };

        this.saveSession();

        console.log('User data updated successfully');
        return true;
      } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
      }
    },

    async refreshUserData() {
      if (!this.user || !this.user.id) return;

      try {
        const freshUserData = await userService.getUserById(this.user.id);
        this.user = freshUserData;
        this.xp = freshUserData.xp || 0;
        this.level = freshUserData.level || 0;
        this.saveSession();
        console.log('User data refreshed from backend');
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
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
      this.saveSession();

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
        this.saveSession();
      } catch (error) {
        console.error('Failed to persist user XP/level:', error);
      }
    }
  }
});