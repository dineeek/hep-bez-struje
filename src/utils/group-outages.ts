import { IOutage } from '../models';
import { readTimeRange } from './outage-time';
import { findUserMatch, UserMatch } from './street-match';

export interface IDayOutage {
  outage: IOutage;
  userMatch: UserMatch | undefined;
}

export interface IOutageDay {
  date: string;
  outages: IDayOutage[];
}

const UNREADABLE_TIME = '99:99';

const toTimeKey = (outage: IOutage): string => {
  const range = readTimeRange(outage.time);

  return range ? `${range.start}-${range.end}` : UNREADABLE_TIME;
};

export function groupOutagesByDay(
  outages: IOutage[],
  dates: string[],
  userStreet: string
): IOutageDay[] {
  return dates.map(date => ({
    date,
    outages: outages
      .filter(outage => outage.date === date)
      .sort((earlier, later) =>
        toTimeKey(earlier).localeCompare(toTimeKey(later))
      )
      .map(outage => ({
        outage,
        userMatch: findUserMatch(outage, userStreet)
      }))
  }));
}
