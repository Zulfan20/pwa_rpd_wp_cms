import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const streamUrl = 'http://s1.voscast.com:8080/stream';

  // small timeout to avoid long hangs when upstream is unstable
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  // Try multiple times for transient network errors (ECONNRESET, etc.)
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const attemptController = new AbortController();
    const attemptTimeout = setTimeout(() => attemptController.abort(), 12000);

    try {
      const response = await fetch(streamUrl, {
        signal: attemptController.signal,
        next: { revalidate: 0 },
        headers: {
          'Accept': 'audio/mpeg',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Connection': 'close',
        },
      });

      clearTimeout(attemptTimeout);

      if (!response.ok || !response.body) {
        console.error(`Attempt ${attempt}: Failed to fetch stream:`, response.status, response.statusText);
        // if final attempt, return error; otherwise retry
        if (attempt === maxAttempts) {
          return new NextResponse('Stream source error', { status: response.status || 502 });
        }
      } else {
        const headers = new Headers();
        headers.set('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.set('Pragma', 'no-cache');
        headers.set('Expires', '0');
        headers.set('Connection', 'close');

        return new NextResponse(response.body, { status: 200, headers });
      }
    } catch (error: any) {
      clearTimeout(attemptTimeout);
      // If abort, it's a timeout
      if (error?.name === 'AbortError') {
        console.warn(`Attempt ${attempt}: fetch aborted (timeout)`);
      } else {
        console.warn(`Attempt ${attempt}: fetch error:`, error && error.message ? error.message : error);
      }

      if (attempt < maxAttempts) {
        // small backoff before retrying
        await new Promise((r) => setTimeout(r, 800 * attempt));
        continue;
      }

      // final failure
      console.error('Audio proxy internal error after retries:', error);
      return new NextResponse('Error proxying audio stream', { status: 502 });
    }
  }
}
