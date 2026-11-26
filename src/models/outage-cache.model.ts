import { IOutage } from './outage.model';

export interface IOutageCache {
  distributionArea: string;
  powerStation: string;
  futureSearch: boolean;
  today: string;
  fetchedAt: number;
  outages: IOutage[];
}
