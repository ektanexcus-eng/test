# Ekta NexCus — Refinement Notes

This rebuild keeps your existing visual identity, brand colours, typography,
and all bilingual (EN/MR) content exactly as written. What changed is the
underlying engineering.

## File structure (was: one 1,442-line HTML file)

```
index.html        clean semantic markup, SEO, structured data
css/styles.css     all styling, extracted and organised
js/script.js       all behaviour, extracted and organised
```

Splitting these out means the browser can cache CSS/JS separately from
content, editing one doesn't risk breaking the others, and the file is
actually navigable.

## Fixed bugs

- A broken tag pair in the "Sweden 6-hour" callout (`<strong>...</span></strong>`
  — a stray `</span>` with no matching open tag) that could cause
  unpredictable rendering in some browsers.

## Structure & accessibility

- Added semantic landmarks: `<header>`, `<main>`, existing `<footer>` —
  screen readers and search engines can now navigate the page properly.
- Added a "Skip to main content" link for keyboard users.
- Added a working **mobile menu** — the old CSS just hid the nav links
  under 768px with no way to open them. Now there's a hamburger toggle
  with keyboard support (Escape closes it, click-outside closes it).
- Added visible focus outlines for keyboard navigation (`:focus-visible`).
- Marked decorative elements (`chakra`, emoji flag icons) `aria-hidden`
  so screen readers skip them instead of announcing symbols.
- Added `aria-pressed` to the language buttons and `role="group"` with a
  label, so assistive tech announces the language switch correctly.
- Respects `prefers-reduced-motion` — the scroll-reveal animation and
  smooth scrolling are disabled for users who've asked for that.

## SEO

- Real `<meta name="description">`, keywords, canonical URL.
- Open Graph + Twitter Card tags (so links shared on WhatsApp/social
  render a proper preview card — currently pointing at placeholder
  image/URL, see "Before you launch" below).
- Organization structured data (JSON-LD) for richer search results.
- `rel="noopener noreferrer"` added to external links that open in a
  new tab (security best practice — prevents the opened page from
  controlling your tab via `window.opener`).

## Functionality

- **Contact form added.** Previously the Contact section only had a
  `mailto:` link and a WhatsApp link (both kept). There's now an
  actual name/email/message form with:
  - client-side validation (required fields, email format check)
  - a honeypot field to filter out basic spam bots
  - it posts to [Formsubmit.co](https://formsubmit.co), a free
    forwarding service — **no backend server required**. See "Before
    you launch" below to activate it.
- Language toggle now uses `addEventListener` instead of inline
  `onclick="..."` (inline JS in HTML is considered bad practice — it's
  harder to maintain and blocks some security policies), and now
  **remembers the visitor's language choice** across page reloads via
  `localStorage`.
- Smooth-scroll links now correctly update the URL hash and account
  for the fixed header height (`scroll-margin-top`), so a section
  title doesn't end up hidden behind the nav bar.

## Performance

- Fonts now load via `<link rel="preconnect">` + `<link rel="stylesheet">`
  instead of a CSS `@import`, which blocks page rendering until fetched.
- Scroll-reveal animation uses `IntersectionObserver` with `unobserve()`
  once an element has animated in, instead of leaving every observer
  running for the life of the page.

## Before you launch — placeholders to replace

1. **Domain**: `https://ektanexcus.org/` appears in the canonical URL,
   Open Graph tags, and structured data. Swap for your real domain
   (same placeholder mentioned in `build_common.py` for the main site).
2. **OG image**: `og:image` / `twitter:image` point at
   `/assets/og-image.jpg`, which doesn't exist yet — add a real 1200×630
   image so shared links show a preview.
3. **Favicons**: `favicon-32.png` / `apple-touch-icon.png` referenced but
   not created.
4. **Contact form email**: in `index.html`, the form's `action` is
   `https://formsubmit.co/YOUR_EMAIL` — replace `YOUR_EMAIL` with
   `ektanexcus@gmail.com`, then submit the form once yourself;
   Formsubmit sends a one-time confirmation email you must click before
   it starts forwarding submissions.
5. If/when you build a real backend (as noted for the main 20-page
   site), swap the form's `action` for your API endpoint and keep the
   same `name`, `email`, `message` field names — no HTML changes needed.
