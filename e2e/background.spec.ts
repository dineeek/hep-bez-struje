import { addDays, getHepToday, toHepDateParam } from '../src/utils/hep-date.ts';
import { expect, test } from './fixtures.ts';

const readBadge = () => chrome.action.getBadgeText({});

const saveZagrebPreferences = () =>
  chrome.storage.sync.set({
    hep_distribution_area: 'zagreb',
    hep_power_station: 'ZG',
    hep_user_street: 'ozaljska',
    hep_future_search: true
  });

test('background worker badges an outage on the saved street', async ({
  serviceWorker,
  hepServer
}) => {
  await serviceWorker.evaluate(saveZagrebPreferences);

  await expect.poll(() => serviceWorker.evaluate(readBadge)).toBe('1');
  expect(
    hepServer.requests.map(request => request.searchParams.get('datum')).sort()
  ).toEqual(
    [0, 1, 2, 3].map(day => toHepDateParam(addDays(getHepToday(), day))).sort()
  );
  expect(hepServer.requests[0].searchParams.get('dp')).toBe('zagreb');
  expect(hepServer.requests[0].searchParams.get('el')).toBe('ZG');
});

test('background worker schedules a refresh every three hours', async ({
  serviceWorker
}) => {
  await expect
    .poll(() =>
      serviceWorker.evaluate(async () => {
        const alarm = await chrome.alarms.get('refresh-outages');

        return alarm?.periodInMinutes;
      })
    )
    .toBe(180);
});

test('background worker clears the badge when the street is removed', async ({
  serviceWorker
}) => {
  await serviceWorker.evaluate(saveZagrebPreferences);
  await expect.poll(() => serviceWorker.evaluate(readBadge)).toBe('1');
  await serviceWorker.evaluate(() =>
    chrome.storage.sync.set({ hep_user_street: '' })
  );

  await expect.poll(() => serviceWorker.evaluate(readBadge)).toBe('');
});
