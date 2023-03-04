<img align="left" width="32" height="32" src="https://github.com/dineeek/hep-bez-struje/blob/develop/assets/icons/icon.png" alt="Extension icon">

# Hep - bez struje

[![lint:test:build](https://github.com/dineeek/hep-bez-struje/actions/workflows/lint-test-build.yml/badge.svg?branch=develop)](https://github.com/dineeek/hep-bez-struje/actions/workflows/lint-test-build.yml)
![version](https://img.shields.io/github/v/release/hep-bez-struje/hep-bez-struje?label=version&sort=semver)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

Chrome extension for checking HEP areas without electric power. Based on HEP web
page data scrapping, TypeScript & React.

## Download

TODO + download badges

## Features

- Storing distribution area and power station in extension options
- Showing areas without electrical power per selected area and station
- Up to three days future search
- Detecting user street if it will not have electricity for some day
- Supported languages: DE, EN, HR, HU and SL

<details style="display: flex; flex-direction: column; row-gap: 20px; justify-content: center; cursor: pointer;">
  <summary>Extension screenshots</summary>
  <img src="https://github.com/dineeek/hep-bez-struje/blob/develop/assets/screenshots/en/0_loader.png" name="Loading notifications">
  <img src="https://github.com/dineeek/hep-bez-struje/blob/develop/assets/screenshots/en/1_no_preferences_selected.png" name="No preferences selected message">
  <img src="https://github.com/dineeek/hep-bez-struje/blob/develop/assets/screenshots/en/2_selected_prefrences.png" name="Selected required preferences">
  <img src="https://github.com/dineeek/hep-bez-struje/blob/develop/assets/screenshots/en/3_no_notifications.png" name="No notifications found">
  <img src="https://github.com/dineeek/hep-bez-struje/blob/develop/assets/screenshots/en/4_insert_all_preferences.png" name="All preferences are inserted">
  <img src="https://github.com/dineeek/hep-bez-struje/blob/develop/assets/screenshots/en/5_notifications.png" name="Notification and highlighted on with user street">
</details>

## Permissions

The extensions needs permissions for storing selected options preferences.

# Contributing

Contributions are welcome!

# License

MIT License

Copyright (c) 2023 Dino Klicek
