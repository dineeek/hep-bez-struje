import { IOutage } from '../models';
import { getUserStreetOutages } from './outage-status';

const BADGE_COLOR = '#d42b2b';

export async function updateBadge(
  outages: IOutage[],
  userStreet: string
): Promise<void> {
  const count = getUserStreetOutages(outages, userStreet).length;

  await chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR });
  await chrome.action.setBadgeText({ text: count ? String(count) : '' });
}

export async function clearBadge(): Promise<void> {
  await chrome.action.setBadgeText({ text: '' });
}
