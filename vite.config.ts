import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest: {
        ...manifest,
        action: {
          ...manifest.action,
          default_popup: 'popup.html',
        },
        options_ui: {
          page: 'options.html',
        },
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
