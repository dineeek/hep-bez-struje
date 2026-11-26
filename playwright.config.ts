import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: {
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'e2e', testIgnore: 'screenshots.spec.ts' },
    { name: 'screenshots', testMatch: 'screenshots.spec.ts' }
  ]
});
