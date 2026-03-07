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
export type WaterHeaterType = "tank" | "tankless" | "heat-pump";

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

  // HVAC / Systems (new)
  hvacBrand: string;
  hvacAge: number;
  waterHeaterType: WaterHeaterType;
  waterHeaterAge: number;
  furnaceFilterSize: string;

  // Property Access (new)
  accessInstructions: string;
  gateCodeExists: boolean;
  lockboxExists: boolean;
  alarmSystem: string;
  petDetails: string;
  parkingInstructions: string;
  preferredServiceDay: string;
  chemicalSensitivities: string;
  specialInstructions: string;

  // Insurance (new)
  homeInsuranceProvider: string;
}

export type StrataContactRole = "property-manager" | "council-president" | "council-member" | "owner" | "other";
export type StrataBuildingType = "townhouse" | "low-rise" | "mid-rise" | "high-rise" | "mixed";
export type StrataAmenity = "pool" | "gym" | "party-room" | "garden" | "playground" | "parking-garage" | "elevator" | "rooftop";
export type StrataCoveredArea = "hallways" | "lobbies" | "parking" | "grounds" | "exterior" | "roof" | "amenity-rooms" | "elevators-stairwells";
export type StrataPainPoint = "reliability" | "cost" | "quality" | "scheduling" | "communication" | "emergency";

export interface StrataCouncilContact {
  name: string;
  role: StrataContactRole;
  email: string;
  phone: string;
  canApprove: boolean;
}

export interface StrataCurrentProvider {
  category: string;
  companyName: string;
  contractEndDate: string;
  satisfaction: number; // 1-5
  notes: string;
}

export interface StrataProfile {
  // Corporation Info
  corporationName: string;
  strataPlanNumber: string;
  managementCompany: string;
  contactName: string;
  contactRole: StrataContactRole;
  contactEmail: string;
  contactPhone: string;

  // Multi-contact (new)
  councilContacts: StrataCouncilContact[];

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

  // Building details (new)
  elevatorCount: number;
  elevatorServiceProvider: string;
  parkingType: string;
  parkingStallCount: number;
  visitorParkingCount: number;
  roofAge: number;
  roofWarrantyExpiry: string;
  fireSystemType: string;
  lastFireInspection: string;

  // Operations (new)
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceCoverageAmount: number;
  insuranceExpiry: string;
  reserveFundBalance: number;
  annualReserveContribution: number;
  depreciationReportDate: string;
  depreciationReportItems: string[];
  relevantBylaws: string;
  accessType: string;
  accessDetails: string;
  agmMonth: number;
  utilityMetering: string;

  // Current providers (new)
  currentProviders: StrataCurrentProvider[];
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

  // Personal Info (new)
  personalAddress: string;
  personalCity: string;
  personalProvince: string;
  personalPostalCode: string;
  dateOfBirth: string;
  sinLast4: string;
  driversLicenseProvince: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  preferredContact: string;

  // Insurance (new)
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceCoverageAmount: number;
  insuranceExpiry: string;
  wcbAccountNumber: string;
  wcbCoverageStart: string;
  wcbCoverageEnd: string;
  isBonded: boolean;

  // Business registration (new)
  businessNumber: string;
  gstNumber: string;

  // Services & Qualifications
  servicesOffered: string[];
  licenses: LicenseType[];
  experienceYears: Record<string, number>;
  equipmentInventory: Record<string, string[]>;
  hourlyRateMin: number;
  hourlyRateMax: number;

  // Service Area (expanded)
  maxTravelDistance: number;
  seasonalAvailability: Record<string, boolean>;

  // Availability
  availableDays: AvailableDay[];
  availableHours: AvailableHour[];
  jobsPerWeek: number;
  hasOwnEquipment: boolean;
  vehicleType: VehicleType;

  // References
  references: ContractorReference[];
  whyJoin: string;
  portfolioDescription: string;

  // Agreements (expanded)
  agreeBackgroundCheck: boolean;
  agreeQualityStandards: boolean;
  agreeTerms: boolean;
  agreedToCriminalCheck: boolean;
  agreedToDrugTest: boolean;
  agreePrivacy: boolean;
  agreeIndependentContractor: boolean;
}

// Property Management types (all new)
export interface PMContact {
  name: string;
  email: string;
  phone: string;
  role: string;
  isPrimary: boolean;
  canApproveReports: boolean;
  canApproveInvoices: boolean;
  receivesNotifications: boolean;
}

export interface PMManagedProperty {
  id: string;
  propertyName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  propertyType: string;
  unitCount: number;
  totalSqft: number;
  yearBuilt: number;
  accessInstructions: string;
  accessType: string;
  selectedServices: string[];
  notes: string;
}

export interface PMProfile {
  // Company info
  companyName: string;
  companyType: string;
  yearsInBusiness: number;
  employeeCount: number;
  website: string;
  businessNumber: string;
  gstNumber: string;

  // Insurance
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceCoverageAmount: number;
  insuranceExpiry: string;
  eoInsuranceProvider: string;
  eoInsurancePolicyNumber: string;
  eoInsuranceCoverageAmount: number;
  eoInsuranceExpiry: string;

  // Contacts
  contacts: PMContact[];

