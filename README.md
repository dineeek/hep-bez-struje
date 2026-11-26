<img align="left" width="64" height="64" src="https://github.com/dineeek/hep-bez-struje/blob/master/assets/icons/icon.png" alt="Extension icon">

# Hep - bez struje

![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/dineeek/hep-bez-struje?include_prereleases)
[![lint:test:build](https://github.com/dineeek/hep-bez-struje/actions/workflows/lint-test-build.yml/badge.svg?branch=master)](https://github.com/dineeek/hep-bez-struje/actions/workflows/lint-test-build.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![Github](https://img.shields.io/github/license/dineeek/hep-bez-struje)
![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/hahhmkkofmofnadefiadmpmcencoaljf)
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/hahhmkkofmofnadefiadmpmcencoaljf)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

Unofficial HEP Chrome extension for checking areas without electric power. Based
on HEP web page data scraping, TypeScript & React.

## Download

Available at
[**Chrome Web Store**](https://chrome.google.com/webstore/detail/hep-bez-struje/hahhmkkofmofnadefiadmpmcencoaljf).

![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/hahhmkkofmofnadefiadmpmcencoaljf)

## Screenshots

| Settings | Outage list | Dark theme | No outages |
|-|-|-|-|
| ![Settings](assets/screenshots/1-settings.png) | ![Outage list](assets/screenshots/2-list.png) | ![Dark theme](assets/screenshots/3-list-dark.png) | ![No outages](assets/screenshots/4-no-outages.png) |

## Features

- Planned and unplanned outages for the selected distribution area and station,
  grouped by day
- Today only, or today and the next three days
- Highlight and toolbar badge for outages on your streets. You can save several
  streets, and they match without diacritics or capitals.
- Background check every three hours, with an optional desktop notification
- The last result is kept locally, so the popup opens without waiting for HEP
- Light and dark theme
- Available localization:
  - German
  - English
  - Croatian
  - Hungarian
  - Slovenian

## Tech stack

- React 19 with TypeScript 6
- Vite 8 with @crxjs/vite-plugin
- Vitest for unit tests, Playwright for tests of the built extension
- ESLint + Prettier for code quality
- Chrome Extension Manifest V3

## Development

```bash
npm install            # install dependencies
npm run dev            # start dev server
npm run build          # production build to dist/
npm run check          # lint, typecheck, unit tests and build
npm run test:e2e       # run the built extension in Chromium against a local HEP stand-in
npm run sync:stations  # refresh the area and station list from hep.hr
npm run screenshots    # regenerate the screenshots above
```

Node comes from `.nvmrc`. Run `npx playwright install chromium` once before
`npm run test:e2e`.

## Permissions

- `storage` saves your settings and the last fetched outage list.
- `alarms` runs the background check every three hours.
- Access to `https://www.hep.hr/*` reads the outage pages. The extension asks
  for no other site.
- `notifications` is optional. Chrome asks for it only when you switch on outage
  notifications in the settings.

## Contributing

Contributions and upgrade ideas are welcome!

## License

MIT License

Copyright (c) 2026 Dino Klicek
