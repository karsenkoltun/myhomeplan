"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepValidationRef {
  validate: () => boolean;
}

export function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

export function CollapsibleSection({
  icon,
  title,
  sectionKey,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  sectionKey: string;
  open: boolean;
  onToggle: (key: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open} onOpenChange={() => onToggle(sectionKey)}>
      <Card>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-4 sm:px-6"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                {icon}
              </span>
              <span className="text-sm font-semibold">{title}</span>
            </div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  error,
  required,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      {required ? <RequiredLabel>{label}</RequiredLabel> : <Label>{label}</Label>}
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg p-1 transition-colors duration-200",
          error && "ring-2 ring-red-500"
        )}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold hover:bg-muted"
        >
          -
        </motion.button>
        <motion.span key={value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="w-10 text-center text-lg font-bold">
          {value}
        </motion.span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold hover:bg-muted"
        >
          +
        </motion.button>
      </div>
      <FieldError message={error} />
    </div>
  );
}
