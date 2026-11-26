import { DISTRIBUTION_AREAS, IPowerStation } from '../meta';

export function getPowerStations(distributionArea: string): IPowerStation[] {
  return (
    DISTRIBUTION_AREAS.find(area => area.value === distributionArea)
      ?.powerStations ?? []
  );
}

export function getDistributionAreaName(distributionArea: string): string {
  return (
    DISTRIBUTION_AREAS.find(area => area.value === distributionArea)?.name ?? ''
  );
}

export function getPowerStationName(
  distributionArea: string,
  powerStation: string
): string {
  return (
    getPowerStations(distributionArea).find(
      station => station.value === powerStation
    )?.name ?? ''
  );
}

export function getStationLabel(
  distributionArea: string,
  powerStation: string
): string {
  const names = [
    getDistributionAreaName(distributionArea),
    getPowerStationName(distributionArea, powerStation)
  ];

  return [...new Set(names)].filter(Boolean).join(' · ');
}
