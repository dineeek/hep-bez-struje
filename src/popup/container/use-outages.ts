import { useCallback, useEffect, useState } from 'react';
import { IOutageCache, IUserPreferences } from '../../models';
import {
  isOutageCacheFresh,
  loadOutageCache,
  loadUserPreferences,
  markUserStreetOutagesSeen,
  refreshOutages
} from '../../utils';

export interface IOutagesState {
  preferences: IUserPreferences | undefined;
  cache: IOutageCache | undefined;
  isRefreshing: boolean;
  hasFailed: boolean;
  refresh: () => void;
}

export function useOutages(): IOutagesState {
  const [preferences, setPreferences] = useState<IUserPreferences>();
  const [cache, setCache] = useState<IOutageCache>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const refreshFor = useCallback(async (userPreferences: IUserPreferences) => {
    setIsRefreshing(true);
    setHasFailed(false);

    try {
      const newCache = await refreshOutages(userPreferences);

      await markUserStreetOutagesSeen(newCache.outages, userPreferences.street);
      setCache(newCache);
    } catch {
      setHasFailed(true);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const userPreferences = await loadUserPreferences();

        setPreferences(userPreferences);

        if (!userPreferences.powerStation) {
          return;
        }

        const storedCache = await loadOutageCache(userPreferences);

        if (storedCache) {
          setCache(storedCache);
          await markUserStreetOutagesSeen(
            storedCache.outages,
            userPreferences.street
          );
        }

        if (!storedCache || !isOutageCacheFresh(storedCache)) {
          await refreshFor(userPreferences);
        }
      } catch {
        setHasFailed(true);
      }
    };
    load();
  }, [refreshFor]);

  return {
    preferences,
    cache,
    isRefreshing,
    hasFailed,
    refresh: () => {
      if (preferences) {
        refreshFor(preferences);
      }
    }
  };
}
