import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChromeLocalStorage, IUserPreferences } from '../models';
import { refreshOutages } from '../utils/refresh-outages';
import { stubChrome } from './fakes/chrome';
import { readFixture } from './fixtures/read-fixture';

const PREFERENCES: IUserPreferences = {
  distributionArea: 'zagreb',
  powerStation: 'ZG',
  street: 'Ozaljska, Koledovčina',
  futureSearch: false,
  notify: false
};

const EARLY_MORNING = new Date('2026-11-26T06:00:00Z');
const AFTER_SESVETE_OUTAGE = new Date('2026-11-26T09:30:00Z');

describe('refreshOutages', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response(readFixture('zagreb-ZG'))
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should store the fetched outages for the Zagreb day', async () => {
    vi.setSystemTime(new Date('2026-11-26T23:30:00Z'));
    const fakeChrome = stubChrome();
    const cache = await refreshOutages(PREFERENCES);

    expect(cache.today).toBe('2026-11-27');
    expect(cache.fetchedAt).toBe(Date.now());
    expect(cache.outages).toHaveLength(4);
    expect(
      fakeChrome.storage.local.items[ChromeLocalStorage.OUTAGE_CACHE]
    ).toEqual(cache);
  });

  it('should badge the number of outages on user streets', async () => {
    vi.setSystemTime(EARLY_MORNING);
    const fakeChrome = stubChrome();
    await refreshOutages(PREFERENCES);

    expect(fakeChrome.action.setBadgeText).toHaveBeenLastCalledWith({
      text: '2'
    });
  });

  it('should drop an ended outage from the badge', async () => {
    vi.setSystemTime(AFTER_SESVETE_OUTAGE);
    const fakeChrome = stubChrome();
    await refreshOutages(PREFERENCES);

    expect(fakeChrome.action.setBadgeText).toHaveBeenLastCalledWith({
      text: '1'
    });
  });

  it('should clear the badge when no user street is affected', async () => {
    vi.setSystemTime(EARLY_MORNING);
    const fakeChrome = stubChrome();
    await refreshOutages({ ...PREFERENCES, street: 'Ilica' });

    expect(fakeChrome.action.setBadgeText).toHaveBeenLastCalledWith({
      text: ''
    });
  });

  it('should keep the old cache when the fetch fails', async () => {
    vi.setSystemTime(EARLY_MORNING);
    vi.mocked(fetch).mockImplementation(
      async () => new Response('missing', { status: 404 })
    );
    const fakeChrome = stubChrome({
      local: { [ChromeLocalStorage.OUTAGE_CACHE]: 'previous' }
    });

    await expect(refreshOutages(PREFERENCES)).rejects.toThrow('HTTP 404');
    expect(fakeChrome.storage.local.items).toEqual({
      [ChromeLocalStorage.OUTAGE_CACHE]: 'previous'
    });
    expect(fakeChrome.action.setBadgeText).not.toHaveBeenCalled();
  });
});
