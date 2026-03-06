import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanInterval } from "@/data/services";

interface PlanState {
  selectedServices: string[];
  planInterval: PlanInterval;

  toggleService: (id: string) => void;
  setServices: (ids: string[]) => void;
  setPlanInterval: (interval: PlanInterval) => void;
  clearServices: () => void;
  reset: () => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      selectedServices: [],
      planInterval: "monthly",

      toggleService: (id) =>
        set((state) => ({
          selectedServices: state.selectedServices.includes(id)
            ? state.selectedServices.filter((s) => s !== id)
            : [...state.selectedServices, id],
        })),
      setServices: (ids) => set({ selectedServices: ids }),
      setPlanInterval: (interval) => set({ planInterval: interval }),
      clearServices: () => set({ selectedServices: [] }),
      reset: () => set({ selectedServices: [], planInterval: "monthly" }),
    }),
    { name: "mhp-plan" }
  )
);
