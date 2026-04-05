<img align="left" width="64" height="64" src="https://github.com/dineeek/hep-bez-struje/blob/master/assets/icons/icon.png" alt="Extension icon">

# Hep - bez struje

![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/dineeek/hep-bez-struje?include_prereleases)
[![lint:test:build](https://github.com/dineeek/hep-bez-struje/actions/workflows/lint-test-build.yml/badge.svg?branch=master)](https://github.com/dineeek/hep-bez-struje/actions/workflows/lint-test-build.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![Github](https://img.shields.io/github/license/dineeek/hep-bez-struje)
![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/hahhmkkofmofnadefiadmpmcencoaljf)
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/hahhmkkofmofnadefiadmpmcencoaljf)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

Unofficial HEP Chrome extension for checking areas without electric power. Based
on HEP web page data scraping, TypeScript & React.

## Download

Available at
[**Chrome Web Store**](https://chrome.google.com/webstore/detail/hep-bez-struje/hahhmkkofmofnadefiadmpmcencoaljf).

![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/hahhmkkofmofnadefiadmpmcencoaljf)

## Screenshots

| Settings                                       | Loading                                      | Notification list                                   | No notifications                                         |
| ---------------------------------------------- | -------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------- |
| ![Settings](assets/screenshots/1-settings.png) | ![Loading](assets/screenshots/2-loading.png) | ![Notification list](assets/screenshots/3-list.png) | ![No notifications](assets/screenshots/4-no-notifications.png) |

## Features

- Showing areas without electrical power per selected area and station
- Storing user selected distribution area and power station
- Highlighting expected power outage for user street
- Up to three days future date search
- Automatic retry on network failures
- Available localization:
  - German
  - English
  - Croatian
  - Hungarian
  - Slovenian

## Tech Stack

- React 18 with TypeScript 5
- Vite 8 with @crxjs/vite-plugin
- Vitest for testing
- ESLint + Prettier for code quality
- Chrome Extension Manifest V3

## Development

```bash
npm install    # install dependencies
npm run dev    # start dev server
npm run build  # production build to dist/
npm run test   # run tests
npm run lint   # check formatting and lint
```

## Permissions

The extension needs permissions for storing user options preferences.

## Contributing

Contributions and upgrade ideas are welcome!

## License

MIT License

Copyright (c) 2026 Dino Klicek
