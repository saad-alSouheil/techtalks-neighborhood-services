import { create } from "zustand";

interface User {
  _id: string;
  userName: string;
  isProvider: boolean;
  phone?: string;
  neighborhoodID?: {
    name?: string;
    city?: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthInitialized: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthInitialized: false,

  setUser: (user) => set({ user, isAuthInitialized: true }),

  clearUser: () => set({ user: null, isAuthInitialized: true }),
}));
