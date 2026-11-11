# DESIGN.md — Cerbi Design System

**Product:** Cerbi — A Retro OS Desktop Experience
**Mode:** Shell = Experience; App windows = Operate
**Strategy:** Committed dark — the screen is the color. Dim-room use, glow from the display, always-dark game OS.
**Status:** Source of truth for the visual rebuild. All components inherit from this file.

---

## 1. Physical scene & color strategy

Who: a player at a desk, screen as the main light source, dim room.
Where: the desktop OS fills the viewport; no chrome outside the window metaphor.
What light: emissive dark UI, saturated accents that glow against deep grounds.

**Color strategy:** Committed / Drenched hybrid. The dark ground owns 70-85% of the surface; neon magenta, gold, and blood are the only saturated carriers. Neutrals are tinted from the purple-blue background, never gray.

---

## 2. Color tokens (oklch)

All colors in `src/styles.css` under `@theme inline` and `:root`. Semantic roles only; components reference semantic tokens, never raw hex.

### Game-OS brand (pinned, immutable)
| Token | oklch | Role |
|---|---|---|
| `--desk` | `oklch(0.55 0.11 200)` | Teal desktop ground / wallpaper base |
| `--desk-2` | `oklch(0.42 0.09 200)` | Secondary desk tone |
| `--neon` | `oklch(0.78 0.19 320)` | Magenta accent, primary actions, highlights |
| `--gold` | `oklch(0.85 0.17 90)` | Gold accent, purchases, active states |
| `--blood` | `oklch(0.62 0.22 25)` | Destructive, danger, close buttons |

### Surface semantics
| Token | oklch | Role |
|---|---|---|
| `--background` | `oklch(0.16 0.03 260)` | App ground (desktop wallpaper sits behind) |
| `--foreground` | `oklch(0.96 0.01 240)` | Primary text |
| `--window` | `oklch(0.24 0.04 260)` | Window content ground |
| `--window-foreground` | `oklch(0.96 0.01 240)` | Window text |
| `--window-bar` | `oklch(0.42 0.14 280)` | Window title bar |
| `--window-bar-foreground` | `oklch(0.99 0.01 240)` | Title bar text |
| `--card` | `oklch(0.22 0.04 260)` | Card ground |
| `--card-foreground` | `oklch(0.96 0.01 240)` | Card text |
| `--primary` | `oklch(0.78 0.19 320)` | = neon, primary brand |
| `--primary-foreground` | `oklch(0.14 0.03 260)` | Text on primary |
| `--secondary` | `oklch(0.32 0.05 260)` | Secondary surfaces |
| `--secondary-foreground` | `oklch(0.96 0.01 240)` | Text on secondary |
| `--muted` | `oklch(0.30 0.03 260)` | Muted surfaces |
| `--muted-foreground` | `oklch(0.75 0.03 260)` | Muted text |
| `--accent` | `oklch(0.85 0.17 90)` | = gold, accent actions |
| `--accent-foreground` | `oklch(0.14 0.03 260)` | Text on accent |
| `--destructive` | `oklch(0.62 0.22 25)` | = blood |
| `--destructive-foreground` | `oklch(0.98 0.01 240)` | Text on destructive |
| `--border` | `oklch(0.14 0.03 260)` | Chunky 3px borders |
| `--input` | `oklch(0.28 0.04 260)` | Input ground |
| `--ring` | `oklch(0.78 0.19 320)` | Focus ring = neon |

### Bevel & shadow colors (pixel chrome, not semantic)
- Outer border: `oklch(0.08 0.02 260)` (near-black purple)
- Inset top-left highlight: `oklch(0.35 0.06 280)` / `oklch(0.4 0.08 280)`
- Inset bottom-right shadow: `oklch(0.15 0.03 260)` / `oklch(0.06 0.02 260)`
- Drop shadow: `oklch(0 0 0 / 0.6)`

---

## 3. Typography

Faces are pinned by the brief and loaded via Google Fonts in `__root.tsx`.

| Role | Face | Stack | Use |
|---|---|---|---|
| Display | Press Start 2P | `'Press Start 2P', system-ui, monospace` | Titles, window bars, labels, buttons, desktop icons |
| Body | VT323 | `'VT323', 'Courier New', monospace` | Article text, chat messages, form inputs, readable copy |
| Mono | VT323 | `'VT323', 'Courier New', monospace` | Codes, timestamps, small data |

**Scale (rem):**
- `text-[9px]` — micro labels, window bar titles
- `text-[10px]` — small display, button text, captions
- `text-[11px]` — headers within windows
- `text-lg` (~18px) — body copy
- `text-xl` (~20px) — section headings
- `text-2xl` (~24px) — modal headings
- `text-7xl` (~48px) — 404 / big numbers

**Line-height:** 1.4 for bitmap display faces (tight, chunky), 1.6 for body.
**Letter-spacing:** 0.02em on display; none on body.
**Font smoothing:** disabled (`-webkit-font-smoothing: none`, `font-smooth: never`) to preserve bitmap crispness.
**Image-rendering:** `pixelated` on body and chrome for crisp bitmap edges.

---

## 4. Spacing & grid

