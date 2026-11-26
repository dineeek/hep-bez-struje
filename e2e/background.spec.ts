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
  expect(new Set(hepServer.requests.map(request => request.search))).toEqual(
    new Set(
      [0, 1, 2, 3].map(
        day =>
          `?dp=zagreb&el=ZG&datum=${toHepDateParam(addDays(getHepToday(), day))}`
      )
    )
  );
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
