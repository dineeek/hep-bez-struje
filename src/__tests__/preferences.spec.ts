import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadUserPreferences, saveUserPreferences } from '../utils/preferences';
import { stubChrome } from './fakes/chrome';

describe('preferences', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should load empty preferences on a new install', async () => {
    stubChrome();

    expect(await loadUserPreferences()).toEqual({
      distributionArea: '',
      powerStation: '',
      street: '',
      futureSearch: false,
      notify: false
    });
  });

  it('should load preferences saved by version 2.0.0', async () => {
    stubChrome({
      sync: {
        hep_distribution_area: 'zagreb',
        hep_power_station: 'ZG',
        hep_user_street: 'Vukovarska',
        hep_future_search: true
      }
    });

    expect(await loadUserPreferences()).toEqual({
      distributionArea: 'zagreb',
      powerStation: 'ZG',
      street: 'Vukovarska',
      futureSearch: true,
      notify: false
    });
  });

  it('should load what it saved', async () => {
    const preferences = {
      distributionArea: 'vinkovci',
      powerStation: '179',
      street: 'Ilica, Savska',
      futureSearch: true,
      notify: true
    };
    stubChrome();
    await saveUserPreferences(preferences);

    expect(await loadUserPreferences()).toEqual(preferences);
  });
});
