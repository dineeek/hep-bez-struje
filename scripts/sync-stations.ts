import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { HEP_OUTAGES_URL } from '../src/meta/hep-url.ts';
import { fetchWithRetry } from '../src/utils/fetchWithRetry.ts';
import { readSelectLists } from './station-lists.ts';

const OUTPUT_FILE = resolve(
  import.meta.dirname,
  '../src/meta/distribution-areas.json'
);

const fetchPage = async (url: string): Promise<string> =>
  (await fetchWithRetry(url)).text();

const [areaOptions = []] = readSelectLists(await fetchPage(HEP_OUTAGES_URL));
const areas = [];

for (const area of areaOptions) {
  const areaUrl = new URL(HEP_OUTAGES_URL);

  areaUrl.searchParams.set('dp', area.value);

  const [, powerStations = []] = readSelectLists(await fetchPage(areaUrl.href));

  if (powerStations.length === 0) {
    throw new Error(`HEP lists no stations for ${area.value}`);
  }

  areas.push({ ...area, powerStations });
}

if (areas.length === 0) {
  throw new Error('HEP lists no distribution areas');
}

const stationCount = areas.reduce(
  (count, area) => count + area.powerStations.length,
  0
);

await writeFile(OUTPUT_FILE, `${JSON.stringify(areas, null, 2)}\n`);
console.log(`Wrote ${areas.length} areas and ${stationCount} stations`);
