import { IOutage, IUserPreferences } from '../models';
import { fetchWithRetry } from './fetchWithRetry';
import { addDays, getHepToday, toHepDateParam } from './hep-date';
import { parseOutages } from './parse-outages';

const HEP_OUTAGES_URL =
  import.meta.env.VITE_HEP_BASE_URL || 'https://www.hep.hr/ods/bez-struje/19';
const FUTURE_DAYS = 3;

export function buildOutagesUrl(
  distributionArea: string,
  powerStation: string,
  date: string
): string {
  const url = new URL(HEP_OUTAGES_URL);

  url.searchParams.set('dp', distributionArea);
  url.searchParams.set('el', powerStation);
  url.searchParams.set('datum', toHepDateParam(date));

  return url.href;
}

export function getSearchDates(
  futureSearch: boolean,
  today: string = getHepToday()
): string[] {
  const dayCount = futureSearch ? FUTURE_DAYS + 1 : 1;

  return Array.from({ length: dayCount }, (_, day) => addDays(today, day));
}

export async function fetchOutages(
  preferences: IUserPreferences,
  today: string = getHepToday()
): Promise<IOutage[]> {
  const dates = getSearchDates(preferences.futureSearch, today);
  const outagesPerDate = await Promise.all(
    dates.map(async date => {
      const response = await fetchWithRetry(
        buildOutagesUrl(
          preferences.distributionArea,
          preferences.powerStation,
          date
        )
      );

      return parseOutages(await response.text(), date);
    })
  );

  return outagesPerDate.flat();
}
