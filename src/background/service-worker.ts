import {
  buildOutagesUrl,
  clearBadge,
  clearOutageCache,
  getHepToday,
  loadUserPreferences,
  notifyUserStreetOutages,
  readOutageDate,
  refreshOutages
} from '../utils';

const REFRESH_ALARM = 'refresh-outages';
const REFRESH_PERIOD_MINUTES = 180;

async function scheduleRefresh(): Promise<void> {
  if (!(await chrome.alarms.get(REFRESH_ALARM))) {
    await chrome.alarms.create(REFRESH_ALARM, {
      periodInMinutes: REFRESH_PERIOD_MINUTES
    });
  }
}

async function refreshInBackground(): Promise<void> {
  try {
    const preferences = await loadUserPreferences();

    if (!preferences.powerStation) {
      await clearOutageCache();
      await clearBadge();
      return;
    }

    const cache = await refreshOutages(preferences);

    await notifyUserStreetOutages(cache.outages, preferences);
  } catch (error) {
    console.warn('HEP outage refresh failed', error);
  }
}

async function openOutagePage(notificationId: string): Promise<void> {
  const preferences = await loadUserPreferences();

  await chrome.tabs.create({
    url: buildOutagesUrl(
      preferences.distributionArea,
      preferences.powerStation,
      readOutageDate(notificationId) ?? getHepToday()
    )
  });
  await chrome.notifications.clear(notificationId);
}

function listenForNotificationClicks(): void {
  chrome.notifications?.onClicked.addListener(openOutagePage);
}

chrome.runtime.onInstalled.addListener(() => {
  scheduleRefresh();
  refreshInBackground();
});
chrome.runtime.onStartup.addListener(() => {
  scheduleRefresh();
  refreshInBackground();
});
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === REFRESH_ALARM) {
    refreshInBackground();
  }
});
chrome.storage.onChanged.addListener((_changes, areaName) => {
  if (areaName === 'sync') {
    refreshInBackground();
  }
});
chrome.permissions.onAdded.addListener(listenForNotificationClicks);
listenForNotificationClicks();
