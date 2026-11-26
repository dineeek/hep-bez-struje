import { describe, expect, it } from 'vitest';
import { DISTRIBUTION_AREAS } from '../meta';
import {
  getDistributionAreaName,
  getPowerStationName,
  getPowerStations
} from '../utils';

describe('meta', () => {
  it('should get power stations for a distribution area', () => {
    expect(getPowerStations('vinkovci')).toEqual([
      { value: 'VI', name: 'Elektra Vinkovci' },
      { value: '180', name: 'Ilok' },
      { value: '179', name: 'Vukovar' },
      { value: '184', name: 'Županja' }
    ]);
  });

  it('should get no power stations for an unknown distribution area', () => {
    expect(getPowerStations('beograd')).toEqual([]);
  });

  it('should get distribution area name', () => {
    expect(getDistributionAreaName('sbrod')).toBe('Elektra Slavonski Brod');
    expect(getDistributionAreaName('')).toBe('');
  });

  it('should get power station name', () => {
    expect(getPowerStationName('zagreb', '115')).toBe('Samobor');
    expect(getPowerStationName('zagreb', '179')).toBe('');
  });

  it('should hold every HEP area with named, unique stations', () => {
    const stations = DISTRIBUTION_AREAS.flatMap(area => area.powerStations);
    const names = [...DISTRIBUTION_AREAS, ...stations].map(({ name }) => name);

    expect(DISTRIBUTION_AREAS).toHaveLength(21);
    expect(DISTRIBUTION_AREAS.every(area => area.powerStations.length)).toBe(
      true
    );
    expect(new Set(stations.map(station => station.value)).size).toBe(
      stations.length
    );
    expect(names.every(name => name && name === name.trim())).toBe(true);
  });
});
