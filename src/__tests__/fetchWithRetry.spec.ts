import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithRetry, HttpStatusError } from '../utils/fetchWithRetry';

const settle = async <T>(request: Promise<T>): Promise<T | unknown> => {
  const outcome = request.catch((error: unknown) => error);
  await vi.runAllTimersAsync();

  return outcome;
};

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should return response on successful fetch', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse);
    const result = await settle(fetchWithRetry('https://example.com'));

    expect(result).toBe(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on network error and succeed', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    vi.spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockResponse);
    const result = await settle(fetchWithRetry('https://example.com', 2));

    expect(result).toBe(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on a server error and succeed', async () => {
    const okResponse = new Response('ok', { status: 200 });
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('error', { status: 500 }))
      .mockResolvedValueOnce(okResponse);
    const result = await settle(fetchWithRetry('https://example.com', 2));

    expect(result).toBe(okResponse);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw after exhausting all retries on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
    const result = await settle(fetchWithRetry('https://example.com', 1));

    expect(result).toEqual(new Error('Network error'));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw the status after exhausting retries on a server error', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response('error', { status: 503 })
    );
    const result = await settle(fetchWithRetry('https://example.com', 1));

    expect(result).toBeInstanceOf(HttpStatusError);
    expect((result as HttpStatusError).status).toBe(503);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should not retry a request the server rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response('missing', { status: 404 })
    );
    const result = await settle(fetchWithRetry('https://example.com'));

    expect((result as HttpStatusError).status).toBe(404);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should give each attempt a time limit', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    await settle(fetchWithRetry('https://example.com'));

    expect(vi.mocked(fetch).mock.calls[0][1]?.signal).toBeInstanceOf(
      AbortSignal
    );
  });
});
