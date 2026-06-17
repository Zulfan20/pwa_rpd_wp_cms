// app/api/now-playing/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // We completely bypass the messy VosCast JS CDN.
    // Instead, we ask the raw SHOUTcast server directly for its /7.html stats page.
    const SHOUTCAST_URL = "http://s1.voscast.com:8080/7.html";

    const res = await fetch(SHOUTCAST_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Radio server offline: ${res.status}`);
    }

    const text = await res.text();

    // The response looks like: <HTML><meta ...><body>1,1,23,100,23,128,Artist - Song Title</body></HTML>
    // 1. We extract everything inside the <body> tag
    const bodyMatch = text.match(/<body>(.*?)<\/body>/i);

    if (bodyMatch && bodyMatch[1]) {
      const stats = bodyMatch[1].split(',');
      
      // 2. In SHOUTcast, the 7th item (index 6) is ALWAYS the current song title.
      if (stats.length >= 7) {
        // If the song title contains commas (e.g. "SK Faiz - Mesir, SK Davina"), 
        // the .split(',') above accidentally breaks it apart. 
        // We use .slice(6).join(',') to stitch the full title back together perfectly!
        const songTitle = stats.slice(6).join(',').trim();
        
        return NextResponse.json({ 
          displayTitle: songTitle || "Radio PPI Dunia Mengudara" 
        });
      }
    }

    // Fallback if the radio server is online but isn't sending a song title
    return NextResponse.json({ displayTitle: "Radio PPI Dunia Mengudara" });

  } catch (error) {
    console.error("Now Playing Scraper Error:", error);
    // Fallback if the server is completely unreachable
    return NextResponse.json({ displayTitle: "Radio PPI Dunia - Live" });
  }
}