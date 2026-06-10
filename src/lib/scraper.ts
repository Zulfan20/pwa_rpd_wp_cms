import * as cheerio from 'cheerio';

export async function getHomepageData() {
  // Fetch the raw WordPress JSON for the Homepage (ID: 6495)
  // The 'revalidate: 3600' tells Next.js to update the cache every hour (ISR)
  const res = await fetch('https://radioppidunia.org/wp-json/wp/v2/pages/6495', {
    next: { revalidate: 3600 } 
  });
  
  if (!res.ok) throw new Error('Failed to fetch homepage data');
  
  const data = await res.json();
  const $ = cheerio.load(data.content.rendered);

  // Extract the exact UI elements you need
  return {
    tagline: $('[data-id="09766a8"] .elementor-heading-title').text().trim(),
    date: $('[data-id="8d7ed90"] .elementor-heading-title').text().trim(),
    featuredMember: {
      name: $('[data-id="bd1e03e"] .elementor-heading-title').text().trim(),
      image: $('[data-id="4e43c38"] img').attr('src') || ''
    },
    musicChart: $('.eael-image-accordion-item').map((_, el) => ({
      rank: $(el).find('.img-accordion-title').text().trim(),
      title: $(el).find('b').text().trim(),
      artist: $(el).find('p').last().text().trim(),
      bgImage: $(el).css('background-image')?.replace(/url\(['"]?|['"]?\)/g, '') || ''
    })).get()
  };
}