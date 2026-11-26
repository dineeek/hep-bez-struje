import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IUserPreferences } from '../models';
import {
  markUserStreetOutagesSeen,
  notifyUserStreetOutages,
  readOutageDate,
  toOutageId
} from '../utils/outage-notifications';
import { parseOutages } from '../utils/parse-outages';
import { stubChrome } from './fakes/chrome';
import { FIXTURE_DATE, readFixture } from './fixtures/read-fixture';

const PREFERENCES: IUserPreferences = {
  distributionArea: 'zagreb',
  powerStation: 'ZG',
  street: 'Ozaljska',
  futureSearch: false,
  notify: true
};

const OUTAGES = parseOutages(readFixture('zagreb-ZG'), FIXTURE_DATE);

describe('outage-notifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-26T06:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should notify once about an outage on a user street', async () => {
    const fakeChrome = stubChrome({ permissions: ['notifications'] });
    await notifyUserStreetOutages(OUTAGES, PREFERENCES);
    await notifyUserStreetOutages(OUTAGES, PREFERENCES);

    expect(fakeChrome.notifications.create).toHaveBeenCalledTimes(1);
    expect(fakeChrome.notifications.create.mock.calls[0][0]).toBe(
      toOutageId(OUTAGES[2])
    );
    expect(fakeChrome.notifications.create.mock.calls[0][1].message).toContain(
      '09:00 - 10:00\nSESVETE: BJELOVARSKA 2-32 par'
    );
  });

  it('should notify about each affected user street', async () => {
    const fakeChrome = stubChrome({ permissions: ['notifications'] });
    await notifyUserStreetOutages(OUTAGES, {
      ...PREFERENCES,
      street: 'Ozaljska, Orešići'
    });

    expect(fakeChrome.notifications.create).toHaveBeenCalledTimes(2);
  });

  it('should not notify about an outage that has ended', async () => {
    vi.setSystemTime(new Date('2026-11-26T09:30:00Z'));
    const fakeChrome = stubChrome({ permissions: ['notifications'] });
    await notifyUserStreetOutages(OUTAGES, PREFERENCES);

    expect(fakeChrome.notifications.create).not.toHaveBeenCalled();
  });

  it('should not notify when the user has not opted in', async () => {
    const fakeChrome = stubChrome({ permissions: ['notifications'] });
    await notifyUserStreetOutages(OUTAGES, { ...PREFERENCES, notify: false });

    expect(fakeChrome.notifications.create).not.toHaveBeenCalled();
  });

  it('should not notify without the notifications permission', async () => {
    const fakeChrome = stubChrome();
    await notifyUserStreetOutages(OUTAGES, PREFERENCES);

    expect(fakeChrome.notifications.create).not.toHaveBeenCalled();
  });

  it('should not notify about an outage the popup already showed', async () => {
    const fakeChrome = stubChrome({ permissions: ['notifications'] });
    await markUserStreetOutagesSeen(OUTAGES, PREFERENCES.street);
    await notifyUserStreetOutages(OUTAGES, PREFERENCES);

    expect(fakeChrome.notifications.create).not.toHaveBeenCalled();
  });

  it('should read the outage date back from a notification id', () => {
    expect(readOutageDate(toOutageId(OUTAGES[0]))).toBe('2026-11-26');
    expect(readOutageDate('something-else')).toBeUndefined();
  });
});
