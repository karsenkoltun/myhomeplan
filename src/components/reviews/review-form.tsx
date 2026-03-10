"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./star-rating";
import { springs, easings } from "@/lib/animations";
import { toast } from "sonner";

interface ReviewFormProps {
  bookingId: string;
  contractorProfileId: string;
  onSubmit?: () => void;
}

const CATEGORIES = [
  { key: "punctuality_rating", label: "Punctuality", description: "Arrived on time" },
  { key: "quality_rating", label: "Quality", description: "Work quality" },
  { key: "communication_rating", label: "Communication", description: "Clear and responsive" },
  { key: "value_rating", label: "Value", description: "Worth the price" },
] as const;

export function ReviewForm({
  bookingId,
  contractorProfileId,
  onSubmit,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({
    punctuality_rating: 0,
    quality_rating: 0,
    communication_rating: 0,
    value_rating: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateCategory(key: string, val: number) {
    setCategoryRatings((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select an overall rating");
      return;
    }

    setError(null);

    // Default unset category ratings to the overall rating
    const finalCategories = Object.fromEntries(
      Object.entries(categoryRatings).map(([k, v]) => [k, v === 0 ? rating : v])
    );

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: bookingId,
          contractor_profile_id: contractorProfileId,
          rating,
          comment: comment.trim() || undefined,
          ...finalCategories,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit review");
      }

      setSuccess(true);
      toast.success("Review submitted!");
      onSubmit?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit review";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={springs.bouncy}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </motion.div>
          <h3 className="text-lg font-semibold">Thank you for your review!</h3>
          <p className="text-sm text-muted-foreground">
            Your feedback helps other homeowners and improves service quality.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate your experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Overall Rating</label>
          <div className="flex items-center gap-3">
            <StarRating rating={rating} onRate={setRating} size="lg" />
            <AnimatePresence mode="wait">
              {rating > 0 && (
                <motion.span
                  key={rating}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, ease: easings.smooth }}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {rating === 1
                    ? "Poor"
                    : rating === 2
                      ? "Fair"
                      : rating === 3
                        ? "Good"
                        : rating === 4
                          ? "Great"
                          : "Excellent"}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Category Ratings */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Rate by Category</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + i * 0.06,
                  duration: 0.4,
                  ease: easings.smooth,
                }}
                className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </div>
                <StarRating
                  rating={categoryRatings[cat.key]}
                  onRate={(val) => updateCategory(cat.key, val)}
                  size="sm"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label htmlFor="review-comment" className="text-sm font-medium">
            Comment (optional)
          </label>
          <Textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about your experience..."
            rows={4}
          />
        </div>

        {/* Error State */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
          className="w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
