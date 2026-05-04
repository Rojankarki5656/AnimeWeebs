import config from '@/config/config';
import { validationError } from '@/utils/errors';

const WHITELIST = [
  'megaup.nl',
  'megaup.cc',
  'mega.nz',
  'mega.co.nz',
  'rrr.net22lab.site',
  'static.cloudflareinsights.com',
];

export default async function proxyHandler(c) {
  const { url } = c.req.valid('query');

  if (!url) {
    throw new validationError('url is required');
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    throw new validationError('invalid url');
  }

  const host = parsed.hostname || '';
  const allowed = WHITELIST.some((w) => host.includes(w));
  if (!allowed) {
    return c.text('Forbidden host', 403);
  }

  // Fetch remote resource and stream it back
  try {
    const remoteRes = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: config.baseurl || '',
      },
    });

    const headers = {};
    const contentType = remoteRes.headers.get('content-type');
    const contentLength = remoteRes.headers.get('content-length');
    if (contentType) headers['content-type'] = contentType;
    if (contentLength) headers['content-length'] = contentLength;

    return new Response(remoteRes.body, { status: remoteRes.status, headers });
  } catch (err) {
    console.error('Proxy fetch error:', err.message);
    return c.text('Failed to proxy resource', 502);
  }
}
