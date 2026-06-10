const WP_BASE = process.env.NEXT_PUBLIC_WP_BASE_URL || process.env.WP_BASE_URL || "";

type WPResponse<T> = T | null;

export type SiteSetting = {
  id?: number;
  key: string;
  value?: string | null;
};

export type Member = {
  id: string;
  name: string;
  position?: string | null;
  division?: string | null;
  directorate?: string | null;
  photo_url?: string | null;
  image_url?: string | null;
  bio?: string | null;
  instagram_url?: string | null;
  social_links?: Record<string, string> | null;
  is_featured?: boolean;
};

export type MusicItem = {
  id: string | number;
  title: string;
  artist?: string | null;
  image_url?: string | null;
  spotify_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
};

export type ProgramBanner = {
  image_url: string;
  alt_text?: string | null;
  section?: string;
  sort_order?: number;
  is_active?: boolean;
};

export type PosterSlide = {
  id?: number;
  image_url?: string;
  title?: string | null;
  sort_order?: number;
};

export type Podcast = {
  id: string;
  title: string;
  subtitle?: string | null;
  category?: string | null;
  audio_url?: string | null;
  duration?: string | null;
};

async function safeFetch<T>(path: string): Promise<T | null> {
  if (!WP_BASE) return null;
  try {
    const res = await fetch(`${WP_BASE.replace(/\/$/,"")}/${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (e) {
    console.error("wp-client fetch error", e);
    return null;
  }
}

export async function fetchSiteSettings(): Promise<SiteSetting[] | null> {
  // expects a REST endpoint: /wp-json/wp/v2/site_settings
  return safeFetch<SiteSetting[]>("wp-json/wp/v2/site_settings?per_page=100");
}

export async function fetchFeaturedMember(): Promise<Member | null> {
  const data = await safeFetch<Member[]>("wp-json/wp/v2/members?per_page=1&filter[meta_is_featured]=1");
  if (!data || data.length === 0) return null;
  return data[0];
}

export async function fetchMusicList(): Promise<MusicItem[] | null> {
  return safeFetch<MusicItem[]>("wp-json/wp/v2/music?per_page=50");
}

export async function fetchProgramBanners(): Promise<ProgramBanner[] | null> {
  return safeFetch<ProgramBanner[]>("wp-json/wp/v2/program_banners?per_page=100");
}

export async function fetchPosterSlides(): Promise<PosterSlide[] | null> {
  return safeFetch<PosterSlide[]>("wp-json/wp/v2/poster_slides?per_page=100");
}

export async function fetchPodcasts(): Promise<Podcast[] | null> {
  return safeFetch<Podcast[]>("wp-json/wp/v2/podcasts?per_page=100");
}

export default {
  fetchSiteSettings,
  fetchFeaturedMember,
  fetchMusicList,
  fetchProgramBanners,
  fetchPosterSlides,
  fetchPodcasts,
};
