# Privacy Policy

**Hep - bez struje** Chrome Extension

*Last updated: November 26, 2026*

## Data Collection

This extension does **not** collect, transmit, or share any personal data.

## Data Storage

The extension stores your preferences (selected distribution area, power station, street names, future search and notification settings) in Chrome's synced storage (`chrome.storage.sync`). Chrome syncs them through your Google account. The last outage list fetched from HEP is kept on your device (`chrome.storage.local`). None of this is sent to a server controlled by the developer.

## Network Requests

The extension fetches publicly available power outage data from the official HEP website (hep.hr) when you open it and in the background every three hours. A request carries the selected distribution area, the power station and a date. Street names are compared on your device and are not part of any request.

## Notifications

Desktop notifications are off by default. Chrome asks for the notification permission only when you switch them on in the settings, and saving the settings with them switched off removes it.

## Third Parties

This extension does not use any analytics, tracking, advertising, or third-party services.

## Changes

If this policy changes, the update will be posted here with a revised date.

## Contact

For questions about this policy, open an issue at [github.com/dineeek/hep-bez-struje](https://github.com/dineeek/hep-bez-struje/issues).
