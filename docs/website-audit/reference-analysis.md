# Reference analysis: amira.vn, miichisoft.com, digitran.asia

Pages fetched 2026-10-16: AMIRA home and About; Miichisoft CEO message and home; Digitran home and About.
Purpose: learn positioning, founder storytelling and credibility patterns. No text, numbers or claims were copied.

## Summary by site

| | AMIRA (2021) | Miichisoft (2018) | Digitran (2021) |
|---|---|---|---|
| Positioning | "AI-native partner" for Japanese SMEs, long-term growth (3/5/10 years) | GenAI suite for enterprises plus AI-skilled lab teams; Japan implied, not stated | AI-powered digital transformation for Vietnamese businesses |
| Founder/CEO message | None; About has vision, values, executive headshots and a Japanese-style company table | Strongest of the three: first-person letter of about 800-900 words (background, a failed first startup, problem with order-taking offshore teams, mindset before methods, mission, name origin, milestones, targets) | None; CEO named in a short founding story on About |
| Services grouped by | Capability (AI, Data, Engineering, Cloud) and industry DX pages | Engagement model, with outcome-led taglines | Engagement type and use case |
| Credibility | ISO 27001/9001, ISTQB, PMP, AWS, named Japanese testimonials, client logos | Partner and award badges, executive testimonials, case cards tagged with stack | Client and university logos, unattributed portfolio metrics |
| Technology | Not named | **In context**: stack tags on each case study | Bare tag list (LLM, RAG, GPT-4, Claude) |
| CTA | One primary (free consultation) plus a low-commitment AI-maturity diagnosis | Two entry points (consult / partner) plus profile download, repeated too often | One primary (free AI consultation) |

## Weak spots seen (to avoid)

- Superlatives and savings/productivity percentages with no baseline ("top-class", "40-50% cheaper", "2-5x").
- Numbers that conflict across pages (150 vs 100 projects; 80% vs 90%), counters that render "0+" without JavaScript.
- Placeholder content: "#" links, template alt text, "coming soon" items mixed with live services, pricing tiers without prices.
- Stock photos used as portfolio images; university or client logos with no stated relationship.
- Long homepages that repeat testimonials and CTA blocks; inconsistent CEO/President titles.

## What Brisasoft adopted

1. Market stated in the hero (Japan and Vietnam), with a long-term partnership service.
2. A real first-person founder letter (about 450 words) on its own page, short excerpt on home, with visible name and a consistent title ("Founder").
3. Japanese-style company information table kept on About (legal name, registration number, address, founding date).
4. Every statistic carries its scope in its label plus a definitions note; numbers live in one place (`src/company.json`) so they cannot drift between languages.
5. Services grouped by customer problem, each with a one-line outcome; technologies named in context.
6. Technology listed **with where it was used** and a disclaimer that listing does not imply partnership or certification.
7. Own products shown as case studies (challenge, approach, technology, status), with the AAB workflow drawn as a diagram.
8. One primary CTA everywhere ("Discuss your project", pre-filled email subject) plus a secondary "See our work".
9. A short, honest company timeline starting in 2024; founder history moved to the founder page.

## Deliberately not adopted (needs evidence first)

- Certification and partner badges, client logos, testimonials, pricing tiers, outcome percentages.
- Headcount and AI-engineer percentage as numbers (held until dated and defined; see `docs/knowledge/company-profile.md`).
- A downloadable Japanese company profile PDF (good idea for later; needs founder-approved content).
