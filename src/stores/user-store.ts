import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserType = "homeowner" | "contractor" | "strata" | "property-manager";

export interface AddressInfo {
  street: string;
  unit: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  address: AddressInfo;
  mailingAddressSame: boolean;
  mailingAddress?: AddressInfo;
  preferredContact: "email" | "phone" | "text";
  emergencyContactName: string;
  emergencyContactPhone: string;
  howDidYouHear: string;
  referralCode: string;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
  marketingOptIn: boolean;
}

interface UserState {
  userType: UserType | null;
  onboardingStep: number;
  onboardingComplete: boolean;
  account: AccountInfo | null;

  setUserType: (type: UserType) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  setAccount: (info: AccountInfo) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userType: null,
      onboardingStep: 0,
      onboardingComplete: false,
      account: null,

      setUserType: (type) => set({ userType: type }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      setAccount: (info) => set({ account: info }),
      reset: () =>
        set({
          userType: null,
          onboardingStep: 0,
          onboardingComplete: false,
          account: null,
        }),
    }),
    { name: "mhp-user" }
  )
);
