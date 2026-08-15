# Ekta NexCus — Website

A fresh, 20-page rebuild of the Ekta NexCus site. Plain HTML/CSS/JS — no build step, no framework,
no server-side dependency. Every page works by opening the file directly or uploading it as-is to
Hostinger (or any static host).

## What's here

```
site/
├── index.html                 Home
├── about.html                 About Ekta NexCus
├── vision-mission.html        Vision & Mission
├── six-hour-policy.html       The 6-Hour Work Policy
├── suvidha.html                Suvidha Platform
├── jobs.html                  Employment & Jobs
├── skills.html                Skills & Education
├── community.html             Community
├── women-youth.html           Women & Youth Empowerment
├── impact.html                Social Impact
├── events.html                Events
├── articles.html              Articles / Blog
├── campaigns.html             Campaigns
├── volunteer.html             Volunteer
├── partner.html                Partner With Us
├── mentorship.html            Mentorship
├── contact.html                Contact
├── privacy.html                Privacy Policy
├── terms.html                  Terms & Conditions
├── disclaimer.html             Disclaimer
├── sitemap.xml
├── robots.txt
├── assets/
│   ├── css/style.css           Single shared stylesheet (design tokens + components)
│   ├── js/main.js              Shared JS: nav, language switch, scroll reveal, form validation
│   └── icons/favicon.svg       Favicon (the site's "four-shift dial" mark)
└── docs/
    ├── README.md                This file
    └── FORMS.md                 What to do before forms can actually submit anywhere
```

Every page shares the same `<link>`/`<script>` to `assets/css/style.css` and `assets/js/main.js` —
edit those two files once and every page updates.

## How pages are built

There is no framework, but there **is** a generator script (not part of the deployed site) that was
used to keep the header, footer and SEO tags consistent across all 20 pages without hand-editing each
one: `build_common.py`, `build_icons.py`, and `build_pages.py`. If you need to add a 21st page or
change the nav/footer sitewide, the fastest path is:

1. Edit `NAV_PRIMARY` / `NAV_MORE` / `FOOTER_COLS` in `build_common.py` for nav/footer changes.
2. Add a new page block to `build_pages.py` following the existing pattern.
3. Run `python3 build_pages.py` — it regenerates every `.html` file in `site/`.

If you'd rather hand-edit HTML directly going forward, that's fine too — the generator is a
convenience, not a requirement. Just keep header/footer markup in sync across pages manually if you
skip it.

## Before you launch

1. **Replace the placeholder domain.** `BASE_URL` in `build_common.py` (and therefore every canonical
   URL, Open Graph tag, and `sitemap.xml`/`robots.txt` entry) is currently set to
   `https://www.ektanexcus.org` as a placeholder. Update it to your real Hostinger domain, then
   re-run the generator (or find-and-replace across the HTML files).
2. **Add a real OG share image.** `assets/icons/og-default.png` is referenced in every page's Open
   Graph/Twitter tags but doesn't exist yet — add a 1200×630px image at that path.
3. **Wire up the forms.** See `docs/FORMS.md` — right now every form validates client-side and shows
   a success message, but nothing is actually sent anywhere yet.
4. **Grievance officer details.** `privacy.html` has a placeholder for this — required for India DPDP
   Act compliance, fill in before public launch.
5. **Decide on full trilingual coverage.** See "Language support" below — the current setup is a
   starting point, not the final i18n architecture.

## Language support

The brief calls for Marathi, Hindi and English. Right now:

- Every page's **primary content is English**, for clean single-language SEO per URL.
- The nav has a working **EN / HI / MR switch** and the JS (`setLang()` in `main.js`) is fully wired
  to show/hide any element tagged `data-lang="en|hi|mr"` — but no Hindi/Marathi copy has been written
  into the pages yet, so right now the switch has nothing to toggle.

**Recommendation for full trilingual coverage:** don't duplicate three languages' worth of copy into
every element of all 20 pages (that was the old single-page site's approach, and it roughly triples
page weight and creates duplicate-content SEO issues on every URL). Instead, once Hindi/Marathi copy
is ready, mirror the site under `/hi/` and ``/mr/` subfolders with `hreflang` tags linking the three
versions together. That keeps each page lean and lets each language rank on its own. The `data-lang`
toggle mechanism can stay as-is for small in-page bilingual snippets (like the hero) if you want a
quick preview without a full subfolder build.

## Accessibility & performance notes

- Every interactive element has a visible focus ring; `prefers-reduced-motion` is respected globally.
- Skip-to-content link on every page (first tab stop).
- No `<img>` tags with photography yet — all iconography is inline SVG (no extra HTTP requests, no
  missing-alt-text risk). If you add real photos, give every one a real `alt` description.
- Total page weight is ~90–140KB per page including CSS/JS/fonts (fonts are the biggest cost, loaded
  from Google Fonts CDN) — no images to optimize yet, but keep any you add compressed and lazy-loaded.
- Forms use native HTML validation attributes plus a light JS layer — no library.

## Content still marked as placeholder

Search the HTML for `placeholder-note` to find every spot that's explicitly flagged as needing real
content before launch: impact statistics, skills-training partners, event dates, and the Open Graph
image. Nothing on the live pages currently claims a number, partnership, or outcome that hasn't been
verified — that's intentional per the project's content rules, and should stay that way as real data
comes in.
