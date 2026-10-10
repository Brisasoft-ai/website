// Static site generator for brisasoft.net (EN / JA / VI). No dependencies.
// Usage: node build.mjs   -> writes ./dist (deploy this folder to Cloudflare Pages)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
// SITE_ENV=staging builds for stg.brisasoft.net and blocks search engines.
const STAGING = process.env.SITE_ENV === 'staging';
const SITE = STAGING ? 'https://stg.brisasoft.net' : 'https://brisasoft.net';
const EMAIL = 'hello@brisasoft.net';

const LANGS = [
  { code: 'en', label: 'English', short: 'EN', flag: 'gb', htmlLang: 'en', og: 'en_US', skip: 'Skip to content' },
  { code: 'ja', label: '日本語', short: 'JA', flag: 'jp', htmlLang: 'ja', og: 'ja_JP', skip: '本文へスキップ' },
  { code: 'vi', label: 'Tiếng Việt', short: 'VI', flag: 'vn', htmlLang: 'vi', og: 'vi_VN', skip: 'Bỏ qua đến nội dung' },
];
const PAGES = [
  { key: 'home', path: '' },
  { key: 'about', path: 'about/' },
  { key: 'bis', path: 'products/bis/' },
  { key: 'contact', path: 'contact/' },
];

const read = (p) => readFileSync(join(root, p), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const get = (obj, key) => key.split('.').reduce((a, k) => (a == null ? undefined : a[k]), obj);

const dicts = Object.fromEntries(LANGS.map((l) => [l.code, JSON.parse(read(`src/i18n/${l.code}.json`))]));
const company = JSON.parse(read('src/company.json'));

// Every language file must have exactly the same keys as English.
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [`${p}${k}`]));
const enKeys = new Set(flat(dicts.en));
for (const l of LANGS) {
  const keys = new Set(flat(dicts[l.code]));
  for (const k of enKeys) if (!keys.has(k)) throw new Error(`[${l.code}] missing key: ${k}`);
  for (const k of keys) if (!enKeys.has(k)) throw new Error(`[${l.code}] unknown key: ${k}`);
}

const url = (lang, key) => `/${lang}/${PAGES.find((p) => p.key === key).path}`;
const abs = (lang, key) => `${SITE}${url(lang, key)}`;

function render(tpl, ctx, dict) {
  return tpl.replace(/\{\{\s*([@\w.]+)\s*\}\}/g, (_, key) => {
    if (key.startsWith('@')) {
      const v = get(ctx, key.slice(1));
      if (typeof v !== 'string') throw new Error(`missing template var: ${key}`);
      return v;
    }
    const v = get(dict, key);
    if (typeof v !== 'string') throw new Error(`missing text key: ${key}`);
    return esc(v);
  });
}

// Company fields hidden unless filled in src/company.json
const pick = (v, lang) => (v && typeof v === 'object' ? v[lang] || v.en || '' : v || '');
const companyRows = (lang, d) => {
  const L = d.footer.labels;
  return [
    [L.company, d.facts.companyValue],
    [L.legalName, pick(company.legalName, lang)],
    [L.registrationNumber, pick(company.registrationNumber, lang)],
    [L.address, pick(company.address, lang)],
    [L.phone, pick(company.phone, lang)],
  ].filter(([, v]) => String(v).trim() !== '');
};

function header(lang, pageKey, d) {
  const cur = LANGS.find((l) => l.code === lang);
  const items = [
    ['about', url(lang, 'about'), 'about'],
    ['products', url(lang, 'bis'), 'bis'],
    ['build', `${url(lang, 'home')}#build`, null],
    ['contact', url(lang, 'contact'), 'contact'],
  ];
  const links = items
    .map(([k, href, active]) => `<a href="${href}"${active === pageKey ? ' class="active" aria-current="page"' : ''}>${esc(d.nav[k])}</a>`)
    .join('\n      ');
  const langItems = LANGS.map(
    (l) =>
      `<li><a href="${url(l.code, pageKey)}" hreflang="${l.htmlLang}" lang="${l.htmlLang}" data-lang="${l.code}"${l.code === lang ? ' aria-current="true"' : ''}><img src="/assets/flags/${l.flag}.svg" alt="" width="22" height="15"><span>${l.label}</span></a></li>`
  ).join('\n          ');
  return `<header>
  <div class="wrap nav">
    <a href="${url(lang, 'home')}" class="logo" aria-label="Brisasoft"><span class="logo-mark">Bs</span>Brisasoft</a>
    <nav class="menu" id="menu" aria-label="Main">
      ${links}
    </nav>
    <div class="nav-actions">
      <details class="lang">
        <summary aria-label="${esc(d.nav.language)}"><img src="/assets/flags/${cur.flag}.svg" alt="" width="22" height="15"><span>${cur.short}</span></summary>
        <ul>
          ${langItems}
        </ul>
      </details>
      <button class="burger" id="burger" aria-label="${esc(d.nav.menu)}" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

function footer(lang, d) {
  const rows = companyRows(lang, d)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join('\n          ');
  return `<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="${url(lang, 'home')}" class="logo"><span class="logo-mark">Bs</span>Brisasoft</a>
        <p>${esc(d.footer.tagline)}</p>
      </div>
      <div class="footer-col">
        <h5>${esc(d.footer.companyCol)}</h5>
        <a href="${url(lang, 'about')}">${esc(d.nav.about)}</a>
        <a href="${url(lang, 'home')}#build">${esc(d.nav.build)}</a>
        <a href="${url(lang, 'contact')}">${esc(d.nav.contact)}</a>
      </div>
      <div class="footer-col">
        <h5>${esc(d.footer.productsCol)}</h5>
        <a href="${url(lang, 'bis')}">${esc(d.bis.name)}: ${esc(d.bis.full)}</a>
      </div>
      <div class="footer-col footer-info">
        <h5>${esc(d.footer.infoTitle)}</h5>
        <dl>
          ${rows}
          <div><dt>${esc(d.footer.labels.email)}</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd></div>
        </dl>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year">2026</span> Brisasoft. ${esc(d.footer.rights)}</span>
      <span>${esc(d.footer.bisNote)}</span>
    </div>
  </div>
</footer>`;
}

function detailsRows(lang, d) {
  const L = d.footer.labels;
  const rows = [
    ...companyRows(lang, d),
    [d.facts.focusLabel, d.facts.focusValue],
    [d.facts.establishedLabel, d.facts.establishedValue],
    [d.facts.locationLabel, d.facts.locationValue],
    [L.email, EMAIL],
  ];
  return rows.map(([k, v]) => `        <tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n');
}

