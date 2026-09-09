import { create } from 'zustand';
import type { Key } from "@/types/database"

export interface KeysStore {
  keys: Key[];
  isLoading: boolean;
  setKeys: (keys: Key[]) => void;
  setLoading: (isLoading: boolean) => void;
  updateKey: (keyId: string, updates: Partial<Key>) => void;
  incrementClickCount: (keyId: string) => void;
}

export const useKeysStore = create<KeysStore>((set) => ({
  keys: [],
  isLoading: false,

  setKeys: (keys) => set({ keys }),

  setLoading: (isLoading) => set({ isLoading }),

  updateKey: (keyId, updates) =>
    set((state) => {
      const idx = state.keys.findIndex((k) => k.id === keyId);
      if (idx !== -1) {
        const next = [...state.keys];
        next[idx] = { ...next[idx], ...updates };
        return { keys: next };
      }
      if ('id' in updates && updates.id) {
        return { keys: [updates as Key, ...state.keys] };
      }
      return state;
    }),

  incrementClickCount: (keyId) =>
    set((state) => ({
      keys: state.keys.map((k) =>
        k.id === keyId ? { ...k, click_count: (k.click_count ?? 0) + 1 } : k
      ),
    })),
}));

export default useKeysStore;
