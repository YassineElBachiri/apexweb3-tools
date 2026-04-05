// lib/utils/fetchWithRetry.ts

/**
 * Fetch with automatic retries, exponential backoff, and 8-second timeout.
 * Never throws — returns null on all failure modes.
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoffMs = 500
): Promise<any> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (err: any) {
      const isLast = attempt === retries - 1;
      if (err?.name === 'AbortError') {
        console.error(`[TIMEOUT] ${url} — attempt ${attempt + 1}`);
      } else {
        console.error(`[API FAIL] ${url} — attempt ${attempt + 1} — ${err?.message}`);
      }
      if (isLast) return null;
      // Exponential backoff: 500ms, 1000ms, 2000ms …
      await new Promise((r) => setTimeout(r, backoffMs * Math.pow(2, attempt)));
    }
  }
  return null;
}

/**
 * Safely extract the value from a PromiseSettledResult.
 * Returns null if the promise was rejected.
 */
export function extractSettled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null;
}
