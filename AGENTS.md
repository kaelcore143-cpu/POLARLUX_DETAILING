# AGENTS.md

## Project

Static landing page for **Polarlux Detailing** (auto tint / PPF / detailing, Bogotá). No build, package manager or tests — open `index.html` in a browser to preview. Remote source: https://github.com/kaelcore143-cpu/POLARLUX_DETAILING. Page copy is **Spanish**; keep it that way.

- `index.html` — markup, SEO/meta, JSON-LD, section content.
- `css/styles.css` — design tokens, base styles, components, skeletons/state styles.
- `js/theme-init.js` — blocking head script that applies the saved theme before paint.
- `js/tailwind-config.js` — Tailwind CDN config; must load right after the CDN script.
- `js/main.js` — theme toggle, mobile menu, image loading/retry, gallery lightbox and empty state, toast, quote form.

Keep this load order: `theme-init.js` → fonts/preload → Tailwind CDN → `tailwind-config.js` in `<head>`, then `main.js` at the end of `<body>`. Deploy `index.html` together with `css/` and `js/` (all paths are relative).

## Design system

- **Tailwind is loaded from the CDN**; its config lives in `js/tailwind-config.js` (there is no Tailwind build). Custom colors map to CSS RGB-triplet variables in `:root` / `[data-theme="light"]` inside `css/styles.css`: `canvas`, `surface`, `raised`, `fg`, `muted`, `line`, `accent`, `accent-soft`, `success`, `warning`, `danger`, plus static `cream`/`noir`.
- **Brand palette is yellow + green.** Yellow (`accent`) is the primary action color; green (`success`) signals trust/availability. Red is **only** for form validation errors; never decorative.
- **Never name a Tailwind color `base`.** `text-base` then collides with the font-size utility and silently sets a text color (this broke the logo). Use `canvas` / `bg-canvas`.
- Tokens also define typography (`--font-*`), spacing (`--space-*`), radii (`--radius-*`), borders (`--line-*`) and shadows (`--shadow-*`). Light-theme accent is darkened for contrast. Reusable classes: `.container-page`, `.card`, `.btn` / `.btn-primary` / `.btn-ghost`, `.icon-btn`, `.eyebrow`, `.chip`, `.input`, `.field`, `.media`, `.hero-badge`, `.modal`, `.whatsapp-float`. Reuse these instead of ad-hoc colors.
- Hero is intentionally **dark in both themes**; `.hero` overrides accent/success tokens and uses fixed cream text. Don't make hero text theme-dependent.
- Logo is one inline `<symbol id="shieldMark">` referenced with `<use>`. Edit it once.
- Fonts: `font-display` = Playfair Display, `font-body` = Inter (Google Fonts).

## Theme

- `data-theme="dark|light"` on `<html>`; `js/theme-init.js` reads `localStorage["polarlux-theme"]` before paint to avoid flash. `#theme-toggle` in `js/main.js` flips it, updates `aria-pressed`/label/icons, and persists.
- Any new themed style must be defined in **both** token blocks. The `theme-color` meta tags are static media queries and do not follow the manual toggle.

## Layout

- Masonry is implemented with CSS `columns` (benefits, services, gallery, testimonials): children need `mb-*` + `break-inside-avoid`. Note that visual order is **column-major**, so adding/removing a card changes how items pair across columns.
- Responsive: `sm`/`md`/`lg` plus a distinct `xl` treatment (wider container, left-aligned hero, larger type). Use `.container-page` for every section wrapper.
- Pricing and contact use grids; mobile nav is a fixed panel controlled by `#menu-toggle` / `#mobile-menu` (closes on link, Escape, outside click, and at `lg`). The scroll lock is shared with `#lightbox` via `syncScrollLock()`.
- Preserve anchors: `#beneficios`, `#servicios`, `#galeria`, `#precios`, `#contacto`.

## Images and UI states

- Every remote `<img>` must be wrapped in `.media` with `is-loading`. `js/main.js` removes it on load and adds `is-error` on failure, injecting a fallback with a `data-retry` button. Cached images are handled too.
- Hero media carries `data-no-fallback` so a broken hero keeps the dark background instead of overlay text.
- Retry appends `&_r=<timestamp>` to the `src`; keep image URLs query-string friendly.
- Form `#quote-form` validates inline (`is-invalid`, `aria-invalid`, hidden `.field-error`), shows a shimmer loading state on submit, then opens WhatsApp and swaps to `#quote-success` (`#quote-reset` restores). Keep the no-JS fallback: images remain visible if scripts don't run.
- Gallery figures get an injected `.gallery-open` button that opens `#lightbox` (dialog with its own skeleton, error/fallback and caption). If every gallery image fails, `#gallery-empty` replaces `#gallery-grid`.
- Clicking any `wa.me` link shows `#toast`; add `data-no-toast` where it would be redundant.

## Content invariants

- WhatsApp number `573014576626` is hardcoded in every CTA and in the form's generated message; update all occurrences together.
- Canonical/OG URLs use the `https://www.tudominio.com/` placeholder (also JSON-LD `@id`/`url`) — replace at deploy.
- SEO metadata is duplicated (meta, Open Graph, Twitter, Schema.org `AutomotiveBusiness` JSON-LD). Keep names, phone, services, and social links consistent.
- Prices, UV/IR claims, and warranty terms are business data — only change when asked.

## Verification

No build or test suite. Open `index.html` directly and check mobile (~390px), tablet (~820px), desktop (~1440px) and wide desktop (~1920px), both themes, gallery/service images loading plus the fallback/empty state, the lightbox, and the quote form's invalid/loading/success states. Verify `css/styles.css` and the `js/` files load with no console errors.
