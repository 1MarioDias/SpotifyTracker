import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoggedIn: false,
    user: null
  }),
  
  getters: {
    getUser: (state) => state.user,
    getLoginStatus: (state) => state.isLoggedIn
  },
  
  actions: {
    login(userData) {
      this.isLoggedIn = true
      this.user = userData
    },
    
    logout() {
      this.isLoggedIn = false
      this.user = null
    }
  }
})
