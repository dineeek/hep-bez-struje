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

export function toText(html: string): string {
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
