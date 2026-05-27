import { create } from 'zustand';

interface StoreState {
  settings: any;
  setSettings: (settings: any) => void;
  admin: any;
  setAdmin: (admin: any) => void;
  logout: () => void;
}

export const useStore = create<StoreState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
  admin: null,
  setAdmin: (admin) => set({ admin }),
  logout: () => {
    localStorage.removeItem('token');
    set({ admin: null });
  },
}));
