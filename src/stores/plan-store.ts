import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanInterval, ServiceFrequency } from "@/data/services";

interface PlanState {
  selectedServices: string[];
  planInterval: PlanInterval;
  serviceFrequencies: Record<string, ServiceFrequency>; // per-service frequency override

  toggleService: (id: string) => void;
  setServices: (ids: string[]) => void;
  setPlanInterval: (interval: PlanInterval) => void;
  setServiceFrequency: (serviceId: string, frequency: ServiceFrequency) => void;
  clearServices: () => void;
  reset: () => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      selectedServices: [],
      planInterval: "monthly",
      serviceFrequencies: {},

      toggleService: (id) =>
        set((state) => ({
          selectedServices: state.selectedServices.includes(id)
            ? state.selectedServices.filter((s) => s !== id)
            : [...state.selectedServices, id],
        })),
      setServices: (ids) => set({ selectedServices: ids }),
      setPlanInterval: (interval) => set({ planInterval: interval }),
      setServiceFrequency: (serviceId, frequency) =>
        set((state) => ({
          serviceFrequencies: {
            ...state.serviceFrequencies,
            [serviceId]: frequency,
          },
        })),
      clearServices: () => set({ selectedServices: [], serviceFrequencies: {} }),
      reset: () => set({ selectedServices: [], planInterval: "monthly", serviceFrequencies: {} }),
    }),
    { name: "mhp-plan" }
  )
);