**Base grid:** 4px. All padding, margins, gaps, and borders align to 4px increments.

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4px | Tight gaps inside chrome |
| `--space-2` | 8px | Component padding, small gaps |
| `--space-3` | 12px | Card padding, section gaps |
| `--space-4` | 16px | Page margins, major gaps |
| `--space-6` | 24px | Section padding, modal inner padding |
| `--space-8` | 32px | Large section gaps |

**Border width:** 3px (chunky pixel chrome) on windows, cards, tiles, inputs, buttons.
**Radius:** 0 (sharp corners). Pixel OS has no rounded corners; `rounded-none` everywhere.

---

## 5. Component vocabulary

Every component is rebuilt in the pixel-chrome vocabulary. No stock shadcn/Radix default styling leaks through.

### Window (`pixel-window`)
- 3px solid `--border` outer border
- Inset bevel: top-left light, bottom-right dark
- Drop shadow: 4px 4px, 60% black
- `image-rendering: pixelated`
- Title bar: gradient `--window-bar`, 2px bottom border, drag handle
- Close button: blood background, white text, "X", 2px border
- Content area: `--window` ground, overflow auto
- Absolutely positioned, draggable, z-ordered

### Button (`pixel-btn`)
- 3px border, `--border` color
- Inset bevel + 3px drop shadow
- Pressed: translate(2px, 2px), shadow collapses
- Hover: translate(-1px, -1px)
- Variants: default (window-bar purple), gold (`--accent`), danger (`--blood`), ghost (transparent, border only)
- Font: Press Start 2P, 10px, uppercase
- Active states use `variant-gold` / `variant-danger` / `variant-ghost` classes

### Input (`pixel-input`)
- 3px border, `--border`
- Inset bottom-right shadow only
- Ground: `--input`, text: `--foreground`
- Focus: border `--ring` (neon)
- Font: VT323, 18px

### Card (`pixel-card`)
- 3px border, inset bevel
- Ground: `--card`, padding 12px
- No drop shadow (cards sit inside windows)

### Tile (`pixel-tile`) — desktop icon
- 96px wide, 3px border, inset bevel + drop shadow
- Ground: semi-transparent window color
- Icon 48px, label 9px below, centered
- Hover: translate up, neon-tinted ground
- Active: translate down

### Badge (`pixel-badge`)
- Gold ground, dark text, 2px border, 10px Press Start 2P

---

## 6. Wallpapers

CSS-generated repeating gradients, `background-blend-mode`, crisp edges:
- `wp-grid-teal` — teal grid on teal (default)
- `wp-grid-purple` — purple ground, neon grid lines
- `wp-stars` — deep space, white/gold stars
- `wp-dungeon` — dark stone, soft radial glows
- `wp-sunset` — gradient with horizontal scanlines

---

## 7. Motion

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 60ms | Button press, tile tap |
| `--duration-normal` | 80ms | Window focus, hover lift |
| `--easing-pixel` | `steps(4)` | Pixel-perfect stepped motion |

- `pixel-pulse` — 1s, steps(4), scale 1 → 1.06 → 1 (loading, notifications)
- `pixel-blink` — 1s, steps(2), opacity 1 → 0 (cursors, "insert coin")
- Hover/active translations on all buttons and tiles
- `prefers-reduced-motion`: disables pulse/blink, keeps instant state

---

## 8. Accessibility floor

- Contrast: all text ≥ 4.5:1 against its ground (neon on dark = ~12:1, gold on dark = ~14:1)
- Focus rings: `--ring` (neon), 2px, never removed
- Touch targets: min 44×44px; desktop tiles are 96px, buttons min 40px
- Keyboard nav: all interactive elements reachable, visible focus
- Aria labels: close buttons, icon-only controls, window drag handles
- Reduced motion: respected for pulse/blink
- `overflow: hidden` body does not trap focus; modals restore focus on close

---

## 9. Anti-patterns (banned)

- Rounded corners (`rounded-*` other than `none`) — pixel OS is sharp
- Gray-on-gray text — every text has a defined semantic color
- Raw hex in components — use CSS variables / Tailwind semantic tokens
- Emoji as icons — Lucide only
- Stock shadcn button/card styling without pixel override
- Hover-only interactions — every hover has a focus/keyboard equivalent
- Disabled opacity alone — disabled buttons also `pointer-events: none` and `cursor: not-allowed`
- Layout shift on load — reserve space for async content (news articles, chat messages)

---

## 10. Responsive rules

- Desktop is primary (`overflow: hidden`, fixed viewport desktop)
- Windows scale: `maxWidth: calc(100vw - 24px)`, `maxHeight: calc(100vh - 80px)`
- Desktop icons grid: 2 cols → 1 col on narrow screens
- Top bar: always visible, never wrapped
- No horizontal scroll anywhere

---

## 11. Implementation notes

- Tailwind CSS v4 with `@import "tailwindcss"` and `@source "../src"`
- Custom variants: `dark` (&:is(.dark *)) — app is always dark, variant kept for future
- `cn()` utility from `@/lib/utils` (clsx + tailwind-merge)
- All inline `style={{ color: "var(--color-...)" }}` should migrate to Tailwind arbitrary values or classes where possible
- Fonts loaded via Google Fonts stylesheet in `__root.tsx` (preconnect to fonts.gstatic.com)
