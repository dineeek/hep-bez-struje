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

  it('should order a day by start time and then by end time', () => {
    const [today] = groupOutagesByDay(TODAY, DATES, '');

    expect(today.outages.map(dayOutage => dayOutage.outage.time)).toEqual([
      '08:00 - 13:00',
      '09:00 - 10:00',
      '09:00 - 13:00',
      '09:00 - 14:00'
    ]);
  });

  it('should mark an outage on a user street where it stands', () => {
    const [today] = groupOutagesByDay(TODAY, DATES, 'Mate Meršića, Ozaljska');

    expect(
      today.outages.map(dayOutage => [
        dayOutage.outage.time,
        dayOutage.isUserStreet
      ])
    ).toEqual([
      ['08:00 - 13:00', false],
      ['09:00 - 10:00', true],
      ['09:00 - 13:00', false],
      ['09:00 - 14:00', true]
    ]);
  });

  it('should put an outage with an unreadable time last', () => {
    const allDay = { ...TODAY[0], time: 'tijekom dana' };
    const [today] = groupOutagesByDay([allDay, ...TODAY], DATES, '');

    expect(today.outages.at(-1)?.outage).toEqual(allDay);
  });

  it('should leave the given outages in their order', () => {
    const outages = [...TODAY];
    groupOutagesByDay(outages, DATES, '');

    expect(outages).toEqual(TODAY);
  });
});
