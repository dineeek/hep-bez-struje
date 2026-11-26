const DAY_MS = 24 * 60 * 60 * 1000;

export function formatOutageDay(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatDayHeading(
  date: string,
  today: string,
  locale: string
): string {
  const daysAhead = Math.round((Date.parse(date) - Date.parse(today)) / DAY_MS);
  const day = formatOutageDay(date, locale);
  const heading =
    daysAhead === 0 || daysAhead === 1
      ? `${new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(daysAhead, 'day')} · ${day}`
      : day;

  return heading.charAt(0).toLocaleUpperCase(locale) + heading.slice(1);
}

export function formatClockTime(timestamp: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
}
