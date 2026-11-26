import { defineManifest } from '@crxjs/vite-plugin';
import { loadEnv } from 'vite';
import packageJson from './package.json' with { type: 'json' };
import { HEP_OUTAGES_URL } from './src/meta/hep-url.ts';

export default defineManifest(({ mode }) => {
  const outagesUrl =
    loadEnv(mode, process.cwd()).VITE_HEP_BASE_URL || HEP_OUTAGES_URL;

  return {
    manifest_version: 3,
    version: packageJson.version,
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    default_locale: 'hr',
    minimum_chrome_version: '88',

    permissions: ['storage'],
    host_permissions: [`${new URL(outagesUrl).origin}/*`],

    options_ui: {
      page: 'options.html'
    },

    action: {
      default_icon: 'icons/no_power32.png',
      default_popup: 'popup.html',
      default_title: '__MSG_extensionName__'
    },

    icons: {
      16: 'icons/no_power16.png',
      32: 'icons/no_power32.png',
      48: 'icons/no_power48.png',
      128: 'icons/no_power128.png'
    }
  };
});
