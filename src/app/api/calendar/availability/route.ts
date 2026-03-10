import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBusyTimes, refreshAccessToken } from "@/lib/google-calendar";

interface TimeSlot {
  start: string; // HH:mm
  end: string; // HH:mm
  available: boolean;
}

// Default business hours when no specific availability is set
const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 17;
const SLOT_DURATION_MINUTES = 60;

/**
 * GET /api/calendar/availability?contractorId=xxx&date=2026-03-15
 *
 * Returns available time slots for a contractor on a given date.
 * Merges static availability (available_days + available_hours) with
 * real-time Google Calendar busy times when the contractor has connected
 * their calendar.
 */
export async function GET(req: NextRequest) {
  try {
    const contractorId = req.nextUrl.searchParams.get("contractorId");
    const date = req.nextUrl.searchParams.get("date"); // YYYY-MM-DD

    if (!contractorId || !date) {
      return NextResponse.json(
        { error: "Missing required query params: contractorId, date" },
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ---- Get contractor profile ----
    const { data: contractor, error: contractorError } = await supabase
      .from("contractor_profiles")
      .select("available_days, available_hours, service_area")
      .eq("id", contractorId)
      .single();

    if (contractorError || !contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 }
      );
    }

    // ---- Check if the requested day is in contractor's available days ----
    const requestedDate = new Date(`${date}T12:00:00`);
    const dayOfWeek = requestedDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "America/Vancouver",
    });

    const availableDays = (contractor.available_days as string[] | null) ?? [];
    if (availableDays.length > 0 && !availableDays.includes(dayOfWeek)) {
      return NextResponse.json({
        date,
        dayOfWeek,
        available: false,
        reason: "Contractor does not work on this day",
        slots: [],
      });
    }

    // ---- Build base time slots from static availability ----
    const availableHours = (contractor.available_hours as {
      start?: string;
      end?: string;
    } | null) ?? {};

    const startHour = availableHours.start
      ? parseInt(availableHours.start.split(":")[0], 10)
      : DEFAULT_START_HOUR;
    const endHour = availableHours.end
      ? parseInt(availableHours.end.split(":")[0], 10)
      : DEFAULT_END_HOUR;

    // Generate hourly slots
    const slots: TimeSlot[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const startMin = `${hour.toString().padStart(2, "0")}:00`;
      const endMin = `${(hour + 1).toString().padStart(2, "0")}:00`;
      slots.push({ start: startMin, end: endMin, available: true });
    }

    // ---- Check Google Calendar if connected ----
    const serviceArea = (contractor.service_area as Record<string, unknown>) ?? {};
    const calendarTokens = serviceArea._calendar_tokens as {
      refresh_token?: string;
      access_token?: string;
      expires_at?: number;
    } | undefined;

    let calendarConnected = false;
    let busyTimes: { start: string; end: string }[] = [];

    if (calendarTokens?.refresh_token) {
      calendarConnected = true;

      try {
        // Refresh the access token
        let accessToken = calendarTokens.access_token || "";
        const expiresAt = calendarTokens.expires_at || 0;

        if (Date.now() >= expiresAt - 60000) {
          // Token expired or about to expire, refresh it
          const refreshed = await refreshAccessToken(calendarTokens.refresh_token);
          accessToken = refreshed.access_token;

          // Update stored tokens
          await supabase
            .from("contractor_profiles")
            .update({
              service_area: {
                ...serviceArea,
                _calendar_tokens: {
                  ...calendarTokens,
                  access_token: accessToken,
                  expires_at: Date.now() + refreshed.expires_in * 1000,
                },
              },
            })
            .eq("id", contractorId);
        }

        // Fetch busy times for the requested date
        const timeMin = `${date}T00:00:00-08:00`;
        const timeMax = `${date}T23:59:59-08:00`;
        busyTimes = await getBusyTimes(accessToken, timeMin, timeMax);

        // Mark overlapping slots as unavailable
        for (const slot of slots) {
          const slotStart = new Date(`${date}T${slot.start}:00-08:00`).getTime();
          const slotEnd = new Date(`${date}T${slot.end}:00-08:00`).getTime();

          for (const busy of busyTimes) {
            const busyStart = new Date(busy.start).getTime();
            const busyEnd = new Date(busy.end).getTime();

            // Check for overlap
            if (slotStart < busyEnd && slotEnd > busyStart) {
              slot.available = false;
              break;
            }
          }
        }
      } catch (calendarError) {
        // If calendar check fails, log but don't block - fall back to static availability
        console.error("Google Calendar check failed:", calendarError);
        calendarConnected = false;
      }
    }

    return NextResponse.json({
      date,
      dayOfWeek,
      available: true,
      calendarConnected,
      slotDurationMinutes: SLOT_DURATION_MINUTES,
      slots,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
