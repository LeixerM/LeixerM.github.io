const monthYear = new Intl.DateTimeFormat('es-CO', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Formats a date as a short Spanish month and year, e.g. "Nov 2025". */
export function formatMonthYear(date: Date): string {
  return capitalize(monthYear.format(date).replace('.', '').replace(' de ', ' '));
}

/** Formats a position period; a `null` end date means the position is current. */
export function formatPeriod(start: Date, end: Date | null): string {
  return `${formatMonthYear(start)} – ${end ? formatMonthYear(end) : 'Presente'}`;
}

/** Whole years elapsed since `start`, measured at build time. */
export function yearsSince(start: Date, now: Date = new Date()): number {
  const months =
    (now.getUTCFullYear() - start.getUTCFullYear()) * 12 + (now.getUTCMonth() - start.getUTCMonth());
  return Math.floor(months / 12);
}

/** Builds a `tel:` URI from a human-formatted phone number. */
export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
