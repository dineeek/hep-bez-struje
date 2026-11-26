import { describe, expect, it } from 'vitest';
import manifest from '../../manifest.config';
import packageJson from '../../package.json';

const buildManifest = (mode: string) =>
  typeof manifest === 'function'
    ? manifest({ mode, command: 'build' })
    : manifest;

describe('manifest', () => {
  it('should ask a production user only for storage and alarms', async () => {
    const production = await buildManifest('production');

    expect(production.permissions).toEqual(['storage', 'alarms']);
    expect(production.optional_permissions).toEqual(['notifications']);
    expect(production.host_permissions).toEqual(['https://www.hep.hr/*']);
  });

  it('should require the Chrome version the bundle is built for', async () => {
    const production = await buildManifest('production');

    expect(production.minimum_chrome_version).toBe('111');
  });

  it('should take its version from package.json', async () => {
    const production = await buildManifest('production');

    expect(production.version).toBe(packageJson.version);
  });
});
