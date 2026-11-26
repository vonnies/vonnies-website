// Cloudflare Worker "vonnies-stats": ontvangt meldingen van js/main.js op /api/e
// en slaat ze op in D1 (binding: DB). Geen cookies, geen IP-adressen.
// Bezoekers krijgen per dag een anonieme code: hash van (zout van vandaag + IP + browser).
// Het zout wordt na een dag weggegooid, dus codes zijn niet terug te rekenen of over dagen te koppelen.
// Wijzig je dit bestand? Plak het daarna in de Worker in het Cloudflare-dashboard en deploy.

const SITE = ['https://vonnieswaxenslijpservice.nl', 'https://www.vonnieswaxenslijpservice.nl'];
const TYPES = ['bezoek', 'klik', 'keuzehulp', 'gezien'];
const BOT = /bot|crawl|spider|slurp|headless|preview|scanner|facebookexternalhit|whatsapp|curl|wget|python|httpclient/i;

function clean(v, max) {
  return String(v == null ? '' : v).slice(0, max || 80).replace(/[^\p{L}\p{N} :\/#._\-–’?&=]/gu, '').trim();
}

async function sha(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function visitorCode(env, req) {
  const day = new Date().toISOString().slice(0, 10);
  let row = await env.DB.prepare('SELECT value FROM salt WHERE day = ?').bind(day).first();
  if (!row) {
    const value = crypto.randomUUID();
    await env.DB.batch([
      env.DB.prepare('INSERT OR IGNORE INTO salt (day, value) VALUES (?, ?)').bind(day, value),
      env.DB.prepare('DELETE FROM salt WHERE day < ?').bind(day),
    ]);
    row = await env.DB.prepare('SELECT value FROM salt WHERE day = ?').bind(day).first();
  }
  const ip = req.headers.get('CF-Connecting-IP') || '';
  return sha(row.value + ip + (req.headers.get('User-Agent') || ''));
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname !== '/api/e') return new Response('Not found', { status: 404 });
    if (req.method !== 'POST') return new Response(null, { status: 405 });

    const origin = req.headers.get('Origin');
    const referer = req.headers.get('Referer') || '';
    const fromSite = origin ? SITE.includes(origin) : SITE.some(s => referer.startsWith(s + '/'));
    if (!fromSite) return new Response(null, { status: 403 });

    const ua = req.headers.get('User-Agent') || '';
    if (!ua || BOT.test(ua)) return new Response(null, { status: 204 });

    let d;
    try {
      const body = await req.text();
      if (body.length > 600) throw new Error('te groot');
      d = JSON.parse(body);
    } catch (e) {
      return new Response(null, { status: 400 });
    }
    if (!TYPES.includes(d.t)) return new Response(null, { status: 400 });

    const device = /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'mobiel' : 'desktop';
    const country = (req.cf && req.cf.country) || '';

    await env.DB.prepare(
      'INSERT INTO events (ts, type, label, section, tekst, ref, device, country, visitor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      new Date().toISOString(), d.t, clean(d.l), clean(d.s, 40), clean(d.x, 60), clean(d.r, 60),
      device, country, await visitorCode(env, req)
    ).run();

    return new Response(null, { status: 204 });
  },
};
