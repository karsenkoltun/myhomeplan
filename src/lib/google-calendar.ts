/**
 * Google Calendar integration for contractor availability.
 *
 * Setup required:
 * 1. Create Google Cloud project
 * 2. Enable Google Calendar API
 * 3. Create OAuth 2.0 credentials
 * 4. Set env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
 *
 * This module handles:
 * - OAuth flow for connecting contractor calendars
 * - Checking busy/free times
 * - Creating service booking events
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];

/** Generate the OAuth consent URL for a contractor */
export function getAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/** Exchange authorization code for tokens */
export async function exchangeCodeForTokens(code: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error("Failed to exchange code for tokens");
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  }>;
}

/** Refresh an expired access token */
export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error("Failed to refresh access token");
  return res.json() as Promise<{
    access_token: string;
    expires_in: number;
  }>;
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
}

/** Get busy times from the contractor's primary calendar for a given date range */
export async function getBusyTimes(
  accessToken: string,
  timeMin: string,
  timeMax: string
): Promise<{ start: string; end: string }[]> {
  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/freeBusy",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        items: [{ id: "primary" }],
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to fetch busy times");
  const data = await res.json();
  return data.calendars?.primary?.busy ?? [];
}

/** Create a calendar event for a service booking */
export async function createBookingEvent(
  accessToken: string,
  event: {
    summary: string;
    description: string;
    location: string;
    startTime: string; // ISO datetime
    endTime: string; // ISO datetime
  }
): Promise<CalendarEvent> {
  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: { dateTime: event.startTime, timeZone: "America/Vancouver" },
        end: { dateTime: event.endTime, timeZone: "America/Vancouver" },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 60 },
            { method: "popup", minutes: 15 },
          ],
        },
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to create calendar event");
  const data = await res.json();
  return {
    id: data.id,
    summary: data.summary,
    start: data.start.dateTime,
    end: data.end.dateTime,
  };
}

/** Check if a contractor is available at a specific time (no conflicts with their calendar) */
export async function isContractorAvailable(
  accessToken: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const busyTimes = await getBusyTimes(accessToken, startTime, endTime);
  return busyTimes.length === 0;
}