// Founder block, shown only when a name is filled in src/company.json
const founderBlock = (d) => {
  const f = company.founder || {};
  if (!String(f.name || '').trim()) return '';
  const link = String(f.linkedin || '').trim();
  return `<section>
  <div class="wrap">
    <span class="eyebrow center">${esc(d.founder.title)}</span>
    <div class="grid-2">
      <article class="feature left"><h3>${esc(f.name)}</h3><p>${esc(d.founder.role)}</p>${
        link ? `<p><a href="${esc(link)}" rel="noopener noreferrer" target="_blank">${esc(d.founder.linkedin)}</a></p>` : ''
      }</article>
    </div>
  </div>
</section>`;
};

const layout = read('src/layout.html');
const pageTpl = Object.fromEntries(PAGES.map((p) => [p.key, read(`src/pages/${p.key}.html`)]));

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const l of LANGS) {
  const d = dicts[l.code];
  const urls = Object.fromEntries(PAGES.map((p) => [p.key, url(l.code, p.key)]));
  for (const p of PAGES) {
    const alternates = [
      ...LANGS.map((a) => `<link rel="alternate" hreflang="${a.htmlLang}" href="${abs(a.code, p.key)}">`),
      `<link rel="alternate" hreflang="x-default" href="${abs('en', p.key)}">`,
    ].join('\n');
    const jsonld =
      p.key === 'home'
        ? `<script type="application/ld+json">${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Brisasoft',
            alternateName: 'Brisa',
            url: SITE,
            email: EMAIL,
            foundingDate: '2024-10-23',
            address: { '@type': 'PostalAddress', addressCountry: 'VN' },
            ...(pick(company.legalName, l.code) ? { legalName: pick(company.legalName, l.code) } : {}),
          })}</script>`
        : '';
    const ctx = { url: urls, email: EMAIL, detailsRows: detailsRows(l.code, d), founderBlock: founderBlock(d) };
    const content = render(pageTpl[p.key], ctx, d);
    const html = render(
      layout,
      {
        htmlLang: l.htmlLang,
        title: esc(d.meta[p.key].title),
        description: esc(d.meta[p.key].description),
        canonical: abs(l.code, p.key),
        alternates,
        ogLocale: l.og,
        site: SITE,
        jsonld,
        skip: esc(l.skip),
        header: header(l.code, p.key, d),
        content,
        footer: footer(l.code, d),
      },
      d
    );
    const out = join(dist, l.code, p.path);
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, 'index.html'), html);
  }
}

// Root page: choose a language (saved choice, then browser language, then English).
writeFileSync(
  join(dist, 'index.html'),
  `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Brisasoft</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${SITE}/en/">
${LANGS.map((a) => `<link rel="alternate" hreflang="${a.htmlLang}" href="${abs(a.code, 'home')}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${abs('en', 'home')}">
<meta http-equiv="refresh" content="1;url=/en/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>
(function () {
  var langs = ['en', 'ja', 'vi'], pick = 'en';
  try {
    var saved = localStorage.getItem('brisa-lang');
    if (saved && langs.indexOf(saved) > -1) pick = saved;
    else {
      var prefs = navigator.languages || [navigator.language || 'en'];
      for (var i = 0; i < prefs.length; i++) {
        var c = String(prefs[i]).slice(0, 2).toLowerCase();
        if (langs.indexOf(c) > -1) { pick = c; break; }
      }
    }
  } catch (e) {}
  location.replace('/' + pick + '/');
})();
</script>
</head>
<body>
<p><a href="/en/">English</a> · <a href="/ja/">日本語</a> · <a href="/vi/">Tiếng Việt</a></p>
</body>
</html>
`
);

// Static assets
cpSync(join(root, 'assets'), join(dist, 'assets'), { recursive: true });
if (existsSync(join(root, 'public'))) cpSync(join(root, 'public'), dist, { recursive: true });

// robots.txt, sitemap.xml, Cloudflare Pages headers
writeFileSync(
  join(dist, 'robots.txt'),
  STAGING ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.flatMap((l) =>
  PAGES.map(
    (p) => `  <url>
    <loc>${abs(l.code, p.key)}</loc>
${LANGS.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.htmlLang}" href="${abs(a.code, p.key)}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs('en', p.key)}"/>
  </url>`
  )
).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(
  join(dist, '_headers'),
  `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
${STAGING ? '  X-Robots-Tag: noindex, nofollow\n' : ''}  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=86400
`
);

console.log(`Built ${LANGS.length * PAGES.length} pages + root into ${dist}`);
