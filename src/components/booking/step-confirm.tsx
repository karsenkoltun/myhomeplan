"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { useAuth } from "@/components/auth/auth-provider";
import {
  createBooking,
  getProperty,
  createNotification,
  getAvailableContractorsForService,
} from "@/lib/supabase/queries";
import { calculateContractorPayout } from "@/lib/pricing";
import { FadeIn } from "@/components/ui/motion";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

export function StepConfirm() {
  const router = useRouter();
  const { user } = useAuth();
  const { draft, updateDraft, setBookingStep, clearDraft } = useBookingStore();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notes, setNotes] = useState(draft?.notes || "");

  async function handleConfirm() {
    if (!user || !draft) return;
    setSubmitting(true);

    try {
      const property = await getProperty(user.id);
      if (!property) throw new Error("No property found");

      // Find an available contractor
      let contractorProfileId: string | undefined;
      try {
        const contractors = await getAvailableContractorsForService(draft.serviceId);
        if (contractors.length > 0) {
          contractorProfileId = contractors[0].id;
        }
      } catch {
        // No contractor assigned - that's ok
      }

      const customerPrice = draft.price ?? 0;
      const contractorPayout = calculateContractorPayout(customerPrice);

      const booking = await createBooking({
        property_id: property.id,
        service_id: draft.serviceId,
        scheduled_date: draft.scheduledDate,
        scheduled_time: draft.scheduledTime,
        notes,
        contractor_profile_id: contractorProfileId,
        price: customerPrice,
        contractor_payout: contractorPayout,
      });

      // Notify contractor if assigned
      if (contractorProfileId) {
        try {
          // Get the contractor's profile_id from the contractor_profiles record
          const { createClient } = await import("@/lib/supabase/client");
          const { data: cp } = await createClient()
            .from("contractor_profiles")
            .select("profile_id")
            .eq("id", contractorProfileId)
            .single();

          if (cp) {
            await createNotification({
              user_id: cp.profile_id,
              title: "New Job Assigned",
              message: `${draft.serviceName} on ${format(parseISO(draft.scheduledDate), "MMM d, yyyy")} at ${draft.scheduledTime}`,
              type: "new_job_assigned",
              metadata: { booking_id: booking.id, service_id: draft.serviceId },
            });
          }
        } catch {
          // Notification failure shouldn't block booking
        }
      }

      setSuccess(true);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <FadeIn>
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold">Booking Confirmed!</h2>
          <p className="text-sm text-muted-foreground">
            Your {draft?.serviceName} has been scheduled for{" "}
            {draft?.scheduledDate && format(parseISO(draft.scheduledDate), "EEEE, MMM d, yyyy")}{" "}
            at {draft?.scheduledTime}.
          </p>
          <Button
            onClick={() => {
              clearDraft();
              router.push("/account");
            }}
          >
            Back to Dashboard
          </Button>
        </div>
      </FadeIn>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Confirm Booking</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Review your booking details before confirming
      </p>

      <FadeIn delay={0.1}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="text-sm font-medium">{draft?.serviceName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">
                    {draft?.scheduledDate && format(parseISO(draft.scheduledDate), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium">{draft?.scheduledTime}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for the service provider..."
                className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => setBookingStep(1)}>
          Back
        </Button>
        <Button disabled={submitting} onClick={handleConfirm}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </div>
    </div>
  );
}
