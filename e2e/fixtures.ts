import {
  type BrowserContext,
  chromium,
  type Page,
  type ViewportSize,
  test as base,
  type Worker
} from '@playwright/test';
import { resolve } from 'node:path';
import { type IHepServer, startHepServer } from './hep-server.ts';

const EXTENSION_DIR = resolve(import.meta.dirname, '../dist-e2e');

interface IExtensionFixtures {
  hepServer: IHepServer;
  context: BrowserContext;
  serviceWorker: Worker;
  extensionId: string;
  openExtensionPage: (path: string, viewport?: ViewportSize) => Promise<Page>;
}

export const test = base.extend<IExtensionFixtures>({
  hepServer: [
    async ({}, use) => {
      const hepServer = await startHepServer();

      await use(hepServer);
      await hepServer.close();
    },
    { auto: true }
  ],

  context: async ({ deviceScaleFactor }, use) => {
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      deviceScaleFactor,
      args: [
        `--disable-extensions-except=${EXTENSION_DIR}`,
        `--load-extension=${EXTENSION_DIR}`
      ]
    });

    await use(context);
    await context.close();
  },

  serviceWorker: async ({ context }, use) => {
    const [serviceWorker] = context.serviceWorkers();

    await use(serviceWorker ?? (await context.waitForEvent('serviceworker')));
  },

  extensionId: async ({ serviceWorker }, use) => {
    await use(new URL(serviceWorker.url()).host);
  },

  openExtensionPage: async ({ context, extensionId }, use) => {
    await use(async (path, viewport) => {
      const page = await context.newPage();

      if (viewport) {
        await page.setViewportSize(viewport);
      }

      await page.goto(`chrome-extension://${extensionId}/${path}`);

      return page;
    });
  }
});

export { expect } from '@playwright/test';
