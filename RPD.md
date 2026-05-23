# Radio PPI Dunia — Project Documentation

## Overview

**Radio PPI Dunia (RPD)** is a Production-Ready Radio Streaming Progressive Web App (PWA) built with Next.js 15. It features a live 24/7 radio stream, a podcast library, team organization management, and a full headless CMS backed by Supabase.

**Live URL**:

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.3.6 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui |
| Animation | Framer Motion 11 |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| Auth | Supabase Auth (email/password) |
| Audio | Web Audio API + VosCast stream proxy |
| PWA | Service Worker + Web Manifest |
| 3D/Globe | Three.js + React Three Fiber |
| Carousel | Embla Carousel + Swiper |
| Forms | React Hook Form + Zod |
| Charts | Recharts |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home page (hero, stream player, slides)
│   ├── layout.tsx                # Root layout (PWA, analytics, fonts)
│   ├── globals.css               # Global styles + Tailwind directives
│   ├── error.tsx                 # Error boundary
│   ├── about/
│   │   └── page.tsx              # About Us + Team Members (directorates/divisions)
│   ├── podcast/
│   │   └── page.tsx              # Podcast library with sidebar + audio player
│   ├── program/
│   │   └── page.tsx              # Program schedule + social stats
│   ├── faq/
│   │   └── page.tsx              # FAQ section
│   ├── admin/
│   │   ├── login/page.tsx        # CMS login (email/password)
│   │   └── dashboard/page.tsx    # Full CMS dashboard (7 managers)
│   └── api/
│       └── stream/route.ts       # Live radio stream proxy
├── components/
│   ├── Navbar.tsx                # Navigation with mobile burger menu
│   ├── InstallButton.tsx         # PWA install prompt
│   ├── ErrorReporter.tsx         # Error tracking
│   └── ui/                       # 45+ shadcn/ui components
└── lib/
    ├── supabase.ts               # Supabase client + all TypeScript types
    └── utils.ts                  # Tailwind merge (cn utility)
```

---

## Environment Variables

Located in `.env.local`:

#bisa pakai email rpd bikin akun supabase terus connect ke databasenya

```env
NEXT_PUBLIC_SUPABASE_URL=https://uhklpvtpexbtrmgiqmus.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<jwt-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<jwt-service-role-key>
```

> `NEXT_PUBLIC_` variables are safe for client-side. `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser.

---

## Database Schema (Supabase)

All types are defined in `src/lib/supabase.ts`.

### `poster_slides`
Homepage hero slider images.
| Column | Type | Notes |
|--------|------|-------|
| id | number | PK |
| image_url | string | |
| title | string | optional |
| link | string | optional |
| sort_order | number | display order |
| is_active | boolean | show/hide |
| created_at / updated_at | string | timestamps |

### `music_list`
Featured music tracks.
| Column | Type | Notes |
|--------|------|-------|
| id | number | PK |
| title | string | |
| artist | string | |
| image_url | string | optional |
| spotify_url | string | optional |
| sort_order | number | |
| is_active | boolean | |

### `site_settings`
Key-value store for all UI text.
| Key | Description |
|-----|-------------|
| hero_title_1/2/3 | Animated hero headline lines |
| tagline | Hero subtext |
| description_24h | "24 Hours" section description |
| what_is_on_tagline | Section tagline |
| what_is_on_date | Current featured date |

### `center_poster`
Featured promotional posters.
| Column | Type |
|--------|------|
| id | number |
| image_url | string |
| alt_text | string |
| link | string |
| is_active | boolean |

### `information`
General info / announcements.
| Column | Type |
|--------|------|
| id | number |
| title | string |
| content | string |
| image_url | string |
| is_active | boolean |

### `members`
Team members with full organizational hierarchy.
| Column | Type | Notes |
|--------|------|-------|
| id | number | PK |
| name | string | |
| position | string | e.g., "Head", "Staff" |
| directorate | string | See directorates below |
| division | string | See divisions below |
| member_type | string | "bod", "sobat_siar", etc. |
| photo_url | string | optional |
| is_featured | boolean | Featured on homepage |
| sort_order | number | |
| is_active | boolean | |

### `podcasts`
Audio content library.
| Column | Type | Notes |
|--------|------|-------|
| id | number | PK |
| title | string | |
| subtitle | string | optional |
| category | string | See categories below |
| audio_url | string | Direct audio file URL |
| duration | string | e.g., "45:30" |

---

## Organizational Structure

### Directorates & Divisions

| Directorate | Divisions |
|------------|-----------|
| BOD | *(no divisions — board level)* |
| Sobat Siar | *(listener community)* |
| Operational | HRD, Program, Broadcast |
| Technology | Mobile & Web Dev, Technical, Music |
| Produksi | Visual Design, Audio, Video, Event |
| Komunikasi | Public Relation, Community Relations, Research |
| Marketing | Social Media, Sales & Partnership |

