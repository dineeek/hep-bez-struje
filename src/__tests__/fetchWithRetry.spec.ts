import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWithRetry } from '../utils/fetchWithRetry';

describe('fetchWithRetry', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return response on successful fetch', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse);

    const result = await fetchWithRetry('https://example.com');

    expect(result).toBe(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on network error and succeed', async () => {
    const mockResponse = new Response('ok', { status: 200 });
    vi.spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockResponse);

    const result = await fetchWithRetry('https://example.com', 2);

    expect(result).toBe(mockResponse);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on non-ok response and succeed', async () => {
    const failResponse = new Response('error', { status: 500 });
    const okResponse = new Response('ok', { status: 200 });
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(failResponse)
      .mockResolvedValueOnce(okResponse);

    const result = await fetchWithRetry('https://example.com', 2);

    expect(result).toBe(okResponse);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw after exhausting all retries on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    await expect(fetchWithRetry('https://example.com', 1)).rejects.toThrow(
      'Network error'
    );
    expect(fetch).toHaveBeenCalledTimes(2); // initial + 1 retry
  });

  it('should return last non-ok response after exhausting retries', async () => {
    const failResponse = new Response('error', { status: 500 });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(failResponse);

    const result = await fetchWithRetry('https://example.com', 1);

    expect(result.status).toBe(500);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
