import { getMessageLocale, localize } from '../utils';

export function setUpDocument(): void {
  document.documentElement.lang = getMessageLocale();
  document.title = localize('extensionName');
}
