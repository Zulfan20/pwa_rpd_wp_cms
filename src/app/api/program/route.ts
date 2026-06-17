// app/api/program/route.ts
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const HOME_PAGE_URL = 'https://radioppidunia.org/'; // the homepage contains the banners & tagline

export async function GET() {
  try {
    const res = await fetch(HOME_PAGE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Tagline & Date
    const rawTagline = $('[data-id="09766a8"] .elementor-heading-title').text().trim();
    const rawDate = $('[data-id="8d7ed90"] .elementor-heading-title').text().trim().replace(/-/g, '').trim();

    // Banners from Siaran Reguler (data-id="ba48b9a") and Siaran Spesial (data-id="30480b7")
    const regularBanners = $('[data-id="ba48b9a"] .n2-ss-slide-background-image img')
      .map((_, el) => {
        let src = $(el).attr('src') || '';
        if (src.startsWith('//')) src = `https:${src}`;
        return { image_url: src, alt: 'Siaran Reguler' };
      })
      .get();

    const specialBanners = $('[data-id="30480b7"] .n2-ss-slide-background-image img')
      .map((_, el) => {
        let src = $(el).attr('src') || '';
        if (src.startsWith('//')) src = `https:${src}`;
        return { image_url: src, alt: 'Siaran Spesial' };
      })
      .get();

    return NextResponse.json({
      what_is_on_tagline: rawTagline || '"Melangkah Menuju Awal Baru bersama Radio PPI Dunia"',
      what_is_on_date: rawDate || 'December 2025',
      regularBanners,
      specialBanners,
    });
  } catch (error) {
    console.error('Program API error:', error);
    return NextResponse.json({
      what_is_on_tagline: '',
      what_is_on_date: '',
      regularBanners: [],
      specialBanners: [],
    }, { status: 500 });
  }
}