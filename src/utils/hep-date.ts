const HEP_TIME_ZONE = 'Europe/Zagreb';

export function getHepToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: HEP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(now);
  const readPart = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find(part => part.type === type)?.value ?? '';

  return `${readPart('year')}-${readPart('month')}-${readPart('day')}`;
}

export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

export function toHepDateParam(date: string): string {
  const [year, month, day] = date.split('-');

  return `${day}.${month}.${year}`;
}
