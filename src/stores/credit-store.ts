import { create } from "zustand";

interface CreditState {
  credits: { serviceId: string; total: number; used: number }[];
  loading: boolean;
  setCredits: (credits: CreditState["credits"]) => void;
  setLoading: (loading: boolean) => void;
  totalAvailable: () => number;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  credits: [],
  loading: false,
  setCredits: (credits) => set({ credits }),
  setLoading: (loading) => set({ loading }),
  totalAvailable: () =>
    get().credits.reduce((sum, c) => sum + (c.total - c.used), 0),
}));
