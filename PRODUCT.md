# PRODUCT.md — Cerbi

## Product identity
**Name:** Cerbi — A Retro OS Desktop Experience
**Tagline:** A game-style desktop operating system for news, chat, daily trials, and rewards.
**One-liner:** Log in to a pixel-art SNES-style desktop, browse a monthly news calendar, chat in code-only rooms, take a 10-question daily trial for your occupation, spend points in the shop, and stream music through Spotify.

## Product type
Hybrid: **Operate** (dashboard/tool: read news, chat, take quizzes, shop, stream music) wrapped in **Experience** (the retro desktop OS shell is the product). Mode per surface: shell = Experience; app windows = Operate.

## Target audience
- Casual to mid-core web users who enjoy gaming aesthetics and retro computing
- Users who want a playful, game-like wrapper around daily information habits (news, quiz, chat)
- Spotify-connected music listeners who want an in-browser player within the desktop

## Surface inventory
| Route | Surface | Mode | Purpose |
|---|---|---|---|
| `/` | Boot / redirect | Experience | Loading screen, redirects to auth or desktop |
| `/auth` | Sign in / sign up | Persuade → Operate | Login window, new account creation, Google OAuth |
| `/_authenticated/desktop` | Desktop shell | Experience | Wallpaper, top bar, desktop icons, draggable windows, z-order |
| Desktop → News Tome | App window | Operate | Monthly calendar, article reader (AI summaries via OpenRouter) |
| Desktop → Chat Tavern | App window | Operate | Create/join code-only rooms, real-time messaging (Supabase Realtime) |
| Desktop → Daily Trial | App window | Operate | 10-question occupation quiz, timer, score, leaderboard |
| Desktop → Shop of Wares | App window | Operate | Buy/equip fonts and wallpapers with wallet points |
| Desktop → Music Player | App window | Operate | Spotify connect, playlists, search, showcase, web playback |
| Onboarding (modal) | Character select | Operate → Experience | Choose occupation, interests, enter Cerbi |

## Core flows
1. **Boot:** `/` checks Supabase session → `/desktop` or `/auth`
2. **Auth:** Sign in or sign up in a pixel window → `/desktop`
3. **Onboarding:** First login shows character select modal (occupation + interests)
4. **Desktop:** Open apps by double-clicking icons; windows stack with z-order; top bar shows username + points + logout
5. **News:** Pick a day on the calendar → open tome → read AI-summarized articles
6. **Chat:** Create or join a room → real-time code-only chat
7. **Trial:** 10 questions, 15s each → score + points → weekly leaderboard
8. **Shop:** Browse fonts/wallpapers → buy with points → apply to desktop
9. **Music:** Connect Spotify → browse playlists/search/showcase → stream via Web Playback SDK

## Tech stack (locked)
- Framework: TanStack Start (React 19 + Vite 8 + Nitro), Vercel deploy
- Routing: TanStack Router (file-based)
- Auth/DB/Realtime: Supabase (PostgreSQL + Auth + Realtime)
- Styling: Tailwind CSS v4 + tw-animate-css
- UI primitives: Radix UI, shadcn-style components (`@/components/ui`)
- Forms: React Hook Form + Zod
- Charts: Recharts
- Icons: Lucide React
- Data: TanStack Query
- Toasts: Sonner
- Fonts (Google): Press Start 2P, VT323, Pixelify Sans, Silkscreen

## Design constraints (pinned, do not break)
- Always-dark game OS (no light mode)
- Pixel-art / chunky window chrome is the core identity
- `overflow: hidden` body; desktop fills the viewport
- Desktop icons on the left; windows are absolutely positioned, draggable, stackable
- Wallpapers are CSS-generated repeating gradients (teal grid, purple grid, stars, dungeon, sunset)
- Bitmap fonts (Press Start 2P for display, VT323 for body) are the voice of the OS
- oklch color palette with `--desk`, `--neon`, `--gold`, `--blood` game-OS tokens
- 3px chunky borders, inset bevel shadows, `image-rendering: pixelated`

## What must be preserved in the redesign
- All product truth, content, copy, function, native affordances, and constraints above
- All routes, queries, mutations, Supabase integrations, Spotify flows
- The desktop/window metaphor and all five apps
- Brand name "Cerbi" and the "◆" glyph motif

## What may change (redesign scope)
- The complete visual implementation: tokens, typography scale, spacing, motion, component styling, layout craft
- Replacement of inconsistent inline styles with a coherent design system
- Accessibility upgrades (focus rings, contrast, aria labels, touch targets)
- Responsive behavior for the desktop shell and app windows
- Empty states, loading states, error states across all apps
- Polish: micro-interactions, transitions, delight details

## Assumptions (inferred, unconfirmed by user)
- No existing PRODUCT.md or DESIGN.md; this is a from-scratch design-system build
- User wants the retro identity elevated, not replaced (brief: "top level designer" rewrite)
- No strict RTL requirement (components.json `rtl: false`)
- Mobile is secondary but should not break; desktop is the primary context
