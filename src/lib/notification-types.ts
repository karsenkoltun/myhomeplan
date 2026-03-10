export const NotificationType = {
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  BOOKING_REMINDER: "booking_reminder",
  JOB_STARTED: "job_started",
  JOB_COMPLETED: "job_completed",
  PAYMENT_PROCESSED: "payment_processed",
  REVIEW_RECEIVED: "review_received",
  NEW_JOB_ASSIGNED: "new_job_assigned",
  JOB_ACCEPTED: "job_accepted",
  JOB_DECLINED: "job_declined",
  PLAN_RENEWED: "plan_renewed",
  WELCOME: "welcome",
} as const;

export type NotificationTypeValue =
  (typeof NotificationType)[keyof typeof NotificationType];

/** Human-readable labels for each notification type */
export const NotificationTypeLabel: Record<NotificationTypeValue, string> = {
  [NotificationType.BOOKING_CONFIRMED]: "Booking Confirmed",
  [NotificationType.BOOKING_CANCELLED]: "Booking Cancelled",
  [NotificationType.BOOKING_REMINDER]: "Booking Reminder",
  [NotificationType.JOB_STARTED]: "Job Started",
  [NotificationType.JOB_COMPLETED]: "Job Completed",
  [NotificationType.PAYMENT_PROCESSED]: "Payment Processed",
  [NotificationType.REVIEW_RECEIVED]: "Review Received",
  [NotificationType.NEW_JOB_ASSIGNED]: "New Job Assigned",
  [NotificationType.JOB_ACCEPTED]: "Job Accepted",
  [NotificationType.JOB_DECLINED]: "Job Declined",
  [NotificationType.PLAN_RENEWED]: "Plan Renewed",
  [NotificationType.WELCOME]: "Welcome",
};

/** Icon name (lucide-react) mapping for each notification type */
export const NotificationTypeIcon: Record<NotificationTypeValue, string> = {
  [NotificationType.BOOKING_CONFIRMED]: "CalendarCheck",
  [NotificationType.BOOKING_CANCELLED]: "CalendarX",
  [NotificationType.BOOKING_REMINDER]: "Clock",
  [NotificationType.JOB_STARTED]: "Play",
  [NotificationType.JOB_COMPLETED]: "CheckCircle",
  [NotificationType.PAYMENT_PROCESSED]: "CreditCard",
  [NotificationType.REVIEW_RECEIVED]: "Star",
  [NotificationType.NEW_JOB_ASSIGNED]: "Briefcase",
  [NotificationType.JOB_ACCEPTED]: "ThumbsUp",
  [NotificationType.JOB_DECLINED]: "ThumbsDown",
  [NotificationType.PLAN_RENEWED]: "RefreshCw",
  [NotificationType.WELCOME]: "Sparkles",
};
