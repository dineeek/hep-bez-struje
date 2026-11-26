# Changelog

## 2.1.0

### Fixes

- An HTTP error or a changed HEP page shows an error. Both used to show "no
  scheduled outages".
- Station list regenerated from hep.hr: adds Vukovar, Ilok and Županja and takes
  HEP's current names
- Street names that HEP writes on several lines keep their spaces
- Two outages with the same place and time each get their own entry
- Host permission limited to hep.hr, was all sites
- Minimum Chrome version raised from 88 to 111, the version the bundle is built
  for

### Features

- Background check every three hours keeps the toolbar badge current
- Optional desktop notification for an outage on your street or in your place
- Several streets or places, matched as whole words without diacritics or
  capitals
- Unplanned outages are tagged as faults
- Popup opens from the last result and refreshes when it is older than 15
  minutes
- Refresh and settings buttons, link to the same data on hep.hr

### UI

- Popup redesigned as a notice sheet: day bands, outages ordered by start time,
  an outage on your street or in your place shown as a red block
- Dark theme
- Settings as one form. Changing the area keeps your streets and places.
- Dates follow the language of the interface text

### Stack

- React 18 to 19, TypeScript 5 to 6, ESLint 9 to 10, Prettier 2 to 3, Vitest 4
  to 5
- The parser reads HEP's page without a DOM, so the service worker can use it

### DX

- Typecheck and Playwright tests of the built extension in CI
- `npm run sync:stations` and `npm run screenshots`, which also writes the
  Web Store images
- Manifest generated from `manifest.config.ts`, version taken from
  `package.json`

## 2.0.0

### Stack

- Upgrade React 17 to 18 (createRoot API, react-jsx transform)
- Upgrade TypeScript 4 to 5
- Migrate Webpack 5 to Vite 8 with @crxjs/vite-plugin
- Migrate Jest to Vitest
- Add ESLint with typescript-eslint and react-hooks plugins

### Improvements

- Async/await throughout (scraper, popup, options)
- Fetch retry with exponential backoff (3 retries)
- Chrome storage operations use promises with error handling
- React ErrorBoundary on both entry points
- Scraping resilience guard for empty DOM elements
- Environment variable support for HEP base URL

### UI

- System font stack for crisp rendering
- Notification cards with left-accent border design
- Softer highlight style (red border + tinted background)
- Pulse loader replacing bouncing dots
- Form inputs with focus states and muted labels
- Save button with hover/active feedback
- CSS custom properties for theming

### Accessibility

- Alt text on info icon
- ARIA roles and labels on notification cards
- Label elements on all form inputs

### DX

- GitHub Actions updated to Node 22, actions v4, npm cache
- Removed unused dependencies (glob, rimraf, webpack toolchain)
- Expanded test coverage (12 tests)

## 1.0.0

Initial public release.

- Manifest V3 Chrome extension
- Web scraping of HEP website data
- User preferences stored in Chrome sync storage
- Street highlighting for user-affected outages
- Future date search (up to 3 days)
- Localization: German, English, Croatian, Hungarian, Slovenian

## 0.0.1

Initial development.

- Storing distribution area and power station in extension options
- Showing areas without electrical power per selected area and station
- Up to three days future search
- Detecting expected power outage for user street
- Localization: DE, EN, HR, HU and SL
