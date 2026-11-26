import { describe, expect, it } from 'vitest';
import {
  formatClockTime,
  formatDayHeading,
  formatOutageDay
} from '../utils/format-date';

describe('format-date', () => {
  it('should format an outage day in the given language', () => {
    expect(formatOutageDay('2026-11-26', 'en')).toBe('Thursday, November 26');
    expect(formatOutageDay('2026-11-26', 'hr')).toBe('četvrtak, 26. studenoga');
    expect(formatOutageDay('2026-11-26', 'de')).toBe(
      'Donnerstag, 26. November'
    );
  });

  it('should name today and tomorrow in a day heading', () => {
    expect(formatDayHeading('2026-11-26', '2026-11-26', 'en')).toBe(
      'Today · Thursday, November 26'
    );
    expect(formatDayHeading('2026-11-27', '2026-11-26', 'hr')).toBe(
      'Sutra · petak, 27. studenoga'
    );
  });

  it('should head a later day with its capitalized weekday', () => {
    expect(formatDayHeading('2026-11-28', '2026-11-26', 'hr')).toBe(
      'Subota, 28. studenoga'
    );
    expect(formatDayHeading('2026-12-01', '2026-11-29', 'en')).toBe(
      'Tuesday, December 1'
    );
  });

  it('should format a clock time in the given language', () => {
    const halfPastNine = new Date(2026, 10, 26, 21, 30).getTime();

    expect(formatClockTime(halfPastNine, 'hr')).toBe('21:30');
    expect(formatClockTime(halfPastNine, 'en-US')).toMatch(/^09:30\sPM$/);
  });
});
