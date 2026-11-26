import { IOutageCache, IUserPreferences } from '../models';
import { updateBadge } from './badge';
import { fetchOutages } from './fetch-outages';
import { getHepToday } from './hep-date';
import { saveOutageCache } from './outage-cache';

export async function refreshOutages(
  preferences: IUserPreferences
): Promise<IOutageCache> {
  const today = getHepToday();
  const cache: IOutageCache = {
    distributionArea: preferences.distributionArea,
    powerStation: preferences.powerStation,
    futureSearch: preferences.futureSearch,
    today,
    fetchedAt: Date.now(),
    outages: await fetchOutages(preferences, today)
  };

  await saveOutageCache(cache);
  await updateBadge(cache.outages, preferences.street);

  return cache;
}
