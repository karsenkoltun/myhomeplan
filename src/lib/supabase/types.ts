export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Simplified types - we only need Row types for reads and basic insert/update support.
// The Supabase client infers the rest from the schema at runtime.
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_type: "homeowner" | "contractor" | "strata" | "property-manager";
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth: string | null;
          street: string;
          unit: string;
          city: string;
          province: string;
          postal_code: string;
          mailing_address_same: boolean;
          mailing_street: string;
          mailing_unit: string;
          mailing_city: string;
          mailing_province: string;
          mailing_postal_code: string;
          preferred_contact: "email" | "phone" | "text";
          emergency_contact_name: string;
          emergency_contact_phone: string;
          how_did_you_hear: string;
          referral_code: string;
          agreed_to_terms: boolean;
          agreed_to_privacy: boolean;
          marketing_opt_in: boolean;
          onboarding_step: number;
          onboarding_complete: boolean;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; user_type: "homeowner" | "contractor" | "strata" | "property-manager" };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      homeowner_properties: {
        Row: {
          id: string;
          profile_id: string;
          address: string;
          home_sqft: number;
          lot_sqft: number;
          year_built: number;
          home_type: "detached" | "townhouse" | "duplex" | "condo" | "other";
          bedrooms: number;
          bathrooms: number;
          floors: number;
          heating_type: "furnace" | "heat-pump" | "baseboard" | "boiler" | "other";
          has_ac: boolean;
          has_garage: boolean;
          has_driveway: boolean;
          has_deck: boolean;
          has_fence: boolean;
          has_pets: boolean;
          roof_type: "asphalt" | "metal" | "tile" | "flat";
          exterior_material: "vinyl" | "stucco" | "brick" | "wood" | "fiber-cement";
          foundation: "slab" | "crawlspace" | "basement";
          window_count: number;
          landscaping_complexity: "minimal" | "moderate" | "extensive";
          mature_trees: number;
          garden_beds: number;
          garden_bed_sqft: number;
          deck_patio_sqft: number;
          has_pool: boolean;
          has_irrigation: boolean;
          driveway_material: "concrete" | "asphalt" | "gravel" | "pavers";
          driveway_length: "short" | "medium" | "long";
          fence_type: "none" | "wood" | "vinyl" | "chain-link" | "metal";
          fence_linear_feet: number;
          // New columns
          access_instructions: string;
          gate_code_exists: boolean;
          lockbox_exists: boolean;
          alarm_system: string;
          pet_details: string;
          parking_instructions: string;
          hvac_brand: string;
          hvac_age: number;
          water_heater_type: string;
          water_heater_age: number;
          furnace_filter_size: string;
          preferred_service_day: string;
          chemical_sensitivities: string;
          special_instructions: string;
          home_insurance_provider: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["homeowner_properties"]["Row"]> & { profile_id: string };
        Update: Partial<Database["public"]["Tables"]["homeowner_properties"]["Row"]>;
      };
      strata_properties: {
        Row: {
          id: string;
          profile_id: string;
          corporation_name: string;
          strata_plan_number: string;
          management_company: string;
          contact_name: string;
          contact_role: string;
          contact_email: string;
          contact_phone: string;
          unit_count: number;
          building_type: string;
          building_count: number;
          common_area_sqft: number;
          year_built: number;
          address: string;
          city: string;
          province: string;
          postal_code: string;
          amenities: Json;
          covered_areas: Json;
          annual_maintenance_budget: number;
          priority_areas: Json;
          current_pain_points: Json;
          // New columns
          council_contacts: Json;
          insurance_provider: string;
          insurance_policy_number: string;
          insurance_coverage_amount: number;
          insurance_expiry: string | null;
          reserve_fund_balance: number;
          annual_reserve_contribution: number;
          depreciation_report_date: string | null;
          depreciation_report_items: Json;
          relevant_bylaws: string;
          access_type: string;
          access_details: string;
          elevator_count: number;
          elevator_service_provider: string;
          parking_type: string;
          parking_stall_count: number;
          visitor_parking_count: number;
          roof_age: number;
          roof_warranty_expiry: string | null;
          fire_system_type: string;
          last_fire_inspection: string | null;
          current_providers: Json;
          current_contract_end_dates: Json;
          agm_month: number;
          utility_metering: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["strata_properties"]["Row"]> & { profile_id: string };
        Update: Partial<Database["public"]["Tables"]["strata_properties"]["Row"]>;
      };
      contractor_profiles: {
        Row: {
          id: string;
          profile_id: string;
          business_name: string;
          owner_name: string;
          business_type: string;
          years_in_business: number;
          employee_count: number;
          service_area: Json;
          website: string;
          services_offered: Json;
          licenses: Json;
          experience_years: Json;
          available_days: Json;
          available_hours: Json;
          jobs_per_week: number;
          has_own_equipment: boolean;
          vehicle_type: string;
          vetting_status: string;
          rating: number;
          total_jobs: number;
          why_join: string;
          agree_background_check: boolean;
          agree_quality_standards: boolean;
          agree_terms: boolean;
          // New columns
          personal_address: string;
          personal_city: string;
          personal_province: string;
          personal_postal_code: string;
          date_of_birth: string | null;
          sin_last4: string;
          drivers_license_province: string;
          insurance_provider: string;
          insurance_policy_number: string;
          insurance_coverage_amount: number;
          insurance_expiry: string | null;
          wcb_account_number: string;
          wcb_coverage_start: string | null;
          wcb_coverage_end: string | null;
          business_number: string;
          gst_number: string;
          bank_institution: string;
          bank_transit: string;
          bank_account_last4: string;
          stripe_connect_id: string;
          emergency_contact_name: string;
          emergency_contact_phone: string;
          preferred_contact: string;
          equipment_inventory: Json;
          hourly_rate_min: number;
          hourly_rate_max: number;
          seasonal_availability: Json;
          portfolio_description: string;
          agreed_to_criminal_check: boolean;
          agreed_to_drug_test: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contractor_profiles"]["Row"]> & { profile_id: string };
        Update: Partial<Database["public"]["Tables"]["contractor_profiles"]["Row"]>;
      };
      contractor_references: {
        Row: {
          id: string;
          contractor_profile_id: string;
          name: string;
          phone: string;
          relationship: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contractor_references"]["Row"]> & { contractor_profile_id: string };
        Update: Partial<Database["public"]["Tables"]["contractor_references"]["Row"]>;
      };
      // PM tables
      pm_companies: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          company_type: string;
          years_in_business: number;
          employee_count: number;
          website: string;
          business_number: string;
          gst_number: string;
          insurance_provider: string;
          insurance_policy_number: string;
          insurance_coverage_amount: number;
          insurance_expiry: string | null;
          eo_insurance_provider: string;
          eo_insurance_policy_number: string;
          eo_insurance_coverage_amount: number;
          eo_insurance_expiry: string | null;
          total_properties: number;
          total_units: number;
          annual_maintenance_spend: number;
          billing_preference: string;
          payment_terms: string;
          reporting_frequency: string;
          escalation_protocol: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pm_companies"]["Row"]> & { profile_id: string };
        Update: Partial<Database["public"]["Tables"]["pm_companies"]["Row"]>;
      };
      pm_company_contacts: {
        Row: {
          id: string;
          pm_company_id: string;
          name: string;
          email: string;
          phone: string;
          role: string;
          is_primary: boolean;
          can_approve_reports: boolean;
          can_approve_invoices: boolean;
          receives_notifications: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pm_company_contacts"]["Row"]> & { pm_company_id: string };
        Update: Partial<Database["public"]["Tables"]["pm_company_contacts"]["Row"]>;
      };
      pm_managed_properties: {
        Row: {
          id: string;
          pm_company_id: string;
          property_name: string;
          address: string;
          city: string;
          province: string;
          postal_code: string;
          property_type: string;
          unit_count: number;
          total_sqft: number;
          year_built: number;
          access_instructions: string;
          access_type: string;
          selected_services: Json;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pm_managed_properties"]["Row"]> & { pm_company_id: string };
        Update: Partial<Database["public"]["Tables"]["pm_managed_properties"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: "outdoor" | "indoor" | "maintenance" | "specialty";
          icon: string;
          base_price: number;
          default_frequency: string;
          frequency_label: string;
          seasonal: string | null;
          popular: boolean;
          includes: Json;
          what_to_expect: string;
          why_it_matters: string;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]> & { id: string; name: string; description: string; category: "outdoor" | "indoor" | "maintenance" | "specialty"; base_price: number; default_frequency: string };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      strata_services: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          base_per_unit: number;
          base_per_sqft: number;
          frequency: string;
          includes: Json;
          what_to_expect: string;
          why_it_matters: string;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["strata_services"]["Row"]> & { id: string; name: string; description: string; base_per_unit: number };
        Update: Partial<Database["public"]["Tables"]["strata_services"]["Row"]>;
      };
      service_frequency_options: {
        Row: {
          id: string;
          service_id: string;
          frequency: string;
          label: string;
          annual_events: number;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["service_frequency_options"]["Row"]> & { service_id: string; frequency: string; label: string; annual_events: number };
        Update: Partial<Database["public"]["Tables"]["service_frequency_options"]["Row"]>;
      };
      service_spec_definitions: {
        Row: {
          id: string;
          service_id: string;
          field_id: string;
          label: string;
          field_type: "number" | "select" | "boolean" | "range";
          unit: string | null;
          min_val: number | null;
          max_val: number | null;
          step_val: number | null;
          default_value: string;
          options: Json | null;
          pricing_impact: string | null;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["service_spec_definitions"]["Row"]> & { service_id: string; field_id: string; label: string; field_type: "number" | "select" | "boolean" | "range"; default_value: string };
        Update: Partial<Database["public"]["Tables"]["service_spec_definitions"]["Row"]>;
      };
      plan_tiers: {
        Row: {
          id: string;
          name: string;
          tagline: string;
          description: string;
          starting_price: number;
          service_ids: Json;
          features: Json;
          highlighted: boolean;
          best_for: string;
          sort_order: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["plan_tiers"]["Row"]> & { id: string; name: string; starting_price: number };
        Update: Partial<Database["public"]["Tables"]["plan_tiers"]["Row"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          property_id: string | null;
          strata_property_id: string | null;
          plan_tier_id: string | null;
          plan_interval: "monthly" | "quarterly" | "annual";
          status: "active" | "paused" | "cancelled" | "past_due" | "trialing";
          monthly_total: number;
          discount_pct: number;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & { profile_id: string };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
      };
      subscription_services: {
        Row: {
          id: string;
          subscription_id: string;
          service_id: string;
          frequency: string;
          specs: Json;
          calculated_monthly_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscription_services"]["Row"]> & { subscription_id: string; service_id: string; frequency: string };
        Update: Partial<Database["public"]["Tables"]["subscription_services"]["Row"]>;
      };
      service_bookings: {
        Row: {
          id: string;
          property_id: string;
          service_id: string;
          contractor_profile_id: string | null;
          subscription_id: string | null;
          status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
          scheduled_date: string;
          scheduled_time: string;
          completed_at: string | null;
          notes: string;
          price: number;
          contractor_payout: number | null;
          payment_status: "pending" | "succeeded" | "failed" | "refunded";
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["service_bookings"]["Row"]> & { property_id: string; service_id: string; scheduled_date: string; scheduled_time: string };
        Update: Partial<Database["public"]["Tables"]["service_bookings"]["Row"]>;
      };
      contractor_service_rates: {
        Row: {
          id: string;
          contractor_profile_id: string;
          service_id: string;
          individual_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["contractor_service_rates"]["Row"]> & { contractor_profile_id: string; service_id: string; individual_rate: number };
        Update: Partial<Database["public"]["Tables"]["contractor_service_rates"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          body: string;
          type: string;
          read: boolean;
          data: Json | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & { profile_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
      service_credits: {
        Row: {
          id: string;
          subscription_id: string;
          service_id: string;
          total_credits: number;
          used_credits: number;
          purchased_at: string;
          expires_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["service_credits"]["Row"]> & { subscription_id: string; service_id: string; total_credits: number };
        Update: Partial<Database["public"]["Tables"]["service_credits"]["Row"]>;
      };
      stripe_webhook_events: {
        Row: {
          id: string;
          type: string;
          processed_at: string;
          data: Json | null;
        };
        Insert: Partial<Database["public"]["Tables"]["stripe_webhook_events"]["Row"]> & { id: string; type: string };
        Update: Partial<Database["public"]["Tables"]["stripe_webhook_events"]["Row"]>;
      };
      pricing_multipliers: {
        Row: {
          id: string;
          multiplier_type: "property_size" | "lot_size";
          label: string;
          min_sqft: number;
          max_sqft: number;
          multiplier: number;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["pricing_multipliers"]["Row"]> & { multiplier_type: "property_size" | "lot_size"; label: string; min_sqft: number; max_sqft: number; multiplier: number };
        Update: Partial<Database["public"]["Tables"]["pricing_multipliers"]["Row"]>;
      };
      plan_discount_config: {
        Row: {
          interval: "monthly" | "quarterly" | "annual";
          label: string;
          discount: number;
          description: string;
        };
        Insert: Database["public"]["Tables"]["plan_discount_config"]["Row"];
        Update: Partial<Database["public"]["Tables"]["plan_discount_config"]["Row"]>;
      };
      frequency_multiplier_config: {
        Row: {
          frequency: string;
          annual_events: number;
          description: string;
        };
        Insert: Database["public"]["Tables"]["frequency_multiplier_config"]["Row"];
        Update: Partial<Database["public"]["Tables"]["frequency_multiplier_config"]["Row"]>;
      };
      platform_config: {
        Row: {
          key: string;
          value: Json;
          description: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["platform_config"]["Row"]> & { key: string; value: Json };
        Update: Partial<Database["public"]["Tables"]["platform_config"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_type: "homeowner" | "contractor" | "strata" | "property-manager";
      preferred_contact: "email" | "phone" | "text";
      home_type: "detached" | "townhouse" | "duplex" | "condo" | "other";
      heating_type: "furnace" | "heat-pump" | "baseboard" | "boiler" | "other";
      roof_type: "asphalt" | "metal" | "tile" | "flat";
      exterior_material: "vinyl" | "stucco" | "brick" | "wood" | "fiber-cement";
      landscaping_complexity: "minimal" | "moderate" | "extensive";
      driveway_material: "concrete" | "asphalt" | "gravel" | "pavers";
      driveway_length: "short" | "medium" | "long";
      fence_type: "none" | "wood" | "vinyl" | "chain-link" | "metal";
      foundation_type: "slab" | "crawlspace" | "basement";
      service_category: "outdoor" | "indoor" | "maintenance" | "specialty";
      service_frequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "biannual" | "annual" | "seasonal" | "as-needed";
      plan_interval: "monthly" | "quarterly" | "annual";
      subscription_status: "active" | "paused" | "cancelled" | "past_due" | "trialing";
      booking_status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";
      payment_status: "pending" | "succeeded" | "failed" | "refunded";
      payout_status: "pending" | "processing" | "paid" | "failed";
      vetting_status: "pending" | "approved" | "rejected" | "suspended";
    };
  };
};
