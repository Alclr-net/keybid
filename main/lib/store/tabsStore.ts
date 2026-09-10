import { create } from "zustand";

export interface TabsStore {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useTabsStore = create<TabsStore>((set) => ({
  activeTab: "",
  setActiveTab: (activeTab) => set({ activeTab }),
}));

export default useTabsStore;
