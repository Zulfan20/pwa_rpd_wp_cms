import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PosterSlide = {
  id: number
  image_url: string
  title: string | null
  link: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type MusicItem = {
  id: number
  title: string
  artist: string | null
  image_url: string | null
  spotify_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SiteSetting = {
  id: number
  key: string
  value: string | null
  updated_at: string
}

export type CenterPoster = {
  id: number
  image_url: string
  alt_text: string | null
  link: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Information = {
  id: number
  title: string
  content: string | null
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Member = {
  id: number
  name: string
  role: string | null
  image_url: string | null
  quote: string | null
  country: string | null
  social_links: Record<string, string> | null
  is_featured: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  // New fields for team structure
  position: string | null
  division: string | null
  directorate: string | null
  member_type: string | null
  photo_url: string | null
}

export type Podcast = {
  id: string
  title: string
  subtitle: string | null
  category: string
  audio_url: string | null
  duration: string
  created_at: string
  updated_at: string
}
