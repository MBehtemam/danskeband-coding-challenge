import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

/**
 * Format a date string to relative time (e.g., "2 days ago", "5 minutes ago")
 */
export function formatRelativeTime(dateString: string): string {
  return dayjs(dateString).fromNow();
}

/**
 * Format a date string to a localized datetime format
 */
export function formatDateTime(dateString: string): string {
  return dayjs(dateString).format('MMM D, YYYY h:mm A');
}

/**
 * Format a date string to a short date format
 */
export function formatDate(dateString: string): string {
  return dayjs(dateString).format('MMM D, YYYY');
}

export { dayjs };
