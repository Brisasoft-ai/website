// Static site generator for brisasoft.net (EN / JA / VI). No dependencies.
// Usage: node build.mjs   -> writes ./dist (deploy this folder to Cloudflare Pages)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
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
  { key: 'founder', path: 'about/founder/' },
  { key: 'services', path: 'services/' },
  { key: 'products', path: 'products/' },
  { key: 'bis', path: 'products/bis/' },
  { key: 'aab', path: 'products/aab/' },
  { key: 'insights', path: 'insights/' },
  { key: 'contact', path: 'contact/' },
  { key: 'privacy', path: 'privacy/' },
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
    ['about', url(lang, 'about'), ['about', 'founder']],
    ['services', url(lang, 'services'), 'services'],
    ['products', url(lang, 'products'), ['products', 'bis', 'aab']],
    ['insights', url(lang, 'insights'), 'insights'],
    ['contact', url(lang, 'contact'), 'contact'],
  ];
  const links = items
    .map(([k, href, active]) => `<a href="${href}"${[].concat(active).includes(pageKey) ? ' class="active" aria-current="page"' : ''}>${esc(d.nav[k])}</a>`)
    .join('\n      ');
  const langItems = LANGS.map(
    (l) =>
      `<li><a href="${url(l.code, pageKey)}" hreflang="${l.htmlLang}" lang="${l.htmlLang}" data-lang="${l.code}"${l.code === lang ? ' aria-current="true"' : ''}><img src="/assets/flags/${l.flag}.svg" alt="" width="22" height="15"><span>${l.label}</span></a></li>`
  ).join('\n          ');
  return `<header>
  <div class="wrap nav">
    <a href="${url(lang, 'home')}" class="logo" aria-label="Brisasoft"><img class="logo-img" src="/assets/logo-mark.svg" alt="" width="58" height="31">Brisasoft</a>
    <nav class="menu" id="menu" aria-label="Main">
      ${links}
    </nav>
    <div class="nav-actions">
      <details class="lang">
        <summary aria-label="${cur.short} ${esc(d.nav.language)}"><img src="/assets/flags/${cur.flag}.svg" alt="" width="22" height="15"><span>${cur.short}</span></summary>
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
        <a href="${url(lang, 'home')}" class="logo"><img class="logo-img" src="/assets/logo-mark.svg" alt="" width="58" height="31">Brisasoft</a>
        <p>${esc(d.footer.tagline)}</p>
      </div>
      <div class="footer-col">
        <h2 class="footer-h">${esc(d.footer.companyCol)}</h2>
        <a href="${url(lang, 'about')}">${esc(d.nav.about)}</a>
        <a href="${url(lang, 'founder')}">${esc(d.nav.founder)}</a>
        <a href="${url(lang, 'services')}">${esc(d.nav.services)}</a>
        <a href="${url(lang, 'insights')}">${esc(d.nav.insights)}</a>
        <a href="${url(lang, 'contact')}">${esc(d.nav.contact)}</a>
      </div>
      <div class="footer-col">
        <h2 class="footer-h">${esc(d.footer.productsCol)}</h2>
        <a href="${url(lang, 'bis')}">${esc(d.products.bis.name)}: ${esc(d.products.bis.full)}</a>
        <a href="${url(lang, 'aab')}">${esc(d.products.aab.name)}: ${esc(d.products.aab.full)}</a>
      </div>
      <div class="footer-col footer-info">
        <h2 class="footer-h">${esc(d.footer.infoTitle)}</h2>
        <dl>
          ${rows}
          <div><dt>${esc(d.footer.labels.email)}</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd></div>
        </dl>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year">2026</span> Brisasoft. ${esc(d.footer.rights)}</span>
      <span><a href="${url(lang, 'privacy')}">${esc(d.footer.privacy)}</a> · ${esc(d.footer.bisNote)}</span>
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

// Founder card (name, role, optional photo and LinkedIn), shown only when a name is filled in src/company.json
const founderCard = (d) => {
  const f = company.founder || {};
  const name = String(f.name || '').trim();
  if (!name) return '';
  const link = String(f.linkedin || '').trim();
  const photo = String(f.photo || '').trim();
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(-3).toUpperCase();
  const pic = photo
    ? `<img class="founder-photo" src="${esc(photo)}" alt="${esc(name)}" width="96" height="96" loading="lazy">`
    : `<span class="founder-photo" aria-hidden="true">${esc(initials)}</span>`;
  return `<div class="founder-card">${pic}<div><b>${esc(name)}</b><span>${esc(d.founder.role)}</span>${
    link ? `<a href="${esc(link)}" rel="noopener noreferrer" target="_blank">${esc(d.founder.linkedin)}</a>` : ''
  }</div></div>`;
};

// Large founder portrait for the founder page (only when set)
const founderPortrait = () => {
  const f = company.founder || {};
  const src = String(f.portrait || '').trim();
  return src ? `<img class="founder-portrait" src="${esc(src)}" alt="${esc(f.name || '')}" width="560" height="510">` : '';
};

// Credibility figures from src/company.json (only show:true with a value). Labels: stats.<id>.label
const statsBlock = (d) =>
  (company.stats || [])
    .filter((s) => s.show && String(s.value || '').trim())
    .map((s) => {
      const label = get(d, `stats.${s.id}.label`);
      if (typeof label !== 'string') throw new Error(`missing text key: stats.${s.id}.label`);
      return `<div><b>${esc(s.value)}</b><span>${esc(label)}</span></div>`;
    })
    .join('\n      ');

// Technologies with where they were used. Text: tech.items.<id>.{area,text}
const techBlock = (d) =>
  (company.technologies || [])
    .filter((t) => t.show)
    .map((t) => {
      const item = get(d, `tech.items.${t.id}`);
      if (!item || typeof item.area !== 'string' || typeof item.text !== 'string') throw new Error(`missing text key: tech.items.${t.id}`);
      const u = String(t.url || '').trim();
      const name = u.startsWith('https://') ? `<a href="${esc(u)}" rel="noopener noreferrer" target="_blank">${esc(t.name)}</a>` : esc(t.name);
      return `<article class="tech-item"><span class="tech-mark" aria-hidden="true">${esc(t.name.slice(0, 2))}</span><div><h3>${name}</h3><p class="tech-area">${esc(item.area)}</p><p>${esc(item.text)}</p></div></article>`;
    })
    .join('\n      ');

// Link to the running BIS app, shown only when bisUrl is filled in src/company.json (must be https)
const bisAction = (d) => {
  const u = String(company.bisUrl || '').trim();
  if (!u.startsWith('https://')) return '';
  return `<p><a href="${esc(u)}" class="btn btn-primary" rel="noopener" target="_blank">${esc(d.bispage.openApp)}</a></p>`;
};

const layout = read('src/layout.html');
// Cache-busting version for CSS/JS, derived from their content
const VER = createHash('sha1').update(read('assets/style.css') + read('assets/main.js')).digest('hex').slice(0, 8);
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
            address: { '@type': 'PostalAddress', addressLocality: 'Hanoi', addressCountry: 'VN' },
            ...(String(company.founder?.name || '').trim() ? { founder: { '@type': 'Person', name: company.founder.name, jobTitle: 'Founder & CEO', ...(company.founder.portrait ? { image: `${SITE}${company.founder.portrait}` } : {}) } } : {}),
            ...(pick(company.legalName, l.code) ? { legalName: pick(company.legalName, l.code) } : {}),
          })}</script>`
        : '';
    const ctx = {
      url: urls,
      email: EMAIL,
      mailto: `mailto:${EMAIL}?subject=${encodeURIComponent(`${d.contact.subject} (Brisasoft website)`)}`,
      detailsRows: detailsRows(l.code, d),
      founderCard: founderCard(d),
      founderPortrait: founderPortrait(),
      statsBlock: statsBlock(d),
      techBlock: techBlock(d),
      bisAction: bisAction(d),
    };
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
        ver: VER,
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
// The inline script is allowed by its hash in the Content-Security-Policy below.
// The CSP also allows Cloudflare Web Analytics, which Cloudflare injects at the edge (not visible in this repo).
const ROOT_SCRIPT = `
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
`;
const ROOT_SCRIPT_HASH = `'sha256-${createHash('sha256').update(ROOT_SCRIPT).digest('base64')}'`;
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
<script>${ROOT_SCRIPT}</script>
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


