import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HomeType = "detached" | "townhouse" | "duplex" | "condo" | "other";
export type HeatingType = "furnace" | "heat-pump" | "baseboard" | "boiler" | "other";
export type RoofType = "asphalt" | "metal" | "tile" | "flat";
export type ExteriorMaterial = "vinyl" | "stucco" | "brick" | "wood" | "fiber-cement";
export type LandscapingComplexity = "minimal" | "moderate" | "extensive";
export type DrivewayMaterial = "concrete" | "asphalt" | "gravel" | "pavers";
export type DrivewayLength = "short" | "medium" | "long";
export type FenceType = "none" | "wood" | "vinyl" | "chain-link" | "metal";
export type FoundationType = "slab" | "crawlspace" | "basement";

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

  // Exterior & Structure
  roofType: RoofType;
  exteriorMaterial: ExteriorMaterial;
  foundation: FoundationType;
  windowCount: number;

  // Outdoor Spaces
  landscapingComplexity: LandscapingComplexity;
  matureTrees: number;
  gardenBeds: number;
  gardenBedSqft: number;
  deckPatioSqft: number;
  hasPool: boolean;
  hasIrrigation: boolean;

  // Driveway & Fencing
  drivewayMaterial: DrivewayMaterial;
  drivewayLength: DrivewayLength;
  fenceType: FenceType;
  fenceLinearFeet: number;
}

export type StrataContactRole = "property-manager" | "council-president" | "council-member" | "owner" | "other";
export type StrataBuildingType = "townhouse" | "low-rise" | "mid-rise" | "high-rise" | "mixed";
export type StrataAmenity = "pool" | "gym" | "party-room" | "garden" | "playground" | "parking-garage" | "elevator" | "rooftop";
export type StrataCoveredArea = "hallways" | "lobbies" | "parking" | "grounds" | "exterior" | "roof" | "amenity-rooms" | "elevators-stairwells";
export type StrataPainPoint = "reliability" | "cost" | "quality" | "scheduling" | "communication" | "emergency";

export interface StrataProfile {
  // Corporation Info
  corporationName: string;
  strataPlanNumber: string;
  managementCompany: string;
  contactName: string;
  contactRole: StrataContactRole;
  contactEmail: string;
  contactPhone: string;

  // Property Details
  unitCount: number;
  buildingType: StrataBuildingType;
  buildingCount: number;
  commonAreaSqft: number;
  yearBuilt: number;
  address: string;
  city: string;
  province: string;
  postalCode: string;

  // Amenities
  amenities: StrataAmenity[];

  // Coverage
  coveredAreas: StrataCoveredArea[];
  annualMaintenanceBudget: number;
  priorityAreas: string[];
  currentPainPoints: StrataPainPoint[];
}

export type BusinessType = "sole-proprietor" | "partnership" | "corporation";
export type AvailableDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type AvailableHour = "morning" | "afternoon" | "evening";
export type LicenseType = "wcb" | "licensed" | "bonded" | "insured" | "red-seal" | "trade-ticket";
export type VehicleType = "pickup-truck" | "cargo-van" | "box-truck" | "trailer" | "other";

export interface ContractorReference {
  name: string;
  phone: string;
  relationship: string;
}

export interface ContractorProfile {
  // Business Info
  businessName: string;
  ownerName: string;
  businessType: BusinessType;
  yearsInBusiness: number;
  employeeCount: number;
  serviceArea: string[];
  website: string;

  // Services & Qualifications
  servicesOffered: string[];
  licenses: LicenseType[];
  experienceYears: Record<string, number>;

  // Availability
  availableDays: AvailableDay[];
  availableHours: AvailableHour[];
  jobsPerWeek: number;
  hasOwnEquipment: boolean;
  vehicleType: VehicleType;

  // References
  references: ContractorReference[];
  whyJoin: string;
  agreeBackgroundCheck: boolean;
  agreeQualityStandards: boolean;
  agreeTerms: boolean;
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

  // Exterior & Structure
  roofType: "asphalt",
  exteriorMaterial: "vinyl",
  foundation: "slab",
  windowCount: 10,

  // Outdoor Spaces
  landscapingComplexity: "moderate",
  matureTrees: 0,
  gardenBeds: 0,
  gardenBedSqft: 0,
  deckPatioSqft: 0,
  hasPool: false,
  hasIrrigation: false,

  // Driveway & Fencing
  drivewayMaterial: "concrete",
  drivewayLength: "medium",
  fenceType: "none",
  fenceLinearFeet: 0,
};

const defaultStrata: StrataProfile = {
  // Corporation Info
  corporationName: "",
  strataPlanNumber: "",
  managementCompany: "",
  contactName: "",
  contactRole: "property-manager",
  contactEmail: "",
  contactPhone: "",

  // Property Details
  unitCount: 20,
  buildingType: "low-rise",
  buildingCount: 1,
  commonAreaSqft: 2000,
  yearBuilt: 2000,
  address: "",
  city: "",
  province: "",
  postalCode: "",

  // Amenities
  amenities: [],

  // Coverage
  coveredAreas: [],
  annualMaintenanceBudget: 0,
  priorityAreas: [],
  currentPainPoints: [],
};

const defaultContractor: ContractorProfile = {
  // Business Info
  businessName: "",
  ownerName: "",
  businessType: "sole-proprietor",
  yearsInBusiness: 3,
  employeeCount: 1,
  serviceArea: [],
  website: "",

  // Services & Qualifications
  servicesOffered: [],
  licenses: [],
  experienceYears: {},

  // Availability
  availableDays: [],
  availableHours: [],
  jobsPerWeek: 5,
  hasOwnEquipment: true,
  vehicleType: "pickup-truck",

  // References
  references: [
    { name: "", phone: "", relationship: "" },
    { name: "", phone: "", relationship: "" },
    { name: "", phone: "", relationship: "" },
  ],
  whyJoin: "",
  agreeBackgroundCheck: false,
  agreeQualityStandards: false,
  agreeTerms: false,
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
