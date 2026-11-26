import { vi } from 'vitest';

type StoredItems = Record<string, unknown>;

interface IChromeState {
  sync?: StoredItems;
  local?: StoredItems;
  permissions?: string[];
}

const createStorageArea = (items: StoredItems) => ({
  items,
  get: vi.fn(async (keys: string | string[]) =>
    Object.fromEntries(
      [keys]
        .flat()
        .filter(key => key in items)
        .map(key => [key, items[key]])
    )
  ),
  set: vi.fn(async (newItems: StoredItems) => {
    Object.assign(items, newItems);
  }),
  remove: vi.fn(async (key: string) => {
    delete items[key];
  })
});

export function stubChrome(state: IChromeState = {}) {
  const grantedPermissions = state.permissions ?? [];
  const fakeChrome = {
    storage: {
      sync: createStorageArea({ ...state.sync }),
      local: createStorageArea({ ...state.local })
    },
    action: {
      setBadgeText: vi.fn<(details: { text: string }) => Promise<void>>(
        async () => {}
      ),
      setBadgeBackgroundColor: vi.fn<
        (details: { color: string }) => Promise<void>
      >(async () => {})
    },
    permissions: {
      contains: vi.fn(async (request: { permissions: string[] }) =>
        request.permissions.every(permission =>
          grantedPermissions.includes(permission)
        )
      )
    },
    notifications: {
      create: vi.fn<
        (id: string, options: { message: string }) => Promise<string>
      >(async id => id)
    },
    i18n: {
      getMessage: vi.fn((key: string) => key),
      getUILanguage: vi.fn(() => 'hr')
    },
    runtime: {
      getURL: vi.fn((path: string) => `chrome-extension://test/${path}`)
    }
  };

  vi.stubGlobal('chrome', fakeChrome);

  return fakeChrome;
}
