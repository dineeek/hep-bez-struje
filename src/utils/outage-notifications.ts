import { ChromeLocalStorage, IOutage, IUserPreferences } from '../models';
import { formatOutageDay } from './format-date';
import { getUserStreetOutages } from './outage-status';

const NOTIFICATION_ICON = 'icons/no_power128.png';

export function toOutageId(outage: IOutage): string {
  return [outage.date, outage.time, outage.place, outage.street].join('|');
}

export function readOutageDate(outageId: string): string | undefined {
  return /^\d{4}-\d{2}-\d{2}(?=\|)/.exec(outageId)?.[0];
}

export async function markUserStreetOutagesSeen(
  outages: IOutage[],
  userStreet: string
): Promise<IOutage[]> {
  const userStreetOutages = getUserStreetOutages(outages, userStreet);
  const stored = await chrome.storage.local.get(
    ChromeLocalStorage.NOTIFIED_OUTAGES
  );
  const notified = stored[ChromeLocalStorage.NOTIFIED_OUTAGES];
  const notifiedIds: unknown[] = Array.isArray(notified) ? notified : [];

  await chrome.storage.local.set({
    [ChromeLocalStorage.NOTIFIED_OUTAGES]: userStreetOutages.map(toOutageId)
  });

  return userStreetOutages.filter(
    outage => !notifiedIds.includes(toOutageId(outage))
  );
}

export async function notifyUserStreetOutages(
  outages: IOutage[],
  preferences: IUserPreferences
): Promise<void> {
  const isAllowed =
    preferences.notify &&
    (await chrome.permissions.contains({ permissions: ['notifications'] }));

  if (!isAllowed) {
    return;
  }

  const newOutages = await markUserStreetOutagesSeen(
    outages,
    preferences.street
  );
  const locale = chrome.i18n.getUILanguage();

  for (const outage of newOutages) {
    await chrome.notifications.create(toOutageId(outage), {
      type: 'basic',
      iconUrl: chrome.runtime.getURL(NOTIFICATION_ICON),
      title: chrome.i18n.getMessage('notificationTitle'),
      message: `${formatOutageDay(outage.date, locale)}, ${outage.time}\n${outage.place}: ${outage.street}`
    });
  }
}
