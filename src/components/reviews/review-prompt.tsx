"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";
import { ReviewForm } from "./review-form";
import { springs, easings } from "@/lib/animations";

interface ReviewPromptProps {
  bookingId: string;
  contractorProfileId: string;
  contractorName: string;
  serviceName: string;
}

function getDismissKey(bookingId: string) {
  return `review-dismissed-${bookingId}`;
}

export function ReviewPrompt({
  bookingId,
  contractorProfileId,
  contractorName,
  serviceName,
}: ReviewPromptProps) {
  const [quickRating, setQuickRating] = useState(0);
  const [showFullForm, setShowFullForm] = useState(false);
  const [dismissed, setDismissed] = useState(true); // start hidden until we check localStorage

  useEffect(() => {
    const wasDismissed = localStorage.getItem(getDismissKey(bookingId));
    setDismissed(wasDismissed === "true");
  }, [bookingId]);

  function handleDismiss() {
    localStorage.setItem(getDismissKey(bookingId), "true");
    setDismissed(true);
  }

  function handleQuickRate(star: number) {
    setQuickRating(star);
    setTimeout(() => setShowFullForm(true), 400);
  }

  function handleReviewComplete() {
    localStorage.setItem(getDismissKey(bookingId), "true");
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <AnimatePresence mode="wait">
      {showFullForm ? (
        <motion.div
          key="full-form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: easings.smooth }}
        >
          <ReviewForm
            bookingId={bookingId}
            contractorProfileId={contractorProfileId}
            onSubmit={handleReviewComplete}
          />
        </motion.div>
      ) : (
        <motion.div
          key="prompt"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.4, ease: easings.smooth }}
        >
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={springs.bouncy}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                </div>
              </motion.div>

              <div>
                <h3 className="text-lg font-semibold">
                  How was your {serviceName} with {contractorName}?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your feedback helps other homeowners find great contractors.
                </p>
              </div>

              {/* Quick star picker */}
              <StarRating
                rating={quickRating}
                onRate={handleQuickRate}
                size="lg"
              />

              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setShowFullForm(true)}
              >
                Write a review
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
