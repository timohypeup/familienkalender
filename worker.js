// Cloudflare Worker — CORS-Proxy fuer Kalender-Feeds (iCloud, Google, etc.)
// Deploy-Anleitung: siehe README.md
//
// Dieser Worker leitet ICS-Requests weiter und setzt die noetigen Headers,
// damit iCloud-Feeds korrekt geladen werden.

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');

    if (!target) {
      return new Response('Missing ?url= parameter', { status: 400 });
    }

    // Nur Kalender-URLs erlauben (Sicherheit)
    const allowed = [
      'caldav.icloud.com',
      'calendar.google.com',
      'outlook.office365.com',
      'outlook.live.com'
    ];
    const targetUrl = new URL(target);
    if (!allowed.some(domain => targetUrl.hostname.endsWith(domain))) {
      return new Response('Domain not allowed', { status: 403 });
    }

    try {
      const resp = await fetch(target, {
        headers: {
          'User-Agent': 'macOS/15.0 CalendarAgent/1.0',
          'Accept': 'text/calendar, text/plain, */*'
        }
      });

      const body = await resp.text();

      return new Response(body, {
        status: resp.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Content-Type': 'text/calendar; charset=utf-8',
          'Cache-Control': 'public, max-age=300'
        }
      });
    } catch (err) {
      return new Response('Fetch failed: ' + err.message, { status: 502 });
    }
  }
};
