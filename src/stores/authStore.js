import { defineStore } from 'pinia'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { getUserProfile } from '../services/userService'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, profile: null, ready: false }),
  actions: {
    async hydrate(firebaseUser) {
      this.user = firebaseUser
      this.profile = firebaseUser ? await getUserProfile(firebaseUser.uid) : null
    },
    init() {
      return new Promise(resolve => {
        const stop = onAuthStateChanged(auth, async user => {
          await this.hydrate(user)
          this.ready = true
          resolve(user)
          stop()
        })
      })
    },
    async logout() {
      await signOut(auth)
      this.user = null
      this.profile = null
    }
  }
})
