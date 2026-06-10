// app/api/about/route.ts
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const ABOUT_PAGE_URL = 'https://radioppidunia.org/about-us/'; // correct URL

// Keep these as fallback if extraction fails
const FALLBACK_BACKGROUNDS = [
  "https://radioppidunia.org/wp-content/uploads/2022/01/phot2-scaled.jpg",
  "https://radioppidunia.org/wp-content/uploads/2022/01/phot-scaled.jpg",
  "https://radioppidunia.org/wp-content/uploads/2025/01/IMG_8452.JPEG-1-scaled.jpg",
  "https://radioppidunia.org/wp-content/uploads/2025/01/IMG_8451.JPEG.jpg",
];

const DIRECTORATE_KEY_MAP: Record<string, string> = {
  bod: 'bod',
  Announcer: 'sobat_siar',
  operational: 'operational',
  production: 'produksi',
  communication: 'komunikasi',
  marketing: 'marketing',
  technology: 'technology',
};

const DIVISION_LABEL_MAP: Record<string, string> = {
  hrd: 'HRD',
  program: 'Program',
  BroadCasting: 'Broadcast',
  visdes: 'Visual Design',
  audio: 'Audio',
  video: 'Video',
  event: 'Event',
  public_relations: 'Public Relation',
  community: 'Community Relations',
  research: 'Research',
  social_media: 'Social Media',
  sales: 'Sales & Partnership',
  mobweb: 'Mobile & Web Development',
  technical: 'Technical Division',
  music: 'Music Division',
};

export async function GET() {
  try {
    const res = await fetch(ABOUT_PAGE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store'
    });

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    // 1. Extract hero background images from Elementor slideshow
    const aboutBackgrounds = extractBackgroundImages(html) || FALLBACK_BACKGROUNDS;

    // 2. Extract team members from the JSON block
    const members = extractMembers($);

    return NextResponse.json({ members, aboutBackgrounds });
  } catch (error) {
    console.error('About API error:', error);
    return NextResponse.json(
      { members: [], aboutBackgrounds: FALLBACK_BACKGROUNDS },
      { status: 200 }
    );
  }
}

/**
 * Parses the Elementor section's data-settings to retrieve
 * the background_slideshow_gallery image URLs.
 */
function extractBackgroundImages(html: string): string[] | null {
  // Match the section element that contains background_slideshow_gallery in its data-settings
  const regex = /<section[^>]+data-settings="([^"]*background_slideshow_gallery[^"]*)"/;
  const match = html.match(regex);
  if (!match) return null;

  // Decode HTML entities (Elementor escapes quotes)
  const settingsStr = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  try {
    const settings = JSON.parse(settingsStr);
    const gallery = settings.background_slideshow_gallery;
    if (!Array.isArray(gallery)) return null;

    // Extract the url of each slide
    const urls = gallery.map((item: any) => item.url).filter(Boolean);
    return urls.length ? urls : null;
  } catch (e) {
    console.error('Failed to parse slideshow settings:', e);
    return null;
  }
}

/**
 * Looks for <script type="application/json" id="rpd-team-data"> and
 * parses the JSON inside it to build the members array.
 */
function extractMembers($: cheerio.CheerioAPI): any[] {
  const jsonBlock = $('#rpd-team-data');
  if (jsonBlock.length === 0) {
    console.warn('No #rpd-team-data block found on the page');
    return [];
  }

  const rawJson = (jsonBlock.html() || '').trim();
  if (!rawJson) {
    console.warn('#rpd-team-data block is empty');
    return [];
  }

  try {
    const teamData = JSON.parse(rawJson);
    return mapTeamDataToMembers(teamData);
  } catch (e) {
    console.error('Failed to parse JSON from #rpd-team-data:', e);
    return [];
  }
}

function mapTeamDataToMembers(teamData: any): any[] {
  const members: any[] = [];
  let memberId = 0;

  Object.keys(teamData).forEach((wpDirKey) => {
    const frontendDirKey = DIRECTORATE_KEY_MAP[wpDirKey];
    if (!frontendDirKey) return;

    const directorate = teamData[wpDirKey];

    if (Array.isArray(directorate.members)) {
      directorate.members.forEach((m: any) => {
        members.push({
          id: memberId++,
          name: m.name,
          directorate: frontendDirKey,
          division: null,
          position: m.position,
          bio: m.bio || '',
          photo_url: m.image || '',
          instagram_url: m.instagram || '',
        });
      });
    }

    if (directorate.divisions) {
      Object.keys(directorate.divisions).forEach((wpDivKey) => {
        const division = directorate.divisions[wpDivKey];
        const frontendDivLabel = DIVISION_LABEL_MAP[wpDivKey];
        if (!frontendDivLabel) return;

        if (Array.isArray(division.members)) {
          division.members.forEach((m: any) => {
            members.push({
              id: memberId++,
              name: m.name,
              directorate: frontendDirKey,
              division: frontendDivLabel,
              position: m.position,
              bio: m.bio || '',
              photo_url: m.image || '',
              instagram_url: m.instagram || '',
            });
          });
        }
      });
    }
  });

  return members;
}