import { DISTRIBUTION_AREAS, POWER_STATIONS } from '../meta';
import { MetaUtil } from '../utils';

describe('Meta util', () => {
  let RANDOM_INDEX = 0;

  beforeEach(() => {
    RANDOM_INDEX = Math.floor(Math.random() * 10);
  });

  it('should get power stations for specific distribution area', () => {
    expect(
      MetaUtil.getDistributionAreaPowerStations(
        DISTRIBUTION_AREAS[RANDOM_INDEX].value
      )
    ).toEqual(
      POWER_STATIONS.filter(
        station =>
          station.distributionAreaId === DISTRIBUTION_AREAS[RANDOM_INDEX].id
      )
    );
  });

  it('should get distribution area name', () => {
    expect(
      MetaUtil.getDistributionAreaName(DISTRIBUTION_AREAS[RANDOM_INDEX].value)
    ).toBe(DISTRIBUTION_AREAS[RANDOM_INDEX].name);
  });

  it('should get power station name', () => {
    expect(
      MetaUtil.getPowerStationName(POWER_STATIONS[RANDOM_INDEX].value)
    ).toBe(POWER_STATIONS[RANDOM_INDEX].name);
  });
});
