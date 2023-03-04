import { IPowerStation, DISTRIBUTION_AREAS, POWER_STATIONS } from '../meta';

export class MetaUtil {
  static getDistributionAreaPowerStations(
    distributionArea: string
  ): IPowerStation[] {
    const areaId = DISTRIBUTION_AREAS.find(
      area => area.value === distributionArea
    )?.id;

    return POWER_STATIONS.filter(
      station => station.distributionAreaId === areaId
    );
  }

  static getDistributionAreaName(distributionArea: string): string {
    return (
      DISTRIBUTION_AREAS.find(area => area.value === distributionArea)?.name ??
      ''
    );
  }

  static getPowerStationName(powerStation: string): string {
    return POWER_STATIONS.find(area => area.value === powerStation)?.name ?? '';
  }
}
