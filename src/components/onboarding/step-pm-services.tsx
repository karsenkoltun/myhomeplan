"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, ClipboardList } from "lucide-react";
import { usePropertyStore, type PMManagedProperty } from "@/stores/property-store";
import { SERVICES, SERVICE_CATEGORIES, type ServiceCategory } from "@/data/services";
import { cn } from "@/lib/utils";

export function StepPMServices() {
  const { pm, setPM } = usePropertyStore();

  const toggleServiceForProperty = (propertyId: string, serviceId: string) => {
    setPM({
      properties: pm.properties.map((p) => {
        if (p.id !== propertyId) return p;
        const current = p.selectedServices;
        if (current.includes(serviceId)) {
          return { ...p, selectedServices: current.filter((s) => s !== serviceId) };
        }
        return { ...p, selectedServices: [...current, serviceId] };
      }),
    });
  };

  const toggleServiceForAll = (serviceId: string) => {
    const allHaveIt = pm.properties.every((p) => p.selectedServices.includes(serviceId));
    setPM({
      properties: pm.properties.map((p) => ({
        ...p,
        selectedServices: allHaveIt
          ? p.selectedServices.filter((s) => s !== serviceId)
          : p.selectedServices.includes(serviceId)
            ? p.selectedServices
            : [...p.selectedServices, serviceId],
      })),
    });
  };

  const categories = Object.keys(SERVICE_CATEGORIES) as ServiceCategory[];

  if (pm.properties.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold">Select Services</h2>
        <p className="mt-4 text-muted-foreground">Please add properties first before selecting services.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <ClipboardList className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Select Services</h2>
        <p className="mt-2 text-center text-muted-foreground">Choose services for each property or apply across your entire portfolio.</p>
      </div>

      <div className="mt-8 space-y-6">
        {categories.map((category) => {
          const categoryServices = SERVICES.filter((s) => s.category === category);
          const info = SERVICE_CATEGORIES[category];

          return (
            <Card key={category}>
              <CardContent className="p-5 sm:p-6">
                <h3 className="text-sm font-semibold mb-1">{info.label}</h3>
                <p className="text-xs text-muted-foreground mb-4">{info.description}</p>

                <div className="space-y-2">
                  {categoryServices.map((service) => {
                    const propertiesWithService = pm.properties.filter((p) => p.selectedServices.includes(service.id)).length;
                    const allSelected = propertiesWithService === pm.properties.length;

                    return (
                      <div key={service.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleServiceForAll(service.id)}
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                                allSelected ? "border-violet-500 bg-violet-500" : "border-muted-foreground/30"
                              )}
                            >
                              {allSelected && <Check className="h-3 w-3 text-white" />}
                            </motion.button>
                            <div>
                              <span className="text-sm font-medium">{service.name}</span>
                              {propertiesWithService > 0 && !allSelected && (
                                <Badge variant="secondary" className="ml-2 text-[10px]">
                                  {propertiesWithService}/{pm.properties.length}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">${service.basePrice}/event</span>
                        </div>

                        {/* Per-property toggles (shown when service is partially selected) */}
                        {pm.properties.length > 1 && propertiesWithService > 0 && !allSelected && (
                          <div className="mt-2 ml-8 flex flex-wrap gap-1.5">
                            {pm.properties.map((prop) => {
                              const hasService = prop.selectedServices.includes(service.id);
                              return (
                                <button
                                  key={prop.id}
                                  onClick={() => toggleServiceForProperty(prop.id, service.id)}
                                  className={cn(
                                    "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                                    hasService
                                      ? "bg-violet-500/10 text-violet-700 dark:text-violet-400"
                                      : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {prop.propertyName || prop.address || `Property ${pm.properties.indexOf(prop) + 1}`}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
