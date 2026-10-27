// Edge entry point for brisasoft.net.
// 1) HTTPS + canonical-host redirects.
// 2) POST /api/contact — contact form endpoint (validated, provider-agnostic, mailto fallback).
// 3) Everything else is served from ./dist by the ASSETS binding.

const CANONICAL = { 'www.brisasoft.net': 'brisasoft.net' };
const MAX_BODY = 12_000;
const REQUIRED = ['lastName', 'firstName', 'email', 'company', 'country', 'message'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TO = 'contact@brisasoft.net';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

// Trim, collapse whitespace and cap length; keeps header injection out of the mail body.
const clean = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

function validate(p) {
  const errors = [];
  for (const k of REQUIRED) if (!clean(p[k], 4000)) errors.push(k);
  if (p.email && !EMAIL_RE.test(clean(p.email, 160))) errors.push('email');
  if (clean(p.hp, 200)) errors.push('hp'); // honeypot filled -> treat as bot
  return errors;
}

function formatBody(p, ip, ua) {
  const rows = [
    ['Name', `${clean(p.lastName, 80)} ${clean(p.firstName, 80)}`],
    ['Email', clean(p.email, 160)],
    ['Company', clean(p.company, 120)],
    ['Website', clean(p.website, 120)],
    ['Role', clean(p.role, 80)],
    ['Country', clean(p.country, 40)],
    ['Opt-in', p.optIn ? 'yes' : 'no'],
    ['Page', clean(p.page, 300)],
    ['Language', clean(p.lang, 10)],
    ['IP', ip],
    ['User-Agent', ua],
  ];
  return rows.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n\n' + clean(p.message, 2000);
}

async function send(p, env, ip, ua) {
  const subject = `[Website] ${clean(p.company, 80)} — ${clean(p.lastName, 40)} ${clean(p.firstName, 40)}`;
  const text = formatBody(p, ip, ua);

  // a) Generic webhook (Slack/Teams/Zapier/n8n) — set CONTACT_WEBHOOK_URL.
  if (env.CONTACT_WEBHOOK_URL) {
    const r = await fetch(env.CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: `${subject}\n\n${text}` }),
    });
    if (!r.ok) throw new Error(`webhook ${r.status}`);
    return 'webhook';
  }

  // b) Resend API — set RESEND_API_KEY (and optional CONTACT_FROM).
  if (env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.CONTACT_FROM || 'Brisasoft website <no-reply@brisasoft.net>',
        to: [env.CONTACT_TO || TO],
        reply_to: clean(p.email, 160),
        subject,
        text,
      }),
    });
    if (!r.ok) throw new Error(`resend ${r.status}`);
    return 'resend';
  }

  // c) Cloudflare Email Routing send_email binding (env.CONTACT_EMAIL).
  if (env.CONTACT_EMAIL && typeof env.CONTACT_EMAIL.send === 'function') {
    await env.CONTACT_EMAIL.send({
      to: env.CONTACT_TO || TO,
      from: 'website@brisasoft.net',
      subject,
      text,
    });
    return 'email-routing';
  }

  return null; // no provider configured -> caller returns a mailto fallback
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
      const len = Number(request.headers.get('content-length') || 0);
      if (len > MAX_BODY) return json({ ok: false, error: 'too_large' }, 413);

      let payload;
      try {
        payload = await request.json();
      } catch {
        return json({ ok: false, error: 'bad_json' }, 400);
      }

      const errors = validate(payload);
      if (errors.includes('hp')) return json({ ok: true }); // silently drop bots
      if (errors.length) return json({ ok: false, error: 'validation', fields: errors }, 422);

      const ip = request.headers.get('cf-connecting-ip') || '';
      const ua = clean(request.headers.get('user-agent'), 200);
      try {
        const via = await send(payload, env, ip, ua);
        if (via) return json({ ok: true, via });
      } catch (e) {
        // Provider failed: still give the visitor a working path instead of losing the lead.
        return json({ ok: false, error: 'provider', mailto: mailtoFor(payload) }, 502);
      }
      return json({ ok: false, error: 'not_configured', mailto: mailtoFor(payload) });
    }

    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const host = CANONICAL[url.hostname];
    if (!isLocal && (url.protocol === 'http:' || host)) {
      url.protocol = 'https:';
      if (host) url.hostname = host;
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};

function mailtoFor(p) {
  const body = formatBody(p, '', '');
  const subject = `Website enquiry — ${clean(p.company, 60)}`;
  return `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
