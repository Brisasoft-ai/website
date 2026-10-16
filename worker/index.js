// Edge entry point: HTTPS and canonical-host redirects, then the static site.
// Zone-level "Always Use HTTPS" and Redirect Rules do not apply to Workers Custom Domains,
// so the redirect is done here. Everything else is served from ./dist by the ASSETS binding.
const CANONICAL = { 'www.brisasoft.net': 'brisasoft.net' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
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
