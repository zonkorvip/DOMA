import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  soundEnabled: boolean;
  reducedMotion: boolean;
  language: 'ar' | 'en';
  setSettings: (settings: Partial<Omit<SettingsState, 'setSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      soundEnabled: true,
      reducedMotion: false,
      language: 'ar',
      setSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'zr-doma-settings',
    }
  )
);
