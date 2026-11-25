# AGENTS.md

## Project

Static landing page for **Polarlux Detailing** (auto tint / PPF / detailing, Bogotá). No build, package manager, tests, or git repo — open `index.html` in a browser to preview. Page copy is **Spanish**; keep it that way.

- `index.html` — markup, SEO/meta, JSON-LD, section content.
- `css/styles.css` — design tokens, base styles, components, skeletons/state styles.
- `js/theme-init.js` — blocking head script that applies the saved theme before paint.
- `js/tailwind-config.js` — Tailwind CDN config; must load right after the CDN script.
- `js/main.js` — theme toggle, mobile menu, image loading/retry, toast, quote form.

Keep this load order: `theme-init.js` → fonts/preload → Tailwind CDN → `tailwind-config.js` in `<head>`, then `main.js` at the end of `<body>`. Deploy `index.html` together with `css/` and `js/` (all paths are relative).

## Design system

- **Tailwind is loaded from the CDN**; its config lives in `js/tailwind-config.js` (there is no Tailwind build). Custom colors map to CSS RGB-triplet variables in `:root` / `[data-theme="light"]` inside `css/styles.css`: `canvas`, `surface`, `raised`, `fg`, `muted`, `line`, `gold`, `gold-soft`, `success`, `warning`, `danger`, plus static `cream`/`noir`.
- **Never name a Tailwind color `base`.** `text-base` then collides with the font-size utility and silently sets a text color (this broke the logo). Use `canvas` / `bg-canvas`.
- Tokens also define radius (`--radius-card`), shadows (`--shadow-*`), and on-gold text (`--c-on-gold`). Reusable classes: `.card`, `.btn` / `.btn-primary` / `.btn-ghost`, `.icon-btn`, `.eyebrow`, `.chip`, `.input`, `.field`, `.media`, `.hero-badge`, `.whatsapp-float`. Reuse these instead of ad-hoc colors.
- Semantic status colors: green = available/success, amber = warning, red = validation error. Do not use them as decorative brand colors.
- Hero is intentionally **dark in both themes**; `.hero` overrides gold/success tokens and uses fixed cream text. Don't make hero text theme-dependent.
- Logo is one inline `<symbol id="shieldMark">` referenced with `<use>`. Edit it once.
- Fonts: `font-display` = Playfair Display, `font-body` = Inter (Google Fonts).

## Theme

- `data-theme="dark|light"` on `<html>`; `js/theme-init.js` reads `localStorage["polarlux-theme"]` before paint to avoid flash. `#theme-toggle` in `js/main.js` flips it, updates `aria-pressed`/label/icons, and persists.
- Any new themed style must be defined in **both** token blocks. The `theme-color` meta tags are static media queries and do not follow the manual toggle.

## Layout

- Masonry is implemented with CSS `columns` (benefits, services, gallery, testimonials): children need `mb-*` + `break-inside-avoid`. Note that visual order is **column-major**, so adding/removing a card changes how items pair across columns.
- Pricing and contact use grids; mobile nav is a fixed panel controlled by `#menu-toggle` / `#mobile-menu` (closes on link, Escape, outside click, and at `lg`).
- Preserve anchors: `#beneficios`, `#servicios`, `#galeria`, `#precios`, `#contacto`.

## Images and UI states

- Every remote `<img>` must be wrapped in `.media` with `is-loading`. `js/main.js` removes it on load and adds `is-error` on failure, injecting a fallback with a `data-retry` button. Cached images are handled too.
- Hero media carries `data-no-fallback` so a broken hero keeps the dark background instead of overlay text.
- Retry appends `&_r=<timestamp>` to the `src`; keep image URLs query-string friendly.
- Form `#quote-form` validates inline (`is-invalid`, `aria-invalid`, hidden `.field-error`) and, on success, opens WhatsApp and swaps to `#quote-success` (`#quote-reset` restores). Keep the no-JS fallback: images remain visible if scripts don't run.
- Clicking any `wa.me` link shows `#toast`; add `data-no-toast` where it would be redundant.

## Content invariants

- WhatsApp number `573014576626` is hardcoded in every CTA and in the form's generated message; update all occurrences together.
- Canonical/OG URLs use the `https://www.tudominio.com/` placeholder (also JSON-LD `@id`/`url`) — replace at deploy.
- SEO metadata is duplicated (meta, Open Graph, Twitter, Schema.org `AutomotiveBusiness` JSON-LD). Keep names, phone, services, and social links consistent.
- Prices, UV/IR claims, and warranty terms are business data — only change when asked.

## Verification

No build or test suite. Open `index.html` directly and check desktop (~1440px) and mobile (~390px), both themes, gallery/service images loading plus the fallback state, and the quote form's invalid/valid/success states. Verify `css/styles.css` and the `js/` files load with no console errors.
