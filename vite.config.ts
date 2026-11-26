import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import manifest, { MIN_CHROME_VERSION } from './manifest.config.ts';

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    target: `chrome${MIN_CHROME_VERSION}`
  },
  test: {
    include: ['src/__tests__/**/*.spec.ts']
  }
});
