import { type Page, type Worker } from '@playwright/test';
import { getHepToday, toHepDateParam } from '../src/utils/hep-date.ts';
import { expect, test } from './fixtures.ts';

const readMessage = (page: Page, key: string): Promise<string> =>
  page.evaluate(messageKey => chrome.i18n.getMessage(messageKey), key);

const savePreferences = (serviceWorker: Worker, futureSearch: boolean) =>
  serviceWorker.evaluate(
    hep_future_search =>
      chrome.storage.sync.set({
        hep_distribution_area: 'zagreb',
        hep_power_station: 'ZG',
        hep_user_street: 'ozaljska',
        hep_future_search
      }),
    futureSearch
  );

const waitForBadge = (serviceWorker: Worker, text: string) =>
  expect
    .poll(() => serviceWorker.evaluate(() => chrome.action.getBadgeText({})))
    .toBe(text);

test('popup sends a user without a station to the settings', async ({
  context,
  openExtensionPage
}) => {
  const popup = await openExtensionPage('popup.html');
  const settingsText = await readMessage(popup, 'buttonOpenOptions');
  const refreshText = await readMessage(popup, 'buttonRefresh');

  await expect(
    popup.getByText(await readMessage(popup, 'messageNoOptionsSelectedPopup'))
  ).toBeVisible();
  await expect(popup.getByRole('button', { name: refreshText })).toHaveCount(0);

  const [optionsPage] = await Promise.all([
    context.waitForEvent('page'),
    popup
      .locator('.empty-state')
      .getByRole('button', { name: settingsText })
      .click()
  ]);

  expect(optionsPage.url()).toContain('chrome://extensions');
});

test('popup lists each searched day with the user street first', async ({
  serviceWorker,
  openExtensionPage
}) => {
  await savePreferences(serviceWorker, true);
  const popup = await openExtensionPage('popup.html');
  const days = popup.locator('.day');
  const tomorrow = days.nth(1);

  await expect(days).toHaveCount(4);
  await expect(tomorrow.locator('.outage-card')).toHaveCount(4);
  await expect(tomorrow.locator('.outage-card').first()).toHaveClass(
    /is-user-street/
  );
  await expect(tomorrow.locator('.outage-card').first()).toContainText(
    'SESVETE'
  );
  await expect(
    tomorrow.locator('.outage-card').first().locator('.tag')
  ).toHaveText(await readMessage(popup, 'tagUserStreet'));
  await expect(days.nth(0)).toContainText(
    await readMessage(popup, 'messageNoOutagesOnDay')
  );
  await expect(
    popup.getByRole('link', { name: await readMessage(popup, 'linkHepPage') })
  ).toHaveAttribute(
    'href',
    `http://localhost:4319/ods/bez-struje/19?dp=zagreb&el=ZG&datum=${toHepDateParam(getHepToday())}`
  );
});

test('popup opens from the cache without asking HEP again', async ({
  serviceWorker,
  hepServer,
  openExtensionPage
}) => {
  await savePreferences(serviceWorker, true);
  await waitForBadge(serviceWorker, '1');
  const requestCount = hepServer.requests.length;
  const popup = await openExtensionPage('popup.html');

  await expect(popup.locator('.outage-card')).toHaveCount(4);
  await expect(popup.getByTestId('updated')).toBeVisible();
  expect(hepServer.requests).toHaveLength(requestCount);
});

test('popup keeps the list when a refresh fails', async ({
  serviceWorker,
  hepServer,
  openExtensionPage
}) => {
  await savePreferences(serviceWorker, true);
  await waitForBadge(serviceWorker, '1');
  const popup = await openExtensionPage('popup.html');
  await expect(popup.locator('.outage-card')).toHaveCount(4);
  hepServer.failWith(404);
  await popup
    .getByRole('button', { name: await readMessage(popup, 'buttonRefresh') })
    .click();

  await expect(popup.locator('.notice')).toBeVisible();
  await expect(popup.locator('.outage-card')).toHaveCount(4);
});

test('popup offers a retry when HEP cannot be read', async ({
  serviceWorker,
  hepServer,
  openExtensionPage
}) => {
  hepServer.failWith(404);
  await savePreferences(serviceWorker, true);
  const popup = await openExtensionPage('popup.html');
  const retry = popup
    .locator('.empty-state')
    .getByRole('button', { name: await readMessage(popup, 'buttonRefresh') });

  await expect(
    popup.getByText(await readMessage(popup, 'messageFetchNotificationsError'))
  ).toBeVisible();
  hepServer.failWith(undefined);
  await retry.click();

  await expect(popup.locator('.outage-card')).toHaveCount(4);
});

test('popup says when HEP lists no outages', async ({
  serviceWorker,
  openExtensionPage
}) => {
  await savePreferences(serviceWorker, false);
  const popup = await openExtensionPage('popup.html');

  await expect(
    popup.getByText(await readMessage(popup, 'messageNoNotifications'))
  ).toBeVisible();
  await expect(popup.locator('.day')).toHaveCount(0);
});
