// app/api/podcast/route.ts
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const PODCAST_PAGE_URL = 'https://radioppidunia.org/rpd-podcast-podcast/';

export async function GET() {
  try {
    const res = await fetch(PODCAST_PAGE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const podcasts: any[] = [];
    const entries = $('.swp_music_player_entry');

    entries.each((i, el) => {
      const audioUrl = $(el).attr('data-mediafile')?.trim();
      if (!audioUrl) return; // skip if no audio

      const title = $(el).find('.player_song_name').text().trim();
      const album = $(el).find('.player_song_name').attr('data-albumname')?.trim() || 'Siaran Spesial 2025';

      podcasts.push({
        id: `podcast-${i + 1}`,
        title: title || 'Untitled',
        subtitle: album,
        audio_url: audioUrl,
        category: 'Siaran Spesial 2025', // matches frontend filter
        duration: null, // can be calculated later if needed
        image_url: null, // none available in the player
        created_at: new Date().toISOString(),
      });
    });

    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('Podcast API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}