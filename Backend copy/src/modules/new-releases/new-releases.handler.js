import config from '@/config/config';
import extractNewReleases from './new-releases.extract';
import { NotFoundError } from '@/utils/errors';

export default async function newReleasesHandler(c) {
  let page = parseInt(c.req.query('page') || '1');
  if (isNaN(page) || page < 1) page = 1;

  const { items, totalPages } = await fetchNewReleases(page);

  return c.json({
    success: true,
    page,
    totalPages,
    items,
  });
}

export async function fetchNewReleases(page) {
  const url = `${config.baseurl}/new-releases?page=${page}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': config.headers['User-Agent'],
        Referer: config.baseurl,
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const { items, totalPages } = extractNewReleases(html);

    return { items, totalPages };
  } catch (err) {
    console.error('Failed to fetch new releases:', err.message);
    throw new NotFoundError('Could not fetch new releases');
  }
}