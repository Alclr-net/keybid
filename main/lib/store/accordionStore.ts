import { create } from "zustand";

export interface AccordionStore {
  activeItems: string[];
  initValue: (val: string | string[]) => void;
  toggleItem: (item: string, collapsible?: boolean) => void;
  isOpen: (item: string) => boolean;
}

export const useAccordionStore = create<AccordionStore>((set, get) => ({
  activeItems: [],
  initValue: (val) => {
    const list = Array.isArray(val) ? val : val ? [val] : [];
    if (get().activeItems.length === 0 && list.length > 0) {
      set({ activeItems: list });
    }
  },
  toggleItem: (item, collapsible = true) => {
    const { activeItems } = get();
    if (activeItems.includes(item)) {
      set({ activeItems: collapsible ? activeItems.filter((i) => i !== item) : activeItems });
    } else {
      set({ activeItems: [item] });
    }
  },
  isOpen: (item) => get().activeItems.includes(item),
}));

export default useAccordionStore;
