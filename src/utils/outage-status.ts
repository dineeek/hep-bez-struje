import { IOutage } from '../models';
import { getHepTime, getHepToday } from './hep-date';
import { readTimeRange } from './outage-time';
import { findUserMatch } from './street-match';

export function hasOutageEnded(
  outage: IOutage,
  now: Date = new Date()
): boolean {
  const today = getHepToday(now);

  if (outage.date !== today) {
    return outage.date < today;
  }

  const range = readTimeRange(outage.time);

  return !!range && range.start < range.end && range.end <= getHepTime(now);
}

export function getUserOutages(
  outages: IOutage[],
  userStreet: string,
  now: Date = new Date()
): IOutage[] {
  return outages.filter(
    outage => findUserMatch(outage, userStreet) && !hasOutageEnded(outage, now)
  );
}
