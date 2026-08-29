# Persianate Collective — website

A single-page site for Persianate Collective, a three-week immersive school of
Persian language, literature and culture, held in India. No build step, no
dependencies to install — it's plain HTML, CSS and JavaScript, plus Google
Fonts loaded over a CDN link.

## Structure

```
persianate-collective/
├── index.html        the whole page: hero, details strip, about, weeks,
│                     faculty, texture, who-it's-for, FAQ, contact + fee
│                     breakdown, footer
├── css/
│   └── styles.css    all styling — the fluid gradient sections, the
│                     reveal-on-scroll system, and the hero's string field
├── js/
│   └── script.js     scroll-spy nav, section reveals, the hero string-field
│                     physics + chime, the faculty carousel/modal, the FAQ
│                     accordion, and the contact form's front-end handling
└── README.md
```

## Viewing it locally

There's nothing to build. Either:

- Open `index.html` directly in a browser, or
- Serve the folder locally so relative paths behave exactly as they will
  once hosted, e.g. `python3 -m http.server`, then visit
  `http://localhost:8000`.

## Deploying with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch",
   pick your default branch and the `/ (root)` folder, then save.
4. GitHub will publish the site at `https://<username>.github.io/<repo>/`
   within a minute or two.

No custom domain, build step, or GitHub Action is required for this to work.

## Things to do before this goes live

Everything below reads as real content on the page, but it's dummy data
standing in for the real thing — replace it before anyone applies:

- **Location, dates, fee, and deadline.** The details strip below the hero
  (Location / Dates / Duration / Days / Hours), the fee breakdown in the
  Contact section, and the FAQ answers about venue/cost/deadline all use
  placeholder facts — Lucknow, India; 7–27 June 2027; $2,200; 1 April 2027.
  These are internally consistent with each other (search for each value
  across `index.html` — they all appear in more than one place), so if you
  change one, change all of them.
- **Contact form** (`#enquiry-form`) is front-end only right now — submitting
  it shows a confirmation message but doesn't send an email anywhere. There's
  a marked spot in `js/script.js` (search for `enquiry-form`) to wire it to a
  real endpoint — Formspree and Netlify Forms are both drop-in options that
  need no backend of your own.
- The contact section also lists a placeholder address,
  `hello@persianatecollective.org` — swap that for the real one.
- **Faculty profiles** in the "Who's teaching" carousel are dummy content —
  four repeated "Faculty Name" cards with generic role labels and a
  bracketed prompt in place of a real bio. Replace the `data-name`,
  `data-role`, `data-gloss` and `data-bio` attributes on each
  `.faculty-card` button in `index.html`, and swap the placeholder portrait
  icon for a real photo if you want one.
- The "photograph" plates (About and Texture sections) are illustrated
  placeholders, not real photography — swap in real images when you have
  them.

## Notes on how it's built

- Typography: Instrument Serif for headings, Inter for body and UI text,
  Noto Nastaliq Urdu and Vazirmatn for the Persian script throughout.
- Three "Apply" touchpoints: a button in the hero, a small pill fixed to the
  top-right corner of every page (`.top-cta`), and the primary button in the
  footer — plus "Apply" as the last item in the bottom section nav.
- The hero's hanging words are physics-driven (a damped spring per string)
  and play a short synthesized chime on hover via the Web Audio API — not a
  sampled instrument. Most browsers block audio until the visitor has
  clicked somewhere on the page at least once; that's a browser autoplay
  policy, not a bug.
- Motion respects `prefers-reduced-motion`: the string field, scroll
  reveals, and the fluid-gradient sections all fall back to a static state.
- No frameworks, no build tools, no npm install — everything runs as
  authored.
