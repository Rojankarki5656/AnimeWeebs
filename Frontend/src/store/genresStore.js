import { create } from "zustand";

const useGenresStore = create((set) => ({
  genres: [],
  setGenres: (action) => set({ genres: action }),
}));

export default useGenresStore;
