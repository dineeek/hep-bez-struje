import distributionAreas from './distribution-areas.json';

export interface IPowerStation {
  value: string; // search param - el=value
  name: string;
}

export interface IDistributionArea {
  value: string; // search param - dp=value
  name: string;
  powerStations: IPowerStation[];
}

export const DISTRIBUTION_AREAS: IDistributionArea[] = distributionAreas;
