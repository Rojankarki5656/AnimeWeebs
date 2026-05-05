import { load } from 'cheerio';

export default function extractSearch(html) {
  if (!html) return [];

  const $ = load(html);
  const items = [];

  $('.aitem').each((i, el) => {
    const $item = $(el);

    const href = $item.attr('href') || '';
    const slugMatch = href.match(/\/watch\/([^?#]+)/);
    const slug = slugMatch ? slugMatch[1] : '';

    const posterDiv = $item.find('.poster div img');
    const poster = posterDiv.attr('src') || '';

    const titleEl = $item.find('.detail .title');
    const title = titleEl.text().trim();
    const japaneseTitle = titleEl.attr('data-jp') || '';

    // Extract info spans
    const subSpan = $item.find('.detail .info .sub');
    const subEpisodes = subSpan.length ? subSpan.text().trim() : '0';
    const dubSpan = $item.find('.detail .info .dub');
    const dubEpisodes = dubSpan.length ? dubSpan.text().trim() : '0';

    let totalEpisodes = '';
    let year = '';
    let type = '';
    let rating = '';

    $item.find('.detail .info span').each((idx, span) => {
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