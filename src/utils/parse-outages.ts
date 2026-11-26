import { IOutage, OutageKind } from '../models';

export class HepPageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HepPageError';
  }
}

interface IOutageFields {
  classNames: string[];
  place: string;
  street: string;
  note: string;
  time: string;
  reason: string;
}

const DIV_TAG = /<div\b[^>]*>|<\/div\s*>/gi;
const DIV_END = /<\/div\s*>/i;
const CLASS_ATTRIBUTE = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i;
const LABEL = /<strong\b[^>]*>([\s\S]*?)<\/strong>/i;
const TAG = /<[^>]*>/g;
const ENTITY = /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi;
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  scaron: 'š',
  Scaron: 'Š',
  zcaron: 'ž',
  Zcaron: 'Ž',
  ccaron: 'č',
  Ccaron: 'Č',
  cacute: 'ć',
  Cacute: 'Ć',
  dstrok: 'đ',
  Dstrok: 'Đ'
};

export function parseOutages(pageHtml: string, date: string): IOutage[] {
  const listHtml = readOutageListHtml(pageHtml);
  const outages: IOutageFields[] = [];
  let hasUnknownBlock = false;

  for (const tag of listHtml.matchAll(DIV_TAG)) {
    if (tag[0].startsWith('</')) {
      continue;
    }

    const classNames = readClassNames(tag[0]);

    if (classNames.includes('mjesto')) {
      outages.push({
        classNames,
        place: '',
        street: '',
        note: '',
        time: '',
        reason: ''
      });
      continue;
    }

    const outage = outages.at(-1);

    if (!outage) {
      hasUnknownBlock ||= !classNames.includes('clear');
      continue;
    }

    const field = readField(listHtml, tag.index + tag[0].length);

    if (classNames.includes('grad')) {
      outage.place = field.value;
    } else if (classNames.includes('ulica')) {
      if (field.label.toLowerCase().startsWith('napomena')) {
        outage.note = field.value;
      } else {
        outage.street = field.value;
      }
    } else if (classNames.includes('kada')) {
      outage.time = field.value;
    } else if (classNames.includes('tip')) {
      outage.reason = field.value.replace(/^radovi:\s*/i, '');
    }
  }

  const hasReadableOutage = outages.some(outage => outage.place || outage.time);

  if (hasUnknownBlock || (outages.length > 0 && !hasReadableOutage)) {
    throw new HepPageError('HEP outage list has an unknown structure');
  }

  return outages.map(outage => ({
    date,
    place: outage.place,
    street: outage.street,
    note: outage.note,
    time: outage.time,
    kind: readKind(outage),
    reason: outage.reason
  }));
}

function readOutageListHtml(pageHtml: string): string {
  let listStart = -1;
  let depth = 0;

  for (const tag of pageHtml.matchAll(DIV_TAG)) {
    const isClosing = tag[0].startsWith('</');

    if (listStart < 0) {
      if (!isClosing && readClassNames(tag[0]).includes('radwrap')) {
        listStart = tag.index + tag[0].length;
        depth = 1;
      }

      continue;
    }

    depth += isClosing ? -1 : 1;

    if (depth === 0) {
      return pageHtml.slice(listStart, tag.index);
    }
  }

  if (listStart < 0) {
    throw new HepPageError('HEP outage list not found in the page');
  }

  return pageHtml.slice(listStart);
}

function readClassNames(divTag: string): string[] {
  const match = CLASS_ATTRIBUTE.exec(divTag);
  const classValue = match?.[1] ?? match?.[2] ?? '';

  return classValue.split(/\s+/).filter(Boolean);
}

function readField(
  listHtml: string,
  start: number
): { label: string; value: string } {
  const length = listHtml.slice(start).search(DIV_END);
  const fieldHtml = listHtml.slice(
    start,
    length < 0 ? undefined : start + length
  );
  const label = LABEL.exec(fieldHtml)?.[1] ?? '';

  return {
    label: toText(label),
    value: toText(fieldHtml.replace(LABEL, ' '))
  };
}

function readKind(outage: IOutageFields): OutageKind {
  const reason = outage.reason.toLowerCase();

  if (reason.includes('neplanirani')) {
    return 'unplanned';
  }

  if (reason.includes('planirani')) {
    return 'planned';
  }

  if (outage.classNames.includes('tipP')) {
    return 'unplanned';
  }

  return outage.classNames.includes('tipR') ? 'planned' : 'other';
}

function toText(html: string): string {
  return decodeEntities(html.replace(TAG, ' ')).replace(/\s+/g, ' ').trim();
}

function decodeEntities(text: string): string {
  return text.replace(ENTITY, (entity, code: string) => {
    if (!code.startsWith('#')) {
      return (
        NAMED_ENTITIES[code] ?? NAMED_ENTITIES[code.toLowerCase()] ?? entity
      );
    }

    const isHex = code[1].toLowerCase() === 'x';
    const codePoint = parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);

    return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : entity;
  });
}
