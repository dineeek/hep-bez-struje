import { ChromeStorage, IUserPreferences } from '../models';

export async function loadUserPreferences(): Promise<IUserPreferences> {
  const stored = await chrome.storage.sync.get(Object.values(ChromeStorage));
  const readText = (key: ChromeStorage): string => {
    const value = stored[key];

    return typeof value === 'string' ? value : '';
  };

  return {
    distributionArea: readText(ChromeStorage.DISTRIBUTION_AREA),
    powerStation: readText(ChromeStorage.POWER_STATION),
    street: readText(ChromeStorage.USER_STREET),
    futureSearch: Boolean(stored[ChromeStorage.FUTURE_SEARCH])
  };
}

export async function saveUserPreferences(
  preferences: IUserPreferences
): Promise<void> {
  await chrome.storage.sync.set({
    [ChromeStorage.DISTRIBUTION_AREA]: preferences.distributionArea,
    [ChromeStorage.POWER_STATION]: preferences.powerStation,
    [ChromeStorage.USER_STREET]: preferences.street,
    [ChromeStorage.FUTURE_SEARCH]: preferences.futureSearch
  });
}