// 404 page (served by Workers static assets with not_found_handling: "404-page")
{
  const N = {"en":["Page not found","The page you are looking for does not exist or has moved.","Go to the homepage"],"ja":["ページが見つかりません","お探しのページは存在しないか、移動した可能性があります。","トップページへ"],"vi":["Không tìm thấy trang","Trang bạn tìm không tồn tại hoặc đã được chuyển.","Về trang chủ"]};
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${N.en[0]} | Brisasoft</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/style.css?v=${VER}">
</head>
<body>
<main class="wrap not-found">
  <a href="/en/" class="logo" aria-label="Brisasoft"><img class="logo-img" src="/assets/logo-mark.svg" alt="" width="58" height="31">Brisasoft</a>
  ${['en', 'ja', 'vi'].map((l) => `<section lang="${l}"><h1>${N[l][0]}</h1><p class="muted">${N[l][1]}</p><p><a class="btn btn-primary" href="/${l}/">${N[l][2]}</a></p></section>`).join('\n  ')}
</main>
</body>
</html>
`;
  writeFileSync(join(dist, '404.html'), html);
}

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
  Strict-Transport-Security: max-age=15552000
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' ${ROOT_SCRIPT_HASH} https://static.cloudflareinsights.com; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests

/assets/*
  Cache-Control: public, max-age=86400
`
);

console.log(`Built ${LANGS.length * PAGES.length} pages + root into ${dist}`);
