import { IOutage } from '../models';
import { getUserOutages } from './outage-status';

const BADGE_COLOR = '#d9232a';

export async function updateBadge(
  outages: IOutage[],
  userStreet: string
): Promise<void> {
  const count = getUserOutages(outages, userStreet).length;

  await chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR });
  await chrome.action.setBadgeText({ text: count ? String(count) : '' });
}

export async function clearBadge(): Promise<void> {
  await chrome.action.setBadgeText({ text: '' });
}
