# Design system

## Tokens (`assets/style.css`, `:root`, with dark-mode overrides)
| Token | Light | Use |
|---|---|---|
| `--link` | #0f5fd1 | Links, labels, accents on light surfaces (contrast-checked replacement for `--brand`) |
| `--brand` / `--brand-dark` | #155eef / #0b3fb0 | Gradients, hover |
| `--accent` | #05708f | Secondary labels ("Where AI helps", technology area) |
| `--hero-1` / `--hero-2` | #06122b / #0a2a5e | Dark hero and CTA panels |
| CTA yellow | #fbbf24 → #f59e0b | Primary button on dark panels only |
| `--bg` / `--bg-alt` / `--surface` / `--border` | #fff / #f6f8fb / #fff / #e6e9f0 | Surfaces |
| `--text` / `--text-muted` | #10151f / #5b6472 | Text |

## Components (where they are produced)
| Component | Markup / class | Source |
|---|---|---|
| Header, language switcher | `header`, `details.lang` | `build.mjs › header()` (switcher links to the same page in the other language) |
| Footer | `footer` | `build.mjs › footer()` |
| Company facts table | `.details-table` | `build.mjs › detailsRows()` (Japanese 会社概要 order) |
| Figures | `.numbers` | `build.mjs › statsBlock()` from `company.json › stats` |
| Technology list | `.tech-grid .tech-item` | `build.mjs › techBlock()` from `company.json › technologies` |
| Founder card / portrait | `.founder-card`, `.founder-portrait` | `build.mjs › founderCard()`, `founderPortrait()` |
| Service row with illustration | `.why-row .svc-art` | `src/pages/services.html` |
| Case study + pipeline diagram | `.case`, `.pipeline` | `src/pages/home.html` |
| Process steps | `.steps.steps-6` | `src/pages/services.html` |
| CTA panel | `.cta-box` + `{{@mailto}}` + `cta.discuss` | every page (one CTA wording) |

Content is data (`src/i18n`, `src/company.json`); templates contain no copy.

## Known technical debt
- `style.css` grew in layers; later blocks override earlier ones (e.g. `.numbers`, `.hero.home`, `.cta-box`). It works and is verified, but a consolidation pass (one rule per component, tokens for radius and spacing) would make future edits safer. Not done now to avoid visual regressions before release.
- `.why-row`/`.why-art` names are historical; they now render the service rows.
