import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const FIXTURE_DATE = '2026-11-26';

export const FIXTURE_NAMES = [
  'zagreb-ZG',
  'pula-121',
  'karlovac-KA',
  'rijeka-RI',
  'bjelovar-BJ'
] as const;

export type FixtureName = (typeof FIXTURE_NAMES)[number];

export function readFixture(name: FixtureName): string {
  return readFileSync(resolve(import.meta.dirname, `${name}.html`), 'utf8');
}
