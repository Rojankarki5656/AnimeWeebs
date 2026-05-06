import { load } from 'cheerio';

export default function extractSearch(html) {
  if (!html) return [];

  const $ = load(html);
  const items = [];

  $('.aitem').each((i, el) => {
    const $item = $(el);

    // Get the poster link and slug
    const posterLink = $item.find('.poster');
    const href = posterLink.attr('href') || '';
    const slugMatch = href.match(/\/watch\/([^?#]+)/);
    const slug = slugMatch ? slugMatch[1] : '';

    // Poster image
    const posterImg = $item.find('.poster div img');
    const poster = posterImg.attr('data-src') || posterImg.attr('src') || '';

    // Title (direct .title, not inside .detail)
    const titleEl = $item.find('.title');
    const title = titleEl.text().trim();
    const japaneseTitle = titleEl.attr('data-jp') || '';

    // Extract info spans
    const subSpan = $item.find('.info .sub');
    const subEpisodes = subSpan.length ? subSpan.text().trim() : '0';
    const dubSpan = $item.find('.info .dub');
    const dubEpisodes = dubSpan.length ? dubSpan.text().trim() : '0';

    let totalEpisodes = '';
    let year = '';
    let type = '';
    let rating = '';

    // Loop through all spans inside .info
    $item.find('.info span').each((idx, span) => {
      const $span = $(span);
      const text = $span.text().trim();
      const hasBold = $span.find('b').length > 0;

      if ($span.hasClass('sub') || $span.hasClass('dub')) return;

      if (hasBold && /^\d+$/.test(text)) {
        totalEpisodes = text;
      } else if (hasBold && !/^\d+$/.test(text)) {
        type = text;
      } else if ($span.hasClass('rating')) {
        rating = text;
      } else if (/^\d{4}$/.test(text)) {
        year = text;
      }
    });

    items.push({
      slug,
      poster,
      title,
      japaneseTitle,
      subEpisodes: parseInt(subEpisodes) || 0,
      dubEpisodes: parseInt(dubEpisodes) || 0,
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null,
      year: year || null,
      type: type || null,
      rating: rating || null,
    });
  });

  return items;
}