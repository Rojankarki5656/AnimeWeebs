import { create } from "zustand";

const useTopTenStore = create((set) => ({
  topTen: {},
  setTopTen: (action) => set({ topTen: action }),
}));

export default useTopTenStore;
