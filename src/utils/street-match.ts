import { IOutage } from '../models';

export type UserMatch = 'street' | 'place';

const MIN_STREET_LENGTH = 3;

export function parseUserStreets(userStreet: string): string[] {
  return userStreet
    .split(/[,;\n]/)
    .map(street => street.trim())
    .filter(Boolean);
}

export function isUserStreet(
  outageStreet: string,
  userStreet: string
): boolean {
  const outageWords = ` ${toWords(outageStreet)} `;

  return parseUserStreets(userStreet)
    .map(street => toWords(street).replace(/( \d\w*)+$/, ''))
    .filter(street => street.length >= MIN_STREET_LENGTH)
    .some(street => outageWords.includes(` ${street} `));
}

export function findUserMatch(
  outage: Pick<IOutage, 'place' | 'street'>,
  userStreet: string
): UserMatch | undefined {
  if (isUserStreet(outage.street, userStreet)) {
    return 'street';
  }

  return isUserStreet(outage.place, userStreet) ? 'place' : undefined;
}

function toWords(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
