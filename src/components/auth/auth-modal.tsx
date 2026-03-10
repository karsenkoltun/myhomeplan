"use client";

import { useCallback } from "react";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ open, onOpenChange, defaultMode = "login" }: AuthModalProps) {
  const handleSuccess = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />

        {/* Dialog Content */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2",
            "max-h-[90dvh] overflow-y-auto",
            "rounded-2xl bg-background p-4 sm:p-6",
            "outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]"
          )}
        >
          {/* Hidden title for accessibility */}
          <Dialog.Title className="sr-only">Sign in to My Home Plan</Dialog.Title>
          <Dialog.Description className="sr-only">
            Sign in or create an account to manage your home services
          </Dialog.Description>

          {/* Close Button */}
          <Dialog.Close
            className={cn(
              "absolute right-4 top-4 z-10",
              "flex h-8 w-8 items-center justify-center rounded-full",
              "bg-muted/60 text-muted-foreground backdrop-blur-sm",
              "transition-all hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {/* Auth Form (embedded mode - no full-screen wrapper) */}
          <div className="flex items-center justify-center">
            <AuthForm mode={defaultMode} embedded onSuccess={handleSuccess} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
