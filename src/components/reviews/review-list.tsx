"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./star-rating";
import { easings } from "@/lib/animations";

interface ReviewData {
  id: string;
  created_at: string;
  rating: number;
  comment: string | null;
  punctuality_rating: number;
  quality_rating: number;
  communication_rating: number;
  value_rating: number;
  profiles?: { first_name: string; last_name: string } | null;
}

interface ReviewSummary {
  averageRating: number;
  averagePunctuality: number;
  averageQuality: number;
  averageCommunication: number;
  averageValue: number;
  totalReviews: number;
}

interface ReviewListProps {
  contractorProfileId: string;
}

function CategoryBar({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: number;
  delay?: number;
}) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: easings.smooth }}
          className="absolute inset-y-0 left-0 rounded-full bg-amber-400"
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-medium">{value.toFixed(1)}</span>
    </div>
  );
}

function ReviewListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Summary skeleton */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="space-y-2 text-center">
              <div className="mx-auto h-8 w-12 animate-pulse rounded bg-muted" />
              <div className="mx-auto h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="mx-auto h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex-1 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-2 flex-1 animate-pulse rounded-full bg-muted" />
                  <div className="h-3 w-8 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Review card skeletons */}
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="h-3.5 w-3.5 animate-pulse rounded bg-muted" />
                ))}
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ReviewList({ contractorProfileId }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?contractorId=${contractorProfileId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setReviews(data.reviews ?? []);
        setSummary(data.summary ?? null);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [contractorProfileId]);

  if (loading) {
    return <ReviewListSkeleton />;
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No reviews yet</p>
          <p className="text-xs text-muted-foreground/70">
            Be the first to leave a review for this contractor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rating Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{summary.averageRating.toFixed(1)}</p>
                <StarRating rating={Math.round(summary.averageRating)} size="sm" readonly />
                <p className="mt-1 text-xs text-muted-foreground">
                  {summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="mx-4 h-20 w-px bg-border" />
              <div className="flex-1 space-y-2">
                <CategoryBar label="Punctuality" value={summary.averagePunctuality} delay={0.1} />
                <CategoryBar label="Quality" value={summary.averageQuality} delay={0.2} />
                <CategoryBar label="Communication" value={summary.averageCommunication} delay={0.3} />
                <CategoryBar label="Value" value={summary.averageValue} delay={0.4} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Individual Reviews */}
      <div className="space-y-3">
        {reviews.map((review, i) => {
          const reviewer = review.profiles;
          const displayName = reviewer
            ? `${reviewer.first_name} ${reviewer.last_name?.charAt(0)}.`
            : "Homeowner";

          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.06,
                duration: 0.4,
                ease: easings.smooth,
              }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" readonly />
                  </div>

                  {review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  )}

                  {/* Mini category badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { label: "Punctuality", val: review.punctuality_rating },
                      { label: "Quality", val: review.quality_rating },
                      { label: "Communication", val: review.communication_rating },
                      { label: "Value", val: review.value_rating },
                    ].map((cat) => (
                      <span
                        key={cat.label}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {cat.label}
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        {cat.val}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
