# Layout and design standard

## Page structure
- One `<h1>` per page (verified on all 30 pages), section `<h2>`, card `<h3>`; no heading used for decoration.
- Order on the company profile: introduction → basic information table → 沿革 table → team and representative → contact.
- Each message has one home (see `company-facts-and-copy.md`); a section is removed rather than repeated.

## Company facts
- Two-column label/value table on desktop; **stacked label-above-value on phones (≤560 px)**, so long Japanese values keep full width.
- Ordinary facts (founding year, headcount, capital) stay in the table at body size. Large number typography is reserved for the three experience figures on Home, each with its definition.
- History (沿革) is a date/event table, one line per event, no tags or decorative labels.

## Width, spacing, rhythm
- Content width 1160 px (`.wrap`); reading width for tables and letters about 760–860 px (`.narrow`, `.narrow-grid`).
- Section padding 88 px desktop; alternate background (`section.alt`) to separate sections instead of extra borders.
- Cards: one style (`.feature`, `.case`, `.tech-item`, `.checklist li`): 1 px border, 14–18 px radius, no heavy shadow.

## Typography
- System font stack with Japanese fallbacks (Hiragino Sans, Yu Gothic UI, Noto Sans JP): no web fonts, no layout shift from font loading, full glyph coverage.
- Body 16 px / 1.65; section titles `clamp(1.55rem, 3vw, 2.1rem)`; labels 0.75–0.8 rem uppercase (Latin) only.
- Japanese uses full-width brackets and colons; long Latin strings (email, URLs) may wrap (`overflow-wrap:anywhere`).

## Imagery
- Founder: approved photograph (cropped avatar and portrait, 8 KB and 38 KB).
- Services: four original SVG illustrations (2 KB each) drawn for the service they describe; no stock photos, no text inside images.
- Technology: text marks with the vendor name and where it was used; no vendor logos (brand-guideline review needed).

## Responsive verification (actual)
Headless Chrome via DevTools Protocol, device emulation at 320, 390, 768, 1366, 1920 px × 10 pages × 3 languages = 150 combinations: no horizontal overflow, one h1 each, no images without alt, no console errors. Screenshots reviewed: Home JA 1366, About JA 390, Services JA 1366, Founder JA 1366.
