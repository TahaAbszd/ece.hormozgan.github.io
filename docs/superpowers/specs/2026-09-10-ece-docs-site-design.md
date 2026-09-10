# ECE Docs Site — Design

## Purpose

Static bilingual (Persian/English) documentation site for the Faculty of
Computer Engineering, University of Hormozgan, hosted on GitHub Pages at
`ece.hormozgan.github.io`. Holds per-course materials: videos, notes/books,
exercises, and code. Content (files/links) is added manually by the owner
over time; the site only needs to render whatever exists.

## Visual identity

- Primary color: navy (سرمه‌ای), e.g. `#0a1f44` / `#0f2a52`, paired with
  white content areas and a light accent for hover/active states.
- University logo (`assets/img/logo.png`) used in the header and hero.
- Font: Vazirmatn (Google Fonts) — covers Persian and Latin in one family.
- Simple, tasteful motion: scroll-reveal on sections, hover lift on cards,
  animated nav underline, subtle logo/hero entrance animation. No heavy
  libraries — CSS transitions + one small IntersectionObserver helper.
- No code comments anywhere in the shipped files.

## Site structure

```
index.html                        homepage
courses/index.json                 [{id, title_fa, title_en}, ...] — course list
courses/<id>/index.html            shared course template (same markup for every course)
courses/<id>/data.json             { videos: [], notes: [], exercises: [], code: [] }
assets/css/style.css               design system (colors, layout, animations, RTL/LTR)
assets/js/main.js                  language toggle, mobile nav, scroll-reveal
assets/js/course.js                reads data.json, renders sections + video player
assets/img/logo.png                university logo
```

Adding a new course later = new `courses/<id>/` folder with `index.html`
(copied template) + `data.json`, plus one entry in `courses/index.json`.
No other file changes needed.

## Components

**Header (shared, injected via `main.js` or duplicated per page)**
Logo + site name (bilingual), nav links (Home / courses), a language
toggle button (`FA`/`EN`).

**Homepage**
Hero section (navy gradient, logo, faculty name, short tagline) +
a responsive grid of course cards read from `courses/index.json`. Each
card links to `courses/<id>/index.html`.

**Course page**
Title + four sections, each independently empty-safe:
- **ویدیوها / Videos** — one `<video controls>` player + a session list
  below it; clicking a session sets the player's `src` and highlights the
  active item. A visible "دانلود / Download" link next to the player
  points at the active video's `src` (works for same-repo files; for
  cross-origin URLs the browser will still let the user save the file,
  just not force it silently).
- **جزوه و کتاب / Notes & Books** — simple linked list (title + link).
- **تمارین / Exercises** — simple linked list.
- **کدها / Code** — simple linked list.

Any section whose array is empty renders a single muted "به‌زودی /
Coming soon" line instead of nothing.

## Data flow

`course.js` fetches `./data.json` relative to the course page via
`fetch()`, renders the four sections from it. `main.js` handles the
language toggle independently of content data: it flips `document.dir`
between `rtl`/`ltr`, toggles a `lang-en` class, and swaps any element
with both `data-fa` and `data-en` attributes to show the matching text.
Choice is persisted in `localStorage` and applied on load before paint
(inline snippet in `<head>`) to avoid a flash of the wrong language/dir.

## Error handling

- `fetch('./data.json')` failure (e.g. opened via `file://` without a
  server) → sections show the "Coming soon" placeholder rather than a
  broken state.
- Missing/broken video `src` → native `<video>` element already shows
  its own fallback UI; no extra handling needed.

## Testing / verification

No build step. Verify by serving the folder with a local static server
(`python3 -m http.server`) and checking in a browser:
1. Homepage renders in both languages, RTL/LTR switches correctly.
2. A course page's video player switches between sessions and the
   download link updates.
3. Empty sections show the placeholder, not a blank gap.
4. Relative paths resolve correctly for GitHub Pages (root-relative
   project structure, no absolute local paths).
