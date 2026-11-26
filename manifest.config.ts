import { defineManifest } from '@crxjs/vite-plugin';
import { loadEnv } from 'vite';
import packageJson from './package.json' with { type: 'json' };
import { HEP_OUTAGES_URL } from './src/meta/hep-url.ts';

const NOTIFICATIONS = ['notifications'];

export default defineManifest(({ mode }) => {
  const isE2e = mode === 'e2e';
  const outagesUrl =
    loadEnv(mode, process.cwd()).VITE_HEP_BASE_URL || HEP_OUTAGES_URL;

  return {
    manifest_version: 3,
    version: packageJson.version,
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    default_locale: 'hr',
    minimum_chrome_version: '88',

    permissions: ['storage', 'alarms', ...(isE2e ? NOTIFICATIONS : [])],
    optional_permissions: isE2e ? [] : NOTIFICATIONS,
    host_permissions: [`${new URL(outagesUrl).origin}/*`],

    background: {
      service_worker: 'src/background/service-worker.ts',
      type: 'module'
    },

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
