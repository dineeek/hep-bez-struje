# Changelog

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

- GitHub Actions updated to Node 20, actions v4, npm cache
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
