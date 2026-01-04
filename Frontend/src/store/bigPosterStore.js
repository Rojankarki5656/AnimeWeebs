import { create } from 'zustand'

const useBigPosterStore = create((set) => ({
  isBigPosterActive: false, // Initial state
  bigPoster: '',
  setPoster: (action) => set({ bigPoster: action }),
  toggleBigPoster: () => set((state) => ({ isBigPosterActive: !state.isBigPosterActive })), // Toggle function
}))

export default useBigPosterStore
