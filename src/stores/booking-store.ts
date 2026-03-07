import { create } from "zustand";

interface BookingDraft {
  serviceId: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  contractorId?: string;
  price?: number;
}

interface BookingState {
  draft: BookingDraft | null;
  bookingStep: 0 | 1 | 2;

  setDraft: (draft: BookingDraft | null) => void;
  updateDraft: (updates: Partial<BookingDraft>) => void;
  setBookingStep: (step: 0 | 1 | 2) => void;
  clearDraft: () => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>()((set) => ({
  draft: null,
  bookingStep: 0,

  setDraft: (draft) => set({ draft }),
  updateDraft: (updates) =>
    set((state) => ({
      draft: state.draft ? { ...state.draft, ...updates } : null,
    })),
  setBookingStep: (step) => set({ bookingStep: step }),
  clearDraft: () => set({ draft: null, bookingStep: 0 }),
  reset: () => set({ draft: null, bookingStep: 0 }),
}));
