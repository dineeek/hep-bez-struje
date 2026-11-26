import { describe, expect, it } from 'vitest';
import { formatTimeRange, readTimeRange } from '../utils/outage-time';

describe('outage-time', () => {
  it('should read the start and the end of a time range', () => {
    expect(readTimeRange('08:30 - 11:00')).toEqual({
      start: '08:30',
      end: '11:00'
    });
  });

  it('should pad a single digit hour', () => {
    expect(readTimeRange('8:00-9:30')).toEqual({
      start: '08:00',
      end: '09:30'
    });
  });

  it('should read nothing from a text without a time range', () => {
    expect(readTimeRange('tijekom dana')).toBeUndefined();
  });

  it('should format a time range with an en dash', () => {
    expect(formatTimeRange('08:30 - 11:00')).toBe('08:30 – 11:00');
  });

  it('should leave a text without a time range as it is', () => {
    expect(formatTimeRange('tijekom dana')).toBe('tijekom dana');
  });
});
