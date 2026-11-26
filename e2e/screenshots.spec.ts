import { resolve } from 'node:path';
import { expect, test } from './fixtures.ts';

const SCREENSHOT_DIR = resolve(import.meta.dirname, '../assets/screenshots');

test.use({ deviceScaleFactor: 2 });

test('README screenshots', async ({ hepServer, openExtensionPage }) => {
  hepServer.serve({});

  const firstSettings = await openExtensionPage('options.html');
  await firstSettings.locator('#distributionArea').selectOption('zagreb');
  await firstSettings.locator('#powerStation').selectOption('115');
  await firstSettings.locator('#userStreet').fill('Ozaljska, Galižanska');
  await firstSettings.locator('#notify').click();
  await expect(firstSettings.locator('#notify')).toBeChecked();
  await firstSettings.locator('.save-button').click();
  await expect(firstSettings.getByRole('status')).not.toBeEmpty();
  await firstSettings.close();

  const emptyPopup = await openExtensionPage('popup.html', {
    width: 480,
    height: 150
  });
  await expect(emptyPopup.locator('.empty-state')).toBeVisible();
  await emptyPopup.screenshot({ path: `${SCREENSHOT_DIR}/4-no-outages.png` });
  await emptyPopup.close();

  hepServer.serve({ 0: 'pula-121', 1: 'zagreb-ZG', 2: 'karlovac-KA' });

  const settings = await openExtensionPage('options.html', {
    width: 440,
    height: 430
  });
  await settings.locator('#futureSearch').check();
  await settings.locator('.save-button').click();
  await expect(settings.getByRole('status')).not.toBeEmpty();
  await settings.screenshot({ path: `${SCREENSHOT_DIR}/1-settings.png` });
  await settings.close();

  const popup = await openExtensionPage('popup.html', {
    width: 480,
    height: 600
  });
  await expect(popup.locator('.day')).toHaveCount(4);
  await popup.screenshot({ path: `${SCREENSHOT_DIR}/2-list.png` });
  await popup.emulateMedia({ colorScheme: 'dark' });
  await popup.screenshot({ path: `${SCREENSHOT_DIR}/3-list-dark.png` });
});
