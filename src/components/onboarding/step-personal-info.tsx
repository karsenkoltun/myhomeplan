"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserStore } from "@/stores/user-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { User, AlertTriangle } from "lucide-react";
import { RequiredLabel, FieldError, type StepValidationRef } from "./shared";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
});

export const StepPersonalInfo = forwardRef<StepValidationRef>(function StepPersonalInfo(_props, ref) {
  const { account, setAccount } = useUserStore();
  const [firstName, setFirstName] = useState(account?.firstName || "");
  const [lastName, setLastName] = useState(account?.lastName || "");
  const [email, setEmail] = useState(account?.email || "");
  const [phone, setPhone] = useState(account?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(account?.dateOfBirth || "");
  const [preferredContact, setPreferredContact] = useState<"email" | "phone" | "text">(account?.preferredContact || "email");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);
  const [validationAlert, setValidationAlert] = useState<string | null>(null);

  const validate = useCallback(() => {
    const result = personalInfoSchema.safeParse({ firstName, lastName, email, phone });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: Record<string, string> = {};
      const missing: string[] = [];
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs.length > 0) {
          mapped[key] = msgs[0];
          const labels: Record<string, string> = { firstName: "first name", lastName: "last name", email: "email", phone: "phone number" };
          missing.push(labels[key] || key);
        }
      }
      setErrors(mapped);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setValidationAlert(`Please provide your ${missing.join(", ")}`);
      toast.error("Please fill in all required fields");
      return false;
    }

    setErrors({});
    setValidationAlert(null);
    setAccount({
      ...(account || {
        dateOfBirth: "",
        address: { street: "", unit: "", city: "", province: "", postalCode: "" },
        mailingAddressSame: true,
        emergencyContactName: "",
        emergencyContactPhone: "",
        howDidYouHear: "",
        referralCode: "",
        agreedToTerms: false,
        agreedToPrivacy: false,
        marketingOptIn: false,
      }),
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      preferredContact,
    });
    return true;
  }, [firstName, lastName, email, phone, dateOfBirth, preferredContact, account, setAccount]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        // Clear the alert when all field errors are resolved
        if (Object.keys(next).length === 0) setValidationAlert(null);
        return next;
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <User className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">About You</h2>
        <p className="mt-2 text-center text-muted-foreground">Let&apos;s start with your basic information.</p>
      </div>

      <AnimatePresence>
        {validationAlert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6"
          >
            <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
              <AlertDescription>{validationAlert}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("mt-8 space-y-6", shaking && "animate-shake")}>
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2">
              <RequiredLabel>First Name</RequiredLabel>
              <Input
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
                placeholder="John"
                className={cn("h-11", errors.firstName && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.firstName} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Last Name</RequiredLabel>
              <Input
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); clearError("lastName"); }}
                placeholder="Smith"
                className={cn("h-11", errors.lastName && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.lastName} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Email</RequiredLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                placeholder="john@example.com"
                className={cn("h-11", errors.email && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.email} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Phone</RequiredLabel>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
                placeholder="250-555-0123"
                className={cn("h-11", errors.phone && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.phone} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Date of Birth</RequiredLabel>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Preferred Contact Method</RequiredLabel>
              <Select value={preferredContact} onValueChange={(v: "email" | "phone" | "text") => setPreferredContact(v)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
