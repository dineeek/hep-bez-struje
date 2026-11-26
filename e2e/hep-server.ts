import { createServer } from 'node:http';
import { readFixture } from '../src/__tests__/fixtures/read-fixture.ts';
import { addDays, getHepToday, toHepDateParam } from '../src/utils/hep-date.ts';

export const HEP_SERVER_PORT = 4319;

export interface IHepServer {
  requests: URL[];
  failWith: (status: number | undefined) => void;
  close: () => Promise<void>;
}

export async function startHepServer(): Promise<IHepServer> {
  const requests: URL[] = [];
  let failureStatus: number | undefined;
  const server = createServer((request, response) => {
    const url = new URL(
      request.url ?? '/',
      `http://localhost:${HEP_SERVER_PORT}`
    );
    const tomorrow = toHepDateParam(addDays(getHepToday(), 1));
    const isTomorrow = url.searchParams.get('datum') === tomorrow;

    requests.push(url);

    if (failureStatus) {
      response.writeHead(failureStatus).end('HEP is down');
      return;
    }

    response
      .writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      .end(readFixture(isTomorrow ? 'zagreb-ZG' : 'bjelovar-BJ'));
  });

  await new Promise<void>(resolve => server.listen(HEP_SERVER_PORT, resolve));

  return {
    requests,
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
