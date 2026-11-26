import { IOutage } from '../models';
import { getHepTime, getHepToday } from './hep-date';
import { isUserStreet } from './street-match';

const TIME_RANGE = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;

export function hasOutageEnded(
  outage: IOutage,
  now: Date = new Date()
): boolean {
  const today = getHepToday(now);

  if (outage.date !== today) {
    return outage.date < today;
  }

  const range = TIME_RANGE.exec(outage.time);

  if (!range) {
    return false;
  }

  const start = `${range[1].padStart(2, '0')}:${range[2]}`;
  const end = `${range[3].padStart(2, '0')}:${range[4]}`;

  return start < end && end <= getHepTime(now);
}

export function getUserStreetOutages(
  outages: IOutage[],
  userStreet: string,
  now: Date = new Date()
): IOutage[] {
  return outages.filter(
    outage =>
      isUserStreet(outage.street, userStreet) && !hasOutageEnded(outage, now)
  );
}
