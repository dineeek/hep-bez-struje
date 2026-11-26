import { describe, expect, it } from 'vitest';
import {
  findUserMatch,
  isUserStreet,
  parseUserStreets
} from '../utils/street-match';

const SESVETE_STREETS =
  'BJELOVARSKA 2-32 par, 3, KARLOVAČKA 2-30 par, 1-25 nep, OZALJSKA 1-24 obje, KAŠINSKA 40/A';

describe('street-match', () => {
  it('should split user streets on commas, semicolons and line breaks', () => {
    expect(
      parseUserStreets(' Ilica , Ozaljska;Savska\nVukovarska ,, ')
    ).toEqual(['Ilica', 'Ozaljska', 'Savska', 'Vukovarska']);
  });

  it('should match a street typed without diacritics or capitals', () => {
    expect(
      isUserStreet('Šenoina 1, 2, 3; Kukuljevićeva 1 - 9', 'senoina')
    ).toBe(true);
    expect(isUserStreet('JEĐUTOVA 2-10 par, 1-9 nep', 'jedutova')).toBe(true);
    expect(isUserStreet('Senoina 4', 'ŠENOINA')).toBe(true);
  });

  it('should not match a street inside a longer street name', () => {
    expect(isUserStreet(SESVETE_STREETS, 'Lovačka')).toBe(false);
    expect(isUserStreet(SESVETE_STREETS, 'Karlovačka')).toBe(true);
  });

  it('should match a street name of several words', () => {
    expect(
      isUserStreet('ZORANIĆEVA, ULICA GRADA VUKOVARA 267', 'Grada Vukovara')
    ).toBe(true);
    expect(isUserStreet('S. Radića 27, 32 a', 's. radića')).toBe(true);
  });

  it('should match when any of several user streets is listed', () => {
    expect(isUserStreet(SESVETE_STREETS, 'Ilica, Ozaljska')).toBe(true);
    expect(isUserStreet(SESVETE_STREETS, 'Ilica; Savska')).toBe(false);
  });

  it('should ignore a house number after the user street', () => {
    expect(isUserStreet(SESVETE_STREETS, 'Ozaljska 112a')).toBe(true);
  });

  it('should ignore spaces around the user street', () => {
    expect(isUserStreet(SESVETE_STREETS, '  Ozaljska  ')).toBe(true);
  });

  it('should not match a term shorter than three letters', () => {
    expect(isUserStreet(SESVETE_STREETS, 'a')).toBe(false);
    expect(isUserStreet(SESVETE_STREETS, 'A, 40')).toBe(false);
  });

  it('should not match when either side is empty', () => {
    expect(isUserStreet(SESVETE_STREETS, '')).toBe(false);
    expect(isUserStreet(SESVETE_STREETS, ' , ')).toBe(false);
    expect(isUserStreet('', 'Ozaljska')).toBe(false);
  });

  it('should match a saved street before a saved place', () => {
    const outage = { place: 'SESVETE', street: 'OZALJSKA 1-24 obje' };

    expect(findUserMatch(outage, 'Ozaljska, Sesvete')).toBe('street');
    expect(findUserMatch(outage, 'Sesvete')).toBe('place');
    expect(findUserMatch(outage, 'Ilica')).toBeUndefined();
  });

  it('should match a place that HEP lists without a street', () => {
    const outage = { place: 'VETERNICA, KUZMINEC', street: '' };

    expect(findUserMatch(outage, 'kuzminec')).toBe('place');
  });

  it('should match a town inside a longer place description', () => {
    const outage = { place: 'IVANEC - DIO CENTRA', street: 'VRTNA ULICA 11' };

    expect(findUserMatch(outage, 'Ivanec')).toBe('place');
    expect(findUserMatch(outage, 'Ivan')).toBeUndefined();
  });
});
