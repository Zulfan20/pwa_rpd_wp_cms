import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const streamUrl = 'http://s1.voscast.com:8080/stream';
  
  try {
    const response = await fetch(streamUrl, {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'audio/mpeg',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok || !response.body) {
      console.error('Failed to fetch stream:', response.statusText);
      return new NextResponse('Stream source error', { status: response.status });
    }

    // Set headers to prevent caching and identify as audio
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    headers.set('Connection', 'keep-alive');

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Audio proxy internal error:', error);
    return new NextResponse('Error proxying audio stream', { status: 500 });
  }
}
