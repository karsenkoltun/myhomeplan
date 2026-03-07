"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Check, Upload, Shield, Award, ShieldCheck, BadgeCheck, Wrench, HardHat } from "lucide-react";
import { usePropertyStore, type LicenseType } from "@/stores/property-store";
import { SERVICES, SERVICE_CATEGORIES, type ServiceCategory } from "@/data/services";
import { cn } from "@/lib/utils";

const licenseOptions: { value: LicenseType; label: string; icon: React.ElementType }[] = [
  { value: "wcb", label: "WCB Coverage", icon: Shield },
  { value: "licensed", label: "Licensed", icon: BadgeCheck },
  { value: "bonded", label: "Bonded", icon: ShieldCheck },
  { value: "insured", label: "Insured", icon: Shield },
  { value: "red-seal", label: "Red Seal", icon: Award },
  { value: "trade-ticket", label: "Trade Ticket", icon: Wrench },
];

export function StepContractorServices() {
  const { contractor, setContractor } = usePropertyStore();

  const toggleService = (serviceId: string) => {
    const current = contractor.servicesOffered;
    if (current.includes(serviceId)) {
      setContractor({
        servicesOffered: current.filter((s) => s !== serviceId),
        experienceYears: Object.fromEntries(
          Object.entries(contractor.experienceYears).filter(([k]) => k !== serviceId)
        ),
      });
    } else {
      setContractor({
        servicesOffered: [...current, serviceId],
        experienceYears: { ...contractor.experienceYears, [serviceId]: 1 },
      });
    }
  };

  const toggleLicense = (license: LicenseType) => {
    const current = contractor.licenses;
    if (current.includes(license)) {
      setContractor({ licenses: current.filter((l) => l !== license) });
    } else {
      setContractor({ licenses: [...current, license] });
    }
  };

  const setExperienceYears = (serviceId: string, years: number) => {
    setContractor({
      experienceYears: { ...contractor.experienceYears, [serviceId]: Math.max(0, years) },
    });
  };

  const categories = Object.keys(SERVICE_CATEGORIES) as ServiceCategory[];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
          <HardHat className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Services & Qualifications</h2>
        <p className="mt-2 text-center text-muted-foreground">Select the services you offer and share your credentials.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Service Selection */}
        {categories.map((category) => {
          const categoryServices = SERVICES.filter((s) => s.category === category);
          const info = SERVICE_CATEGORIES[category];
          const selectedCount = categoryServices.filter((s) => contractor.servicesOffered.includes(s.id)).length;

          return (
            <Card key={category}>
              <CardContent className="p-5 sm:p-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">{info.label}</h3>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </div>
                  {selectedCount > 0 && (
                    <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-600">
                      {selectedCount} selected
                    </span>
                  )}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categoryServices.map((service) => {
                    const isSelected = contractor.servicesOffered.includes(service.id);
                    return (
                      <div key={service.id}>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleService(service.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                            isSelected
                              ? "border-sky-500 bg-sky-500/[0.04] shadow-sm"
                              : "border-border/50 hover:border-sky-500/30 hover:bg-muted/50"
                          )}
                        >
                          <motion.div
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                              isSelected ? "border-sky-500 bg-sky-500" : "border-muted-foreground/30"
                            )}
                            animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </motion.div>
                          <span className="text-sm font-medium">{service.name}</span>
                        </motion.button>

                        {/* Experience years input for selected services */}
                        {isSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1 ml-8"
                          >
                            <div className="flex items-center gap-2 py-1">
                              <Input
                                type="number"
                                value={contractor.experienceYears[service.id] || 1}
                                onChange={(e) => setExperienceYears(service.id, Number(e.target.value))}
                                min={0}
                                max={50}
                                className="h-8 w-20 text-center text-sm"
                              />
                              <span className="text-xs text-muted-foreground">years experience</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Licenses & Certifications */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-3 block text-sm font-semibold">Licenses & Certifications</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {licenseOptions.map((lic) => {
                const isSelected = contractor.licenses.includes(lic.value);
                const Icon = lic.icon;
                return (
                  <motion.button
                    key={lic.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleLicense(lic.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all",
                      isSelected
                        ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-400"
                        : "border-border/50 text-muted-foreground hover:border-sky-500/30 hover:bg-muted/50"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-medium">{lic.label}</span>
                    {isSelected && <Check className="ml-auto h-3.5 w-3.5 shrink-0" />}
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Rate Range */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-3 block text-sm font-semibold">Hourly Rate Range</Label>
            <p className="mb-3 text-xs text-muted-foreground">What is your typical hourly rate range?</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Minimum ($/hr)</Label>
                <Input
                  type="number"
                  value={contractor.hourlyRateMin || ""}
                  onChange={(e) => setContractor({ hourlyRateMin: Number(e.target.value) })}
                  placeholder="e.g. 45"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum ($/hr)</Label>
                <Input
                  type="number"
                  value={contractor.hourlyRateMax || ""}
                  onChange={(e) => setContractor({ hourlyRateMax: Number(e.target.value) })}
                  placeholder="e.g. 85"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
