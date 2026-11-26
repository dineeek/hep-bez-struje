import { describe, expect, it } from 'vitest';
import { groupOutagesByDay } from '../utils/group-outages';
import { parseOutages } from '../utils/parse-outages';
import { readFixture } from './fixtures/read-fixture';

const TODAY = parseOutages(readFixture('zagreb-ZG'), '2026-11-26');
const TOMORROW = parseOutages(readFixture('pula-121'), '2026-11-27');
const DATES = ['2026-11-26', '2026-11-27', '2026-11-28'];

describe('groupOutagesByDay', () => {
  it('should give every searched date its own day', () => {
    const days = groupOutagesByDay([...TODAY, ...TOMORROW], DATES, '');

    expect(days.map(day => [day.date, day.outages.length])).toEqual([
      ['2026-11-26', 4],
      ['2026-11-27', 3],
      ['2026-11-28', 0]
    ]);
  });

  it('should keep the HEP order when no user street matches', () => {
    const [today] = groupOutagesByDay(TODAY, DATES, 'Ilica');

    expect(today.outages.map(dayOutage => dayOutage.outage)).toEqual(TODAY);
    expect(today.outages.some(dayOutage => dayOutage.isUserStreet)).toBe(false);
  });

  it('should put outages on user streets first', () => {
    const [today] = groupOutagesByDay(TODAY, DATES, 'Mate Meršića, Ozaljska');

    expect(
      today.outages.map(dayOutage => [
        dayOutage.outage.time,
        dayOutage.isUserStreet
      ])
    ).toEqual([
      ['09:00 - 10:00', true],
      ['09:00 - 14:00', true],
      ['09:00 - 13:00', false],
      ['08:00 - 13:00', false]
    ]);
  });
});
