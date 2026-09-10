import { create } from "zustand";
import type { Key } from "@/types/database";

export interface KeyboardStore {
  pressedKeys: Set<string>;
  lastPressedKey: string | null;
  onKeyClick?: (keySlot: string, keyData: Key | null) => void;
  keysMap: Map<string, Key>;
  isLoading: boolean;
  keysCount: number;

  setPressed: (keyCode: string) => void;
  setReleased: (keyCode: string) => void;
  setOnKeyClick: (fn?: (keySlot: string, keyData: Key | null) => void) => void;
  setKeysMap: (keysMap: Map<string, Key>) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useKeyboardStore = create<KeyboardStore>((set) => ({
  pressedKeys: new Set<string>(),
  lastPressedKey: null,
  onKeyClick: undefined,
  keysMap: new Map<string, Key>(),
  isLoading: false,
  keysCount: 0,

  setPressed: (keyCode: string) =>
    set((state) => ({
      pressedKeys: new Set(state.pressedKeys).add(keyCode),
      lastPressedKey: keyCode,
    })),

  setReleased: (keyCode: string) =>
    set((state) => {
      const next = new Set(state.pressedKeys);
      next.delete(keyCode);
      return { pressedKeys: next };
    }),

  setOnKeyClick: (onKeyClick) => set({ onKeyClick }),

  setKeysMap: (keysMap) => set({ keysMap, keysCount: keysMap.size }),

  setIsLoading: (isLoading) => set({ isLoading }),
}));

export const useKeyboardContext = useKeyboardStore;
export const useKeyboardSound = useKeyboardStore;
export default useKeyboardStore;
