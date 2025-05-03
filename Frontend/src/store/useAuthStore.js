import {create} from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: !!user }),
  logout: () => set({ user: null, isLoggedIn: false }),

  updateLoginStatus: (status) => set({ isLoggedIn: status }),
}));
