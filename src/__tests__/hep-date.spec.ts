import { describe, expect, it } from 'vitest';
import { addDays, getHepToday, toHepDateParam } from '../utils/hep-date';

describe('hep-date', () => {
  it('should take today from the Zagreb clock in winter', () => {
    expect(getHepToday(new Date('2026-11-26T22:59:00Z'))).toBe('2026-11-26');
    expect(getHepToday(new Date('2026-11-26T23:00:00Z'))).toBe('2026-11-27');
  });

  it('should take today from the Zagreb clock in summer', () => {
    expect(getHepToday(new Date('2026-07-01T21:59:00Z'))).toBe('2026-07-01');
    expect(getHepToday(new Date('2026-07-01T22:00:00Z'))).toBe('2026-07-02');
  });

  it('should add days across a month and a year', () => {
    expect(addDays('2026-11-29', 3)).toBe('2026-12-02');
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2026-11-26', 0)).toBe('2026-11-26');
  });

  it('should format a date the way HEP links do', () => {
    expect(toHepDateParam('2026-03-01')).toBe('01.03.2026');
  });
});
