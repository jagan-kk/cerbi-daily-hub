# 🖥️ Cerbi — A Retro OS Desktop Experience

**Cerbi** is a full-stack web application that reimagines a desktop operating system as a retro game-style experience. Log in, navigate a pixel-art desktop, browse news, chat in code-only rooms, take daily occupation-based trials, spend points in the shop, and stream music through Spotify.

Built with **TanStack Start**, **Supabase**, and **Tailwind CSS v4**, deployed on **Vercel**.

---

## ✨ Features

### 🖥️ Desktop
- Pixel-art SNES-style window chrome
- Desktop icons for each app
- Draggable, stackable windows with z-order management
- Retro wallpapers (teal grid, purple grid, stars, dungeon, sunset)

### 📰 News Tome
- Monthly calendar view of news articles
- AI-generated summaries via OpenRouter
- Detailed article view with source attribution

### 💬 Chat Tavern
- Code-only chat rooms
- Real-time messaging via Supabase Realtime
- Room creation and management

### 🎯 Daily Trial
- 10-question daily quiz for your occupation
- AI-generated questions from GNews articles
- Score tracking and streak rewards

### 🛒 Shop
- Spend points on cosmetics and items
- Item management (buy, equip, unequip)

### 🎵 Music Player (Premium Required)
- Spotify integration (login required)
- Browse and search your playlists
- Web Playback SDK for in-browser streaming
- Community playlist showcase

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React + Vite + Nitro) |
| **Routing** | [TanStack Router](https://tanstack.com/router) (file-based) |
| **Auth & DB** | [Supabase](https://supabase.com) (PostgreSQL + Auth + Realtime) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [tw-animate-css](https://github.com/tw-in-js/tw-animate-css) |
| **UI** | [Radix UI](https://www.radix-ui.com) primitives, shadcn-style components |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| **Charts** | [Recharts](https://recharts.org) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **AI** | [OpenRouter](https://openrouter.ai) (news summarization, question generation) |
| **Fonts** | Press Start 2P, VT323, Pixelify Sans, Silkscreen |
| **Build** | [Vite 8](https://vite.dev) + [Nitro](https://nitro.build) |
| **Deploy** | [Vercel](https://vercel.com) (Nitro vercel preset) |
| **Package** | npm |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x
- npm
- A Supabase project
- Spotify Developer account (for music features)
- OpenRouter API key (for AI features)
- GNews API key (for news)

### Installation

```bash
git clone <repo-url>
cd cerbi-daily-hub
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
VITE_SUPABASE_URL="${SUPABASE_URL}"
VITE_SUPABASE_PUBLISHABLE_KEY="${SUPABASE_PUBLISHABLE_KEY}"

# Spotify
SPOTIFY_CLIENT_ID="your-client-id"
SPOTIFY_CLIENT_SECRET="your-client-secret"
SPOTIFY_REDIRECT_URI="https://your-domain.vercel.app/api/spotify/callback"
VITE_SPOTIFY_CLIENT_ID="${SPOTIFY_CLIENT_ID}"
VITE_SPOTIFY_REDIRECT_URI="${SPOTIFY_REDIRECT_URI}"

# APIs
OPENROUTER_API_KEY="sk-or-v1-..."
GNEWS_API_KEY="your-gnews-key"
```
### Link
https://cerbi-daily-hub.vercel.app
