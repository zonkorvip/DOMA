import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProgress {
  levelId: number;
  highestScore: number;
  status: 'locked' | 'unlocked' | 'completed';
  attemptsCount: number;
}

interface UserState {
  user: { id: string, fullName: string, email: string } | null;
  progress: Record<number, UserProgress>;
  isAuthenticated: boolean;
  login: (email: string, fullName: string) => void;
  logout: () => void;
  updateProgress: (levelId: number, score: number, passed: boolean) => void;
  unlockLevel: (levelId: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      progress: {
        1: { levelId: 1, highestScore: 0, status: 'unlocked', attemptsCount: 0 }
      },
      login: (email, fullName) => set({ 
        user: { id: 'user-1', email, fullName }, 
        isAuthenticated: true 
      }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProgress: (levelId, score, passed) => set((state) => {
        const current = state.progress[levelId] || { levelId, highestScore: 0, status: 'unlocked', attemptsCount: 0 };
        const newProgress = {
          ...current,
          highestScore: Math.max(current.highestScore, score),
          status: passed ? 'completed' : current.status,
          attemptsCount: current.attemptsCount + 1
        };
        
        const nextProgress = { ...state.progress, [levelId]: newProgress };
        
        // Unlock next level if passed
        if (passed && levelId < 10) { // assuming 10 levels
          const nextId = levelId + 1;
          if (!nextProgress[nextId] || nextProgress[nextId].status === 'locked') {
            nextProgress[nextId] = { levelId: nextId, highestScore: 0, status: 'unlocked', attemptsCount: 0 };
          }
        }
        
        return { progress: nextProgress };
      }),
      unlockLevel: (levelId) => set((state) => ({
        progress: {
          ...state.progress,
          [levelId]: { ...state.progress[levelId], status: 'unlocked' }
        }
      }))
    }),
    {
      name: 'zr-doma-user',
    }
  )
);