### Podcast Categories

- `siaran_special_2025` — Siaran Special 2025
- `siaran_special_2024` — Siaran Special 2024
- `hut_drama` — Siaran Special HUT & Drama
- `archived_2024` — Archieved Podcast 2024

---

## Pages

### Home (`/`)
- Animated hero with site settings text
- Live 24/7 radio stream player (proxied through `/api/stream`)
- Poster slides carousel
- "What is On" section
- Featured member (Sobat Siar of the Month)
- Social links section
- Chatango chat widget
- Bottom music player drawer
- PWA install prompt

### About Us (`/about`)
- Section 1: Hero banner
- Section 2: "Tentang Radio PPI Dunia" with logo
- Section 3: World map + member distribution ("Persebaran Anggota")
- Section 4: Interactive team member popup — click directorate icon → pick division → scroll members
- Footer

### Podcast (`/podcast`)
- Fixed left sidebar with category navigation
- Section 1: Siaran Special 2025 playlist
- Section 2: Siaran Special HUT & Drama with tabs
- Section 3: Siaran Special 2024 + Archived 2024
- Each track has a play/pause button
- Audio sourced from `podcasts.audio_url` in database

### Program (`/program`)
- Siaran Reguler section with CMS-uploaded images
- Siaran Spesial section with horizontally scrollable CMS images
- Social media stats (Facebook, Instagram, X)
- Collaboration CTA
- Broadcast schedule table
- Footer

### FAQ (`/faq`)
- Accordion-based FAQ list

### Admin Login (`/admin/login`)
- Email + password form
- Authenticates via Supabase Auth
- Redirects to `/admin/dashboard` on success

### Admin Dashboard (`/admin/dashboard`)
Protected route — requires authenticated Supabase session.

| Tab | Manages |
|-----|---------|
| Poster Slides | Homepage slider images (add/edit/delete) |
| Music List | Featured songs with Spotify links |
| Site Settings | All UI text content |
| Center Poster | Promotional poster images |
| Information | Announcements / blog posts |
| Members | Team members with directorate/division/photo |
| Podcasts | Audio episodes with category and audio URL |

---

## Live Radio Stream

**Proxy endpoint**: `GET /api/stream`  
**Source**: `http://s1.voscast.com:8080/stream`  
**Format**: `audio/mpeg`  
**Behavior**: No-cache headers, streams live audio directly to browser.

Used by the homepage audio player. The `<audio>` element on the home page points to `/api/stream`.

---

## PWA Configuration

- **Manifest**: `/public/manifest.json`
- **Service Worker**: `/public/sw.js` (caches static assets)
- **Install**: `InstallButton` component triggers the browser's `beforeinstallprompt` event
- **Theme color**: `#000000` (black)
- **SW is disabled** on `localhost` and `orchids.cloud` domains in development

---

## Color Scheme

| Token | Value | Usage |
|-------|-------|-------|
| Primary Red | `#B21E35` | Buttons, accents, section headers |
| Dark Background | `#0a0a0a` | Page background |
| Card Dark | `#1a1a1a` | Card / sidebar backgrounds |
| Card Darker | `#111111` | Nested card backgrounds |
| White | `#ffffff` | Primary text |
| Gray text | `#9ca3af` | Secondary text |

---

## Development

```bash
# Install dependencies
npm install

not:
beberapa dependencies / version ada yang belom update, akses dlu webnya habis itu install yang versi terbaru
bisa pakai 
npm install --legacy-peer-deps

# Run dev server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Dev server runs on **port 3000**.

---



## Key Design Patterns

- **Dark theme only** — all pages use black/dark backgrounds with red accents
- **Mobile-first** — responsive breakpoints with `md:` and `lg:` prefixes
- **CMS-driven content** — all visible text and images are fetched from Supabase at runtime
- **Client components** — most pages use `"use client"` with `useEffect` for data fetching
- **No middleware auth** — admin dashboard checks Supabase session client-side and redirects manually
- **Image hosting** — all images are stored as URLs (Supabase Storage or external CDN) — no local image uploads
- **Audio URLs** — podcast audio files are stored as direct URLs in the database

---

## Assets

Key uploaded assets in `/public/`:
- `logo RPD.png` — Main Radio PPI Dunia logo (used in About section and Footer)
- `map-*.png` — World map for member distribution section
- Program/podcast background images referenced via `/public/` paths

---

## Startup Commands

Configured in `.orchids/orchids.json`:
```json
{
  "startupCommands": ["npm install; npm run dev"]
}
```




