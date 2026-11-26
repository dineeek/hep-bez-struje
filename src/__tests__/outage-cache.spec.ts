import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChromeLocalStorage, IOutageCache, IUserPreferences } from '../models';
import {
  clearOutageCache,
  isOutageCacheFresh,
  loadOutageCache,
  saveOutageCache
} from '../utils/outage-cache';
import { stubChrome } from './fakes/chrome';

const PREFERENCES: IUserPreferences = {
  distributionArea: 'zagreb',
  powerStation: 'ZG',
  street: '',
  futureSearch: false,
  notify: false
};

const CACHE: IOutageCache = {
  distributionArea: 'zagreb',
  powerStation: 'ZG',
  futureSearch: false,
  today: '2026-11-26',
  fetchedAt: 1_000_000,
  outages: []
};

describe('outage-cache', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should load the cache saved for the same station and day', async () => {
    stubChrome();
    await saveOutageCache(CACHE);

    expect(await loadOutageCache(PREFERENCES, '2026-11-26')).toEqual(CACHE);
  });

  it('should not load a cache saved on an earlier day', async () => {
    stubChrome();
    await saveOutageCache(CACHE);

    expect(await loadOutageCache(PREFERENCES, '2026-11-27')).toBeUndefined();
  });

  it('should not load a cache saved for other preferences', async () => {
    stubChrome();
    await saveOutageCache(CACHE);

    expect(
      await loadOutageCache(
        { ...PREFERENCES, powerStation: '115' },
        CACHE.today
      )
    ).toBeUndefined();
    expect(
      await loadOutageCache({ ...PREFERENCES, futureSearch: true }, CACHE.today)
    ).toBeUndefined();
  });

  it('should not load a stored value that is not a cache', async () => {
    stubChrome({ local: { [ChromeLocalStorage.OUTAGE_CACHE]: 'corrupt' } });

    expect(await loadOutageCache(PREFERENCES, CACHE.today)).toBeUndefined();
  });

  it('should load nothing after the cache is cleared', async () => {
    stubChrome();
    await saveOutageCache(CACHE);
    await clearOutageCache();

    expect(await loadOutageCache(PREFERENCES, CACHE.today)).toBeUndefined();
  });

  it('should call a cache fresh for fifteen minutes', () => {
    const fifteenMinutes = 15 * 60 * 1000;

    expect(
      isOutageCacheFresh(CACHE, CACHE.fetchedAt + fifteenMinutes - 1)
    ).toBe(true);
    expect(isOutageCacheFresh(CACHE, CACHE.fetchedAt + fifteenMinutes)).toBe(
      false
    );
  });
});
