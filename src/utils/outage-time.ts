const TIME_RANGE = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;

export interface ITimeRange {
  start: string;
  end: string;
}

export function readTimeRange(time: string): ITimeRange | undefined {
  const range = TIME_RANGE.exec(time);

  if (!range) {
    return undefined;
  }

  return {
    start: `${range[1].padStart(2, '0')}:${range[2]}`,
    end: `${range[3].padStart(2, '0')}:${range[4]}`
  };
}

export function formatTimeRange(time: string): string {
  const range = readTimeRange(time);

  return range ? `${range.start} – ${range.end}` : time;
}
