import { describe, expect, it } from 'vitest';
import { readSelectLists } from '../../scripts/station-lists';
import { readFixture } from './fixtures/read-fixture';

describe('readSelectLists', () => {
  it('should read areas and stations from a HEP page', () => {
    const [areas, stations] = readSelectLists(readFixture('zagreb-ZG'));

    expect(areas).toHaveLength(21);
    expect(areas[0]).toEqual({ value: 'bjelovar', name: 'Elektra Bjelovar' });
    expect(stations).toEqual([
      { value: 'ZG', name: 'Elektra Zagreb' },
      { value: '115', name: 'Samobor' },
      { value: '114', name: 'Velika Gorica' },
      { value: '177', name: 'Zaprešić' },
      { value: '113', name: 'Zelina' },
      { value: '187', name: 'Dugo Selo' },
      { value: '118', name: 'Sveta Klara' }
    ]);
  });

  it('should read no lists from a page without them', () => {
    expect(readSelectLists('<html><body></body></html>')).toEqual([]);
  });
});
