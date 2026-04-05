const DEFAULT_RETRIES = 3;
const INITIAL_DELAY_MS = 500;

export async function fetchWithRetry(
  url: string,
  retries = DEFAULT_RETRIES
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      if (attempt === retries) {
        return response;
      }
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
    }
    await new Promise(resolve =>
      setTimeout(resolve, INITIAL_DELAY_MS * Math.pow(2, attempt))
    );
  }
  throw new Error('Unreachable');
}
