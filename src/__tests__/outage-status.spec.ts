import { describe, expect, it } from 'vitest';
import { IOutage } from '../models';
import { getUserStreetOutages, hasOutageEnded } from '../utils/outage-status';

const createOutage = (fields: Partial<IOutage>): IOutage => ({
  date: '2026-11-26',
  place: 'ZAGREB',
  street: 'OZALJSKA 1-24 obje',
  note: '',
  time: '09:00 - 13:00',
  kind: 'planned',
  reason: 'planirani',
  ...fields
});

const AT_NOON_IN_ZAGREB = new Date('2026-11-26T11:00:00Z');

describe('outage-status', () => {
  it('should end an outage once its end time passes in Zagreb', () => {
    expect(
      hasOutageEnded(createOutage({ time: '09:00 - 12:00' }), AT_NOON_IN_ZAGREB)
    ).toBe(true);
    expect(
      hasOutageEnded(createOutage({ time: '09:00 - 12:01' }), AT_NOON_IN_ZAGREB)
    ).toBe(false);
    expect(
      hasOutageEnded(createOutage({ time: '8:00 - 9:30' }), AT_NOON_IN_ZAGREB)
    ).toBe(true);
  });

  it('should end every outage of an earlier day', () => {
    expect(
      hasOutageEnded(
        createOutage({ date: '2026-11-25', time: '22:00 - 23:00' }),
        AT_NOON_IN_ZAGREB
      )
    ).toBe(true);
  });

  it('should keep an outage of a later day', () => {
    expect(
      hasOutageEnded(
        createOutage({ date: '2026-11-27', time: '08:00 - 09:00' }),
        AT_NOON_IN_ZAGREB
      )
    ).toBe(false);
  });

  it('should keep an outage that runs past midnight', () => {
    expect(
      hasOutageEnded(createOutage({ time: '22:00 - 05:00' }), AT_NOON_IN_ZAGREB)
    ).toBe(false);
  });

  it('should keep an outage with an unreadable time', () => {
    expect(
      hasOutageEnded(createOutage({ time: 'tijekom dana' }), AT_NOON_IN_ZAGREB)
    ).toBe(false);
  });

  it('should list outages on a user street that have not ended', () => {
    const ended = createOutage({ time: '08:00 - 10:00' });
    const running = createOutage({ time: '11:00 - 14:00' });
    const otherStreet = createOutage({ street: 'ILICA 1-20' });

    expect(
      getUserStreetOutages(
        [ended, running, otherStreet],
        'Ozaljska',
        AT_NOON_IN_ZAGREB
      )
    ).toEqual([running]);
  });
});
