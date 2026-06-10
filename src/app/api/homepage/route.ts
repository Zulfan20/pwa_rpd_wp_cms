import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    // 1. Fetch live HTML using a real browser User-Agent to bypass security/bot blocks
    const res = await fetch('https://radioppidunia.org/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store' // Forces fresh content while we test
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: `WP Server responded with status ${res.status}` }, { status: res.status });
    }
    
    const html = await res.text();
    const $ = cheerio.load(html);

    // 2. Extract Tagline & Date
    const rawTagline = $('[data-id="09766a8"] .elementor-heading-title').text().trim();
    const rawDate = $('[data-id="8d7ed90"] .elementor-heading-title').text().trim().replace(/-/g, '').trim();

    // 3. Extract Sobat Siar
    const rawSsName = $('[data-id="bd1e03e"] .elementor-heading-title').text().trim();
    const nameParts = rawSsName.split('-');
    const featuredMember = {
      name: nameParts[0] ? nameParts[0].trim() : 'Sobat Siar',
      country: nameParts[1] ? nameParts[1].trim() : '',
      quote: "Stay Creative, Stay Productive",
      image_url: $('[data-id="4e43c38"] img').attr('src') || ''
    };

    // 4. Extract Music Chart (With Modified Artist Parser)
    const musicList = $('.eael-image-accordion-item').map((i, el) => {
      const bgStyle = $(el).attr('style') || '';
      const bgMatch = bgStyle.match(/url\(['"]?(.*?)['"]?\)/);
      const imageUrl = bgMatch ? bgMatch[1] : null;

      const title = $(el).find('b').text().trim();
      
      // Fine-tuned target for the flattened nested paragraphs containing the artist
      let artist = '';
      $(el).find('.overlay-inner p').each((_, pEl) => {
        const text = $(pEl).text().trim();
        // If the paragraph has text, doesn't contain the bold title, and isn't the title itself
        if (text && $(pEl).find('b').length === 0 && text !== title) {
          artist = text;
        }
      });

      return {
        id: i + 1,
        title: title || "Unknown Title",
        artist: artist || "Unknown Artist",
        image_url: imageUrl,
        spotify_url: null 
      };
    }).get();

    // 5. Extract Banners from the Live DOM
    // Siaran Reguler (data-id="ba48b9a")
    const regularBanners = $('[data-id="ba48b9a"] .n2-ss-slide-background-image img').map((_, el) => {
      let src = $(el).attr('src') || '';
      if (src.startsWith('//')) src = `https:${src}`;
      return { image_url: src, section: 'regular' };
    }).get();

    // Siaran Spesial (data-id="30480b7")
    const specialBanners = $('[data-id="30480b7"] .n2-ss-slide-background-image img').map((_, el) => {
      let src = $(el).attr('src') || '';
      if (src.startsWith('//')) src = `https:${src}`;
      return { image_url: src, section: 'special' };
    }).get();

    const banners = [...regularBanners, ...specialBanners];

    // 6. Send structural payload to the frontend
    return NextResponse.json({
      settings: {
        hero_title_1: "Suara Anak Bangsa",
        hero_title_2: "Satu Cinta",
        hero_title_3: "Satu Indonesia",
        description_24h: "24 jam mengudara dengan berbagai program menarik, inovatif, dan informatif",
        what_is_on_tagline: rawTagline || "Melangkah Menuju Awal Baru\nbersama Radio PPI Dunia",
        what_is_on_date: rawDate || "December 2025"
      },
      featuredMember,
      musicList,
      banners 
    });

  } catch (error: any) {
    console.error("Scraper Error:", error);
    return NextResponse.json({ error: error.message || "Failed to scrape data" }, { status: 500 });
  }
}