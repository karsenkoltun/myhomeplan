import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HomeType = "detached" | "townhouse" | "duplex" | "condo" | "other";
export type HeatingType = "furnace" | "heat-pump" | "baseboard" | "boiler" | "other";

export interface PropertyProfile {
  // Basics
  address: string;
  homeSqft: number;
  lotSqft: number;
  yearBuilt: number;
  homeType: HomeType;

  // Details
  bedrooms: number;
  bathrooms: number;
  floors: number;
  heatingType: HeatingType;
  hasAC: boolean;
  hasGarage: boolean;
  hasDriveway: boolean;
  hasDeck: boolean;
  hasFence: boolean;
  hasPets: boolean;
}

export interface StrataProfile {
  corporationName: string;
  address: string;
  units: number;
  buildings: number;
  commonAreaSqft: number;
  parkadeSqft: number;
  parkingSpaces: number;
  stories: number;
  elevators: number;
}

export interface ContractorProfile {
  businessName: string;
  yearsExperience: number;
  serviceTypes: string[];
  licenseNumber: string;
  hasInsurance: boolean;
  hasWorksafe: boolean;
  serviceArea: string;
}

export interface ServiceSpecs {
  [serviceId: string]: Record<string, string | number | boolean>;
}

interface PropertyState {
  property: PropertyProfile;
  strata: StrataProfile;
  contractor: ContractorProfile;
  serviceSpecs: ServiceSpecs;

  setProperty: (data: Partial<PropertyProfile>) => void;
  setStrata: (data: Partial<StrataProfile>) => void;
  setContractor: (data: Partial<ContractorProfile>) => void;
  setServiceSpec: (serviceId: string, field: string, value: string | number | boolean) => void;
  reset: () => void;
}

const defaultProperty: PropertyProfile = {
  address: "",
  homeSqft: 1500,
  lotSqft: 5000,
  yearBuilt: 2000,
  homeType: "detached",
  bedrooms: 3,
  bathrooms: 2,
  floors: 2,
  heatingType: "furnace",
  hasAC: false,
  hasGarage: true,
  hasDriveway: true,
  hasDeck: false,
  hasFence: false,
  hasPets: false,
};

const defaultStrata: StrataProfile = {
  corporationName: "",
  address: "",
  units: 20,
  buildings: 1,
  commonAreaSqft: 2000,
  parkadeSqft: 5000,
  parkingSpaces: 30,
  stories: 3,
  elevators: 1,
};

const defaultContractor: ContractorProfile = {
  businessName: "",
  yearsExperience: 3,
  serviceTypes: [],
  licenseNumber: "",
  hasInsurance: false,
  hasWorksafe: false,
  serviceArea: "",
};

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set) => ({
      property: defaultProperty,
      strata: defaultStrata,
      contractor: defaultContractor,
      serviceSpecs: {},

      setProperty: (data) =>
        set((state) => ({ property: { ...state.property, ...data } })),
      setStrata: (data) =>
        set((state) => ({ strata: { ...state.strata, ...data } })),
      setContractor: (data) =>
        set((state) => ({ contractor: { ...state.contractor, ...data } })),
      setServiceSpec: (serviceId, field, value) =>
        set((state) => ({
          serviceSpecs: {
            ...state.serviceSpecs,
            [serviceId]: {
              ...(state.serviceSpecs[serviceId] || {}),
              [field]: value,
            },
          },
        })),
      reset: () =>
        set({
          property: defaultProperty,
          strata: defaultStrata,
          contractor: defaultContractor,
          serviceSpecs: {},
        }),
    }),
    { name: "mhp-property" }
  )
);
