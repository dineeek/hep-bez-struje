import { IOutage } from '../models';
import { isUserStreet } from './street-match';

export interface IDayOutage {
  outage: IOutage;
  isUserStreet: boolean;
}

export interface IOutageDay {
  date: string;
  outages: IDayOutage[];
}

export function groupOutagesByDay(
  outages: IOutage[],
  dates: string[],
  userStreet: string
): IOutageDay[] {
  return dates.map(date => {
    const dayOutages = outages
      .filter(outage => outage.date === date)
      .map(outage => ({
        outage,
        isUserStreet: isUserStreet(outage.street, userStreet)
      }));

    return {
      date,
      outages: [
        ...dayOutages.filter(dayOutage => dayOutage.isUserStreet),
        ...dayOutages.filter(dayOutage => !dayOutage.isUserStreet)
      ]
    };
  });
}
