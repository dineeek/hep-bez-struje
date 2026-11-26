import { addDays, getHepToday, toHepDateParam } from '../src/utils/hep-date.ts';
import { expect, test } from './fixtures.ts';

const readBadge = () => chrome.action.getBadgeText({});

interface IDispatchableEvent {
  dispatch: (notificationId: string) => void;
}

// Chrome events have an undocumented dispatch() that @types/chrome leaves out.
const clickNotification = (notificationId: string) =>
  (chrome.notifications.onClicked as unknown as IDispatchableEvent).dispatch(
    notificationId
  );

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

test('background worker notifies once about an outage on the saved street', async ({
  serviceWorker,
  context
}) => {
  const readNotificationIds = async () =>
    Object.keys(await chrome.notifications.getAll());
  const savePreferences = (hep_user_street: string) =>
    chrome.storage.sync.set({
      hep_distribution_area: 'zagreb',
      hep_power_station: 'ZG',
      hep_user_street,
      hep_future_search: true,
      hep_notify: true
    });
  const tomorrow = addDays(getHepToday(), 1);

  await serviceWorker.evaluate(savePreferences, 'ozaljska');
  await expect
    .poll(() => serviceWorker.evaluate(readNotificationIds))
    .toHaveLength(1);
  const [ozaljskaId] = await serviceWorker.evaluate(readNotificationIds);

  expect(ozaljskaId).toContain(`${tomorrow}|09:00 - 10:00|SESVETE|`);

  await serviceWorker.evaluate(
    id => chrome.notifications.clear(id),
    ozaljskaId
  );
  await serviceWorker.evaluate(savePreferences, 'ozaljska, orešići');
  await expect
    .poll(() => serviceWorker.evaluate(readNotificationIds))
    .toHaveLength(1);
  const [oresiciId] = await serviceWorker.evaluate(readNotificationIds);

  expect(oresiciId).toContain(`${tomorrow}|08:00 - 13:00|ZAGREB|OREŠIĆI`);

  const [outagePage] = await Promise.all([
    context.waitForEvent('page'),
    serviceWorker.evaluate(clickNotification, oresiciId)
  ]);

  expect(outagePage.url()).toBe(
    `http://localhost:4319/ods/bez-struje/19?dp=zagreb&el=ZG&datum=${toHepDateParam(tomorrow)}`
  );
});
