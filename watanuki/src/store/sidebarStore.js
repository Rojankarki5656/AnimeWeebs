import { create } from "zustand";

const useSidebarStore = create((set) => ({
  isSidebarOpen: false, // Initial state
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })), // Toggle function
}));

export default useSidebarStore;
