import type messages from '../../public/_locales/hr/messages.json';

export type MessageKey = keyof typeof messages;

export function localize(key: MessageKey, substitution?: string): string {
  return chrome.i18n.getMessage(key, substitution);
}

export function getMessageLocale(): string {
  return localize('locale');
}
