# AGENTS.md

## Project

Static landing page for **Polarlux Detailing** (auto tint / PPF / detailing, Medellín, Antioquia). No build, package manager or tests — open `index.html` in a browser to preview. Remote source: https://github.com/kaelcore143-cpu/POLARLUX_DETAILING. Page copy is **Spanish** (`es-CO`); keep it that way.

- `index.html` — markup, SEO/meta, JSON-LD, section content.
- `privacidad.html` — privacy policy page linked from the form consent checkbox and the footer.
- `assets/logo-polarlux-wide.png` — transparent logo used in navbar and footer; source PNGs live in the root.
- `favicon.ico`, `assets/icon-256.png`, `assets/apple-touch-icon.png` — favicons generated from the same transparent logo.
- `css/styles.css` — design tokens, base styles, components, skeletons/state styles.
- `js/tailwind-config.js` — Tailwind CDN config; must load right after the CDN script.
- `js/main.js` — mobile menu, image loading/retry, gallery empty state, toast, quote form.
- `robots.txt` / `sitemap.xml` — SEO files; both use the same domain placeholder as the canonical URL.

Load order: fonts/preload → Tailwind CDN → `tailwind-config.js` in `<head>`, then `main.js` at the end of `<body>`. Deploy `index.html` together with `assets/`, `css/`, `js/`, `robots.txt` and `sitemap.xml` (all paths are relative).

## Design system

- **Tailwind is loaded from the CDN**; its config lives in `js/tailwind-config.js` (there is no Tailwind build). Custom colors map to CSS RGB-triplet variables in `:root` inside `css/styles.css`: `canvas`, `surface`, `raised`, `fg`, `muted`, `line`, `accent`, `accent-soft`, `success`, `warning`, `danger`, plus static `cream`/`noir`.
- **Brand palette is yellow + green.** Yellow (`accent`) is the primary action color; green (`success`) signals trust/availability. Red is **only** for form validation errors; never decorative.
- **Never name a Tailwind color `base`.** `text-base` then collides with the font-size utility and silently sets a text color (this broke the logo). Use `canvas` / `bg-canvas`.
- Tokens also define typography (`--font-*`), spacing (`--space-*`), radii (`--radius-*`), borders (`--line-*`) and shadows (`--shadow-*`). Reusable classes: `.container-page`, `.card`, `.btn` / `.btn-primary` / `.btn-ghost`, `.icon-btn`, `.eyebrow`, `.chip`, `.input`, `.field`, `.media`, `.hero-badge`, `.modal`, `.whatsapp-float`. Reuse these instead of ad-hoc colors.
- **Single dark theme.** There is no light theme, no toggle and no `data-theme` attribute or `localStorage` preference. Don't reintroduce theme-dependent styles.
- Hero is dark by design and `.hero` overrides accent/success tokens and uses fixed cream text.
- Logo is `assets/logo-polarlux-wide.png` (transparent cutout generated from the two source PNGs in the root). It is used in the navbar and footer; keep the originals as the source of truth and re-export if the logo changes.
- Fonts: `font-display` = Playfair Display, `font-body` = Inter (Google Fonts).

## Layout

- Masonry is implemented with CSS `columns` (benefits, services, gallery, testimonials): children need `mb-*` + `break-inside-avoid`. Note that visual order is **column-major**, so adding/removing a card changes how items pair across columns.
- Responsive: `sm`/`md`/`lg` plus a distinct `xl` treatment (wider container, left-aligned hero, larger type). Use `.container-page` for every section wrapper.
- Pricing and contact use grids; mobile nav is a fixed panel controlled by `#menu-toggle` / `#mobile-menu` (closes on link, Escape, outside click, and at `lg`). `syncScrollLock()` locks body scroll only while the menu is open.
- Preserve anchors: `#beneficios`, `#servicios`, `#galeria`, `#precios`, `#contacto`.

## Images and UI states

- Every remote `<img>` must be wrapped in `.media` with `is-loading`. `js/main.js` removes it on load and adds `is-error` on failure, injecting a fallback with a `data-retry` button. Cached images are handled too.
- Hero media carries `data-no-fallback` so a broken hero keeps the dark background instead of overlay text.
- Retry appends `&_r=<timestamp>` to the `src`; keep image URLs query-string friendly.
- Form `#quote-form` validates inline (`is-invalid`, `aria-invalid`, hidden `.field-error`), requires the privacy consent checkbox (`#q-privacy` → `privacidad.html`), shows a shimmer loading state on submit, then opens WhatsApp and swaps to `#quote-success` (`#quote-reset` restores). Keep the no-JS fallback: images remain visible if scripts don't run.
- Gallery images are display-only (no lightbox, click-to-zoom or overlaid titles). If every gallery image fails, `#gallery-empty` replaces `#gallery-grid`.
- Clicking any `wa.me` link shows `#toast`; add `data-no-toast` where it would be redundant.

## Content and SEO

- WhatsApp number `573014576626` is hardcoded in every CTA and in the form's generated message; update all occurrences together.
- Workshop location is **Medellín, Antioquia**. Keep address, `geo` coordinates (6.2442, -75.5812), local SEO meta tags, hero badge and footer consistent; avoid repeating the city in every alt text or caption.
- Canonical/OG/JSON-LD/`robots.txt`/`sitemap.xml` URLs use the `https://www.tudominio.com/` placeholder — replace at deploy (also `/privacidad.html`).
- SEO metadata is duplicated across meta, Open Graph, Twitter and the JSON-LD `@graph` (`AutomotiveBusiness` + `WebSite`). Keep names, phone, services, prices and social links consistent. Validate the JSON-LD block parses.
- Business data shown once: prices live in the pricing grid (before IVA is stated once in the chip); UV/IR claims and warranty terms live in benefits/pricing/FAQ. Avoid repeating them in the hero or service cards.

## Verification

No build or test suite. Open `index.html` directly and check mobile (~390px), tablet (~820px), desktop (~1440px) and wide desktop (~1920px), gallery/service images loading plus the fallback/empty state, and the quote form's invalid/loading/success states including the privacy checkbox. Open `privacidad.html` and check its links back to the site. Verify `css/styles.css` and the `js/` files load with no console errors.
