import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // Auth modal states
  showLogin: false,
  showSignup: false,

  // Actions
  handleShowLogin: () => set((state) => {
    if (state.showLogin) {
      return { showLogin: false }
    }
    return { showLogin: true }
  }),

  handleShowSignup: () => set((state) => {
    if (state.showSignup) {
      return { showSignup: false }
    }
    return { showSignup: true }
  }),

  // Reset both modals
  resetModals: () => set({ showLogin: false, showSignup: false })
}))

export default useAuthStore
