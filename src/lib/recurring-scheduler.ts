/**
 * Recurring Scheduler Utilities
 *
 * Pure utility functions for auto-scheduling recurring home maintenance services
 * based on subscription frequency and seasonal windows.
 */

type Frequency =
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "biannual"
  | "annual"
  | "seasonal"
  | "as-needed";

/**
 * Calculate the next service date based on the last completed date and frequency.
 * Returns an ISO date string (YYYY-MM-DD).
 */
export function getNextServiceDate(lastDate: string, frequency: string): string {
  const date = new Date(lastDate + "T12:00:00"); // Noon to avoid timezone edge cases

  switch (frequency as Frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "biweekly":
      date.setDate(date.getDate() + 14);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "biannual":
      date.setMonth(date.getMonth() + 6);
      break;
    case "annual":
      date.setFullYear(date.getFullYear() + 1);
      break;
    case "seasonal":
      // Default to monthly during season
      date.setMonth(date.getMonth() + 1);
      break;
    case "as-needed":
      // No automatic scheduling - return same date (caller should check)
      break;
    default:
      // Unknown frequency, default to monthly
      date.setMonth(date.getMonth() + 1);
      break;
  }

  return date.toISOString().split("T")[0];
}

/**
 * Generate an array of future service dates for N occurrences.
 * Useful for showing upcoming scheduled dates on a calendar.
 */
export function generateRecurringSchedule(
  startDate: string,
  frequency: string,
  count: number
): string[] {
  if (count <= 0) return [];
  if (frequency === "as-needed") return [];

  const dates: string[] = [];
  let currentDate = startDate;

  for (let i = 0; i < count; i++) {
    if (i === 0) {
      dates.push(currentDate);
    } else {
      currentDate = getNextServiceDate(currentDate, frequency);
      dates.push(currentDate);
    }
  }

  return dates;
}

/**
 * Returns true if enough time has elapsed since the last completed service
 * for the next one to be due. Compares against today's date.
 */
export function isServiceDue(lastCompletedDate: string, frequency: string): boolean {
  if (frequency === "as-needed") return false;

  const nextDue = getNextServiceDate(lastCompletedDate, frequency);
  const today = new Date().toISOString().split("T")[0];

  // Service is due if the next date is today or in the past
  return nextDue <= today;
}

/**
 * Seasonal window definitions for service types.
 * Returns the months (1-12) when a seasonal service should run,
 * or null for non-seasonal services.
 *
 * Pass the service ID (from the services table) to look up the window.
 * Known seasonal services are mapped by common naming conventions.
 */
export function getSeasonalWindow(
  serviceId: string
): { start: number; end: number } | null {
  // Normalize the ID for matching (service IDs are typically kebab-case slugs)
  const id = serviceId.toLowerCase();

  // Lawn and yard services: April through October
  if (
    id.includes("lawn") ||
    id.includes("mowing") ||
    id.includes("grass") ||
    id.includes("yard-maintenance") ||
    id.includes("fertiliz") ||
    id.includes("aerat")
  ) {
    return { start: 4, end: 10 };
  }

  // Snow removal: November through March
  if (
    id.includes("snow") ||
    id.includes("ice") ||
    id.includes("salt") ||
    id.includes("de-ice") ||
    id.includes("winter-maintenance")
  ) {
    return { start: 11, end: 3 };
  }

  // Spring cleanup: March through May
  if (id.includes("spring-clean") || id.includes("spring_clean")) {
    return { start: 3, end: 5 };
  }

  // Fall cleanup: September through November
  if (
    id.includes("fall-clean") ||
    id.includes("fall_clean") ||
    id.includes("leaf-removal") ||
    id.includes("leaf_removal") ||
    id.includes("gutter-clean") ||
    id.includes("gutter_clean")
  ) {
    return { start: 9, end: 11 };
  }

  // Not a seasonal service
  return null;
}

/**
 * Check whether the current month falls within a seasonal window.
 * Handles wrap-around windows (e.g., Nov-Mar where start > end).
 */
export function isInSeasonalWindow(window: { start: number; end: number }): boolean {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  if (window.start <= window.end) {
    // Normal range (e.g., Apr-Oct = 4-10)
    return currentMonth >= window.start && currentMonth <= window.end;
  } else {
    // Wrap-around range (e.g., Nov-Mar = 11-3)
    return currentMonth >= window.start || currentMonth <= window.end;
  }
}

/**
 * Get the number of days between occurrences for a frequency.
 * Used for rough calculations and comparisons.
 */
export function getFrequencyDays(frequency: string): number {
  switch (frequency as Frequency) {
    case "weekly":
      return 7;
    case "biweekly":
      return 14;
    case "monthly":
      return 30;
    case "quarterly":
      return 90;
    case "biannual":
      return 182;
    case "annual":
      return 365;
    case "seasonal":
      return 30;
    default:
      return 30;
  }
}
