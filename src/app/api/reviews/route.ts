import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      contractor_profile_id,
      booking_id,
      rating,
      comment,
      punctuality_rating,
      quality_rating,
      communication_rating,
      value_rating,
    } = body as {
      contractor_profile_id: string;
      booking_id: string;
      rating: number;
      comment?: string;
      punctuality_rating: number;
      quality_rating: number;
      communication_rating: number;
      value_rating: number;
    };

    // Validate required fields
    if (!contractor_profile_id || !booking_id || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: contractor_profile_id, booking_id, rating" },
        { status: 400 }
      );
    }

    // Validate rating ranges (1-5)
    const ratings = [rating, punctuality_rating, quality_rating, communication_rating, value_rating];
    for (const r of ratings) {
      if (r !== undefined && r !== null && (r < 1 || r > 5 || !Number.isInteger(r))) {
        return NextResponse.json(
          { error: "All ratings must be integers between 1 and 5" },
          { status: 400 }
        );
      }
    }

    // Verify the booking exists, belongs to this user, and is completed
    const { data: booking, error: bookingError } = await supabase
      .from("service_bookings")
      .select("*, homeowner_properties!service_bookings_property_id_fkey(profile_id)")
      .eq("id", booking_id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check that the booking's property belongs to this user
    const property = booking.homeowner_properties as { profile_id: string } | null;
    if (!property || property.profile_id !== user.id) {
      return NextResponse.json(
        { error: "This booking does not belong to you" },
        { status: 403 }
      );
    }

    if (booking.status !== "completed") {
      return NextResponse.json(
        { error: "You can only review completed bookings" },
        { status: 400 }
      );
    }

    // Check if already reviewed
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("booking_id", booking_id)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json(
        { error: "This booking has already been reviewed" },
        { status: 409 }
      );
    }

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        homeowner_id: user.id,
        contractor_profile_id,
        booking_id,
        rating,
        comment: comment || null,
        punctuality_rating: punctuality_rating ?? rating,
        quality_rating: quality_rating ?? rating,
        communication_rating: communication_rating ?? rating,
        value_rating: value_rating ?? rating,
      })
      .select()
      .single();

    if (reviewError) throw reviewError;

    // Recalculate contractor average rating
    const { data: allReviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("contractor_profile_id", contractor_profile_id);

    if (allReviews && allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await supabase
        .from("contractor_profiles")
        .update({ rating: Math.round(avgRating * 10) / 10 })
        .eq("id", contractor_profile_id);
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const contractorId = req.nextUrl.searchParams.get("contractorId");
    if (!contractorId) {
      return NextResponse.json(
        { error: "Missing required query param: contractorId" },
        { status: 400 }
      );
    }

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*, profiles!reviews_homeowner_id_fkey(first_name, last_name)")
      .eq("contractor_profile_id", contractorId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Compute summary stats
    const list = reviews ?? [];
    const count = list.length;

    let summary = null;
    if (count > 0) {
      const avg = (key: string) =>
        Math.round(
          (list.reduce((s, r) => s + ((r as Record<string, number>)[key] ?? 0), 0) / count) * 10
        ) / 10;

      summary = {
        averageRating: avg("rating"),
        averagePunctuality: avg("punctuality_rating"),
        averageQuality: avg("quality_rating"),
        averageCommunication: avg("communication_rating"),
        averageValue: avg("value_rating"),
        totalReviews: count,
      };
    }

    return NextResponse.json({ reviews: list, summary });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
