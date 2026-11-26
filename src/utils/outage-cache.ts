import { ChromeLocalStorage, IOutageCache, IUserPreferences } from '../models';
import { getHepToday } from './hep-date';

const FRESH_FOR_MS = 15 * 60 * 1000;

export async function loadOutageCache(
  preferences: IUserPreferences,
  today: string = getHepToday()
): Promise<IOutageCache | undefined> {
  const stored = await chrome.storage.local.get(
    ChromeLocalStorage.OUTAGE_CACHE
  );
  const cache = stored[ChromeLocalStorage.OUTAGE_CACHE];

  return isOutageCache(cache) && isCacheFor(cache, preferences, today)
    ? cache
    : undefined;
}

export async function saveOutageCache(cache: IOutageCache): Promise<void> {
  await chrome.storage.local.set({ [ChromeLocalStorage.OUTAGE_CACHE]: cache });
}

export async function clearOutageCache(): Promise<void> {
  const key: string = ChromeLocalStorage.OUTAGE_CACHE;

  await chrome.storage.local.remove(key);
}

export function isOutageCacheFresh(
  cache: IOutageCache,
  now: number = Date.now()
): boolean {
  return now - cache.fetchedAt < FRESH_FOR_MS;
}

function isOutageCache(value: unknown): value is IOutageCache {
  return (
    typeof value === 'object' &&
    value !== null &&
    'outages' in value &&
    Array.isArray(value.outages) &&
    'fetchedAt' in value &&
    typeof value.fetchedAt === 'number'
  );
}

function isCacheFor(
  cache: IOutageCache,
  preferences: IUserPreferences,
  today: string
): boolean {
  return (
    cache.distributionArea === preferences.distributionArea &&
    cache.powerStation === preferences.powerStation &&
    cache.futureSearch === preferences.futureSearch &&
    cache.today === today
  );
}
