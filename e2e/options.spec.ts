import { type Page } from '@playwright/test';
import { expect, test } from './fixtures.ts';

const readMessage = (page: Page, key: string): Promise<string> =>
  page.evaluate(messageKey => chrome.i18n.getMessage(messageKey), key);

const readStoredPreferences = (page: Page) =>
  page.evaluate(() => chrome.storage.sync.get(null));

test('options saves a station, several streets and both switches', async ({
  openExtensionPage
}) => {
  const options = await openExtensionPage('options.html');
  const save = options.getByRole('button', {
    name: await readMessage(options, 'labelSave')
  });

  await expect(save).toBeDisabled();
  await expect(options.locator('#powerStation')).toBeDisabled();
  await expect(options.locator('#notify')).toBeDisabled();
  await options.locator('#distributionArea').selectOption('vinkovci');
  await options.locator('#powerStation').selectOption({ label: 'Vukovar' });
  await options.locator('#userStreet').fill(' ilica ,, savska; ');
  await options.locator('#futureSearch').check();
  await options.locator('#notify').click();
  await expect(options.locator('#notify')).toBeChecked();
  await save.click();

  await expect(options.getByRole('status')).toHaveText(
    await readMessage(options, 'messageOptionsSaved')
  );
  expect(await readStoredPreferences(options)).toEqual({
    hep_distribution_area: 'vinkovci',
    hep_power_station: '179',
    hep_user_street: 'ilica, savska',
    hep_future_search: true,
    hep_notify: true
  });

  await options.reload();

  await expect(options.locator('#distributionArea')).toHaveValue('vinkovci');
  await expect(options.locator('#powerStation')).toHaveValue('179');
  await expect(options.locator('#userStreet')).toHaveValue('ilica, savska');
  await expect(options.locator('#futureSearch')).toBeChecked();
  await expect(options.locator('#notify')).toBeChecked();
});

test('options selects the only station of an area', async ({
  openExtensionPage
}) => {
  const options = await openExtensionPage('options.html');
  await options.locator('#distributionArea').selectOption('cakovec');

  await expect(options.locator('#powerStation')).toHaveValue('CK');
});

test('options keeps the streets when the area changes', async ({
  openExtensionPage
}) => {
  const options = await openExtensionPage('options.html');
  await options.locator('#distributionArea').selectOption('zagreb');
  await options.locator('#powerStation').selectOption('115');
  await options.locator('#userStreet').fill('Ilica');
  await options.locator('#distributionArea').selectOption('split');

  await expect(options.locator('#userStreet')).toHaveValue('Ilica');
  await expect(options.locator('#powerStation')).toHaveValue('');
});

test('options turns notifications off when the streets are removed', async ({
  openExtensionPage
}) => {
  const options = await openExtensionPage('options.html');
  await options.locator('#distributionArea').selectOption('cakovec');
  await options.locator('#userStreet').fill('Ilica');
  await options.locator('#notify').click();
  await expect(options.locator('#notify')).toBeChecked();
  await options.locator('#userStreet').fill('');
  await options
    .getByRole('button', { name: await readMessage(options, 'labelSave') })
    .click();

  await expect(options.getByRole('status')).not.toBeEmpty();
  expect(await readStoredPreferences(options)).toMatchObject({
    hep_user_street: '',
    hep_notify: false
  });
});

test('options shows settings saved by version 2.0.0', async ({
  serviceWorker,
  openExtensionPage
}) => {
  await serviceWorker.evaluate(() =>
    chrome.storage.sync.set({
      hep_distribution_area: 'zagreb',
      hep_power_station: 'ZG',
      hep_user_street: 'Vukovarska',
      hep_future_search: true
    })
  );
  const options = await openExtensionPage('options.html');

  await expect(options.locator('#distributionArea')).toHaveValue('zagreb');
  await expect(options.locator('#powerStation')).toHaveValue('ZG');
  await expect(options.locator('#userStreet')).toHaveValue('Vukovarska');
  await expect(options.locator('#futureSearch')).toBeChecked();
  await expect(options.locator('#notify')).not.toBeChecked();
});
