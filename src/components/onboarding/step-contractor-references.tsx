"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Users, User, Phone, Link2 } from "lucide-react";
import { usePropertyStore } from "@/stores/property-store";
import { cn } from "@/lib/utils";

const relationshipOptions = [
  { value: "client", label: "Client" },
  { value: "colleague", label: "Colleague" },
  { value: "supplier", label: "Supplier" },
  { value: "other", label: "Other" },
];

export function StepContractorReferences() {
  const { contractor, setContractor } = usePropertyStore();

  const updateReference = (index: number, field: string, value: string) => {
    const updated = [...contractor.references];
    updated[index] = { ...updated[index], [field]: value };
    setContractor({ references: updated });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
          <Users className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">References & Agreement</h2>
        <p className="mt-2 text-center text-muted-foreground">Provide references and review our standards.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* References */}
        {contractor.references.map((ref, index) => {
          const isOptional = index === 2;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={isOptional ? "border-dashed" : ""}>
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                      Reference {index + 1}
                      {isOptional && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span>
                      )}
                    </h3>
                    {!isOptional && (
                      <span className="text-xs text-red-500">Required</span>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5 text-xs">
                        <User className="h-3 w-3" /> Name
                      </Label>
                      <Input
                        value={ref.name}
                        onChange={(e) => updateReference(index, "name", e.target.value)}
                        placeholder="Full name"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5 text-xs">
                        <Phone className="h-3 w-3" /> Phone
                      </Label>
                      <Input
                        type="tel"
                        value={ref.phone}
                        onChange={(e) => updateReference(index, "phone", e.target.value)}
                        placeholder="250-555-0123"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1.5 text-xs">
                        <Link2 className="h-3 w-3" /> Relationship
                      </Label>
                      <Select
                        value={ref.relationship || undefined}
                        onValueChange={(v) => updateReference(index, "relationship", v)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {relationshipOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {/* Why Join */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-2 block text-sm font-semibold">
              Why do you want to join My Home Plan?
            </Label>
            <textarea
              value={contractor.whyJoin}
              onChange={(e) => setContractor({ whyJoin: e.target.value })}
              placeholder="Tell us about your motivation, goals, and what you bring to the table..."
              rows={4}
              className={cn(
                "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground",
                "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "dark:bg-input/30"
              )}
            />
          </CardContent>
        </Card>

        {/* Agreements */}
        <Card className="border-sky-500/20">
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold">Agreements</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreeBackgroundCheck}
                  onCheckedChange={(v) => setContractor({ agreeBackgroundCheck: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I agree to a background check</p>
                  <p className="text-xs text-muted-foreground">
                    My Home Plan conducts background checks on all contractor partners for the safety of our homeowners.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreeQualityStandards}
                  onCheckedChange={(v) => setContractor({ agreeQualityStandards: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I agree to My Home Plan quality standards</p>
                  <p className="text-xs text-muted-foreground">
                    You commit to maintaining high-quality work, timely communication, and professional conduct.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={contractor.agreeTerms}
                  onCheckedChange={(v) => setContractor({ agreeTerms: v === true })}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I agree to the Terms of Service</p>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, you agree to our{" "}
                    <span className="text-sky-600 underline">Terms of Service</span> and{" "}
                    <span className="text-sky-600 underline">Privacy Policy</span>.
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
