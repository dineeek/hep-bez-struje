import { ChromeLocalStorage, IOutage, IUserPreferences } from '../models';
import { formatOutageDay } from './format-date';
import { getMessageLocale, localize } from './localize';
import { getUserOutages } from './outage-status';
import { findUserMatch } from './street-match';

const NOTIFICATION_ICON = 'icons/no_power128.png';

export function toOutageId(outage: IOutage): string {
  return [outage.date, outage.time, outage.place, outage.street].join('|');
}

export function readOutageDate(outageId: string): string | undefined {
  return /^\d{4}-\d{2}-\d{2}(?=\|)/.exec(outageId)?.[0];
}

export async function markUserOutagesSeen(
  outages: IOutage[],
  userStreet: string
): Promise<IOutage[]> {
  const userOutages = getUserOutages(outages, userStreet);
  const stored = await chrome.storage.local.get(
    ChromeLocalStorage.NOTIFIED_OUTAGES
  );
  const notified = stored[ChromeLocalStorage.NOTIFIED_OUTAGES];
  const notifiedIds: unknown[] = Array.isArray(notified) ? notified : [];

  await chrome.storage.local.set({
    [ChromeLocalStorage.NOTIFIED_OUTAGES]: userOutages.map(toOutageId)
  });

  return userOutages.filter(
    outage => !notifiedIds.includes(toOutageId(outage))
  );
}

export async function notifyUserOutages(
  outages: IOutage[],
  preferences: IUserPreferences
): Promise<void> {
  const isAllowed =
    preferences.notify &&
    (await chrome.permissions.contains({ permissions: ['notifications'] }));

  if (!isAllowed) {
    return;
  }

  const newOutages = await markUserOutagesSeen(outages, preferences.street);
  const locale = getMessageLocale();

  for (const outage of newOutages) {
    const isPlaceMatch = findUserMatch(outage, preferences.street) === 'place';

    await chrome.notifications.create(toOutageId(outage), {
      type: 'basic',
      iconUrl: chrome.runtime.getURL(NOTIFICATION_ICON),
      title: localize(
        isPlaceMatch ? 'notificationTitlePlace' : 'notificationTitle'
      ),
      message: [
        `${formatOutageDay(outage.date, locale)}, ${outage.time}`,
        [outage.place, outage.street].filter(Boolean).join(': ')
      ].join('\n')
    });
  }
}
