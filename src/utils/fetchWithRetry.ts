const DEFAULT_RETRIES = 3;
const INITIAL_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 10_000;

export class HttpStatusError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
    this.name = 'HttpStatusError';
  }
}

const isRetryable = (error: unknown): boolean =>
  !(error instanceof HttpStatusError) ||
  error.status >= 500 ||
  error.status === 429;

export async function fetchWithRetry(
  url: string,
  retries = DEFAULT_RETRIES
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });

      if (response.ok) {
        return response;
      }

      throw new HttpStatusError(response.status);
    } catch (error) {
      if (attempt >= retries || !isRetryable(error)) {
        throw error;
      }
    }

    await new Promise(resolve =>
      setTimeout(resolve, INITIAL_DELAY_MS * 2 ** attempt)
    );
  }
}
