const HEP_TIME_ZONE = 'Europe/Zagreb';

function readHepClock(now: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: HEP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now);

  return Object.fromEntries(parts.map(part => [part.type, part.value]));
}

export function getHepToday(now: Date = new Date()): string {
  const clock = readHepClock(now);

  return `${clock.year}-${clock.month}-${clock.day}`;
}

export function getHepTime(now: Date = new Date()): string {
  const clock = readHepClock(now);

  return `${clock.hour}:${clock.minute}`;
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
