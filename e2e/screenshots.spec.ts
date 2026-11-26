import { type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from './fixtures.ts';

const SCREENSHOT_DIR = resolve(import.meta.dirname, '../assets/screenshots');
const STORE_DIR = resolve(import.meta.dirname, '../assets/store');
const POPUP_SIZE = { width: 400, height: 600 };
const SETTINGS_SIZE = { width: 440, height: 418 };
const STORE_SIZE = { width: 1280, height: 800 };

const saveSettings = async (settings: Page, futureSearch: boolean) => {
  await settings.locator('#distributionArea').selectOption('zagreb');
  await settings.locator('#powerStation').selectOption('115');
  await settings.locator('#userStreet').fill('Ozaljska, Galižanska');
  await settings.locator('#futureSearch').setChecked(futureSearch);

  if (!(await settings.locator('#notify').isChecked())) {
    await settings.locator('#notify').click();
    await expect(settings.locator('#notify')).toBeChecked();
  }

  await settings.locator('.save-button').click();
  await expect(settings.getByRole('status')).not.toBeEmpty();
};

test.describe('README', () => {
  test.use({ deviceScaleFactor: 2 });

  test('README screenshots', async ({ hepServer, openExtensionPage }) => {
    hepServer.serve({});

    const firstSettings = await openExtensionPage('options.html');
    await saveSettings(firstSettings, false);
    await firstSettings.close();

    const emptyPopup = await openExtensionPage('popup.html', {
      width: POPUP_SIZE.width,
      height: 150
    });
    await expect(emptyPopup.locator('.empty-state')).toBeVisible();
    await emptyPopup.screenshot({
      path: `${SCREENSHOT_DIR}/4-no-outages.png`
    });
    await emptyPopup.close();

    hepServer.serve({ 0: 'pula-121', 1: 'zagreb-ZG', 2: 'karlovac-KA' });

    const settings = await openExtensionPage('options.html', {
      width: SETTINGS_SIZE.width,
      height: 430
    });
    await saveSettings(settings, true);
    await settings.screenshot({ path: `${SCREENSHOT_DIR}/1-settings.png` });
    await settings.close();

    const popup = await openExtensionPage('popup.html', POPUP_SIZE);
    await expect(popup.locator('.day')).toHaveCount(4);
    await popup.screenshot({ path: `${SCREENSHOT_DIR}/2-list.png` });
    await popup.emulateMedia({ colorScheme: 'dark' });
    await popup.screenshot({ path: `${SCREENSHOT_DIR}/3-list-dark.png` });
  });
});

test('Chrome Web Store screenshots', async ({
  context,
  hepServer,
  openExtensionPage
}) => {
  const composeStoreImage = async (name: string, panels: Buffer[]) => {
    const canvas = await context.newPage();
    const images = panels
      .map(
        panel =>
          `<img src="data:image/png;base64,${panel.toString('base64')}" style="outline: 1px solid #cfcfcf" />`
      )
      .join('');

    await canvas.setViewportSize(STORE_SIZE);
    await canvas.setContent(
      `<body style="margin: 0; height: 100vh; display: flex; gap: 56px; align-items: center; justify-content: center; background: #ececec">${images}</body>`
    );
    await canvas.screenshot({
      path: `${STORE_DIR}/${name}.jpg`,
      type: 'jpeg',
      quality: 92
    });
    await canvas.close();
  };

  mkdirSync(STORE_DIR, { recursive: true });
  hepServer.serve({ 0: 'pula-121', 1: 'zagreb-ZG', 2: 'karlovac-KA' });

  const settings = await openExtensionPage('options.html', SETTINGS_SIZE);
  await settings.emulateMedia({ colorScheme: 'light' });
  await saveSettings(settings, true);
  const settingsPanel = await settings.screenshot();

  const popup = await openExtensionPage('popup.html', POPUP_SIZE);
  await popup.emulateMedia({ colorScheme: 'light' });
  await expect(popup.locator('.day')).toHaveCount(4);
  const lightPanel = await popup.screenshot();
  await popup.emulateMedia({ colorScheme: 'dark' });
  const darkPanel = await popup.screenshot();

  await composeStoreImage('1-outages', [lightPanel, darkPanel]);
  await composeStoreImage('2-settings', [settingsPanel, lightPanel]);
});
