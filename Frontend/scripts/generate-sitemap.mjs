import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = 'https://animeweebs.app';
const API_URL = process.env.VITE_APP_LOCALURL;

async function fetchAnimeIds() {
  try {
    const res = await fetch(`${API_URL}/home`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const spotlight = json?.data?.spotlight || [];
    const trending = json?.data?.trending || [];
    const topAiring = json?.data?.topAiring || [];
    const all = [...spotlight, ...trending, ...topAiring];
    const ids = [...new Set(all.map(a => a.id).filter(Boolean))];
    console.log(`✅ Fetched ${ids.length} anime IDs`);
    return ids;
  } catch (err) {
    console.error('❌ Failed to fetch anime IDs:', err.message);
    return [];
  }
}

async function generateSitemap() {
  const animeIds = await fetchAnimeIds();
  const staticPages = ['', 'home', 'trending', 'popular', 'latest-episodes'];
  
  // Fix: call .replace() on each string, not on the array
  const staticUrls = staticPages.map(p => {
    const url = `${SITE_URL}/${p}`;
    // Remove trailing slash for root (https://animeweebs.app/ -> https://animeweebs.app)
    return url.replace(/\/$/, '');
  });
  
  const animeUrls = animeIds.map(id => `${SITE_URL}/anime/${id}`);
  const urls = [...staticUrls, ...animeUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`).join('\n')}
</urlset>`;

  const outPath = resolve(process.cwd(), 'public/sitemap.xml');
  writeFileSync(outPath, sitemap);
  console.log(`✅ Sitemap generated with ${urls.length} URLs at ${outPath}`);
}

generateSitemap();