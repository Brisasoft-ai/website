# Brand and information architecture

## Positioning
- **Primary promise:** AI-native engineering for real business impact.
  JA: AIネイティブなエンジニアリングで、ビジネスに確かな成果を。 VI: Kỹ thuật AI-native tạo giá trị kinh doanh thực.
- **Supporting messages (max three):**
  1. Engineers who understand your business (Forward Deployed Engineer mindset, described as a standard we train towards, not a finished state).
  2. AI in every step, engineers own every result.
  3. The simplest solution that works, including non-AI.
- Rejected options: "From business challenges to intelligent solutions" (vague), "AI-native teams, end-to-end ownership" (implies a team size we do not publish). No superlatives ("cutting-edge", "world-class").

## Audiences
1. Japanese enterprise and SIer buyers (about 70% of experience): want predictability, documentation, change control, honest status. Japanese copy written in business register (です・ます), company table kept.
2. Vietnamese businesses doing digital transformation (about 30%): want practical, step-by-step change.
3. Partners, candidates, education stakeholders (BIS).

## Company vs founder boundary
| Company (About) | Founder (About › Founder's message) |
|---|---|
| Legal name, registration, address, founded Oct 2024 | Since 2011 Japan-market work, before graduating |
| Own products BIS, AAB; company milestones from Oct 2024 | 30+ projects, SAP/ERP, embedded, BPMN, healthcare, AI, **in other organisations, before Brisasoft** |
| Team education, AI focus (qualitative) | Engineering to project/delivery management |
| Experience figures with explicit scope note | Why Brisasoft exists, AI-native and FDE philosophy |

## Homepage order (implemented)
1. Hero: promise, who we serve, primary CTA "Discuss your project" (pre-filled email), secondary "See our work". Visual: a localized HTML flow diagram (challenge → 5 steps → impact, with "AI assists every step" and "engineers own the outcome" rails), replacing the decorative DNA/neural art.
2. Credibility figures (from `src/company.json`) with a definitions note.
3. What we deliver: 6 problem-based service groups.
4. Engineering approach: 6 steps, each with "where AI helps".
5. Four principles (AI-native, FDE, ownership, customer value).
6. Selected work: BIS and AAB as case studies (challenge, approach, technology, status) and an AAB process diagram.
7. Technology in context: each platform with where it was used and a no-partnership disclaimer.
8. Founder message excerpt with link to the full letter.
9. Delivery and quality checklist (8 practices).
10. Final CTA, then footer (company info, founder link, privacy).

Removed from home (still elsewhere): "four areas of work", company facts card (About), product grid (Products), Japan block (Services), vision (About).

## CTA strategy
One primary action everywhere: email with a localized subject line (`mailto:` keeps the site form-free, no personal data stored on the site). Contact page lists what to include. A low-commitment offer (e.g. 30-minute AI-readiness review, JA company profile PDF) is a candidate for later, after the founder decides what can be offered.

## Technology presentation model
`src/company.json › technologies[]` holds name, official URL and `show`; text per language in `tech.items.<id>`. Rule: show only with a project where it was used. Text marks instead of vendor logos for now: official logos need each vendor's brand-guideline review (see final report).

## Multilingual plan
All three languages carry identical facts; numbers come from one file so they cannot drift. Build fails if any language misses a key. `hreflang`, canonical, sitemap alternates and same-page language switching were already correct and are extended to the new founder page.
