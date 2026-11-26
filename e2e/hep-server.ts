import { createServer } from 'node:http';
import {
  type FixtureName,
  readFixture
} from '../src/__tests__/fixtures/read-fixture.ts';
import { getHepToday } from '../src/utils/hep-date.ts';

export const HEP_SERVER_PORT = 4319;

const DAY_MS = 24 * 60 * 60 * 1000;
const NO_OUTAGES: FixtureName = 'bjelovar-BJ';

type FixturePerDay = Record<number, FixtureName>;

export interface IHepServer {
  requests: URL[];
  serve: (fixturePerDay: FixturePerDay) => void;
  failWith: (status: number | undefined) => void;
  close: () => Promise<void>;
}

const readDaysAhead = (datum: string | null): number => {
  const [day, month, year] = (datum ?? '').split('.');

  return Math.round(
    (Date.parse(`${year}-${month}-${day}`) - Date.parse(getHepToday())) / DAY_MS
  );
};

export async function startHepServer(): Promise<IHepServer> {
  const requests: URL[] = [];
  let fixturePerDay: FixturePerDay = { 1: 'zagreb-ZG' };
  let failureStatus: number | undefined;
  const server = createServer((request, response) => {
    const url = new URL(
      request.url ?? '/',
      `http://localhost:${HEP_SERVER_PORT}`
    );
    const daysAhead = readDaysAhead(url.searchParams.get('datum'));

    requests.push(url);

    if (failureStatus) {
      response.writeHead(failureStatus).end('HEP is down');
      return;
    }

    response
      .writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      .end(readFixture(fixturePerDay[daysAhead] ?? NO_OUTAGES));
  });

  await new Promise<void>(resolve => server.listen(HEP_SERVER_PORT, resolve));

  return {
    requests,
    serve: newFixturePerDay => {
      fixturePerDay = newFixturePerDay;
    },
    failWith: status => {
      failureStatus = status;
    },
    close: () =>
      new Promise<void>(resolve => {
        server.closeAllConnections();
        server.close(() => resolve());
      })
  };
}