  // Portfolio
  totalProperties: number;
  totalUnits: number;
  annualMaintenanceSpend: number;

  // Properties
  properties: PMManagedProperty[];

  // Billing
  billingPreference: string;
  paymentTerms: string;
  reportingFrequency: string;
  escalationProtocol: string;
}

export interface ServiceSpecs {
  [serviceId: string]: Record<string, string | number | boolean>;
}

interface PropertyState {
  property: PropertyProfile;
  strata: StrataProfile;
  contractor: ContractorProfile;
  pm: PMProfile;
  serviceSpecs: ServiceSpecs;

  setProperty: (data: Partial<PropertyProfile>) => void;
  setStrata: (data: Partial<StrataProfile>) => void;
  setContractor: (data: Partial<ContractorProfile>) => void;
  setPM: (data: Partial<PMProfile>) => void;
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

  // HVAC / Systems
  hvacBrand: "",
  hvacAge: 0,
  waterHeaterType: "tank",
  waterHeaterAge: 0,
  furnaceFilterSize: "",

  // Property Access
  accessInstructions: "",
  gateCodeExists: false,
  lockboxExists: false,
  alarmSystem: "",
  petDetails: "",
  parkingInstructions: "",
  preferredServiceDay: "",
  chemicalSensitivities: "",
  specialInstructions: "",

  // Insurance
  homeInsuranceProvider: "",
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
  councilContacts: [],

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

  // Building details
  elevatorCount: 0,
  elevatorServiceProvider: "",
  parkingType: "surface",
  parkingStallCount: 0,
  visitorParkingCount: 0,
  roofAge: 0,
  roofWarrantyExpiry: "",
  fireSystemType: "alarm",
  lastFireInspection: "",

  // Operations
  insuranceProvider: "",
  insurancePolicyNumber: "",
  insuranceCoverageAmount: 0,
  insuranceExpiry: "",
  reserveFundBalance: 0,
  annualReserveContribution: 0,
  depreciationReportDate: "",
  depreciationReportItems: [],
  relevantBylaws: "",
  accessType: "key",
  accessDetails: "",
  agmMonth: 1,
  utilityMetering: "shared",

  // Current providers
  currentProviders: [],
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

  // Personal Info
  personalAddress: "",
  personalCity: "",
  personalProvince: "",
  personalPostalCode: "",
  dateOfBirth: "",
  sinLast4: "",
  driversLicenseProvince: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  preferredContact: "email",

  // Insurance
  insuranceProvider: "",
  insurancePolicyNumber: "",
  insuranceCoverageAmount: 0,
  insuranceExpiry: "",
  wcbAccountNumber: "",
  wcbCoverageStart: "",
  wcbCoverageEnd: "",
  isBonded: false,

  // Business registration
  businessNumber: "",
  gstNumber: "",

  // Services & Qualifications
  servicesOffered: [],
  licenses: [],
  experienceYears: {},
  equipmentInventory: {},
  hourlyRateMin: 0,
  hourlyRateMax: 0,

  // Service Area
  maxTravelDistance: 50,
  seasonalAvailability: {
    jan: true, feb: true, mar: true, apr: true, may: true, jun: true,
    jul: true, aug: true, sep: true, oct: true, nov: true, dec: true,
  },

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
  portfolioDescription: "",

  // Agreements
  agreeBackgroundCheck: false,
  agreeQualityStandards: false,
  agreeTerms: false,
  agreedToCriminalCheck: false,
  agreedToDrugTest: false,
  agreePrivacy: false,
  agreeIndependentContractor: false,
};

const defaultPM: PMProfile = {
  companyName: "",
  companyType: "residential",
  yearsInBusiness: 0,
  employeeCount: 1,
  website: "",
  businessNumber: "",
  gstNumber: "",

  insuranceProvider: "",
  insurancePolicyNumber: "",
  insuranceCoverageAmount: 0,
  insuranceExpiry: "",
  eoInsuranceProvider: "",
  eoInsurancePolicyNumber: "",
  eoInsuranceCoverageAmount: 0,
  eoInsuranceExpiry: "",

  contacts: [
    { name: "", email: "", phone: "", role: "manager", isPrimary: true, canApproveReports: true, canApproveInvoices: true, receivesNotifications: true },
  ],

  totalProperties: 0,
  totalUnits: 0,
  annualMaintenanceSpend: 0,

  properties: [],

  billingPreference: "centralized",
  paymentTerms: "net-30",
  reportingFrequency: "monthly",
  escalationProtocol: "",
};

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set) => ({
      property: defaultProperty,
      strata: defaultStrata,
      contractor: defaultContractor,
      pm: defaultPM,
      serviceSpecs: {},

      setProperty: (data) =>
        set((state) => ({ property: { ...state.property, ...data } })),
      setStrata: (data) =>
        set((state) => ({ strata: { ...state.strata, ...data } })),
      setContractor: (data) =>
        set((state) => ({ contractor: { ...state.contractor, ...data } })),
      setPM: (data) =>
        set((state) => ({ pm: { ...state.pm, ...data } })),
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
          pm: defaultPM,
          serviceSpecs: {},
        }),
    }),
    { name: "mhp-property" }
  )
);
