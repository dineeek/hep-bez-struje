import { toText } from '../src/utils/html-text.ts';

export interface ISelectOption {
  value: string;
  name: string;
}

const STATION_SELECT =
  /<select\b[^>]*\bpopispogona\b[^>]*>([\s\S]*?)<\/select>/gi;
const OPTION =
  /<option\b[^>]*\bvalue\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([^<]*)/gi;

export function readSelectLists(pageHtml: string): ISelectOption[][] {
  return [...pageHtml.matchAll(STATION_SELECT)].map(select =>
    [...select[1].matchAll(OPTION)]
      .map(option => ({
        value: option[1] ?? option[2] ?? '',
        name: toText(option[3])
      }))
      .filter(option => option.value)
  );
}
