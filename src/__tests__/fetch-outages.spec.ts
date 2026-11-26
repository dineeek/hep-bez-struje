import { afterEach, describe, expect, it, vi } from 'vitest';
import { IUserPreferences } from '../models';
import {
  buildOutagesUrl,
  fetchOutages,
  getSearchDates
} from '../utils/fetch-outages';
import { HttpStatusError } from '../utils/fetchWithRetry';
import { HepPageError } from '../utils/parse-outages';
import { FIXTURE_DATE, readFixture } from './fixtures/read-fixture';

const PREFERENCES: IUserPreferences = {
  distributionArea: 'zagreb',
  powerStation: 'ZG',
  street: '',
  futureSearch: false
};

const respondWith = (body: string, status = 200) =>
  vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async () => new Response(body, { status }));

describe('fetch-outages', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should build the HEP url for an area, a station and a date', () => {
    expect(buildOutagesUrl('bjelovar', 'BJ', '2023-03-01')).toBe(
      'https://www.hep.hr/ods/bez-struje/19?dp=bjelovar&el=BJ&datum=01.03.2023'
    );
  });

  it('should search only today by default', () => {
    expect(getSearchDates(false, '2026-11-29')).toEqual(['2026-11-29']);
  });

  it('should search today and three days ahead on future search', () => {
    expect(getSearchDates(true, '2026-11-29')).toEqual([
      '2026-11-29',
      '2026-11-30',
      '2026-12-01',
      '2026-12-02'
    ]);
  });

  it("should fetch today's outages", async () => {
    const fetchSpy = respondWith(readFixture('zagreb-ZG'));
    const outages = await fetchOutages(PREFERENCES, FIXTURE_DATE);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe(
      'https://www.hep.hr/ods/bez-struje/19?dp=zagreb&el=ZG&datum=26.11.2026'
    );
    expect(outages).toHaveLength(4);
    expect(outages.every(outage => outage.date === FIXTURE_DATE)).toBe(true);
  });

  it('should fetch each day of a future search in date order', async () => {
    const fetchSpy = respondWith(readFixture('pula-121'));
    const outages = await fetchOutages(
      { ...PREFERENCES, futureSearch: true },
      FIXTURE_DATE
    );

    expect(fetchSpy).toHaveBeenCalledTimes(4);
    expect(outages.map(outage => outage.date)).toEqual([
      ...Array(3).fill('2026-11-26'),
      ...Array(3).fill('2026-11-27'),
      ...Array(3).fill('2026-11-28'),
      ...Array(3).fill('2026-11-29')
    ]);
  });

  it('should reject when HEP answers with a server error', async () => {
    vi.useFakeTimers();
    respondWith('Internal Server Error', 500);
    const outcome = fetchOutages(PREFERENCES, FIXTURE_DATE).catch(
      (error: unknown) => error
    );
    await vi.runAllTimersAsync();

    expect(await outcome).toBeInstanceOf(HttpStatusError);
  });

  it('should reject when the page has no outage list', async () => {
    respondWith('<html><body><h1>Stranica u izradi</h1></body></html>');

    await expect(fetchOutages(PREFERENCES, FIXTURE_DATE)).rejects.toThrow(
      HepPageError
    );
  });
});
